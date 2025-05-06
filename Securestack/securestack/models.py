from django.db import models
from django.utils import timezone

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="Font Awesome icon class")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=200)
    completion_date = models.DateField()
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    client_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    rating = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.client_name} - {self.company}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class TeamMember(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.TextField()
    image = models.ImageField(upload_to='team/')
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name 