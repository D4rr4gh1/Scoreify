from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("callback/", views.callback, name="callback"),
    path("profile/", views.spotifyProfile, name="profile"),
    path("topitems/", views.topItems, name="top_items")
]