<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar el comando 

```
yarn install
```

3. Tener instalado nest cli instalado
```
npm i -g @nestjs/cli
```

4.Levantar la bd
```
docker-compose up -d
```


5. Clonar el archivo .env.template y renombrar la copia a .env

6. Llenar las variables de entorno definidas en el .env

7. Ejecutar la aplicacion en dev con
```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla

```
localhost:3000/api/v2/seed
```

# Build de produccion

1. crear el archivo 
```
.env.prod
```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen con 
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```


## Stack usado

* Mongo db
* Nest
