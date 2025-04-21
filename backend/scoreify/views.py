from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.conf import settings
from .services import *
import requests

# Create your views here.

def index(request):
    return HttpResponse("Hello World")

def callback(request):
    code = request.GET.get("code")
    if code == None:
        return authoriseUser(request)
    else:
        codeVerifier = request.session.get('verifier')

        if not codeVerifier:
            return HttpResponse("Missing Verifier", status=400)
        
        accessToken = getAccessToken(code, codeVerifier)
        profileData = getUserProfile(accessToken) # ProfileData is a Json with the information
        request.session['profile'] = profileData
        print(profileData)
        return redirect("http://localhost:3000/dashboard")
    
def spotifyProfile(request):
    
    data = request.session.get('profile')

    print(data)

    return JsonResponse(data, safe=False)