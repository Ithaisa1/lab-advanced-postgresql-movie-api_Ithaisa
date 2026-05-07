const pool = require('../config/database')

// GET /api/peliculas
const getAllPeliculas = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.titulo,
        p.anio,
        p.nota,
        d.nombre AS director,
        g.nombre AS genero
      FROM peliculas p
      LEFT JOIN directores d ON d.id = p.director_id
      LEFT JOIN generos g ON g.id = p.genero_id
      ORDER BY p.anio DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id
const getPeliculaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query('SELECT * FROM peliculas WHERE id = $1', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrada' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas
const createPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director_id, genero_id } = req.body
    const { rows } = await pool.query(
      'INSERT INTO peliculas (titulo, anio, nota, director_id, genero_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, anio, nota, director_id, genero_id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT /api/peliculas/:id
const updatePelicula = async (req, res, next) => {
  try {
    const { id } = req.params
    const { titulo, anio, nota, director_id, genero_id } = req.body
    const { rows } = await pool.query(
      'UPDATE peliculas SET titulo = COALESCE($1, titulo), anio = COALESCE($2, anio), nota = COALESCE($3, nota), director_id = COALESCE($4, director_id), genero_id = COALESCE($5, genero_id) WHERE id = $6 RETURNING *',
      [titulo, anio, nota, director_id, genero_id, id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrada' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// DELETE /api/peliculas/:id
const deletePelicula = async (req, res, next) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query('DELETE FROM peliculas WHERE id = $1 RETURNING *', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrada' })
    res.json({ message: 'Eliminada' })
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      HAVING COUNT(p.id) >= 1
      ORDER BY nota_media DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula,
  estadisticasDirectores,
  estadisticasGeneros
}
