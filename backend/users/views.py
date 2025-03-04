from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializer
from cafeteria_be.permissions import IsAdmin, IsRecepcionistaOrCocinero

class UsersViewSet(viewsets.ModelViewSet):
    # Minimamente hay que pasar queryset y serializer_class
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        permission_classes = []
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [IsRecepcionistaOrCocinero]
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update' or self.action == 'destroy':
            permission_classes = [IsAdmin]
        
        return [permission() for permission in permission_classes]