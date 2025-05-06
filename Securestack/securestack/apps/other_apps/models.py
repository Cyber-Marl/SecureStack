from django.db import models

# Define your models here
class ExampleModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class YourModelName(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name