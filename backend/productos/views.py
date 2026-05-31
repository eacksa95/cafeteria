from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer
from cafeteria_be.permissions import IsRecepcionistaOrCocinero, IsAdmin, get_user_role


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAdmin()]


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
        """Endpoint público: productos disponibles para carta digital."""
        productos = Producto.objects.filter(disponible=True)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='menu-completo')
    def menu_completo(self, request):
        """Endpoint público: categorías con sus productos disponibles para TV2."""
        categorias = Categoria.objects.all()
        result = []
        for cat in categorias:
            productos = Producto.objects.filter(categoria_id=cat.id)
            result.append({
                'categoria': CategoriaSerializer(cat).data,
                'productos': ProductoSerializer(productos, many=True).data,
            })
        return Response(result)
