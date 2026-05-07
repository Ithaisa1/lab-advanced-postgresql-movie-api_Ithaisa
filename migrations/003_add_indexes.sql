-- Migración 003: Índices

CREATE INDEX IF NOT EXISTS idx_peliculas_anio ON peliculas(anio);
CREATE INDEX IF NOT EXISTS idx_peliculas_genero ON peliculas(genero_id);
CREATE INDEX IF NOT EXISTS idx_peliculas_genero_nota ON peliculas(genero_id, nota DESC);
CREATE INDEX IF NOT EXISTS idx_resenas_pelicula ON resenas(pelicula_id);

INSERT INTO schema_migrations (version) VALUES ('003')
ON CONFLICT (version) DO NOTHING;
