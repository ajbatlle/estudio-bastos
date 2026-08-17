// Datos del estudio que usan varios componentes.

/** Destino del formulario de agenda y del enlace de contacto. */
export const CORREO = 'hola@estudiobastos.com';

/**
 * Clave de Web3Forms, el servicio que recibe el formulario y lo reenvía a
 * CORREO. Se obtiene gratis en https://web3forms.com y llega por correo.
 *
 * Si se vaciara, el formulario cae en `mailto:`, que depende de que el visitante
 * tenga un programa de correo configurado — y muchos no lo tienen.
 *
 * No es un secreto: va en el HTML y solo sirve para enviar a esta dirección.
 */
export const CLAVE_FORMULARIO = '590fc502-f075-466d-a717-85f6020bfaa4';

/**
 * Días en que el estudio toma reuniones, en la numeración de JavaScript:
 * 0 domingo … 6 sábado. Hoy: lunes, miércoles y viernes.
 */
export const DIAS_REUNION = [1, 3, 5];

/**
 * Horas de inicio disponibles. La ventana es de 15 a 18, así que la última
 * reunión empieza a las 17 y termina a las 18.
 */
export const HORAS = ['15:00', '16:00', '17:00'];

/** Cuántas fechas válidas se ofrecen en la lista. */
export const FECHAS_OFRECIDAS = 12;

/** Zona horaria del estudio. La usan el pie y el cálculo de fechas válidas. */
export const ZONA = 'America/Santiago';
