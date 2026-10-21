-- Apply this to the existing remote database with `wrangler d1 migrations apply gasolina --remote`.
-- Historical runs before this migration could store the same station/minute more
-- than once. Keep the most recently stored reading so the uniqueness guarantee
-- below can be introduced without discarding the latest observed value.
DELETE FROM biopetrol
WHERE id NOT IN (
  SELECT MAX(id)
  FROM biopetrol
  GROUP BY estacion, timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_biopetrol_station_timestamp
  ON biopetrol (estacion, timestamp);

-- The public endpoint reads this table only: one row per station.
CREATE TABLE IF NOT EXISTS current_biopetrol (
  estacion TEXT PRIMARY KEY,
  litros TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  address TEXT NOT NULL
);
