# pokemon_with_details VIEW Explanation

This document breaks down the `pokemon_with_details` view created in `schema.sql` (lines 47–59).

## Overview

A VIEW is like a saved query. Instead of repeating this complex join in every route handler, queries can simply `SELECT * FROM pokemon_with_details` and get all details in one statement.

## Line-by-line breakdown

### Line 47: CREATE OR REPLACE VIEW pokemon_with_details AS

Creates a named view. `OR REPLACE` means you can run this again to update the view definition without errors.

### Line 49: SELECT p.\*

Gets all columns from the `pokemon` table (`id`, `name`, `height`, `weight`, `base_experience`, `created_at`).

### Lines 50–51: array_agg(DISTINCT t.name) FILTER ... as types

**What it does:**

- `array_agg()` collects multiple rows into a single array column.
- `DISTINCT` ensures no duplicate type names are collected.
- `FILTER (WHERE t.name IS NOT NULL)` skips null values so only real names are aggregated.

**Result:** The `types` column becomes an array like `['Fire', 'Flying']` instead of multiple rows per pokemon.

### Lines 52–55: array_agg(DISTINCT jsonb_build_object(...)) FILTER ... as abilities

**What it does:**

- Similar to types, but `jsonb_build_object()` creates structured JSON objects instead of plain strings.
- Each ability becomes an object: `{ "name": "Ability Name", "is_hidden": true/false }`
- `array_agg()` collects these objects into an array.

**Result:** The `abilities` column becomes an array of objects like:

```json
[
	{ "name": "Blaze", "is_hidden": false },
	{ "name": "Solar Power", "is_hidden": true }
]
```

### Line 56: FROM pokemon p

Base table. All pokemon rows start here.

### Lines 57–60: LEFT JOIN ... (4 joins)

**Why LEFT JOIN:**

- `LEFT JOIN` keeps all pokemon rows, even if they have no associated types or abilities.
- If you used `INNER JOIN`, pokemon without types/abilities would disappear.

**The joins:**

1. `pokemon_types pt` — Junction table linking pokemon to type IDs.
2. `types t` — Actual type names (Fire, Water, etc.).
3. `pokemon_abilities pa` — Junction table linking pokemon to ability IDs.
4. `abilities a` — Actual ability names.

### Line 61: GROUP BY p.id

**What it does:**

- Without GROUP BY, a pokemon with 2 types would appear as 2 separate rows.
- GROUP BY rolls all those joined rows back into **one row per pokemon**.
- The `array_agg()` functions above collect the multiple type/ability rows into arrays inside that single pokemon row.

**Result:** One row per pokemon with arrays of types and abilities instead of duplicated pokemon rows.

## Complete flow example

If Pikachu has 1 type (Electric) and 2 abilities (Static, Lightning Rod), the joins would create 2 rows:

```
pikachu | Electric | Static
pikachu | Electric | Lightning Rod
```

`GROUP BY p.id` combined with `array_agg()` collapses this to:

```
pikachu | [Electric] | [{ name: Static, is_hidden: false }, { name: Lightning Rod, is_hidden: false }]
```

This single-row format is what the API expects in the response.
