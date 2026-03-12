-- Pokemon Test Data Manager - Database Schema
-- Safe to run multiple times (uses IF NOT EXISTS)

-- Create pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    height INTEGER NOT NULL,  -- in decimeters
    weight INTEGER NOT NULL,  -- in hectograms
    base_experience INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create types table
CREATE TABLE IF NOT EXISTS types (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create abilities table
CREATE TABLE IF NOT EXISTS abilities (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create pokemon_types junction table (many-to-many)
CREATE TABLE IF NOT EXISTS pokemon_types (
    pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    type_id INTEGER REFERENCES types(id) ON DELETE CASCADE,
    slot INTEGER NOT NULL,  -- 1 for primary type, 2 for secondary
    PRIMARY KEY (pokemon_id, type_id)
);

-- Create pokemon_abilities junction table (many-to-many)
CREATE TABLE IF NOT EXISTS pokemon_abilities (
    pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    ability_id INTEGER REFERENCES abilities(id) ON DELETE CASCADE,
    is_hidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (pokemon_id, ability_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pokemon_types_type ON pokemon_types(type_id);
CREATE INDEX IF NOT EXISTS idx_pokemon_abilities_ability ON pokemon_abilities(ability_id);

-- Create view for pokemon with full details (types and abilities)
CREATE OR REPLACE VIEW pokemon_with_details AS
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
    GROUP BY p.id;
