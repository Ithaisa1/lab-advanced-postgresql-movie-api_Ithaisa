-- Migración 001: Esquema inicial
-- Tablas: directores, generos, peliculas, resenas, usuarios

CREATE TABLE IF NOT EXISTS directores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS generos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS peliculas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  anio INTEGER,
  nota DECIMAL(3,1),
  director_id INTEGER REFERENCES directores(id) ON DELETE SET NULL,
  genero_id INTEGER REFERENCES generos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS resenas (
  id SERIAL PRIMARY KEY,
  pelicula_id INTEGER NOT NULL REFERENCES peliculas(id) ON DELETE CASCADE,
  autor VARCHAR(100) NOT NULL,
  texto TEXT,
  puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 10)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(100),
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(10) NOT NULL UNIQUE,
  aplicado_en TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES ('001')
ON CONFLICT (version) DO NOTHING;
