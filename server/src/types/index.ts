export interface Pokemon {
	id: number
	name: string
	height: number
	weight: number
	base_experience: number | null
	created_at: Date
}

export interface PokemonWithDetails extends Pokemon {
	types: string[]
	abilities: Array<{ name: string; is_hidden: boolean }>
}

export interface CreatePokemonInput {
	name: string
	height: number
	weight: number
	base_experience?: number | null
	types?: number[]
	abilities?: Array<{ id: number; is_hidden?: boolean }>
}

export type UpdatePokemonInput = Partial<CreatePokemonInput>

export interface DatabaseError extends Error {
	code?: string
}

export function isValidId(id: string): boolean {
	const n = Number(id)
	return Number.isInteger(n) && n > 0
}

export function isValidTypesInput(types: unknown): types is number[] {
	return Array.isArray(types) && types.every((t) => Number.isInteger(t) && t > 0)
}

export function isValidAbilitiesInput(abilities: unknown): abilities is Array<{ id: number; is_hidden?: boolean }> {
	return (
		Array.isArray(abilities) &&
		abilities.every((a: unknown) => {
			if (a === null || typeof a !== 'object') return false
			const obj = a as Record<string, unknown>
			return (
				Number.isInteger(obj.id) &&
				(obj.id as number) > 0 &&
				(obj.is_hidden === undefined || typeof obj.is_hidden === 'boolean')
			)
		})
	)
}
