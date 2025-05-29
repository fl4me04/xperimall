-- First, let's create the promotions table if it doesn't exist
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Insert promotions with category_id
INSERT INTO promotions (title, description, category_id) VALUES
-- Food & Beverages (category_id: 3)
('Maison Special Menu', 'Enjoy our special menu with 20% discount on all items', 3),
('Gong Xi Special Offer', 'Get 15% off on all Chinese New Year special dishes', 3),
('Gyudon Special', 'Buy 1 Get 1 Free on all Gyudon bowls', 3),
('Macaron Special', 'Get 3 macarons for the price of 2', 3),

-- Beauty & Wellness (category_id: 1)
('Sensatia Special Treatment', 'Get 30% off on all facial treatments', 1),
('Victoria Secret Special', 'Buy any 2 items get 1 free', 1),

-- Fashion (category_id: 4)
('Pull & Bear Special', 'Get 25% off on all items', 4),
('Stradivarius Special', 'Buy 2 get 1 free on all items', 4); 