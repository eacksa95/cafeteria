from djongo import models

class Pedido(models.Model):
    id = models.IntegerField(primary_key=True)
    cliente = models.CharField(max_length=100, default='cliente')
    mesa = models.IntegerField()
    lista_productos = models.JSONField()
    lista_cantidad = models.JSONField()
    monto = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50)
    fecha_recepcion = models.DateField(auto_now_add=True)
    hora_recepcion = models.TimeField(auto_now_add=True)
    hora_listo = models.TimeField(null=True)
    hora_entregado = models.TimeField(null=True)
    
 