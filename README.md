# Proyecto final de Back-end

## Descripción del proyecto

El objetivo de este proyecto fue poner en práctica los conocimientos que fueron adquiridos a lo lago del curso "Programación Backend" tomado en Coderhouse. La premisa era integrar distintos desafíos en una aplicación final con las utilidades que se aprendían clase a clase, aplicar patrones de diseño (singleton, repository) y arquitectura por capas (MVC). El desarrollo estuvo particularmente enfocado al desarrollo del servidor y su APIrest, sin embargo se empleó un motor de plantillas para hacer un Front-end sencillo para probar distintas funcionalidades.

## Equipo docente

- Profesor: Diego Fernando Alzate Cardona
- Tutor: Gabriel Navarro

## Requisitos de la aplicación

La idea fue crear una aplicación tipo e-commerce que incluya:

- Gestión de productos (CRUD)
- Gestión de usuarios (CRUD)
- Sistemas de permisos para algunas funciones puntuales
- Un chat general sólo para usuarios (integrado para aplicar la funcionalidad de websocket)
- Sistema de autenticación empleando passport y sessions (incluyendo autenticación con Github)
- Sistema de carrito y compra
- Pasarela de pago para tarjetas (implementado con Stripe)
- Aplicar testing unitario a modo introductorio para algunas funcionalidades

## Enlace al sitio activo

- https://entregas-backend-coder.glitch.me/ (Funcionalidad de Front-end limitada!)

## Librerías utilizadas (npm)

### Requeridas para el funcionamiento de la aplicación

- awilix
- axios
- bcrypt
- connect-mongo
- cookie-parser
- cors
- dotenv
- express
- express-handlebars
- express-session
- jsonwebtoken
- mongoose
- mongoose-delete
- mongoose-paginate-v2
- multer
- nanoid
- nodemailer
- passport
- passport-github2
- passport-local
- socket.io
- stripe
- swagger-jsdoc
- swagger-ui-express
- winston

### Utilizadas para el desarrollo

- @faker-js/faker
- chai
- mocha
- nodemon
- prettier
- supertest

## Estado del proyecto

Finalizado. A decidir si se recrea el Front-end utilizando ReactJS.

## Instalación

Clonado del repositorio a directorio local

```bash
  git clone https://github.com/sfonzo96/ProyectoFInalBackend-Coderhouse.git
```

Moverse a directorio repositorio local

```bash
  cd ProyectoFInalBackend-Coderhouse
```

Instalación de paquetes y dependencias con npm

```bash
  npm i -y
```

Inicializar aplicación

Para iniciar con nodemon:

```bash
  npm dev
```

Para iniciar correr con node:

```bash
  npm start
```

Detener servidor

```bash
  ctrl + c
```

## Variables de entorno

| Variable            | Descripción                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `PORT`              | Puerto sobre el cual se levantará el servidor de manera local. Valores sugeridos: [8080, 3000]                              |
| `NODE_ENV`          | Define el entorno del servidor. Valores: [production, development]                                                          |
| `MONGO_URI_PROD`    | URL de conexión a MongoDB para DB de producción.                                                                            |
| `MONGO_URI_DEV`     | URL de conexión a MongoDB para DB de dev/test. Se sugiere local.                                                            |
| `SESSION_SECRET`    | Clave o secreto para session.                                                                                               |
| `JWT_SECRET`        | Clave o secreto para JSON Web Token.                                                                                        |
| `GH_CLIENT_ID`      | ID de cliente de API de autenticación de Github. Se obtiene en la plataforma (ver sección desarrollo de la plataforma).     |
| `GH_CLIENT_SECRET`  | Clave o secreto de API de autenticación de Github. Se obtiene como la anterior.                                             |
| `APP_ID`            | ID de API de autenticación de Github. Se obtiene como las anteriores. No es requerida.                                      |
| `GMAIL_PASS`        | Clave de acceso a mailing de GMAIL. Se obtiene en la plataforma (ver sección desarrollo de la plataforma).                  |
| `GMAIL_USER`        | Dirección de correo electrónico que actuará como remitente.                                                                 |
| `STRIPE_SECRET_KEY` | Clave o secreto de API de Stripe (gestión de págos). Se obtiene en la plataforma (ver sección desarrollo de la plataforma). |

## Autor del proyecto

- [@sfonzo96](https://www.linkedin.com/in/santiagofonzo/)

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).
