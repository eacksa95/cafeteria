from rest_framework import serializers
from django.db.models import Max
from .models import Producto, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'emoji', 'descripcion', 'orden']


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'disponible', 'img', 'categoria_id', 'categoria']
        extra_kwargs = {
            'id':          {'required': False},
            'descripcion': {'required': False},
            'disponible':  {'required': False},
            'categoria':   {'required': False},
        }

    def create(self, validated_data):
        if not validated_data.get('id'):
            max_id = Producto.objects.aggregate(max_id=Max('id'))['max_id'] or 0
            validated_data['id'] = max_id + 1
        return super().create(validated_data)
