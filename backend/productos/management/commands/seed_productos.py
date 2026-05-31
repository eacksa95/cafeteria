"""
Seed de categorías y productos para el menú del Coffee Shop.

Uso:
    python manage.py seed_productos            # crea datos (no sobreescribe)
    python manage.py seed_productos --reset    # elimina todo y recrea
"""
from django.core.management.base import BaseCommand
from productos.models import Categoria, Producto


CATEGORIAS = [
    { 'id': 1, 'nombre': 'Bebidas calientes', 'emoji': '☕', 'descripcion': 'Cafés, tés y chocolate', 'orden': 1 },
    { 'id': 2, 'nombre': 'Jugos y bebidas',   'emoji': '🥤', 'descripcion': 'Jugos naturales, gaseosas y cervezas', 'orden': 2 },
    { 'id': 3, 'nombre': 'Desayunos',         'emoji': '🥐', 'descripcion': 'Medialunas, tostados y combos', 'orden': 3 },
    { 'id': 4, 'nombre': 'Entradas',          'emoji': '🍟', 'descripcion': 'Papas, pan y para compartir', 'orden': 4 },
    { 'id': 5, 'nombre': 'Platos del día',    'emoji': '🍽️', 'descripcion': 'Guisos, asados y platos principales', 'orden': 5 },
    { 'id': 6, 'nombre': 'Postres',           'emoji': '🍰', 'descripcion': 'Tortas, alfajores y helados', 'orden': 6 },
]

PRODUCTOS = [
    # ── Bebidas calientes (cat 1) ────────────────────────────────────────
    { 'id': 101, 'nombre': 'Café espresso',       'descripcion': 'Espresso puro, intenso y aromático',          'precio': 2500, 'categoria_id': 1 },
    { 'id': 102, 'nombre': 'Café americano',       'descripcion': 'Espresso rebajado con agua caliente',         'precio': 3000, 'categoria_id': 1 },
    { 'id': 103, 'nombre': 'Café con leche',       'descripcion': 'Espresso con leche caliente',                 'precio': 3500, 'categoria_id': 1 },
    { 'id': 104, 'nombre': 'Cappuccino',           'descripcion': 'Espresso, leche vaporizada y espuma',         'precio': 4000, 'categoria_id': 1 },
    { 'id': 105, 'nombre': 'Chocolate caliente',   'descripcion': 'Cacao puro con leche entera',                 'precio': 4000, 'categoria_id': 1 },
    { 'id': 106, 'nombre': 'Té negro',             'descripcion': 'Té en saquito con agua caliente',             'precio': 2000, 'categoria_id': 1 },
    { 'id': 107, 'nombre': 'Té de manzanilla',     'descripcion': 'Infusión relajante',                          'precio': 2000, 'categoria_id': 1 },

    # ── Jugos y bebidas (cat 2) ──────────────────────────────────────────
    { 'id': 201, 'nombre': 'Jugo de naranja',      'descripcion': 'Naranja exprimida al momento',                'precio': 4000, 'categoria_id': 2 },
    { 'id': 202, 'nombre': 'Jugo de durazno',      'descripcion': 'Jugo natural de durazno',                     'precio': 4000, 'categoria_id': 2 },
    { 'id': 203, 'nombre': 'Frugos',               'descripcion': 'Jugo envasado sabores varios',                'precio': 3000, 'categoria_id': 2 },
    { 'id': 204, 'nombre': 'Jugo de mango',        'descripcion': 'Mango tropical natural',                      'precio': 4000, 'categoria_id': 2 },
    { 'id': 205, 'nombre': 'Gaseosa CocaCola',     'descripcion': 'Lata 350ml',                                  'precio': 3500, 'categoria_id': 2 },
    { 'id': 206, 'nombre': 'CervePar',             'descripcion': 'Cerveza nacional 350ml',                      'precio': 5000, 'categoria_id': 2 },
    { 'id': 207, 'nombre': 'Agua mineral',         'descripcion': 'Agua fría sin gas 500ml',                     'precio': 2000, 'categoria_id': 2 },

    # ── Desayunos (cat 3) ────────────────────────────────────────────────
    { 'id': 301, 'nombre': 'Medialuna',            'descripcion': 'Medialuna de mantequilla',                    'precio': 1500, 'categoria_id': 3 },
    { 'id': 302, 'nombre': 'Combo desayuno',       'descripcion': 'Café con leche + 2 medialunas + jugo',        'precio': 7000, 'categoria_id': 3 },
    { 'id': 303, 'nombre': 'Tostado jamón y queso','descripcion': 'Pan de molde, jamón, queso y mantequilla',    'precio': 5500, 'categoria_id': 3 },
    { 'id': 304, 'nombre': 'Yogur con granola',    'descripcion': 'Yogur natural con granola y miel',            'precio': 4000, 'categoria_id': 3 },

    # ── Entradas (cat 4) ─────────────────────────────────────────────────
    { 'id': 401, 'nombre': 'Papas fritas',         'descripcion': 'Papas fritas crujientes con sal',             'precio': 7000, 'categoria_id': 4 },
    { 'id': 402, 'nombre': 'Pan tostado',          'descripcion': 'Pan tostado con mantequilla',                 'precio': 2500, 'categoria_id': 4 },
    { 'id': 403, 'nombre': 'Agua fría en jarra',   'descripcion': 'Jarra de agua helada con vaso',               'precio': 3000, 'categoria_id': 4 },
    { 'id': 404, 'nombre': 'Empanadas (x3)',       'descripcion': 'Empanadas de carne al horno',                 'precio': 6000, 'categoria_id': 4 },
    { 'id': 405, 'nombre': 'Tabla de fiambres',    'descripcion': 'Jamón, salame, quesos y aceitunas',           'precio': 12000,'categoria_id': 4 },

    # ── Platos del día (cat 5) ───────────────────────────────────────────
    { 'id': 501, 'nombre': 'Guiso arroz con pollo','descripcion': 'Guiso casero de arroz con pollo',             'precio': 12000,'categoria_id': 5 },
    { 'id': 502, 'nombre': 'Guiso arroz con carne','descripcion': 'Guiso casero de arroz con carne',             'precio': 13000,'categoria_id': 5 },
    { 'id': 503, 'nombre': 'Asado a la olla',      'descripcion': 'Carne estofada con verduras',                 'precio': 15000,'categoria_id': 5 },
    { 'id': 504, 'nombre': 'Milanesa con papas',   'descripcion': 'Milanesa de res con papas fritas',            'precio': 14000,'categoria_id': 5 },
    { 'id': 505, 'nombre': 'Sopa de verduras',     'descripcion': 'Sopa caliente de estación',                   'precio': 8000, 'categoria_id': 5 },

    # ── Postres (cat 6) ──────────────────────────────────────────────────
    { 'id': 601, 'nombre': 'Cheesecake',           'descripcion': 'Cheesecake con frutos rojos',                 'precio': 5000, 'categoria_id': 6 },
    { 'id': 602, 'nombre': 'Alfajor',              'descripcion': 'Alfajor de maicena con dulce de leche',       'precio': 3000, 'categoria_id': 6 },
    { 'id': 603, 'nombre': 'Medialunas con DDL',   'descripcion': 'Medialunas rellenas con dulce de leche',      'precio': 3500, 'categoria_id': 6 },
    { 'id': 604, 'nombre': 'Helado de chocolate',  'descripcion': '2 bochas de helado artesanal',                'precio': 4000, 'categoria_id': 6 },
    { 'id': 605, 'nombre': 'Flan casero',          'descripcion': 'Flan con caramelo y crema',                   'precio': 4500, 'categoria_id': 6 },
]


class Command(BaseCommand):
    help = 'Crea categorías y productos del menú'

    def add_arguments(self, parser):
        parser.add_argument('--reset', action='store_true', help='Elimina todo antes de crear')

    def handle(self, *args, **options):
        if options['reset']:
            Categoria.objects.all().delete()
            Producto.objects.all().delete()
            self.stdout.write('  Datos anteriores eliminados.')

        # Categorías
        self.stdout.write('\nCategorías:')
        for data in CATEGORIAS:
            obj, created = Categoria.objects.get_or_create(id=data['id'], defaults=data)
            status = 'creada ✓' if created else 'ya existe'
            self.stdout.write(f'  {data["emoji"]} {data["nombre"]:25} {status}')

        # Productos
        self.stdout.write('\nProductos:')
        for data in PRODUCTOS:
            obj, created = Producto.objects.get_or_create(
                id=data['id'],
                defaults={**data, 'disponible': True, 'img': '', 'categoria': 'otro'}
            )
            status = 'creado ✓' if created else 'ya existe'
            self.stdout.write(f'  #{data["id"]:4} {data["nombre"]:35} ${data["precio"]:>7,}  {status}')

        total_cats  = Categoria.objects.count()
        total_prods = Producto.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'\nSeed completado: {total_cats} categorías, {total_prods} productos.'
        ))
