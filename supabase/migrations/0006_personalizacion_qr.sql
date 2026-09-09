alter table negocios
  add column qr_color_fondo text not null default '#ffffff',
  add column qr_color_figura text not null default '#0a1723',
  add column qr_texto_superior text,
  add column qr_texto_inferior text;
