from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from cafeteria_be.permissions import IsRecepcionistaOrCocinero

class ProductosViewSet(viewsets.ModelViewSet):
    # Minimamente hay que pasar queryset y serializer_class
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsRecepcionistaOrCocinero] # Instancia y retorna la lista de permisos que esta vista requiere