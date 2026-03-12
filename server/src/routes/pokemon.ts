import { Router, Request, Response } from 'express'
import pool from '../config/database'
import { Pokemon, PokemonWithDetails, CreatePokemonInput, UpdatePokemonInput, DatabaseError } from '../types'
import { getAllPokemonQuery, searchPokemonByNameQuery, getPokemonByIdQuery } from '../queries/pokemonQueries'

const router = Router()

// GET /api/pokemon - Get all pokemon
router.get('/', async (req: Request, res: Response) => {
	try {
		const result = await pool.query<PokemonWithDetails>(getAllPokemonQuery)

		res.json(result.rows)
	} catch (error) {
		console.error('Error fetching pokemon:', error)
		res.status(500).json({ error: 'Failed to fetch pokemon' })
	}
})

// GET /api/pokemon/search?q=pikachu - Search pokemon by name
router.get('/search', async (req: Request, res: Response) => {
	try {
		const { q } = req.query

		if (!q || typeof q !== 'string') {
			return res.status(400).json({ error: 'Query parameter "q" is required' })
		}

		const result = await pool.query<Pokemon>(searchPokemonByNameQuery, [`%${q}%`])

		res.json(result.rows)
	} catch (error) {
		console.error('Error searching pokemon:', error)
		res.status(500).json({ error: 'Failed to search pokemon' })
	}
})

// GET /api/pokemon/:id - Get single pokemon by ID
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const result = await pool.query<PokemonWithDetails>(getPokemonByIdQuery, [id])

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Pokemon not found' })
		}

		res.json(result.rows[0])
	} catch (error) {
		console.error('Error fetching pokemon:', error)
		res.status(500).json({ error: 'Failed to fetch pokemon' })
	}
})

// POST /api/pokemon - Create new pokemon
router.post('/', async (req: Request, res: Response) => {
	const client = await pool.connect()

	try {
		const { name, height, weight, base_experience, types, abilities } = req.body as CreatePokemonInput

		// Validation
		if (!name || !height || !weight) {
			return res.status(400).json({
				error: 'Missing required fields: name, height, weight',
			})
		}

		await client.query('BEGIN')

		// Insert pokemon (let the database generate the ID)
		const pokemonResult = await client.query<Pokemon>(
			`
      INSERT INTO pokemon (name, height, weight, base_experience)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
			[name.toLowerCase(), height, weight, base_experience || null]
		)

		const newPokemon = pokemonResult.rows[0]

		// Insert types if provided
		if (types && Array.isArray(types) && types.length > 0) {
			for (let i = 0; i < types.length; i++) {
				await client.query(
					`
          INSERT INTO pokemon_types (pokemon_id, type_id, slot)
          VALUES ($1, $2, $3)
        `,
					[newPokemon.id, types[i], i + 1]
				)
			}
		}

		// Insert abilities if provided
		if (abilities && Array.isArray(abilities) && abilities.length > 0) {
			for (const ability of abilities) {
				await client.query(
					`
          INSERT INTO pokemon_abilities (pokemon_id, ability_id, is_hidden)
          VALUES ($1, $2, $3)
        `,
					[newPokemon.id, ability.id, ability.is_hidden || false]
				)
			}
		}

		await client.query('COMMIT')

		res.status(201).json(newPokemon)
	} catch (error: unknown) {
		await client.query('ROLLBACK')
		console.error('Error creating pokemon:', error)

		const dbError = error as DatabaseError
		if (dbError.code === '23505') {
			// Unique violation
			return res.status(409).json({ error: 'Pokemon with this name already exists' })
		}

		res.status(500).json({ error: 'Failed to create pokemon' })
	} finally {
		client.release()
	}
})

// PUT /api/pokemon/:id - Update pokemon
router.put('/:id', async (req: Request, res: Response) => {
	const client = await pool.connect()

	try {
		const { id } = req.params
		const { name, height, weight, base_experience, types, abilities } = req.body as UpdatePokemonInput

		await client.query('BEGIN')

		// Determine if base_experience was explicitly provided in the request body
		const baseExperienceProvided = Object.prototype.hasOwnProperty.call(req.body, 'base_experience')

		// Update pokemon basic info
		let updateQuery: string
		let queryParams: unknown[]

		if (baseExperienceProvided) {
			// If base_experience is provided (including null), update it directly
			updateQuery = `
      UPDATE pokemon
      SET name = COALESCE($1, name),
          height = COALESCE($2, height),
          weight = COALESCE($3, weight),
          base_experience = $4
      WHERE id = $5
      RETURNING *
    `
			queryParams = [name?.toLowerCase(), height, weight, base_experience, id]
		} else {
			// If base_experience is not provided, leave it unchanged
			updateQuery = `
      UPDATE pokemon
      SET name = COALESCE($1, name),
          height = COALESCE($2, height),
          weight = COALESCE($3, weight)
      WHERE id = $4
      RETURNING *
    `
			queryParams = [name?.toLowerCase(), height, weight, id]
		}

		const result = await client.query<Pokemon>(updateQuery, queryParams)
		if (result.rows.length === 0) {
			await client.query('ROLLBACK')
			return res.status(404).json({ error: 'Pokemon not found' })
		}

		// Update types if provided
		if (types && Array.isArray(types)) {
			await client.query('DELETE FROM pokemon_types WHERE pokemon_id = $1', [id])
			for (let i = 0; i < types.length; i++) {
				await client.query(
					`
          INSERT INTO pokemon_types (pokemon_id, type_id, slot)
          VALUES ($1, $2, $3)
        `,
					[id, types[i], i + 1]
				)
			}
		}

		// Update abilities if provided
		if (abilities && Array.isArray(abilities)) {
			await client.query('DELETE FROM pokemon_abilities WHERE pokemon_id = $1', [id])
			for (const ability of abilities) {
				await client.query(
					`
          INSERT INTO pokemon_abilities (pokemon_id, ability_id, is_hidden)
          VALUES ($1, $2, $3)
        `,
					[id, ability.id, ability.is_hidden || false]
				)
			}
		}

		await client.query('COMMIT')

		res.json(result.rows[0])
	} catch (error: unknown) {
		await client.query('ROLLBACK')
		console.error('Error updating pokemon:', error)

		const dbError = error as DatabaseError
		if (dbError.code === '23505') {
			return res.status(409).json({ error: 'Pokemon with this name already exists' })
		}

		res.status(500).json({ error: 'Failed to update pokemon' })
	} finally {
		client.release()
	}
})

// DELETE /api/pokemon/:id - Delete pokemon
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const result = await pool.query<Pokemon>('DELETE FROM pokemon WHERE id = $1 RETURNING *', [id])

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Pokemon not found' })
		}

		res.json({ message: 'Pokemon deleted successfully', pokemon: result.rows[0] })
	} catch (error) {
		console.error('Error deleting pokemon:', error)
		res.status(500).json({ error: 'Failed to delete pokemon' })
	}
})

export default router
