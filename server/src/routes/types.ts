import { Router, Request, Response } from 'express'
import pool from '../config/database'

const router = Router()

// GET /api/types - Get all types
router.get('/', async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT * FROM types ORDER BY name')
		res.json(result.rows)
	} catch (error: unknown) {
		console.error('Error fetching types:', error)
		res.status(500).json({ error: 'Failed to fetch types' })
	}
})

export default router
