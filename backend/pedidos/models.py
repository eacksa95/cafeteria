from djongo import models
import decimal


class Pedido(models.Model):
    id          = models.IntegerField(primary_key=True)
    cliente     = models.CharField(max_length=100, default='Anónimo', blank=True)
    mesa        = models.CharField(max_length=50, default='Sin mesa', blank=True)
    lista_productos = models.JSONField()
    lista_cantidad  = models.JSONField()
    monto       = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    estado      = models.CharField(max_length=50)
    fecha_recepcion = models.DateField(auto_now_add=True)
    hora_recepcion  = models.TimeField(auto_now_add=True)
    hora_listo      = models.TimeField(null=True, blank=True)
    hora_entregado  = models.TimeField(null=True, blank=True)
    # Trazabilidad de usuarios — para reportes por turno
    creado_por_id    = models.IntegerField(null=True, blank=True)  # mozo/cajero que tomó el pedido
    procesado_por_id = models.IntegerField(null=True, blank=True)  # cocinero que lo preparó
    entregado_por_id = models.IntegerField(null=True, blank=True)  # mozo que lo entregó

    def save(self, *args, **kwargs):
        try:
            from bson.decimal128 import Decimal128
            if isinstance(self.monto, Decimal128):
                self.monto = decimal.Decimal(str(self.monto))
        except ImportError:
            pass
        super().save(*args, **kwargs)
