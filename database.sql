PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE [biopetrol] ("estacion" text,"litros" text,"timestamp" text,"id" integer PRIMARY KEY);
CREATE UNIQUE INDEX [idx_biopetrol_station_timestamp] ON [biopetrol] ("estacion", "timestamp");
CREATE TABLE [current_biopetrol] ("estacion" text PRIMARY KEY,"litros" text NOT NULL,"timestamp" text NOT NULL,"address" text NOT NULL);
