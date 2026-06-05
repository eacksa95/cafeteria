from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()
    foto_url   = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'group_name', 'password', 'foto_url']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def get_group_name(self, obj):
        if obj.is_superuser:
            return 'admin'
        group = Group.objects.filter(user=obj).first()
        return group.name if group else None

    def get_foto_url(self, obj):
        try:
            return UserProfile.objects.get(user_id=obj.id).foto_url
        except UserProfile.DoesNotExist:
            return ''

    def _save_foto(self, user_id):
        foto_url = self.initial_data.get('foto_url')
        if foto_url is not None:
            profile, _ = UserProfile.objects.get_or_create(user_id=user_id)
            profile.foto_url = foto_url
            profile.save()

    def create(self, validated_data):
        group_name = self.initial_data.get('group_name', 'mozo')
        password   = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        try:
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            pass
        self._save_foto(user.id)
        return user

    def update(self, instance, validated_data):
        group_name = self.initial_data.get('group_name')
        password   = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        if group_name:
            group, _ = Group.objects.get_or_create(name=group_name)
            instance.groups.set([group])
        self._save_foto(instance.id)
        return instance
