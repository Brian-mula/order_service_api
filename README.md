
## Project setup

### Clone the repository

```bash
git clone https://github.com/Brian-mula/order_service_api.git
```

### Run the application

```bash
# make sure you have docker installed on your machine

# create a .env file at the root of the project and add the following variables
1. POSTGRES_USER=postgres
2. POSTGRES_PASSWORD=postgres

3. POSTGRES_DB=orders_db

4. DB_HOST=db

5. DB_PORT=5432

6. NODE_ENV='test'

7. JWT_SECRET = "xTwmFFW5/Xmaps8dQgkBvgbd6/DTET/zZch4EQIaldDR2AFf3sI8Y2mwrri80CAnts37B3woYCnCyUMDoQ3YJEmFbWjixZ2QtsJHZJ5IBJtN383I2R75gABsYPM0a2ShqvfFpBne5MVsbMEC5OMNHfPHvFWgjiMfnfCfjmzTyMMuNxmmuRiFOE9WCICjpkZCMYWBbngWl97Qn/h4JRb2a6sXUGb4/bepxTGD7oJHg51kedFcRCUKJU0N9Rc16tI66BExCqPlXPfoAdaoRn9cS96HDVXcUrHlcwv6Yk0SXHCn6IHDvXY7PTHgZ8cj7jmtRiFXvemIrfSeMFj+xb10qA=="

# spin up the api with docker
$ docker compose up
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Brian Mulati](https://github.com/Brian-mula)
- Website - [https://mulati.vercel.app](https://mulati.vercel.app)
- Twitter - [@junior_mulati](https://x.com/junior_mulati)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
