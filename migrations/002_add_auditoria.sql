-- Migración 002: Tabla de auditoría y trigger

CREATE TABLE IF NOT EXISTS auditoria_peliculas (
  id SERIAL PRIMARY KEY,
  pelicula_id INTEGER,
  operacion VARCHAR(10) NOT NULL,
  datos_antes JSONB,
  datos_despues JSONB,
  usuario_db VARCHAR(100) DEFAULT current_user,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION registrar_cambio_pelicula()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO auditoria_peliculas (pelicula_id, operacion, datos_despues)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW));
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO auditoria_peliculas (pelicula_id, operacion, datos_antes, datos_despues)
    VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO auditoria_peliculas (pelicula_id, operacion, datos_antes)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD));
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auditoria_peliculas ON peliculas;

CREATE TRIGGER trigger_auditoria_peliculas
AFTER INSERT OR UPDATE OR DELETE ON peliculas
FOR EACH ROW
EXECUTE FUNCTION registrar_cambio_pelicula();

INSERT INTO schema_migrations (version) VALUES ('002')
ON CONFLICT (version) DO NOTHING;
