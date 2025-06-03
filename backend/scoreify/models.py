from django.db import models
from datetime import timedelta
from django.utils import timezone
import uuid 

class customSession(models.Model):
    session_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    verifier = models.CharField(max_length=255, null=True)
    access_token = models.CharField(max_length=255, null=True, blank=True)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return self.created_at + timedelta(hours=1) < timezone.now()