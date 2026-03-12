import { Router, Request, Response } from 'express'
import pool from '../config/database'

const router = Router()

// GET /api/abilities - Get all abilities
router.get('/', async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT * FROM abilities ORDER BY name')
		res.json(result.rows)
	} catch (error: unknown) {
		console.error('Error fetching abilities:', error)
		res.status(500).json({ error: 'Failed to fetch abilities' })
	}
})

export default router
