from djongo import models

class Producto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(default=0, max_digits=10, decimal_places=2) # Puede ser mas adecuado usar DecimalField
    cantidad = models.IntegerField(default=1) # necesario en frontend por mala implementación en calculo de pedidos
    img = models.CharField(max_length=400)