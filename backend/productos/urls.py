from rest_framework import routers
from .views import ProductosViewSet, CategoriaViewSet

router = routers.DefaultRouter()
router.register(r'productos', ProductosViewSet, basename='productos')
router.register(r'categorias', CategoriaViewSet, basename='categorias')

urlpatterns = router.urls
