from djongo import models


class Categoria(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='🍽️')
    descripcion = models.CharField(max_length=200, blank=True, default='')
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=300, blank=True, default='')
    precio = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    disponible = models.BooleanField(default=True)
    # img: URL de imagen (Cloudinary, GitHub raw, Unsplash, etc.) — opcional
    img = models.CharField(max_length=500, blank=True, default='')
    # Nueva referencia a Categoria por ID
    categoria_id = models.IntegerField(default=1)
    # Campo legacy (documentos MongoDB existentes)
    categoria = models.CharField(max_length=50, blank=True, default='otro')
    cantidad = models.IntegerField(default=1)

    class Meta:
        ordering = ['categoria_id', 'nombre']

    def __str__(self):
        return self.nombre
