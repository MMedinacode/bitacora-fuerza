# Bitácora de Fuerza

App de gimnasio para el celular: rutinas por día, series con peso y repeticiones, descanso con
alarma, récords y progreso. Se abre desde un link y se instala como app (PWA).

**Link:** https://mmedinacode.github.io/bitacora-fuerza/

## Qué tiene
- **Semana y rutinas:** plan por día, biblioteca de 85 ejercicios (más los propios), rutinas listas y método por
  ejercicio (series normales, Bilbo, top set + back-off, drop set, última al fallo).
- **Superseries:** en el editor de la rutina, «Superserie con el de abajo» une dos o más ejercicios (A1, A2…). Al
  entrenar se pasa de uno a otro sin descanso; el descanso va al cerrar la vuelta.
- **Calentamiento automático** (Ajustes): en los ejercicios con barra agrega barra sola, ~50 % y ~70 % del peso de
  trabajo (y ~85 % si pasa de 100 kg). No cuentan para récords.
- **Semana de descarga** (Ajustes): cada 4, 6 u 8 semanas la app pone la mitad de las series y un 10 % menos de peso.
  Esas sesiones no cuentan para decidir cuándo subir de peso.
- **Entrenando:** tipos de serie y RIR, descanso con alarma, discos por lado, notas, cambiar ejercicio y link
  «▶ Técnica» (búsqueda en YouTube del ejercicio).
- **Progreso:** días por semana, series y **volumen semanal (kg) por músculo**, 1RM estimado, récords,
  **peso corporal con gráfico** e historial (con «Corregir»).
- **Datos:** se guardan en el celular (`localStorage`); respaldo `.json`, **exportar a Excel** (`.csv`) y cuenta
  opcional por correo que sincroniza con Supabase (proyecto `matias-apps`, tabla `bitacora_docs` con RLS).
- **Compartir:** una rutina (`#r=…`) o la semana completa (`#p=…`) por link; incluye las superseries.

## Cómo funciona
- `sw.js` guarda la app para que abra sin internet. Solo borra sus propias copias (`bf-…`), porque el sitio
  `mmedinacode.github.io` lo comparten otras apps.
- **Al publicar una versión:** subir `VERSION` en `index.html` y el mismo valor en `version.json` (y el nombre de la
  caché en `sw.js`). La app compara ambos y muestra «Hay una versión nueva · Actualizar».
- La pantalla se actualiza con `morph()` (cambia solo lo distinto y no toca el campo enfocado), para que el
  teclado del celular no se cierre al guardar.

## Archivos
| Archivo | Qué es |
|---|---|
| `index.html` | Toda la app (HTML, CSS y JS en un solo archivo) |
| `manifest.webmanifest` | Nombre, colores e íconos para instalarla |
| `sw.js` | Modo sin conexión |
| `version.json` | Versión publicada (para el aviso de actualización) |
| `icon-*.png`, `apple-touch-icon.png` | Íconos |
