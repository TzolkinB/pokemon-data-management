import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/database'

// Import routes
import pokemonRoutes from './routes/pokemon'
import typesRoutes from './routes/types'
import abilitiesRoutes from './routes/abilities'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/pokemon', pokemonRoutes)
app.use('/api/types', typesRoutes)
app.use('/api/abilities', abilitiesRoutes)

// Test route
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Pokemon Test Data Manager API' })
})

// Health check
app.get('/health', async (req: Request, res: Response) => {
	try {
		const result = await pool.query<{ now: Date }>('SELECT NOW()')
		res.json({
			status: 'healthy',
			database: 'connected',
			timestamp: result.rows[0].now,
		})
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({
			status: 'unhealthy',
			database: 'disconnected',
			error: errorMessage,
		})
	}
})

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`)
})
