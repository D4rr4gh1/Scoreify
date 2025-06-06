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
    #Check if this is the initial call to the callback function or the callback from spotify
    code = request.GET.get("code")
    error = request.GET.get("error")

    # If it is the initial call, authorise the user
    if code == None and error == None:
        deleteExpiredDBEntries()
        return authoriseUser(request)
    
    # If there is an error, we need to handle it
    elif error:
        return HttpResponseRedirect(f'{settings.FRONTEND_URL}')
    
    # If it is the callback from the spotify API, lets check if they are verified
    # and then extract the user data
    elif code:
        sessionID = request.GET.get("state")

        try:
            session = customSession.objects.get(session_id=sessionID)
            if session.is_expired():
                session.delete()
                return HttpResponse(status=400, content="Session expired during callback")
        except customSession.DoesNotExist:
            return HttpResponse(status=400, content="Session not found during callback")
        
        codeVerifier = session.verifier
        
        
        accessToken = getAccessToken(code, codeVerifier)

        session.access_token = accessToken
        session.save(update_fields=['access_token'])
        
        response = HttpResponseRedirect(f'{settings.FRONTEND_URL}/dashboard/?session_id={sessionID}')
        return response

def topItems(request):
    session_id = request.GET.get("session_id")

    try:
        session = customSession.objects.get(session_id=session_id)
        if session.is_expired():
            return HttpResponse(status=400, content="Session expired when getting items")
    except customSession.DoesNotExist:
        return HttpResponse(status=400, content="Session not found when getting items")
    
    accessToken = session.access_token

    if not accessToken:
        return HttpResponse(status=401, content="No access token found. User is not logged in.")
    
    items = request.GET.get('items')
    limit = request.GET.get('limit')
    timeRange = request.GET.get('time_range')

    topTracksResponse = getTopItems(accessToken, items, limit, timeRange)

    if topTracksResponse.status_code != 200:
        return HttpResponse(status=400, content=topTracksResponse.text)

    topTracksList = json.loads(topTracksResponse.text)

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
        return HttpResponse(status=400, content="Session not found when logging out")
    
    response = HttpResponse(status=200)
    return response