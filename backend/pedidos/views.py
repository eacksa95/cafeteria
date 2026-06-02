from rest_framework import status, viewsets
from rest_framework.response import Response
from django.db.models import Max
from .models import Pedido
from .serializers import PedidoSerializer
from cafeteria_be.permissions import IsRecepcionistaOrCocinero


class PedidosViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def get_permissions(self):
        return [IsRecepcionistaOrCocinero()]

    def create(self, request, *args, **kwargs):
        """Auto-asigna ID si no se provee o si el provisto excede el rango de IntegerField."""
        data = dict(request.data)

        provided_id = data.get('id')
        try:
            id_invalid = not provided_id or int(str(provided_id)) > 2_147_483_647
        except (ValueError, TypeError):
            id_invalid = True

        if id_invalid:
            try:
                max_id = Pedido.objects.aggregate(Max('id'))['id__max'] or 0
            except Exception:
                max_id = Pedido.objects.count()
            data['id'] = int(max_id) + 1

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
