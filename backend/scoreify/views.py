from django.core.signing import Signer
from django.http import HttpResponse,JsonResponse, HttpResponseRedirect
from django.conf import settings
from .services import *
from .models import customSession
import json
from django.views.decorators.csrf import csrf_exempt
import logging

def index(request): 
    return HttpResponse("HELLO WORLD")


def callback(request):
    logging.info("Callback received")
    
    #Check if this is the initial call to the callback function or the callback from spotify
    code = request.GET.get("code")
    error = request.GET.get("error")

    logging.info("Code: %s, Error: %s", code, error)
    
    # If it is the initial call, authorise the user
    if code == None and error == None:
        return authoriseUser(request)
    
    # If there is an error, we need to handle it
    elif error:
        logging.error("Error in callback: %s", error)
        return HttpResponseRedirect(f'{settings.FRONTEND_URL}')
    
    # If it is the callback from the spotify API, lets check if they are verified
    # and then extract the user data
    elif code:
        sessionID = request.GET.get("state")
        logging.info("Session ID: %s", sessionID)

        try:
            session = customSession.objects.get(session_id=sessionID)
            if session.is_expired():
                logging.error("Session expired")
                return HttpResponse(status=400, content="Session expired during callback")
        except customSession.DoesNotExist:
            logging.error("Session not found")
            return HttpResponse(status=400, content="Session not found during callback")
        
        codeVerifier = session.verifier
        
        logging.info("Code verifier from session: %s", codeVerifier)
        
        accessToken = getAccessToken(code, codeVerifier)
        print("Access token is: %s", accessToken)

        session.access_token = accessToken
        session.save(update_fields=['access_token'])
        
        response = HttpResponseRedirect(f'{settings.FRONTEND_URL}/dashboard/?session_id={sessionID}')
        return response

def topItems(request):
    logging.info("Request received for topItems")
    session_id = request.GET.get("session_id")

    try:
        session = customSession.objects.get(session_id=session_id)
        if session.is_expired():
            logging.error("Session expired")
            return HttpResponse(status=400, content="Session expired when getting items")
    except customSession.DoesNotExist:
        logging.error("Session not found when getting items")
        return HttpResponse(status=400, content="Session not found when getting items")
    
    accessToken = session.access_token

    logging.info("Session ID: %s", request.session.session_key)
    logging.info("All session data: %s", dict(request.session))
    logging.info("Access token when get: %s", accessToken)
    
    if not accessToken:
        logging.warning("No access token found in session")
        return HttpResponse(status=401, content="No access token found. User is not logged in.")
    
    items = request.GET.get('items')
    limit = request.GET.get('limit')
    timeRange = request.GET.get('time_range')

    topTracksList = json.loads(getTopItems(accessToken, items, limit, timeRange).text)

    if not topTracksList['items']:
        return HttpResponse(status=400, content="No items found")
    
    return JsonResponse(topTracksList['items'], safe=False)

@csrf_exempt
def logout(request):
    session_id = request.GET.get("session_id")
    try:
        session = customSession.objects.get(session_id=session_id)
        session.delete()
    except customSession.DoesNotExist:
        logging.error("Session not found when logging out")
        return HttpResponse(status=400, content="Session not found when logging out")
    
    response = HttpResponse(status=200)
    return response