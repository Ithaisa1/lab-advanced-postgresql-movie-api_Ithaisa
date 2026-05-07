const express = require('express')
const router = express.Router()
const { estadisticasDirectores, estadisticasGeneros } = require('../controllers/peliculasController')

router.get('/directores', estadisticasDirectores)
router.get('/generos', estadisticasGeneros)

module.exports = router
