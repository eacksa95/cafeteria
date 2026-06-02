from rest_framework import serializers
from .models import Pedido
import json


class JSONStringField(serializers.Field):
    """Almacena como string JSON en MongoDB, expone como lista Python."""

    def to_representation(self, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return []
        return value if value is not None else []

    def to_internal_value(self, data):
        # Djongo espera recibir list/dict en get_prep_value — no convertir a string.
        if isinstance(data, (list, dict)):
            return data
        if isinstance(data, str):
            try:
                return json.loads(data)  # parsear string JSON a objeto Python
            except json.JSONDecodeError:
                raise serializers.ValidationError('JSON inválido')
        return []


class PedidoSerializer(serializers.ModelSerializer):
    lista_productos = JSONStringField()
    lista_cantidad  = JSONStringField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente', 'mesa',
            'lista_productos', 'lista_cantidad',
            'monto', 'estado',
            'fecha_recepcion', 'hora_recepcion',
            'hora_listo', 'hora_entregado',
            'creado_por_id', 'procesado_por_id', 'entregado_por_id',
        ]
        read_only_fields = ['fecha_recepcion', 'hora_recepcion']
