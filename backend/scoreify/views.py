from django.shortcuts import render
from django.http import HttpResponse,JsonResponse, HttpResponseRedirect
from django.conf import settings
from .services import *
import json
from django.views.decorators.csrf import csrf_exempt

def index(request): 
    return HttpResponse("HELLO WORLD")


def callback(request):

    #Check if this is the initial call to the callback function or the callback from spotify
    code = request.GET.get("code")
    error = request.GET.get("error")

    # If it is the initial call, authorise the user
    if code == None and error == None:
        return authoriseUser(request)
    
    # If there is an error, we need to handle it
    elif error:
        return HttpResponseRedirect('https://scoreify.vercel.app/')
    
    # If it is the callback from the spotify API, lets check if they are verified
    # and then extract the user data
    elif code:
        codeVerifier = request.session.get('verifier')

        if not codeVerifier:
            return HttpResponse("Missing Verifier", status=400)
        
        accessToken = getAccessToken(code, codeVerifier)
        request.session['accessToken'] = accessToken

        return HttpResponseRedirect('https://scoreify.vercel.app/dashboard')
    
def spotifyProfile(request):  
    accessToken = request.session.get('accessToken')

    profileData = getUserProfile(accessToken)

    return HttpResponse(profileData)

def topItems(request):
    accessToken = request.session.get('accessToken')
    if not accessToken:
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