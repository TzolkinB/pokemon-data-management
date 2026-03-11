-- ⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️
-- This script will DELETE ALL DATA in the pokemon_test database
-- ONLY use in development/local environments
-- DO NOT run against production or shared databases

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS pokemon_abilities CASCADE;
DROP TABLE IF EXISTS pokemon_types CASCADE;
DROP TABLE IF EXISTS abilities CASCADE;
DROP TABLE IF EXISTS types CASCADE;
DROP TABLE IF EXISTS pokemon CASCADE;