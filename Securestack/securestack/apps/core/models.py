from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse

class ExampleModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class YourModelName(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('security', 'Security Solutions'),
        ('development', 'Development Services'),
        ('consulting', 'Consulting Services'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=50, help_text="Font Awesome icon class")
    short_description = models.TextField()
    content = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('core:service_detail', kwargs={'slug': self.slug})

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    client = models.CharField(max_length=200)
    completion_date = models.DateField()
    image = models.ImageField(upload_to='projects/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.TextField()
    image = models.ImageField(upload_to='team/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.company}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class Feature(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='features')
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="Font Awesome icon class")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.service.title} - {self.title}"

class Benefit(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='benefits')
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.service.title} - {self.description[:50]}..."