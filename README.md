# Bitácora de Fuerza

App de gimnasio para el celular: rutinas por día, series con peso y repeticiones, descanso con
alarma, récords y progreso. Se abre desde un link y se instala como app (PWA), sin cuentas.

**Link:** https://mmedinacode.github.io/bitacora-fuerza/

## Cómo funciona
- Los datos se guardan en el navegador de cada celular (`localStorage`), así que cada persona que
  abre el link tiene los suyos. En **Ajustes → Tus datos** se descarga y se carga un respaldo (`.json`).
- Una rutina se comparte con un link (`#r=…`) que la trae codificada; quien lo abre la agrega a sus rutinas.
- `sw.js` guarda la app para que abra sin internet.
- `datos/` tiene los datos de la versión anterior (artifact de Claude), para importarlos una vez con `#importar=<nombre>`.

## Archivos
| Archivo | Qué es |
|---|---|
| `index.html` | Toda la app (HTML, CSS y JS en un solo archivo) |
| `manifest.webmanifest` | Nombre, colores e íconos para instalarla |
| `sw.js` | Modo sin conexión |
| `icon-*.png`, `apple-touch-icon.png` | Íconos |
