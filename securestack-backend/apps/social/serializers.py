from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    readTime = serializers.CharField(source='read_time')
    seoTitle = serializers.CharField(source='seo_title', required=False, allow_null=True)
    seoDesc = serializers.CharField(source='seo_desc', required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            'slug',
            'title',
            'excerpt',
            'date',
            'author',
            'readTime',
            'category',
            'tags',
            'seoTitle',
            'seoDesc',
            'keywords',
            'content',
            'status',
            'created_at',
            'updated_at'
        ]

    def get_tags(self, obj):
        if obj.tags:
            return [t.strip() for t in obj.tags.split(',') if t.strip()]
        return []
