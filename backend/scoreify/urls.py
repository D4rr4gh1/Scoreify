from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("callback/", views.callback, name="callback"),
    path("topitems/", views.topItems, name="top_items"),
    path("logout/", views.logout, name="logout")
]