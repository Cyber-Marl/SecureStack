from rest_framework import serializers
from .models import Affiliate
from apps.contact.models import ContactMessage

class AffiliateRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Affiliate
        fields = ['id', 'name', 'email', 'password', 'phone', 'payment_method', 'payment_details']

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Generate a unique short code based on name + random numbers
        name_clean = "".join(c for c in validated_data['name'] if c.isalnum()).upper()[:6]
        if not name_clean:
            name_clean = "SECURE"
        import random
        # Ensure code uniqueness
        while True:
            code = f"{name_clean}{random.randint(100, 999)}"
            if not Affiliate.objects.filter(code=code).exists():
                break
        
        affiliate = Affiliate.objects.create(code=code, **validated_data)
        affiliate.set_password(password)
        affiliate.save()
        return affiliate

class AffiliateLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class ContactMessageAffiliateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'service', 'created_at', 'status', 'reward_amount', 'reward_status']
