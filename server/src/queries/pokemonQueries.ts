export const getAllPokemonQuery = `
  SELECT * FROM pokemon_with_details
  ORDER BY id    
`

export const searchPokemonByNameQuery = `
  SELECT * FROM pokemon_with_details
  WHERE name ILIKE $1
  ORDER BY name
  LIMIT 10
`

export const getPokemonByIdQuery = `
  SELECT * FROM pokemon_with_details
  WHERE id = $1
`
