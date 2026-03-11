import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

console.log('📦 Database module loaded')

// Create PostgreSQL connection pool
const pool = new Pool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '5432'),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
})

console.log('🔌 Attempting to connect to database...')

// Test connection immediately on startup
pool.query('SELECT NOW()', (err) => {
	if (err) {
		console.error('❌ Database connection failed:', err.message)
	} else {
		console.log('✅ Connected to PostgreSQL database')
	}
})

pool.on('error', (err: Error) => {
	console.error('❌ Database connection error:', err)
	process.exit(-1)
})

export default pool
