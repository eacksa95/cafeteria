# Base image
FROM node:16

RUN mkdir -p /cafeteria/app
COPY . /cafeteria/app
WORKDIR /cafeteria/app

# Instalar dependencias
RUN npm install

# Exponer el puerto en el que la aplicación se ejecutará (generalmente el 3000 para aplicaciones React)
EXPOSE 5173

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["npm", "run", "dev"]
#RUN npm run build
