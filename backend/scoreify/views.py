from django.shortcuts import render
from django.http import HttpResponse,JsonResponse, HttpResponseRedirect
from django.conf import settings
from .services import *
import requests
import json

def index(request): 
    return HttpResponse("HELLO WORLD")


def callback(request):

    #Check if this is the initial call to the callback function or the callback from spotify
    code = request.GET.get("code")

    # If it is the initial call, authorise the user
    if code == None:
        return authoriseUser(request)
    
    # If it is the callback from the spotify API, lets check if they are verified
    # and then extract the user data
    else:
        codeVerifier = request.session.get('verifier')

        if not codeVerifier:
            return HttpResponse("Missing Verifier", status=400)
        
        accessToken = getAccessToken(code, codeVerifier)
        request.session['accessToken'] = accessToken

        return HttpResponseRedirect('http://127.0.0.1:3000/dashboard')
    
def spotifyProfile(request):  
    accessToken = request.session.get('accessToken')

    profileData = getUserProfile(accessToken)

    return HttpResponse(profileData)

def topItems(request):
    accessToken = request.session.get('accessToken')
    items = request.GET.get('items')
    limit = request.GET.get('limit')

    topTracksList = json.loads(getTopItems(accessToken, items, limit).text)
    return JsonResponse(topTracksList['items'], safe=False)