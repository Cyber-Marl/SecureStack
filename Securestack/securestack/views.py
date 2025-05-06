from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from .models import Service, Project, Testimonial, TeamMember, ContactMessage

def home(request):
    services = Service.objects.filter(is_active=True)
    featured_projects = Project.objects.filter(is_featured=True, is_active=True)
    testimonials = Testimonial.objects.filter(is_active=True)
    team_members = TeamMember.objects.filter(is_active=True)
    
    context = {
        'services': services,
        'featured_projects': featured_projects,
        'testimonials': testimonials,
        'team_members': team_members,
    }
    return render(request, 'home.html', context)

def services(request):
    services = Service.objects.filter(is_active=True)
    return render(request, 'services.html', {'services': services})

def projects(request):
    projects = Project.objects.filter(is_active=True)
    return render(request, 'projects.html', {'projects': projects})

def about(request):
    team_members = TeamMember.objects.filter(is_active=True)
    return render(request, 'about.html', {'team_members': team_members})

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Save to database
        ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            message=message
        )
        
        # Send email
        send_mail(
            f'New Contact Form Submission: {subject}',
            f'Name: {name}\nEmail: {email}\nPhone: {phone}\nMessage: {message}',
            settings.DEFAULT_FROM_EMAIL,
            [settings.CONTACT_EMAIL],
            fail_silently=False,
        )
        
        messages.success(request, 'Thank you for your message. We will get back to you soon!')
        return redirect('contact')
    
    return render(request, 'contact.html') 