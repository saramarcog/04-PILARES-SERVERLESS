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