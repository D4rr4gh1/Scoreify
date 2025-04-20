from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.conf import settings
from .services import *
import requests

# Create your views here.

def index(request):
    return HttpResponse("Hello World")

def userLogin(request):
    # Expect a post request from user login form on front end

    return HttpResponse("YES")


def callback(request):
    code = request.GET.get("code")
    if code == None:
        return authoriseUser(request)
    else:
        codeVerifier = request.session.get('verifier')

        if not codeVerifier:
            return HttpResponse("Missing Verifier", status=400)
        
        accessToken = getAccessToken(code, codeVerifier)
        profileData = getUserProfile(accessToken)
        return JsonResponse(profileData)