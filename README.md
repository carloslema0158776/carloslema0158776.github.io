# Portafolio de Ingeniería en Computación

Primera versión editable en español. Usa HTML, CSS y JavaScript sin dependencias. Las fichas de proyectos funcionan incluso con JavaScript desactivado. El filtro por asignatura requiere JavaScript.

## 1. Abre y revisa el sitio

1. Si recibiste el ZIP, descomprímelo.
2. En VS Code, elige **Archivo → Abrir carpeta** y selecciona la carpeta que contiene `index.html`.
3. Abre `index.html` directamente en tu navegador. Para servirlo en local, si tienes Python, abre la terminal de VS Code en esa carpeta y ejecuta:

   ```powershell
   python -m http.server 8000 --bind 127.0.0.1
   ```

   Abre `http://127.0.0.1:8000/`, recarga después de guardar cambios y usa **Ctrl+C** para detener el servidor.

## 2. Personaliza el contenido

| Archivo | Qué editar |
| --- | --- |
| `index.html` | Nombre, biografía, proyectos, estudios, certificaciones, contacto y metadatos. |
| `styles.css` | Paleta en `:root` y acabado translúcido en `.glass`. |
| `script.js` | Filtrado por asignatura. Las opciones se generan a partir de las fichas. |
| `assets/` | Ilustración de portada, icono y futuros archivos de evidencia o CV. |

- Busca los textos entre corchetes en `index.html` y reemplázalos con información real. Actualiza también el título del navegador y la descripción.
- Cambia los nombres provisionales de las asignaturas por los oficiales. Cada ficha usa un atributo `data-asignatura`. Las fichas de una misma materia deben usar exactamente el mismo texto. Para agregar un proyecto, duplica un bloque `<article class="project glass" …>` y edita su contenido.
- Completa cada ficha con el problema, tu aporte, las tecnologías usadas y el resultado. Si tienes código, capturas o una demostración, añádelos como evidencia. Para archivos locales, usa rutas relativas como `assets/captura.png` y un texto alternativo que describa la captura.
- Sustituye los marcadores de contacto por enlaces reales. Usa `mailto:` para el correo y URLs completas para perfiles públicos. Puedes quitar los campos que prefieras omitir.
- Añade únicamente certificaciones que puedas verificar. Puedes ocultar el panel de certificaciones con el atributo `hidden` si todavía no vas a mostrar ninguna.
- Para incluir el CV, guarda el archivo como `assets/cv.pdf` y mueve el enlace **Descargar CV (PDF)** fuera del comentario HTML en la sección Contacto.

Antes de publicar, revisa los enlaces, abre las fichas, prueba los filtros y recorre la página con **Tab**. En el grupo de filtros puedes cambiar de opción con las flechas. Prueba también en una ventana estrecha.

## 3. Publica en GitHub Pages

1. Crea un repositorio público en GitHub. Puedes llamarlo `portafolio`. Si quieres que el sitio aparezca en la raíz del dominio de tu cuenta, usa como nombre de repositorio `TU-USUARIO.github.io`, sustituyendo `TU-USUARIO` por tu cuenta real.
2. Sube el **contenido** de esta carpeta a la raíz de la rama `main`, incluido `.nojekyll`. `index.html` debe quedar en el primer nivel, junto a `styles.css`, `script.js` y `assets/`.
3. Abre **Settings → Pages**. En **Source** selecciona **Deploy from a branch**. Elige **main** y **/(root)** y guarda.
4. Una vez que GitHub termine de publicar, abre el enlace que aparece en **Settings → Pages**. Comprueba el filtro y que se carguen los estilos y las imágenes. Los cambios posteriores se publican cuando actualizas la rama configurada.

[Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Referencia de diseño

El acabado web toma como referencia las superficies translúcidas y los reflejos de [Liquid Glass de Apple](https://developer.apple.com/videos/play/wwdc2025/219/). La transparencia se reduce si el navegador detecta esa preferencia del sistema.

