from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    service = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    # Affiliate tracking fields
    referred_by = models.ForeignKey(
        'affiliate.Affiliate', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='referred_leads'
    )
    status = models.CharField(
        max_length=20, 
        default='pending', 
        choices=[
            ('pending', 'Pending Enquiry'),
            ('converted', 'Converted (Project Won)'),
            ('rejected', 'Rejected / Invalid')
        ]
    )
    reward_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    reward_status = models.CharField(
        max_length=20, 
        default='unpaid', 
        choices=[
            ('unpaid', 'Unpaid'),
            ('paid', 'Paid')
        ]
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}> — {self.created_at:%Y-%m-%d}"

