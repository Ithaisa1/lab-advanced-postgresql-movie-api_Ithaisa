const pool = require('../src/config/database')

const seedData = async () => {
  try {
    console.log('🌱 Poblando base de datos...')

    // Insertar directores
    await pool.query(`
      INSERT INTO directores (nombre) VALUES
        ('Christopher Nolan'),
        ('Denis Villeneuve'),
        ('Greta Gerwig'),
        ('Jordan Peele'),
        ('Alfonso Cuarón')
      ON CONFLICT DO NOTHING
    `)

    // Insertar géneros
    await pool.query(`
      INSERT INTO generos (nombre, slug) VALUES
        ('Ciencia Ficción', 'ciencia-ficcion'),
        ('Drama', 'drama'),
        ('Terror', 'terror'),
        ('Animación', 'animacion'),
        ('Crimen', 'crimen')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Insertar películas
    await pool.query(`
      INSERT INTO peliculas (titulo, anio, nota, director_id, genero_id)
      SELECT p.titulo, p.anio, p.nota, d.id, g.id
      FROM (VALUES
        ('Inception', 2010, 8.8, 'Christopher Nolan', 'ciencia-ficcion'),
        ('Interstellar', 2014, 8.6, 'Christopher Nolan', 'ciencia-ficcion'),
        ('Oppenheimer', 2023, 8.5, 'Christopher Nolan', 'drama'),
        ('Dune', 2021, 8.0, 'Denis Villeneuve', 'ciencia-ficcion'),
        ('Blade Runner 2049', 2017, 8.0, 'Denis Villeneuve', 'ciencia-ficcion'),
        ('Arrival', 2016, 7.9, 'Denis Villeneuve', 'ciencia-ficcion'),
        ('Barbie', 2023, 6.9, 'Greta Gerwig', 'drama'),
        ('Lady Bird', 2017, 7.4, 'Greta Gerwig', 'drama'),
        ('Get Out', 2017, 7.7, 'Jordan Peele', 'terror'),
        ('Us', 2019, 6.8, 'Jordan Peele', 'terror'),
        ('Roma', 2018, 7.7, 'Alfonso Cuarón', 'drama'),
        ('Gravity', 2013, 7.7, 'Alfonso Cuarón', 'ciencia-ficcion')
      ) AS p(titulo, anio, nota, director, genero)
      JOIN directores d ON d.nombre = p.director
      JOIN generos g ON g.slug = p.genero
      ON CONFLICT DO NOTHING
    `)

    // Insertar reseñas
    await pool.query(`
      INSERT INTO resenas (pelicula_id, autor, texto, puntuacion)
      SELECT p.id, r.autor, r.texto, r.puntuacion
      FROM (VALUES
        ('Inception', 'María', 'Obra maestra del cine moderno', 9),
        ('Inception', 'Carlos', 'Confusa pero brillante', 8),
        ('Inception', 'Ana', 'La vi tres veces y cada vez entiendo más', 10),
        ('Dune', 'Luis', 'Visualmente impresionante', 9),
        ('Dune', 'Sara', 'Fiel al libro', 8),
        ('Oppenheimer', 'Pedro', 'Tres horas que pasan volando', 9),
        ('Barbie', 'Elena', 'Más profunda de lo que parece', 8),
        ('Barbie', 'Tomás', 'No era para mí', 5),
        ('Get Out', 'Julia', 'Perturbadora y necesaria', 9),
        ('Roma', 'Miguel', 'Poesía visual pura', 10)
      ) AS r(titulo, autor, texto, puntuacion)
      JOIN peliculas p ON p.titulo = r.titulo
    `)

    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM peliculas) as peliculas,
        (SELECT COUNT(*) FROM resenas) as resenas
    `)

    console.log('✅ Datos insertados correctamente')
    console.log(`📊 Películas: ${counts.rows[0].peliculas}`)
    console.log(`📊 Reseñas: ${counts.rows[0].resenas}`)

    await pool.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    await pool.end()
    process.exit(1)
  }
}

seedData()
