from django import forms
from landsApp.models import ParentFarm

class ParentFarmForm(forms.ModelForm):
    class Meta:
        model = ParentFarm
        fields = '__all__'  # Include all fields from the ParentFarm model

class EditParentFarmForm(forms.ModelForm):
    class Meta:
        model = ParentFarm
        fields = '__all__'  # Include all fields from the ParentFarm model
