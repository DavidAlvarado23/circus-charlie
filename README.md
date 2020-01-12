# Trabajo final

El ejercicio consiste en programar un juego utilizando tecnologías web.

## Realización

El trabajo se realizará de forma individual. Cada alumno debe elegir qué juego implementar y comunicármelo, respondiendo al hilo creado en el foro de la asignatura para ese propósito. Dos alumnos no pueden implementar el mismo juego.

## Entrega

La entrega del proyecto consta de:

- Un _pull request_ a la rama _master_ del alumno (`/alumno/xxx.yyy/master`). El PR puede hacerse desde un _fork_ si es preciso. El PR debe contener únicamente los archivos correspondientes al proyecto, contenidos en la carpeta `final/`.
- El despliegue del proyecto en algún servidor accesible públicamente. Por ejemplo, utilizando [glitch](glitch.com). Aseguraos de incluir la URL del servidor en el archivo `meta.md`.
- La demostración durante las clases dispuestas para seminarios tutoriales del funcionamiento del proyecto.

El _pull request_ y el despliegue para la entrega del ejercicio debe realizarse **antes** del mediodía del día trece de enero.

## Tecnologías

El ejercicio se debe realizar sin utilizar librerías externas. Se entiende por librería externa aquella que no esté incluida entre las APIs del navegador o de NodeJS.

Extraordinariamente, el alumno podría solicitar utilizar alguna librería externa si su implementación estuviera fuera del contenido de la asignatura (por ejemplo, [D3](https://d3js.org/)).

## Calificación

Para que el trabajo sea calificado debe cumplir con lo dispuesto en las secciones anteriores.

La calificación del trabajo se calculará a partir de una nota de dificultad. A esta nota de dificultad se le descontará, si procede, puntos por los errores cometidos.

La nota de dificultad se calculará de la siguiente manera:

Cinco (5) puntos si el juego incluye las siguientes características:

- Manejo de estado de la aplicación, utilizando programación funcional reactiva (_Streams_) o la arquitectura _flux_.
- Manejo de eventos, ya sean de teclado, ratón, intervalos de tiempo, etc.
- Los archivos que componen la página web (HTML, CSS, etc.) son servidos por un servidor web a través del protocolo HTTP.

Seis (6) puntos si, **además**, incluye algún otro tipo de interacción con un servidor creado por vosotros. Por ejemplo, persistencia de puntuación u obtención de datos para el funcionamiento del juego.

Siete (7) puntos si, **además**, incluye elementos que se desplazan en la interfaz gráfica. El desplazamiento debe realizarse manipulando el elemento HTML desplazado (ya sea modificando sus atributos, modificando los estilos que se le aplican o eliminándolo para crearlo de nuevo en otra posición).

Hasta diez (10) puntos si, **además**, incluye otros elementos implementados con tecnologías web que aumenten la dificultad del trabajo. Por ejemplo, uso de otras APIs de navegador, elementos estéticos, etc.

## Recomendaciones

Cread la rama para este trabajo a partir de la rama `master` del repositorio de la asignatura.

Comenzad por implementar una versión del juego tan simplificada como os sea posible. Después, añadidle el resto de características de forma iterativa.
