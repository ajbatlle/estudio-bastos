// Idioma del sitio. El español vive en la raíz y el inglés bajo /en/, con las
// mismas páginas: /proyectos ↔ /en/proyectos. El idioma se lee de la dirección
// y no de una cookie, así que cada versión tiene su propia URL, se puede
// compartir y la ven los buscadores.
//
// Los guiones del navegador no importan este archivo: leen `<html lang>`, que
// el layout pone y que Astro actualiza al navegar entre idiomas.

export type Idioma = 'es' | 'en';

const base = import.meta.env.BASE_URL;

/** Idioma de la página que se está sirviendo, según su dirección. */
export function idioma(url: URL): Idioma {
  const resto = '/' + url.pathname.slice(base.length);
  return /^\/en(\/|$)/.test(resto) ? 'en' : 'es';
}

/** Dirección interna en el idioma dado. `ruta('en', 'proyectos')` → /en/proyectos. */
export function ruta(lang: Idioma, destino = ''): string {
  return `${base}${lang === 'en' ? 'en/' : ''}${destino}`;
}

/** La misma página en el otro idioma. */
export function otraVersion(url: URL): { lang: Idioma; href: string } {
  const lang = idioma(url);
  const resto = '/' + url.pathname.slice(base.length);
  if (lang === 'es') {
    return { lang: 'en', href: `${base}en${resto === '/' ? '/' : resto}` };
  }
  const sinPrefijo = resto.replace(/^\/en/, '') || '/';
  return { lang: 'es', href: `${base}${sinPrefijo.slice(1)}` };
}
