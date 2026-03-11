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
CREATE INDEX IF NOT EXISTS idx_pokemon_abilities_pokemon ON pokemon_abilities(pokemon_id);