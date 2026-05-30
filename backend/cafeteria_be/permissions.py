from rest_framework import permissions


def get_user_role(user):
    if user.is_superuser:
        return 'admin'
    try:
        return user.groups.get().name
    except Exception:
        return None


class IsRecepcionista(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'mozo'


class IsCocinero(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'cocinero'


class IsCajero(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) in ('cajero', 'admin')


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'admin'


class IsRecepcionistaOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) in ('mozo', 'admin')


class IsRecepcionistaOrCocinero(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) in ('mozo', 'cocinero', 'cajero', 'admin')
