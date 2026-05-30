from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Producto
from .serializers import ProductoSerializer
from cafeteria_be.permissions import IsRecepcionistaOrCocinero, IsAdmin, get_user_role


class ProductosViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsRecepcionistaOrCocinero]

    def _precio_cambiado(self, request):
        return 'precio' in request.data

    def update(self, request, *args, **kwargs):
        if self._precio_cambiado(request) and get_user_role(request.user) != 'admin':
            return Response(
                {'error': 'Solo el administrador puede modificar el precio.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if self._precio_cambiado(request) and get_user_role(request.user) != 'admin':
            return Response(
                {'error': 'Solo el administrador puede modificar el precio.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='menu')
    def menu(self, request):
        """Endpoint público para carta digital / pantallas de TV. No requiere autenticación."""
        productos = Producto.objects.all()
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
