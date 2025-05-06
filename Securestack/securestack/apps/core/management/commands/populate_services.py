from django.core.management.base import BaseCommand
from apps.core.models import Service

class Command(BaseCommand):
    help = 'Populate the Service model with predefined services'

    def handle(self, *args, **kwargs):
        services = [
            {"title": "Web Development", "description": "Building modern and responsive websites.", "icon": "fas fa-code"},
            {"title": "Software Development", "description": "Custom software solutions for businesses.", "icon": "fas fa-laptop-code"},
            {"title": "System Security Consultancy", "description": "Expert advice on securing IT systems.", "icon": "fas fa-shield-alt"},
            {"title": "Technical Support", "description": "Reliable support for IT infrastructure.", "icon": "fas fa-headset"},
        ]

        for service in services:
            Service.objects.get_or_create(**service)
        self.stdout.write(self.style.SUCCESS('Successfully populated the Service model.'))
