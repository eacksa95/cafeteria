from djongo import models

CATEGORIA_CHOICES = [
    ('cafe',      'Cafés y calientes'),
    ('bebida',    'Bebidas frías'),
    ('desayuno',  'Desayunos'),
    ('comida',    'Comidas'),
    ('postre',    'Postres'),
    ('otro',      'Otro'),
]

class Producto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=1)
    img = models.CharField(max_length=400, blank=True, default='')
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES, default='otro')