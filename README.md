# Festival Control · Bloque 01
 
## Qué he construido
He creado una función serverless básica con TypeScript en `src/hello.ts` y he probado en local la ruta GET `/hello`.

## Qué he comprendido
El handler usa tipos para controlar el evento de entrada y la respuesta HTTP. Al compilar con `tsc`, pasa de TypeScript a `dist/hello.js`, y el mensaje "EVENT RECIBIDO" sale en los logs de la terminal cada vez que entra una petición.

## Qué he modificado
He cambiado el mensaje que devuelve el body del JSON en la respuesta. La URL sigue siendo `/hello` porque no he tocado la ruta en la configuración del servidor, solo el contenido devuelto.

## Cómo lo he comprobado
Hice peticiones GET desde Thunder Client y con `curl`, recibiendo un 200 OK con el nuevo JSON y viendo reflejado el log en la consola.


# Bloque 02

## Resultado
- Qué añadí al proyecto: Creé el handler `backend/src/getEvent.ts` y configuré la nueva ruta con parámetro en `backend/serverless.yml`.
- Ruta o pantalla comprobada: La ruta GET `/events/{id}` (probando con dos ids distintos) y comprobé que `/hello` sigue funcionando.
- Estado y respuesta observados: Estado 200 OK con el JSON devolviendo los datos simulados del evento según el id pasado en la URL.
- Recorrido del dato, explicado con mis palabras: El id que pongo en la URL viaja en la petición HTTP y Serverless lo mete en `event.pathParameters.id`, de donde el handler lo lee para generar la respuesta.
- Cambio guiado y resultado: Probé a cambiar el id en la URL para ver que el mismo handler procesa identificadores diferentes sin tener que crear rutas nuevas.
- Error encontrado y cómo lo resolví: Al principio `pathParameters` venía como opcional en TypeScript, así que me aseguré de comprobar que existía antes de leer el id para evitar fallos de tipado.

## Evidencias
$ curl -i http://localhost:3000/dev/events/EVT-330
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
accept-ranges: bytes
Date: Tue, 27 Oct 2026 09:31:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-330","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}


## Bloque 03

## Resultado
- Qué añadí al proyecto: Creé el nuevo handler `backend/src/createEvent.ts` y di de alta el endpoint con método `POST` en `backend/serverless.yml`.
- Ruta o pantalla comprobada: La ruta POST `/events` enviando un objeto JSON en el cuerpo de la petición.
- Estado y respuesta observados: Estado 201 Created (o 200 OK) devolviendo el objeto del evento creado junto con su id asignado o confirmación.

## Comprensión
- Recorrido del dato, explicado con mis palabras: El cliente envía un JSON en el body de la petición HTTP; Serverless lo recibe como string en `event.body`, lo parseamos con `JSON.parse()` en TypeScript y procesamos los campos antes de responder.
- Cambio guiado y resultado: Modifiqué las propiedades enviadas en el cuerpo (como el nombre o fecha del evento) y comprobé que la función las recibe y devuelve correctamente en la respuesta.
- Error encontrado y cómo lo resolví: Si se envía la petición sin body o con JSON mal formateado, `JSON.parse` falla; se soluciona validando que `event.body` exista antes de parsear o envolviéndolo en un try/catch.

## Evidencias
$ curl -i -X POST http://localhost:3000/dev/events -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CANCELLED"}'
HTTP/1.1 201 Created
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
Date: Tue, 27 Oct 2026 11:40:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-NEW","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CANCELLED"}


# Bloque 04

## Resultado
- Qué añadí al proyecto: Handlers CRUD para los métodos sobre `/events` y `/events/{id}`, además del módulo compartido `model.ts` con tipos y catálogo fijo.
- Ruta o pantalla comprobada: Endpoint `/events/EVT-101` mediante PUT, PATCH y GET posterior.
- Estado y respuesta observados: PUT devolvió 400 Bad Request; PATCH devolvió 200 OK (`operation: UPDATED`); y el GET posterior devolvió 200 OK manteniendo el status `CONFIRMED`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: La petición entra al handler según el método HTTP; PUT valida que llegue el objeto completo y falla al faltar campos, mientras que PATCH solo exige el campo a modificar y responde éxito sin alterar la memoria.
- Cambio guiado y resultado: Envié solo `{"status": "CANCELLED"}` por PUT (obteniendo 400) y por PATCH (obteniendo 200). Al consultar de nuevo con GET sigue saliendo `CONFIRMED` porque el ejercicio no tiene base de datos persistente.
- Error encontrado y cómo lo resolví: Al hacer PUT parcial el handler rechazó la petición por falta de campos obligatorios; lo resolví verificando que para sustitución completa se debe enviar la estructura entera del evento.

## Evidencias
- Captura o transcripción breve, sin credenciales:

## Evidencias
- Captura o transcripción breve, sin credenciales:
  ```bash
  # 1. PUT 
$ curl -i -X PUT http://localhost:3000/dev/events/EVT-101 \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELLED"}'
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 69
Date: Tue, 27 Oct 2026 18:14:42 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"PUT requiere artist, space, time HH:mm y status válido"}

  # 2. PATCH parcial -> 200
  $ curl -i -X PATCH http://localhost:3000/dev/events/EVT-101 \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELLED"}'
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 71
Date: Tue, 27 Oct 2026 18:14:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}

  # 3. GET comprobación
$ curl -i -X GET http://localhost:3000/dev/events/EVT-101
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
accept-ranges: bytes
Date: Tue, 27 Oct 2026 18:15:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}


# Bloque 05

## Resultado
- Qué añadí al proyecto: La aplicación frontend en la carpeta `mobile/` usando Expo y React Native con TypeScript (`App.tsx`).
- Ruta o pantalla comprobada: La interfaz web de Expo abierta en el navegador local (`http://localhost:8081`).
- Estado y respuesta observados: Se muestran las dos tarjetas de eventos y al pulsar el botón cambia dinámicamente el texto a `Selección: EVT-101` (y tras la prueba, a `EVT-102`).

## Comprensión
- Recorrido del dato, explicado con mis palabras: Los eventos se leen de un array local tipado en `App.tsx` y se pintan con `.map()`[cite: 12]; al hacer clic en el `Pressable`, se ejecuta el evento `onPress` llamando a `setSelected(...)`, lo que actualiza el estado con `useState` y fuerza un nuevo render en pantalla.
- Cambio guiado y resultado: Cambié el valor de `setSelected` a `'EVT-102'` y la etiqueta del botón a "Seleccionar EVT-102"; al pulsar en pantalla se actualizó a `Selección: EVT-102`, y después restauré a `EVT-101` para mantener el hito base.
- Error encontrado y cómo lo resolví: Al guardar el cambio en `App.tsx` había que verificar que el tipo del estado admitiera el id y restaurar el valor inicial para no romper el contrato del siguiente bloque.

## Evidencias
![alt text](image.png)


# Bloque 06

## Resultado
- Qué añadí al proyecto: Creé el módulo cliente `api.ts` con la función `getEvents()` usando `fetch`, e integré la carga asíncrona con `useEffect` y manejo de estados (carga, error y eventos) en la interfaz.
- Ruta o pantalla comprobada: La interfaz web de React Native en `http://localhost:8081` haciendo peticiones a `http://localhost:3000/dev/events`.
- Estado y respuesta observados: Petición HTTP GET con estado 200 OK en Network y renderizado dinámico de las dos tarjetas recibidas desde la API.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Al montar el componente, `useEffect` llama a `getEvents()`, que lanza un `fetch` hacia el endpoint del backend; al resolver la promesa, si `response.ok` es true se extrae el JSON y `setEvents` actualiza el estado para pintar las tarjetas.
- Cambio guiado y resultado: Cambié la URL a `/ruta-inexistente` y comprobé en la pestaña Network que el servidor devuelve un 404 (hay comunicación HTTP); al restaurar `/events`, volvió a responder 200 OK y se mostraron las dos tarjetas.
- Error encontrado y cómo lo resolví: `fetch` no rechaza la promesa ante un código 404 o 500; lo gestioné comprobando `if (!response.ok)` para lanzar un error explícito y activar la pantalla de recuperación en la interfaz

## Evidencias
![alt text](image-1.png)