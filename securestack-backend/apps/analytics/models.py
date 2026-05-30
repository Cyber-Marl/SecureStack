from django.db import models

class PageView(models.Model):
    hashed_ip = models.CharField(max_length=64, db_index=True)
    path = models.CharField(max_length=255)
    referrer = models.CharField(max_length=500, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.path} - {self.timestamp}"
