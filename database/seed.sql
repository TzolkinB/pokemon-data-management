-- Sample data for development --
-- Insert sample types (these will populate your dropdown)
INSERT INTO types (id, name) VALUES
(1, 'normal'),
(2, 'fighting'),
(3, 'flying'),
(4, 'poison'),
(5, 'ground'),
(6, 'rock'),
(7, 'bug'),
(8, 'ghost'),
(9, 'steel'),
(10, 'fire'),
(11, 'water'),
(12, 'grass'),
(13, 'electric'),
(14, 'psychic'),
(15, 'ice'),
(16, 'dragon'),
(17, 'dark'),
(18, 'fairy') ON CONFLICT (id) DO NOTHING; -- Avoid duplicate entries if run multiple times

-- Insert sample abilities (these will populate your dropdown)
INSERT INTO abilities (id, name) VALUES
(1, 'overgrow'),
(2, 'chlorophyll'),
(3, 'blaze'),
(4, 'solar-power'),
(5, 'torrent'),
(6, 'rain-dish'),
(7, 'static'),
(8, 'lightning-rod'),
(9, 'keen-eye'),
(10, 'tangled-feet'),
(11, 'big-pecks'),
(12, 'run-away'),
(13, 'adaptability'),
(14, 'anticipation'),
(15, 'thick-fat'),
(16, 'immunity'),
(17, 'gluttony'),
(18, 'pressure'),
(19, 'unnerve') ON CONFLICT (id) DO NOTHING; -- Avoid duplicate entries if run multiple times

-- Insert sample Pokémon (Gen 1 starters + favorites for demo)
INSERT INTO pokemon (id, name, height, weight, base_experience) VALUES
(1, 'bulbasaur', 7, 69, 64),
(4, 'charmander', 6, 85, 62),
(7, 'squirtle', 5, 90, 63),
(25, 'pikachu', 4, 60, 112),
(6, 'charizard', 17, 905, 267),
(9, 'blastoise', 16, 855, 265),
(16, 'pidgey', 3, 18, 50),
(133, 'eevee', 3, 65, 65),
(143, 'snorlax', 21, 4600, 189),
(150, 'mewtwo', 20, 1220, 340) ON CONFLICT (id) DO NOTHING; -- Avoid duplicate entries if run multiple times

-- Link Pokémon to their types
INSERT INTO pokemon_types (pokemon_id, type_id, slot) VALUES
-- Bulbasaur: Grass/Poison
(1, 12, 1),
(1, 4, 2),
-- Charmander: Fire
(4, 10, 1),
-- Squirtle: Water
(7, 11, 1),
-- Pikachu: Electric
(25, 13, 1),
-- Charizard: Fire/Flying
(6, 10, 1),
(6, 3, 2),
-- Blastoise: Water
(9, 11, 1),
-- Pidgey: Normal/Flying
(16, 1, 1),
(16, 3, 2),
-- Eevee: Normal
(133, 1, 1),
-- Snorlax: Normal
(143, 1, 1),
-- Mewtwo: Psychic
(150, 14, 1) ON CONFLICT (pokemon_id, type_id) DO NOTHING; -- Avoid duplicate entries if run multiple times

-- Link Pokémon to their abilities
INSERT INTO pokemon_abilities (pokemon_id, ability_id, is_hidden) VALUES
-- Bulbasaur (id: 1)
(1, 1, false),
(1, 2, true),
-- Charmander (id: 4)
(4, 3, false),
(4, 4, true),
-- Squirtle (id: 7)
(7, 5, false),
(7, 6, true),
-- Pikachu (id: 25)
(25, 7, false),
(25, 8, true),
-- Charizard (id: 6)
(6, 3, false),
(6, 4, true),
-- Blastoise (id: 9)
(9, 5, false),
(9, 6, true),
-- Pidgey (id: 16)
(16, 9, false),
(16, 10, false),
(16, 11, true),
-- Eevee (id: 133)
(133, 12, false),
(133, 13, false),
(133, 14, true),
-- Snorlax (id: 143)
(143, 15, false),
(143, 16, false),
(143, 17, true),
-- Mewtwo (id: 150)
(150, 18, false),
(150, 19, true) ON CONFLICT (pokemon_id, ability_id) DO NOTHING; -- Avoid duplicate entries if run multiple times