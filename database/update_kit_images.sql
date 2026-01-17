-- Update all kits with placeholder or null image to use the new Nano Banana Pro default image
UPDATE kits 
SET image_url = 'http://localhost:3000/default-kit.png'
WHERE image_url LIKE '%placehold.co%' OR image_url IS NULL OR image_url = '';
