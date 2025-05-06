from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Service, Project, TeamMember, Testimonial, ContactMessage, Feature, Benefit
from .forms import ContactForm

def home(request):
    services = Service.objects.all()[:6]
    projects = Project.objects.all()[:3]
    testimonials = Testimonial.objects.all()
    return render(request, 'home.html', {
        'services': services,
        'projects': projects,
        'testimonials': testimonials,
    })

def services(request):
    services = Service.objects.all()
    return render(request, 'services.html', {
        'services': services,
    })

def service_detail(request, slug):
    service = get_object_or_404(Service, slug=slug)
    return render(request, 'service_detail.html', {
        'service': service,
    })

def projects(request):
    projects = Project.objects.all()
    return render(request, 'projects.html', {
        'projects': projects,
    })

def about(request):
    team_members = TeamMember.objects.all()
    return render(request, 'about.html', {
        'team_members': team_members,
    })

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact_message = form.save()
            
            # Send email notification
            subject = f'New Contact Message: {contact_message.subject}'
            message = f'''
            Name: {contact_message.name}
            Email: {contact_message.email}
            Subject: {contact_message.subject}
            Message:
            {contact_message.message}
            '''
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [settings.CONTACT_EMAIL]
            
            try:
                send_mail(subject, message, from_email, recipient_list)
                messages.success(request, 'Your message has been sent successfully!')
            except Exception as e:
                messages.error(request, 'There was an error sending your message. Please try again later.')
            
            return redirect('core:contact')
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {
        'form': form,
    })

class ServiceListView(ListView):
    model = Service
    template_name = 'services.html'
    context_object_name = 'services'
    
    def get_queryset(self):
        return Service.objects.all().order_by('order')

class ServiceDetailView(DetailView):
    model = Service
    template_name = 'service_detail.html'
    context_object_name = 'service'
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.exclude(slug=self.object.slug)[:3]
        return context

class ProjectListView(ListView):
    model = Project
    template_name = 'projects.html'
    context_object_name = 'projects'
    
    def get_queryset(self):
        return Project.objects.all().order_by('-completion_date')

class ProjectDetailView(DetailView):
    model = Project
    template_name = 'project_detail.html'
    context_object_name = 'project'
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['projects'] = Project.objects.exclude(slug=self.object.slug)[:3]
        return context

class TeamListView(ListView):
    model = TeamMember
    template_name = 'team.html'
    context_object_name = 'team_members'
    
    def get_queryset(self):
        return TeamMember.objects.filter(is_active=True).order_by('order')

class ContactView(CreateView):
    model = ContactMessage
    template_name = 'contact.html'
    fields = ['name', 'email', 'subject', 'message']
    success_url = reverse_lazy('core:home')

    def form_valid(self, form):
        response = super().form_valid(form)
        # Send email notification
        send_mail(
            f'New Contact Message: {form.cleaned_data["subject"]}',
            f'Name: {form.cleaned_data["name"]}\nEmail: {form.cleaned_data["email"]}\nMessage: {form.cleaned_data["message"]}',
            settings.EMAIL_HOST_USER,
            [settings.CONTACT_EMAIL],
            fail_silently=False,
        )
        messages.success(self.request, 'Your message has been sent successfully!')
        return response