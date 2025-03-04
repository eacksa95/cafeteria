from rest_framework import serializers
from .models import Pedido
import json

class PedidoSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'mesa', 'lista_productos', 'lista_cantidad', 'monto', 'estado', 'fecha_recepcion', 'hora_recepcion', 'hora_listo', 'hora_entregado']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['lista_productos'] = json.loads(representation['lista_productos'])
        representation['lista_cantidad'] = json.loads(representation['lista_cantidad'])
        return representation
