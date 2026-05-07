-- Migración 004: Vista v_peliculas_completas

CREATE OR REPLACE VIEW v_peliculas_completas AS
SELECT
  p.id,
  p.titulo,
  p.anio,
  p.nota AS nota_editorial,
  d.nombre AS director,
  g.nombre AS genero,
  g.slug AS genero_slug,
  COUNT(r.id) AS num_resenas,
  ROUND(AVG(r.puntuacion), 2) AS media_usuarios
FROM peliculas p
LEFT JOIN directores d ON d.id = p.director_id
LEFT JOIN generos g ON g.id = p.genero_id
LEFT JOIN resenas r ON r.pelicula_id = p.id
GROUP BY p.id, p.titulo, p.anio, p.nota, d.nombre, g.nombre, g.slug;

INSERT INTO schema_migrations (version) VALUES ('004')
ON CONFLICT (version) DO NOTHING;
