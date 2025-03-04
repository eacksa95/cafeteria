
# Bootcamp de Desarrollo Web Full Stack: Modulo de API REST con DRF 
Este proyecto contiene el código de las clases desarrolladas en el modulo de API REST con DRF.  
Sirve como base para la construcción de nuestro proyecto de la API de Cafeteria.

# Requerimientos
Para levantar este proyecto necesitas:
- Python 3+
- MongoDB
- Conocimientos basicos de Django y DRF

 OBS: Antes de crear este proyecto, creamos una API de Peliculas usando Django puro y diferentes implementaciones de DRF. Puedes acceder al codigo de esa clase [aquí](https://github.com/mauri-medina/drf_bootcamp)

# Sobre el codigo:
Separamos el codigo en ramas, segun las clases desarolladas

Las distintas secciones estan contenidas en ramas:
- **mongodb-integration**: Proyecto base de cafeteria integrado con Mongo, con API básica de Productos utilizando ViewSets.
- **ejemplo-relaciones**: Ejemplo de relaciones en MongoDB: Pedidos y productos.
- **authentication**: Autenticacion de endpoints con JWT Token.
- **authentication-with-roles**: Autorizacion de endpoints con JWT Token.
- **front-end-integration**: Integracion con el proyecto front end, Se agrega CORS, modifica duracion del token para simplificar desarrollo, se creo un nuevo endpoint para obtener la informacion del user. 
  
Para cambiar a una rama diferente, utilice el siguiente comando Git:
`git checkout nombre-rama  `

## Instalación de dependencias
Para instalar las dependencias del proyecto, siga estos pasos:
1. Abra una terminal dentro del proyecto, en la misma ubicación que el archivo *requirements.txt.*
2. Active el virtualenv del proyecto.
2. Ejecute el siguiente comando pip para instalar las dependencias del proyecto desde el archivo *requirements.txt*:
`pip install -r requirements.txt`

## Correr migraciones
Para crear la base de datos localmente deben correr el siguiente comando
`python .\manage.py migrate`
