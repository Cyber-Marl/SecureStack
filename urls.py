from django.urls import path, register_converter
from . import views

# Custom path converter to allow slashes in farm_id
class SlashConverter:
    regex = '.+'

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value

register_converter(SlashConverter, 'slash')

urlpatterns = [
    path('parent-farm/<slash:farm_id>/edit/', views.edit_parent_farm, name='edit_parent_farm'),
]