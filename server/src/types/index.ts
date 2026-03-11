export interface Pokemon {
	id: number
	name: string
	height: number
	weight: number
	base_experience: number | null
	created_at: Date
}

export interface Type {
	id: number
	name: string
}

export interface Ability {
	id: number
	name: string
}

export interface PokemonWithDetails extends Pokemon {
	types: Type[]
	abilities: Array<Ability & { is_hidden: boolean }>
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
