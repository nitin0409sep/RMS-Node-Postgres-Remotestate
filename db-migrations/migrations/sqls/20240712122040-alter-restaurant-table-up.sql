/* Replace with your SQL commands */
CREATE TYPE address_type AS (
   restaurant_address_name text,
   latitude text,
   longitude text
);

ALTER TABLE restaurants
ADD COLUMN restaurant_addresses address_type[],
ADD COLUMN archiveAt BOOLEAN DEFAULT FALSE;