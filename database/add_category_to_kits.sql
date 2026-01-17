ALTER TABLE kits ADD COLUMN category_id BIGINT;
ALTER TABLE kits ADD CONSTRAINT fk_kit_category FOREIGN KEY (category_id) REFERENCES categories(id);

-- Assign a default category to existing kits (e.g., the first available category)
UPDATE kits SET category_id = (SELECT id FROM categories LIMIT 1);
