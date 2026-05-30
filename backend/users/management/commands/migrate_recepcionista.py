from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = 'Migra usuarios del grupo recepcionista al grupo mozo y elimina el grupo recepcionista'

    def handle(self, *args, **options):
        try:
            old_group = Group.objects.get(name='recepcionista')
        except Group.DoesNotExist:
            self.stdout.write('El grupo recepcionista no existe. Nada que migrar.')
            return

        mozo_group, _ = Group.objects.get_or_create(name='mozo')
        users = old_group.user_set.all()
        count = 0

        for user in users:
            user.groups.remove(old_group)
            user.groups.add(mozo_group)
            count += 1
            self.stdout.write(f'  {user.username} → mozo')

        old_group.delete()
        self.stdout.write(self.style.SUCCESS(
            f'Migración completada: {count} usuario(s) movidos a mozo. Grupo recepcionista eliminado.'
        ))
