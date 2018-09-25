# Api Base

### Descripción 
- Api base para comenzar desarrollo.

### Características
- Registro de usuarios(Autenticación) mediante JWT
- Autorización mediante la gema Cancancan
- Avatar de usuario mediante la gema Carrierwave (Imagen por defecto para cada usuario)
- Versionamiento mediante Concerns en routing
- Prevención de requests masivas mediante la gema rack-attack
- Recuperación de contraseña
- Documentación generada con Swagger
<img src="https://i.imgur.com/9etl7sr.png" />

### Instalación
```bash
bundle install
rails db:create
rails db:migrate
rails db:seed
rake assets:precompile
rake assets:clean
rails server
```
### Front-end 
- [Instalación](https://github.com/JamesAndresCM/rails_api_base/tree/master/front-end)

### Usuario Admin por defecto
- email: admin@domain.com
- password: admin123

### Endpoints
- Registro 
```bash
api/v1/sign_up
```
- Autenticación
```bash
api/v1/sign_in
```
- Usuario actual
```bash
api/v1/auth
```
- Usuarios (Solo administrador puede ver este endpoint)
```bash
api/v1/admin/users
```
- Eliminar/Editar/Ver Usuario (Requiere token)
```bash
api/v1/users/USERNAME o ID
```
- Recuperación de contraseña (requiere email)
```bash
api/v1/forgot_password
```
- Reset de contraseña (requiere token)
```bash
api/v1/password_reset
```

### Ejemplos

- Registro de usuario (devuelve token + id para evitar enviar 2 request para obtener token al registrarse)
```bash
curl -H 'Content-Type: application/json' -d '{"user": {"email": "emaildomain.com","password": "password","password_confirmation":"password", "username":"user_example"}}' localhost:3000/api/v1/sign_up
```

- Autenticación de usuario (devuelve token + id)
```bash
curl -H 'Content-Type: application/json' -d '{"auth": {"email": "email@domain.com","password": "password"}}' localhost:3000/api/v1/sign_in
```

- Usuario actual (devuelve username actual)
```bash
curl -H 'Content-Type: application/json' -H 'Authorization: JWT' localhost:3000/api/v1/auth
```

- Subir/Editar avatar usuario
```bash
curl -X PATCH \
  http://localhost:3000/api/v1/users/USERNAME o ID \
  -H 'Authorization: JWT' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"user": {"avatar":"data:image/png;base64,FWRK6p8ypyfMo8nzGvJKvXzMDc\n72QHZD0mWbJTsnufMM...}}'
```

- Editar usuario (requiere current_password , excepto para administrador sobre otros usuarios)
- Campos : email, username, etc..
- Para actualizar la contraseña se requiere de los campos:
- current_password, password, password_confirmation
```bash
curl -X PATCH -H 'Content-Type: application/json' -H 'Authorization: JWT' -d '{"user": {"email":"email@domain.com", "current_password":"password"}}' localhost:3000/api/v1/users/USERNAME o ID
```

- Eliminar usuario
* Posibilidad de dar cuenta de baja (Administrador puede eliminar cualquier usuario)
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: JWT' localhost:3000/api/v1/users/USERNAME o ID
```

- Ver usuario en particular
```bash
curl -H 'Content-Type: application/json' -H 'Authorization: JWT' localhost:3000/api/v1/users/USERNAME o ID
```

 - Listar usuarios
 - Solo el usuario con rol "admin" puede modificar/eliminar a otros usuarios además de listarlos.
 ```bash
 curl -H 'Content-Type: application/json' -H 'Authorization: JWT' localhost:3000/api/v1/admin/users
 ```
 - Paginación 
  ```bash
 curl -H 'Content-Type: application/json' -H 'Authorization: JWT' localhost:3000/api/v1/admin/users?page=2
 ```

### Recuperación de contraseña
- Configurar el email(gmail) ,se debe establecer este más su password en el archivo ```config/application.yml```
- Establecer default email ```app/mailers/user_mailer.rb``` segunda linea.

- Se reenviará un email con las instrucciones 
- Configurar host (frontend (?) ) archivo ```app/views/user_mailer/password_reset.html.erb```
 ```bash
 curl -H 'Content-Type: application/json' -d '{"email": "email@domain.com"}' localhost:3000/api/v1/forgot_password
 ```

### Resetear contraseña
- Utilizar el token que genera el email de recuperación
```bash
curl -H 'Content-Type: application/json' -d '{"user": {"token": "token","password":"new_password", "password_confirmation": "new_password"}}' http://localhost:3000/api/v1/password_reset
```

### Versionamiento
- Descomentar apiv2 en el archivo `config/routes.rb`
- Ejemplo de endpoint `/api/v2/test`
- Ejemplo de serialización para endpoint `/api/v[1,2]/users/`
- V1, V2
<img src="https://i.imgur.com/74EqAqd.png" />
<img src="https://i.imgur.com/FTDVAaA.png" />


### Instalación mediante docker
- Si se desea utilizar docker en vez del método tradicional de instalación se deben realizar lo siguiente:
- 1- Utilizar las variables de entorno para email (descomentar ENV) en archivo `config/application.yml`.
- 2- Mover el directorio `front-end` hacia otro lugar y utilizar su instalación normal o utilizar docker tambien para su uso.

#### Crear imágenes y contenedores
- Ejemplos :
- Container Postgresql : ```docker run --name=postgres_rails_api -e POSTGRES_USER=api_base_development -e POSTGRES_PASSWORD=api123 -e POSTGRES_DB=api_base_development -p 5432:5432 -d postgres```

- Imagen docker rails : ```docker build -t api_base_rails .```

- Migración Rails : ```docker run --rm --link=postgres_rails_api:db_rails_api -e DB_HOST=postgres_rails_api -e DB_USER=api_base_development -e DB_NAME=api_base_development -e DB_POSTGRES_PASSWORD=api123 api_base_rails rake db:migrate```

- Seed Rails : ```docker run --rm --link=postgres_rails_api:db_rails_api -e DB_HOST=postgres_rails_api -e DB_USER=api_base_development -e DB_NAME=api_base_development -e DB_POSTGRES_PASSWORD=api123 api_base_rails rake db:seed```

- Container Rails : ```docker run --name=rails_api_base --link=postgres_rails_api:db_rails_api -p 3000:3000 -e DB_HOST=postgres_rails_api -e DB_USER=api_base_development -e DB_NAME=api_base_development -e DB_POSTGRES_PASSWORD=api123 -e EMAIL=EMAIL -e EMAIL_PASSWORD="EMAIL_PASSWORD" -d api_base_rails```

### Adicional
- Si se desea obtener los datos del usuario al momento de registrarse se debe descomentar las líneas 13-14 y comentar la línea 15 del controller `users_controller.rb`
- Si se desea obtener los datos del usuario al momento de logearse se debe descomentar la línea 9 del contoller `user_token_controller.rb` y pasar data como referencia dentro del render.
- Más info en :
- https://github.com/nsarno/knock/issues/101
- https://github.com/nsarno/knock/issues/117
