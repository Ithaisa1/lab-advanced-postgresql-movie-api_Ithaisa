const express = require('express')
const cors = require('cors')
require('dotenv').config()

const peliculasRoutes = require('./routes/peliculas')
const estadisticasRoutes = require('./routes/estadisticas')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/peliculas', peliculasRoutes)
app.use('/api/estadisticas', estadisticasRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`🎬 API corriendo en http://localhost:${PORT}`)
})
