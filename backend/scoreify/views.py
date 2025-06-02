from django.shortcuts import render
from django.http import HttpResponse,JsonResponse, HttpResponseRedirect
from django.conf import settings
from .services import *
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
        logging.info("Session ID when code is good: %s", request.session.session_key)
        codeVerifier = request.session.get('verifier')
        logging.info("Code verifier from session: %s", codeVerifier)

        if not codeVerifier:
            logging.error("Missing verifier in session")
            return HttpResponse("Missing Verifier", status=400)
        
        accessToken = getAccessToken(code, codeVerifier)
        logging.info("Access token obtained: %s", accessToken)
        request.session['accessToken'] = accessToken
        logging.info("Access token set in session. Session ID: %s", request.session.session_key)
        
        response = HttpResponseRedirect(f'{settings.FRONTEND_URL}/dashboard')
        logging.info("Redirecting to dashboard with session cookie: %s", response.cookies)
        return response

def topItems(request):
    logging.info("Request received for topItems")
    logging.info("Request headers: %s", dict(request.headers))
    logging.info("Request cookies: %s", request.COOKIES)
    
    accessToken = request.session.get('accessToken')
    
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
    request.session.flush()
    response = HttpResponse(status=200)
    response.delete_cookie('sessionid')
    return response