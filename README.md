# Festival Control · Bloque 01
 
## Qué he construido
He creado una función serverless básica con TypeScript en `src/hello.ts` y he probado en local la ruta GET `/hello`.

## Qué he comprendido
El handler usa tipos para controlar el evento de entrada y la respuesta HTTP. Al compilar con `tsc`, pasa de TypeScript a `dist/hello.js`, y el mensaje "EVENT RECIBIDO" sale en los logs de la terminal cada vez que entra una petición.

## Qué he modificado
He cambiado el mensaje que devuelve el body del JSON en la respuesta. La URL sigue siendo `/hello` porque no he tocado la ruta en la configuración del servidor, solo el contenido devuelto.

## Cómo lo he comprobado
Hice peticiones GET desde Thunder Client y con `curl`, recibiendo un 200 OK con el nuevo JSON y viendo reflejado el log en la consola.