export const getAllPokemonQuery = `
  SELECT p.*, 
        array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as types,
        array_agg(DISTINCT jsonb_build_object(
          'name', a.name, 
          'is_hidden', pa.is_hidden
      )) FILTER (WHERE a.name IS NOT NULL) as abilities
      FROM pokemon p
      LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
      LEFT JOIN types t ON pt.type_id = t.id
      LEFT JOIN pokemon_abilities pa ON p.id = pa.pokemon_id
      LEFT JOIN abilities a ON pa.ability_id = a.id
      GROUP BY p.id
      ORDER BY p.id
    `

export const searchPokemonByNameQuery = `
SELECT id, name, height, weight
      FROM pokemon
      WHERE name ILIKE $1
      ORDER BY name
      LIMIT 10
      `

export const getPokemonByIdQuery = `
SELECT p.*, 
        array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as types,
        array_agg(DISTINCT jsonb_build_object(
          'name', a.name, 
          'is_hidden', pa.is_hidden
      )) FILTER (WHERE a.name IS NOT NULL) as abilities
      FROM pokemon p
      LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
      LEFT JOIN types t ON pt.type_id = t.id
      LEFT JOIN pokemon_abilities pa ON p.id = pa.pokemon_id
      LEFT JOIN abilities a ON pa.ability_id = a.id
      WHERE p.id = $1
      GROUP BY p.id
      `
