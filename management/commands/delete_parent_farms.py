from django.core.management.base import BaseCommand
from landsApp.models import ParentFarm

class Command(BaseCommand):
    help = "Delete all records from the ParentFarm table"

    def handle(self, *args, **kwargs):
        count = ParentFarm.objects.count()
        ParentFarm.objects.all().delete()
        self.stdout.write(f"Deleted {count} records from the ParentFarm table.")
