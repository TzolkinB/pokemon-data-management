import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import pool from './config/database'

// Import routes
import pokemonRoutes from './routes/pokemon'
import typesRoutes from './routes/types'
import abilitiesRoutes from './routes/abilities'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Load OpenAPI spec
const loadedSwaggerDocument: unknown = YAML.load(path.join(__dirname, '../docs/openapi.yaml'))
const swaggerDocument = loadedSwaggerDocument as Parameters<typeof swaggerUi.setup>[0]

// Middleware
app.use(cors())
app.use(express.json())

// Swagger UI - Interactive API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use('/api/pokemon', pokemonRoutes)
app.use('/api/types', typesRoutes)
app.use('/api/abilities', abilitiesRoutes)

// Root route
app.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'Pokemon Test Data Manager API',
		documentation: 'http://localhost:3000/api-docs',
	})
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

const isDev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'

// Start server
app.listen(PORT, () => {
	if (isDev) console.log(`🚀 Server running on http://localhost:${PORT}`)

	void (async () => {
		try {
			await pool.query('SELECT NOW()')
			if (isDev) console.log('✅ Connected to PostgreSQL database')
		} catch (err: unknown) {
			console.error('❌ Database connection failed:', err instanceof Error ? err.message : err)
			process.exit(1)
		}
	})()
})
