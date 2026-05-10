const express = require('express')
const router = express.Router()
const { estadisticasDirectores, estadisticasGeneros, evolucionDirectores } = require('../controllers/peliculasController')

router.get('/directores', estadisticasDirectores)
router.get('/generos', estadisticasGeneros)
router.get('/evolucion-directores', evolucionDirectores)

module.exports = router
