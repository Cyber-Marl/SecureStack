from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse
from landsApp.models import ParentFarm
from landsApp.forms import ParentFarmForm, EditParentFarmForm  # Ensure you have a form for ParentFarm
import logging
import urllib.parse

logger = logging.getLogger(__name__)

def add_parent_farm(request):
    if request.method == "POST":
        logger.debug(f"Raw POST data: {request.POST}")
        form = ParentFarmForm(request.POST)
        if form.is_valid():
            parent_farm = form.save()
            logger.info(f"ParentFarm record saved successfully: {parent_farm}")
            return JsonResponse({"message": "ParentFarm record added successfully."})
        else:
            logger.error(f"Form errors: {form.errors}")
            logger.debug(f"Form cleaned data: {form.cleaned_data}")
            return JsonResponse({"errors": form.errors}, status=400)
    else:
        logger.info("Rendering the ParentFarm form.")
        form = ParentFarmForm()
    return render(request, "landsApp/manage_parent_farm.html", {"form": form})

def check_parent_farms(request):
    count = ParentFarm.objects.count()
    if count > 0:
        return JsonResponse({"message": f"There are {count} records in the ParentFarm table."})
    else:
        return JsonResponse({"message": "The ParentFarm table is empty."})

def list_parent_farms(request):
    farms = ParentFarm.objects.all()
    if farms.exists():
        data = [
            {
                "farm_id": farm.farm_id,
                "farm_name": farm.farm_name,
                "area_size": float(farm.area_size),
                "province": farm.province,
                "district": farm.district,
            }
            for farm in farms
        ]
        return JsonResponse({"records": data})
    else:
        return JsonResponse({"message": "The ParentFarm table is empty."})

def edit_parent_farm(request, farm_id):
    # Fetch the ParentFarm object using the provided farm_id
    farm = get_object_or_404(ParentFarm, farm_id=farm_id)

    if request.method == "POST":
        # Bind the form to the POST data and the existing farm instance
        form = ParentFarmForm(request.POST, instance=farm)
        if form.is_valid():
            form.save()  # Save the updated farm data
            return redirect('list_parent_farms')  # Redirect to the list of farms or another appropriate page
    else:
        # Render the form pre-filled with the farm's current data
        form = ParentFarmForm(instance=farm)

    return render(request, 'landsApp/edit_parent_farm.html', {'form': form, 'farm': farm})

def lims_dashboard(request):
    farms = ParentFarm.objects.all()
    for farm in farms:
        # Encode the farm_id to handle special characters
        encoded_farm_id = urllib.parse.quote(farm.farm_id, safe='')
        farm.edit_url = reverse('edit_parent_farm', kwargs={'farm_id': encoded_farm_id})
    return render(request, 'landsApp/lims_dashboard.html', {'farms': farms})
