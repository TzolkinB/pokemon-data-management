import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { parse as parseYaml } from 'yaml'
import path from 'path'
import pool from './config/database'

// Import routes
import pokemonRoutes from './routes/pokemon'
import typesRoutes from './routes/types'
import abilitiesRoutes from './routes/abilities'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const isDev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
const enableApiDocs = process.env.ENABLE_API_DOCS === 'true' || isDev

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('OpenAPI document must be an object')
	}
}

// Middleware
app.use(cors())
app.use(express.json())

if (enableApiDocs) {
	const openApiPath = path.join(__dirname, '../docs/openapi.yaml')

	try {
		const openApiContent = readFileSync(openApiPath, 'utf8')
		const loadedSwaggerDocument: unknown = parseYaml(openApiContent)
		assertPlainObject(loadedSwaggerDocument)
		const swaggerDocument = loadedSwaggerDocument as Parameters<typeof swaggerUi.setup>[0]

		// Swagger UI - Interactive API documentation
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		console.error(`❌ Failed to load OpenAPI spec from ${openApiPath}: ${errorMessage}`)
		process.exit(1)
	}
}

// Routes
app.use('/api/pokemon', pokemonRoutes)
app.use('/api/types', typesRoutes)
app.use('/api/abilities', abilitiesRoutes)

// Root route
app.get('/', (req: Request, res: Response) => {
	const response: { message: string; documentation?: string } = {
		message: 'Pokemon Test Data Manager API',
	}

	if (enableApiDocs) {
		const host = req.get('host')
		response.documentation = host ? `${req.protocol}://${host}/api-docs` : '/api-docs'
	}

	res.json(response)
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
