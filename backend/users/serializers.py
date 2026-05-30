from rest_framework import serializers
from django.contrib.auth.models import User, Group


class UserSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'group_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_group_name(self, obj):
        if obj.is_superuser:
            return 'admin'
        group = Group.objects.filter(user=obj).first()
        return group.name if group else None

    def create(self, validated_data):
        group_name = self.initial_data.get('group_name', 'mozo')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        try:
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            pass
        return user
