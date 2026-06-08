from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Affiliate(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Hashed password
    code = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=30, blank=True)  # For e-wallet payouts
    payment_method = models.CharField(max_length=100, blank=True)
    payment_details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} ({self.code})"

class ReferralClick(models.Model):
    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='clicks')
    hashed_ip = models.CharField(max_length=64, db_index=True)
    path = models.CharField(max_length=255, default='/')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('affiliate', 'hashed_ip')  # 1 unique click per IP per affiliate to prevent fraud
        ordering = ['-timestamp']

    def __str__(self):
        return f"Click for {self.affiliate.code} from {self.hashed_ip} at {self.timestamp}"
