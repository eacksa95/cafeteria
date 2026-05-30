from rest_framework import serializers
from django.contrib.auth.models import User, Group


class UserSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'group_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def get_group_name(self, obj):
        if obj.is_superuser:
            return 'admin'
        group = Group.objects.filter(user=obj).first()
        return group.name if group else None

    def create(self, validated_data):
        group_name = self.initial_data.get('group_name', 'mozo')
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        try:
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            pass
        return user

    def update(self, instance, validated_data):
        group_name = self.initial_data.get('group_name')
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        if group_name:
            try:
                instance.groups.clear()
                group = Group.objects.get(name=group_name)
                instance.groups.add(group)
            except Group.DoesNotExist:
                pass
        return instance
