# Marca

Ficheros servidos tal cual en https://estudiobastos.com/brand/.

**No renombrar ni mover sin buscar antes quién los usa.** Algunos los consumen
cosas que ya no se pueden editar hacia atrás:

- `isotipo-firma.png` — la firma de correo (`docs/firma-correo.html`). Cada
  correo enviado lleva esta URL escrita dentro; si se mueve, el logo se rompe
  en todo el histórico, no solo en los correos nuevos.

`npm run build` verifica estas dependencias y falla si alguna queda huérfana
(`scripts/enlaces-externos.mjs`).
