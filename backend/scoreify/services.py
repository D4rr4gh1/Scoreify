from django.conf import settings
from django.shortcuts import redirect
from django.core.signing import Signer
from django.utils import timezone
from datetime import timedelta
import requests, os, base64, hashlib
from .models import customSession

def authoriseUser(request):

    # Generate the verifier and challenge needed to auth
    codeVerifier = generateCodeVerifier()
    challenge = generateCodeChallenge(codeVerifier)
    session = customSession.objects.create(verifier=codeVerifier)

    # Sign the verifier and store it in the session
    authURL = f"https://accounts.spotify.com/authorize?client_id={settings.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri={settings.BACKEND_URL}/scoreify/callback/&code_challenge_method=S256&code_challenge={challenge}&scope=user-read-private user-read-email user-top-read&state={session.session_id}"

    return redirect(authURL)

def generateCodeVerifier():
    length = 128
    randomBytes = os.urandom(32)

    codeVerifier = base64.urlsafe_b64encode(randomBytes).rstrip(b'=').decode('utf-8')
    while len(codeVerifier) < length:
        extraEntropy = base64.urlsafe_b64encode(os.urandom(1)).rstrip(b'=').decode('utf-8')
        codeVerifier += extraEntropy
    
    return codeVerifier[:length]

def generateCodeChallenge(codeVerifier: str):
    bytes = codeVerifier.encode('utf-8')

    digest = hashlib.sha256(bytes).digest()

    codeChallenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode('utf-8')

    return codeChallenge

def getAccessToken(code, codeVerifier):
    
    postData = {
    "client_id" : settings.SPOTIFY_CLIENT_ID,
    "grant_type" : "authorization_code",
    "redirect_uri": f"{settings.BACKEND_URL}/scoreify/callback/",
    "code" : code,
    "code_verifier" : codeVerifier
    }
    response = requests.post("https://accounts.spotify.com/api/token", 
                           headers={ "Content-Type": "application/x-www-form-urlencoded" },
                           data=postData)
    print("Response for access tokenis: %s", response.json())
    return response.json().get('access_token')

def getUserProfile(accessToken):
    response = requests.get(settings.SPOTIFY_URL, headers={ 'Authorization' : f"Bearer {accessToken}" })
    return response

def getTopItems(accessToken, items, limit, timeRange):
    response = requests.get(f'https://api.spotify.com/v1/me/top/{items}?time_range={timeRange}&limit={limit}', headers={ 'Authorization' : f"Bearer {accessToken}" })
    return response 

def deleteExpiredDBEntries():
    expiry_threshold = timezone.now() - timedelta(hours=1)
    # Add a limit to avoid long-running deletions
    # and index on created_at for better performance
    customSession.objects.filter(created_at__lt=expiry_threshold).delete()
