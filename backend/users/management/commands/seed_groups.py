from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = 'Crea los grupos/roles del sistema si no existen'

    def handle(self, *args, **options):
        groups = ['admin', 'mozo', 'recepcionista', 'cocinero', 'cajero']
        for name in groups:
            _, created = Group.objects.get_or_create(name=name)
            status = 'creado  ✓' if created else 'ya existe'
            self.stdout.write(f'  {name:15} {status}')
        self.stdout.write(self.style.SUCCESS('seed_groups completado.'))
