from django.conf import settings
from django.shortcuts import redirect
import requests, os, base64, hashlib

def get_access_token(request):

    apiResponse = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={"Content-Type" : "application/x-www-form-urlencoded"},
        data={"grant_type" : "client_credentials"},
        auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET)
    )

    accessToken = apiResponse.json().get("access_token")

    return accessToken


def authoriseUser(request):
    verifier = generateCodeVerifier()
    challenge = generateCodeChallenge(verifier)

    request.session['verifier'] = verifier

    authURL = f"https://accounts.spotify.com/authorize?client_id={settings.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://127.0.0.1:8000/scoreify/callback/&code_challenge_method=S256&code_challenge={challenge}""&scope=user-read-private user-read-email"

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
    "redirect_uri": "http://127.0.0.1:8000/scoreify/callback/",
    "code" : code,
    "code_verifier" : codeVerifier
    }
    response = requests.post("https://accounts.spotify.com/api/token", 
                           headers={ "Content-Type": "application/x-www-form-urlencoded" },
                           data=postData)
    return response.json().get('access_token')

def getUserProfile(accessToken):
    response = requests.get(settings.SPOTIFY_URL, headers={ 'Authorization' : f"Bearer {accessToken}" })
    return response.json()

def getProfileInfo():
    return None


