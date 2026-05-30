from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from cafeteria_be.permissions import IsAdmin, IsRecepcionistaOrCocinero

# Roles que se pueden auto-seleccionar en registro público (admin nunca)
PUBLIC_ROLES = ('mozo', 'cocinero', 'cajero')


class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action in ('retrieve', 'list'):
            permission_classes = [IsRecepcionistaOrCocinero]
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='register')
    def register(self, request):
        group_name = request.data.get('group_name', 'mozo')
        if group_name not in PUBLIC_ROLES:
            return Response(
                {'error': 'Rol no permitido. Elegí entre: mozo, cocinero, cajero.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Usuario creado. Ya podés iniciar sesión.'},
            status=status.HTTP_201_CREATED
        )
