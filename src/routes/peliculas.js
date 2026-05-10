const express = require('express')
const router = express.Router()
const {
  getAllPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula
} = require('../controllers/peliculasController')

router.get('/', getAllPeliculas)
router.get('/:id', getPeliculaById)
router.post('/', createPelicula)
router.put('/:id', updatePelicula)
router.delete('/:id', deletePelicula)

module.exports = router
