const fs = require('fs')
const path = require('path')
const pool = require('../src/config/database')

const runMigrations = async () => {
  try {
    console.log('🔄 Ejecutando migraciones...')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(10) NOT NULL UNIQUE,
        aplicado_en TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    const { rows: appliedMigrations } = await pool.query(
      'SELECT version FROM schema_migrations ORDER BY version'
    )
    const appliedVersions = appliedMigrations.map(m => m.version)

    const migrationsDir = path.join(__dirname, '..', 'migrations')
    const files = fs.readdirSync(migrationsDir).sort()

    for (const file of files) {
      if (!file.endsWith('.sql')) continue

      const version = file.split('_')[0]

      if (appliedVersions.includes(version)) {
        console.log(`  ⏭️  Migración ${version} ya aplicada`)
        continue
      }

      console.log(`  📝 Aplicando migración ${version}...`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      await pool.query(sql)
      console.log(`  ✅ Migración ${version} aplicada`)
    }

    console.log('✅ Migraciones completadas')
    await pool.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    await pool.end()
    process.exit(1)
  }
}

runMigrations()
