from rest_framework import serializers
from django.contrib.auth.models import User, Group

class UserSerializer(serializers.ModelSerializer): 
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'group_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Indica que el campo 'password' solo se utiliza para escritura (no se muestra en las respuestas)
        }
    def get_group_name(self, obj):
        group = Group.objects.filter(user=obj).first()
        return group.name if group else None
    
    def create(self, validated_data):
        password = validated_data.pop('password')  # Obtén y elimina el campo 'password' del diccionario de datos validados
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Encripta la contraseña utilizando el método set_password()
        user.save()
        return user
