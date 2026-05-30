# Cafetería — Documentación de Desarrollo
> Documento de trabajo interno. Uso: Ezequiel Cristaldo + Claude (IA).
> Última actualización: Mayo 2026

---

## ¿Qué es este proyecto?

**Cafetería** es un sistema de gestión para locales gastronómicos (restaurantes, cafeterías, bares)
construido como proyecto de desarrollo de software de ciclo completo.

El dominio del negocio — atención al cliente en un local — sirve como escenario concreto
para demostrar el proceso completo de desarrollo: análisis de requerimientos, diseño del modelo
de dominio, implementación full stack, control de roles y despliegue en producción.

El sistema no es un ejercicio académico genérico. Es una herramienta funcional que cubre
el flujo real de operación de un local: desde que el cliente elige su pedido hasta que
el cocinero lo prepara, el mozo lo entrega y el administrador cierra el turno con sus reportes.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Bootstrap + React Query |
| Backend | Python + Django 4 + Django REST Framework |
| Base de datos | MongoDB Atlas (djongo como ORM) |
| Autenticación | JWT (djangorestframework-simplejwt) |
| Deploy backend | Railway |
| Deploy frontend | Netlify |
| Control de versiones | GitHub |

---

## Modelo de dominio

### Entidades principales
- **Producto** — ítem del menú (nombre, descripción, precio, categoría, imagen, disponibilidad)
- **Pedido** — orden generada por un cliente/mozo (lista de productos, mesa, cliente, estado, timestamps)
- **Usuario** — operador del sistema con rol asignado

### Estados de un Pedido
```
PENDIENTE → EN_PROCESO → LISTO → ENTREGADO
              ↓
           RECHAZADO
```

### Roles del sistema
| Rol | Descripción | Vistas habilitadas |
|---|---|---|
| `admin` | Administrador del local | Todo |
| `recepcionista` | Mozo / recepción | Menú público, carrito, lista de pedidos |
| `cocinero` | Cocina | Panel de cocina (tickets) |
| `cliente` | (futuro) | Solo menú público / carta digital |

---

## Estado actual del proyecto

### ✅ Hecho
- [x] Modelo de datos: Producto, Pedido, Usuario (djongo + MongoDB)
- [x] API REST completa: CRUD de productos, pedidos y usuarios
- [x] Autenticación JWT (login, refresh token)
- [x] Sistema de permisos por rol (`permissions.py`)
- [x] Frontend base: login, carrito de compra, vista de productos
- [x] Deploy en producción: Railway (backend) + Netlify (frontend)
- [x] Migración de Render a Railway
- [x] CORS restringido al frontend de producción
- [x] Variables de entorno (MONGO_URI, SECRET_KEY, DEBUG)
- [x] Fix: `permissions.py` — superusuario y usuario sin grupo no explotan en 500

### 🔧 En proceso / bugs conocidos
- [ ] Verificar que todos los endpoints CRUD funcionan correctamente en producción
- [ ] El frontend usa Bootstrap — evaluar migración a Tailwind CSS para coherencia con el resto del portafolio
- [ ] El ID de usuario en el JWT puede no coincidir con el de MongoDB en algunos casos

---

## Task List — Por módulo

### 1. Sistema de Roles y Menús dinámicos
- [ ] Implementar menú de navegación dinámico según rol del usuario logueado
- [ ] Vista de administración: acceso a usuarios, productos, reportes
- [ ] Vista de recepcionista/mozo: solo carrito y estado de pedidos
- [ ] Vista de cocinero: solo panel de cocina
- [ ] Crear grupos de Django automáticamente con un management command (`python manage.py seed_groups`)
- [ ] Asignar rol al crear usuario (form en admin)

### 2. Panel de Cocina
- [ ] Vista "Cocina" — lista de pedidos en tiempo real
- [ ] Mostrar tickets en tarjetas/cards: número de pedido, mesa, productos, tiempo
- [ ] Botón "En proceso" (cocinero acepta el pedido)
- [ ] Botón "Listo" (pedido preparado, notifica al mozo)
- [ ] Botón "Rechazar" con motivo
- [ ] Auto-refresh cada N segundos (o WebSocket en versión avanzada)

### 3. Carta Digital / Menú Público
- [ ] Vista pública sin login (ruta `/menu` o `/carta`)
- [ ] Grid de productos con imagen, nombre, precio, descripción
- [ ] Filtro por categoría
- [ ] Diseño de pantalla grande (para tablets sobre mostrador o pantalla tipo McDonald's)
- [ ] Modo oscuro / modo presentación

### 4. Carrito y Pedidos
- [ ] Revisar y testear flujo completo: agregar al carrito → enviar pedido → confirmar
- [ ] Asignar número de mesa al pedido
- [ ] Asignar nombre del cliente
- [ ] Mostrar resumen del pedido antes de confirmar
- [ ] Limpiar carrito después de envío exitoso

### 5. Seguimiento de Pedidos (Mozo)
- [ ] Vista de "Mis pedidos" para el mozo: pendientes, en proceso, listos para entregar
- [ ] Acción "Entregar" cuando el pedido está listo
- [ ] Historial de pedidos del turno

### 6. Administración (Admin)
- [ ] CRUD de productos con carga de imagen
- [ ] CRUD de usuarios con asignación de rol/grupo
- [ ] Vista de pedidos del día (tabla con filtros)
- [ ] Estadísticas básicas: pedidos del día, productos más vendidos

### 7. Facturación / Caja
- [ ] Generar ticket/comprobante del pedido (PDF o vista imprimible)
- [ ] Registrar método de pago
- [ ] Cierre de caja del turno
- [ ] Reporte de ventas por fecha, producto, mozo

### 8. Reportes
- [ ] Ventas por período (día, semana, mes)
- [ ] Ranking de productos más pedidos
- [ ] Actividad por mozo / cocinero
- [ ] Exportar a CSV o PDF

### 9. Infraestructura / Calidad
- [ ] Tests unitarios para los endpoints principales (pytest-django)
- [ ] Variables de entorno documentadas en `.env.example`
- [ ] Documentación de API (drf-spectacular o drf-yasg → Swagger UI en `/api/docs/`)
- [ ] Evaluar migrar de djongo a Motor (async MongoDB) o a djongo alternativo más mantenido
- [ ] WebSockets para actualización en tiempo real del panel de cocina (Django Channels)

---

## Narrativa para Portafolio

> Esta sección define cómo presentar Cafetería en la página de proyectos.

### Concepto central
Cafetería demuestra que un sistema de software real no es una lista de pantallas —
es un **modelo de dominio** con operaciones, actores y flujos de trabajo.
El restaurante es el escenario elegido porque cualquier persona lo entiende de inmediato,
lo que permite evaluar el software por lo que hace, no por la tecnología que usa.

### Lo que hace visible
- Cómo se define un modelo de datos antes de escribir código
- Cómo se implementa control de acceso por rol en una API REST
- Cómo conviven múltiples vistas para distintos usuarios del mismo sistema
- Cómo se despliega y opera un sistema full stack en producción

### Frase de presentación (borrador)
> "Sistema de gestión para locales gastronómicos. Un administrador ve todo;
> el mozo toma pedidos, el cocinero los procesa, la caja los cierra.
> Construido con Django REST Framework y React, desplegado en Railway y Netlify."

### Elementos visuales sugeridos para la card del portafolio
- GIF o screenshot del panel de cocina con tickets en tiempo real
- Screenshot del menú público (carta digital) en tablet
- Diagrama de flujo del pedido (Pendiente → Listo → Entregado)

---

## Decisiones técnicas registradas

| Decisión | Motivo |
|---|---|
| MongoDB en lugar de PostgreSQL | Proyecto de bootcamp, modelo sin JOIN complejos |
| djongo como ORM | Única opción disponible para usar Django ORM con MongoDB |
| JWT en lugar de sesiones | API sin estado, múltiples clientes (frontend, futura app móvil) |
| Railway para backend | Migración desde Render, integración nativa con GitHub |
| `ALLOWED_HOSTS = ['*']` por ahora | CORS ya restringe acceso desde navegadores; suficiente para este alcance |
| Sin CsrfViewMiddleware | JWT en localStorage no es vulnerable a CSRF |

---

## Notas de trabajo

- El `createsuperuser` de Django no asigna grupo → hay que asignarlo manualmente
  o ejecutar `seed_groups` (pendiente de implementar)
- El ID del usuario en el JWT viene del campo `id` de Django auth, que en MongoDB
  puede ser un entero autoincremental o un ObjectId según la versión del esquema
- `djongo 1.3.6` requiere `pymongo 3.x` — NO actualizar pymongo a 4.x
- `whitenoise.storage.CompressedManifestStaticFilesStorage` requiere que `collectstatic`
  se haya ejecutado antes del deploy (ya configurado en `railway.json`)
