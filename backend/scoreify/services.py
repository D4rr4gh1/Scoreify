from django.conf import settings
from django.shortcuts import redirect
import requests, os, base64, hashlib


def authoriseUser(request):

    # Generate the verifier and challenge needed to auth
    verifier = generateCodeVerifier()
    challenge = generateCodeChallenge(verifier)

    request.session['verifier'] = verifier

    authURL = f"https://accounts.spotify.com/authorize?client_id={settings.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri={settings.BACKEND_URL}/scoreify/callback/&code_challenge_method=S256&code_challenge={challenge}""&scope=user-read-private user-read-email user-top-read"

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
    return response.json().get('access_token')

def getUserProfile(accessToken):
    response = requests.get(settings.SPOTIFY_URL, headers={ 'Authorization' : f"Bearer {accessToken}" })
    return response

def getTopItems(accessToken, items, limit, timeRange):
    response = requests.get(f'https://api.spotify.com/v1/me/top/{items}?time_range={timeRange}&limit={limit}', headers={ 'Authorization' : f"Bearer {accessToken}" })
    return response 


