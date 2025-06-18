
import type { Product, Category, Order, UserProfile, DeliveryPartner, PromoCode } from './types';

const nowISO = new Date().toISOString();

export const mockCategories: Category[] = [
  { id: 'cat1', slug: 'dairy-eggs', name: 'Dairy & Eggs', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png', dataAiHint: 'dairy eggs' },
  { id: 'cat2', slug: 'fruits-vegetables', name: 'Fruits & Vegetables', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-3_9.png', dataAiHint: 'fruits vegetables' },
  { id: 'cat3', slug: 'breakfast-instant-food', name: 'Breakfast & Instant Food', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png', dataAiHint: 'breakfast food' },
  { id: 'cat4', slug: 'cold-drinks-juices', name: 'Cold Drinks & Juices', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png', dataAiHint: 'drinks juices' },
  { id: 'cat5', slug: 'snacks-munchies', name: 'Snacks & Munchies', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png', dataAiHint: 'snacks munchies' },
  { id: 'cat6', slug: 'bakery-biscuits', name: 'Bakery & Biscuits', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png', dataAiHint: 'bakery biscuits' },
  { id: 'cat7', slug: 'tea-coffee-health-drinks', name: 'Tea, Coffee & Health Drinks', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-9_3.png', dataAiHint: 'tea coffee' },
  { id: 'cat8', slug: 'atta-rice-dal', name: 'Atta, Rice & Dal', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-10.png', dataAiHint: 'atta rice' },
  { id: 'cat9', slug: 'masala-oil-more', name: 'Masala, Oil & More', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-11.png', dataAiHint: 'masala oil' },
  { id: 'cat10', slug: 'sweet-tooth', name: 'Sweet Tooth', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-7_3.png', dataAiHint: 'sweets chocolate' },
  { id: 'cat11', slug: 'sauces-spreads', name: 'Sauces & Spreads', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-12.png', dataAiHint: 'sauces spreads' },
  { id: 'cat12', slug: 'chicken-meat-fish', name: 'Chicken, Meat & Fish', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-13.png', dataAiHint: 'chicken meat' },
  { id: 'cat13', slug: 'organic-healthy-living', name: 'Organic & Healthy Living', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-14.png', dataAiHint: 'organic healthy' },
  { id: 'cat14', slug: 'baby-care', name: 'Baby Care', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-15.png', dataAiHint: 'baby products' },
  { id: 'cat15', slug: 'pharma-wellness', name: 'Pharma & Wellness', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-16.png', dataAiHint: 'pharma wellness' },
  { id: 'cat16', slug: 'cleaning-essentials', name: 'Cleaning Essentials', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-17.png', dataAiHint: 'cleaning supplies' },
  { id: 'cat17', slug: 'home-office', name: 'Home & Office', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-18.png', dataAiHint: 'home office' },
  { id: 'cat18', slug: 'personal-care', name: 'Personal Care', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-19.png', dataAiHint: 'personal care' },
  { id: 'cat19', slug: 'pet-care', name: 'Pet Care', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-20.png', dataAiHint: 'pet food' },
  { id: 'cat20', slug: 'paan-corner', name: 'Paan Corner', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-12/paan-corner_web.png', dataAiHint: 'paan items' },
];

export const mockProducts: Product[] = [
  { id: 'prod1', name: 'Apples (Shimla)', description: 'Crisp and juicy red apples from Shimla, perfect for snacking or baking.', price: 120, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/E74C3C/ffffff.png',
    rating: 4.5, reviewsCount: 120, stock: 50, status: 'In Stock',
    weight: 'Approx. 1kg (6-7 apples)', origin: 'Himachal Pradesh, India', createdAt: nowISO, dataAiHint: 'red apples'
  },
  { id: 'prod2', name: 'Bananas (Robusta)', description: 'Sweet and ripe Robusta bananas.', price: 40, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/F1C40F/000000.png',
    rating: 4.7, reviewsCount: 90, stock: 30, status: 'In Stock',
    weight: 'Bunch (6-8 bananas)', origin: 'Local', createdAt: nowISO, dataAiHint: 'yellow bananas'
  },
  { id: 'prod3', name: 'Fresh Carrots (Local)', description: 'Fresh, crunchy local carrots.', price: 30, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/E67E22/ffffff.png',
    stock: 100, status: 'In Stock', rating: 4.3, reviewsCount: 50,
    weight: '500g', origin: 'Local Farms', createdAt: nowISO, dataAiHint: 'orange carrots'
  },
  { id: 'prod4', name: 'Whole Milk (1L)', description: 'Fresh pasteurized whole milk.', price: 65, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/ECF0F1/000000.png',
    rating: 4.8, reviewsCount: 200, stock: 75, status: 'In Stock',
    weight: '1 Liter', origin: 'Local Dairy', createdAt: nowISO, dataAiHint: 'milk carton'
  },
  { id: 'prod5', name: 'Zero Maida Whole-Wheat Bread', description: 'Soft whole wheat sliced bread, zero maida.', price: 52, category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/F5E1DA/000000.png',
    stock: 60, status: 'In Stock', rating: 4.6, reviewsCount: 80,
    weight: '400g pack', origin: 'Local Bakery', createdAt: nowISO, dataAiHint: 'bread loaf'
  },
  { id: 'prod6', name: 'Potato Chips (Salted)', description: 'Classic salted potato chips.', price: 20, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/F9E79F/000000.png',
    rating: 4.2, reviewsCount: 150, stock: 120, status: 'In Stock',
    weight: '75g bag', origin: 'Processed locally', createdAt: nowISO, dataAiHint: 'chips bag'
  },
  { id: 'prod7', name: 'Cola Drink (2L)', description: 'Refreshing cola beverage.', price: 90, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/A93226/ffffff.png',
    stock: 80, status: 'In Stock', rating: 4.5, reviewsCount: 100,
    weight: '2 Liter Bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'soda bottle'
  },
  { id: 'prod8', name: 'Dish Soap (500ml)', description: 'Effective grease-cutting dish soap.', price: 75, category: 'cat16',
    imageUrl: 'https://placehold.co/600x450/AED6F1/000000.png',
    rating: 4.6, reviewsCount: 70, stock: 40, status: 'In Stock',
    weight: '500ml Bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'soap bottle'
  },
  { id: 'prod9', name: 'Toothpaste (Mint)', description: 'Mint flavored toothpaste for fresh breath.', price: 55, category: 'cat18',
    imageUrl: 'https://placehold.co/600x450/A2D9CE/000000.png',
    stock: 90, status: 'In Stock', rating: 4.7, reviewsCount: 90,
    weight: '100g Tube', origin: 'India', createdAt: nowISO, dataAiHint: 'toothpaste tube'
  },
  { id: 'prod10', name: 'Avocado Hass (Single)', description: 'Creamy Hass avocado.', price: 180, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/588157/ffffff.png',
    rating: 4.9, reviewsCount: 250, stock: 0, status: 'Out of Stock',
    weight: 'Approx. 150g per piece', origin: 'Imported', createdAt: nowISO, dataAiHint: 'green avocado'
  },
  { id: 'prod11', name: 'Organic Spinach', description: 'Fresh organic spinach leaves, packed with nutrients.', price: 50, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/8FBC8F/000000.png',
    rating: 4.6, reviewsCount: 55, stock: 40, status: 'In Stock',
    weight: '250g bunch', origin: 'Organic Farm', createdAt: nowISO, dataAiHint: 'green spinach'
  },
  { id: 'prod12', name: 'Orange (Nagpur)', description: 'Juicy and sweet oranges from Nagpur, rich in Vitamin C.', price: 80, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FFA500/000000.png',
    rating: 4.4, reviewsCount: 70, stock: 60, status: 'In Stock',
    weight: 'Approx. 1kg (4-5 oranges)', origin: 'Nagpur, India', createdAt: nowISO, dataAiHint: 'orange fruit'
  },
  { id: 'prod13', name: 'Broccoli (Organic)', description: 'Fresh organic broccoli head, great for steaming or roasting.', price: 70, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/556B2F/ffffff.png',
    rating: 4.7, reviewsCount: 65, stock: 35, status: 'In Stock',
    weight: 'Approx. 300g per head', origin: 'Organic Farm', createdAt: nowISO, dataAiHint: 'green broccoli'
  },
  { id: 'prod14', name: 'Mangoes (Alphonso)', description: 'Sweet and flavorful Alphonso mangoes, the king of mangoes.', price: 500, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FFBF00/000000.png',
    rating: 4.9, reviewsCount: 150, stock: 20, status: 'In Stock',
    weight: 'Box of 6', origin: 'Ratnagiri, India', createdAt: nowISO, dataAiHint: 'yellow mango'
  },
  { id: 'prod15', name: 'Hybrid Tomato (Tamatar)', description: 'Sweet and juicy hybrid tomatoes, perfect for salads.', price: 25, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FF6347/ffffff.png',
    rating: 4.5, reviewsCount: 80, stock: 45, status: 'In Stock',
    weight: '500g', origin: 'Local Farms', createdAt: nowISO, dataAiHint: 'red tomatoes'
  },
  { id: 'prod16', name: 'Pomegranate', description: 'Fresh pomegranate with antioxidant-rich seeds.', price: 110, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/D22B2B/ffffff.png',
    rating: 4.6, reviewsCount: 90, stock: 25, status: 'In Stock',
    weight: 'Approx. 300g per piece', origin: 'Maharashtra, India', createdAt: nowISO, dataAiHint: 'red pomegranate'
  },
  { id: 'prod17', name: 'Potato (Aloo)', description: 'Versatile potatoes, ideal for mashing, baking, or frying.', price: 29, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/D2B48C/000000.png',
    rating: 4.3, reviewsCount: 110, stock: 70, status: 'In Stock',
    weight: '1kg', origin: 'Local Farms', createdAt: nowISO, dataAiHint: 'brown potatoes'
  },
  { id: 'prod18', name: 'Strawberries (Fresh)', description: 'Sweet, ripe, and fresh strawberries.', price: 150, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FF69B4/ffffff.png',
    rating: 4.8, reviewsCount: 100, stock: 30, status: 'In Stock',
    weight: '200g punnet', origin: 'Mahabaleshwar, India', createdAt: nowISO, dataAiHint: 'red strawberries'
  },
  { id: 'prod19', name: 'English Cucumber (Kheera)', description: 'Cool and crisp cucumber, great for salads and hydration.', price: 33, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.4, reviewsCount: 60, stock: 55, status: 'In Stock',
    weight: 'Approx. 250g per piece', origin: 'Local Farms', createdAt: nowISO, dataAiHint: 'green cucumber'
  },
  { id: 'prod20', name: 'Eggs (Dozen)', description: 'Farm fresh brown eggs.', price: 84, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/F5DEB3/000000.png',
    rating: 4.7, reviewsCount: 180, stock: 50, status: 'In Stock',
    weight: 'Pack of 12', origin: 'Local Poultry Farm', createdAt: nowISO, dataAiHint: 'eggs carton'
  },
  { id: 'prod21', name: 'Cereal Flakes', description: 'Healthy corn cereal flakes for breakfast.', price: 180, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFDAB9/000000.png',
    rating: 4.5, reviewsCount: 90, stock: 60, status: 'In Stock',
    weight: '500g box', origin: 'India', createdAt: nowISO, dataAiHint: 'cereal box'
  },
  { id: 'prod22', name: 'Orange Juice (1L)', description: 'Freshly squeezed orange juice.', price: 110, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFEBCD/000000.png',
    rating: 4.6, reviewsCount: 110, stock: 70, status: 'In Stock',
    weight: '1 Liter Tetra Pak', origin: 'India', createdAt: nowISO, dataAiHint: 'juice carton'
  },
  { id: 'prod23', name: 'Chocolate Cookies', description: 'Delicious chocolate chip cookies.', price: 75, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/8B4513/ffffff.png',
    rating: 4.8, reviewsCount: 130, stock: 80, status: 'In Stock',
    weight: '200g pack', origin: 'Local Bakery', createdAt: nowISO, dataAiHint: 'cookies pack'
  },
  { id: 'prod24', name: 'Croissants (Pack of 4)', description: 'Buttery and flaky croissants.', price: 160, category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/F0E68C/000000.png',
    rating: 4.9, reviewsCount: 100, stock: 40, status: 'In Stock',
    weight: 'Pack of 4', origin: 'Local Bakery', createdAt: nowISO, dataAiHint: 'bakery croissants'
  },
  { id: 'prod25', name: 'Green Tea Bags (25 count)', description: 'Refreshing green tea bags.', price: 90, category: 'cat7',
    imageUrl: 'https://placehold.co/600x450/98FB98/000000.png',
    rating: 4.7, reviewsCount: 85, stock: 55, status: 'In Stock',
    weight: '25 tea bags box', origin: 'Assam, India', createdAt: nowISO, dataAiHint: 'tea box'
  },
  { id: 'prod26', name: 'Basmati Rice (1kg)', description: 'Premium long-grain basmati rice.', price: 150, category: 'cat8',
    imageUrl: 'https://placehold.co/600x450/FAF0E6/000000.png',
    rating: 4.9, reviewsCount: 150, stock: 65, status: 'In Stock',
    weight: '1kg bag', origin: 'Punjab, India', createdAt: nowISO, dataAiHint: 'rice bag'
  },
  { id: 'prod27', name: 'Olive Oil (500ml)', description: 'Extra virgin olive oil.', price: 350, category: 'cat9',
    imageUrl: 'https://placehold.co/600x450/BDB76B/000000.png',
    rating: 4.8, reviewsCount: 120, stock: 30, status: 'In Stock',
    weight: '500ml Bottle', origin: 'Spain', createdAt: nowISO, dataAiHint: 'oil bottle'
  },
  { id: 'prod28', name: 'Dark Chocolate Bar', description: 'Rich 70% cocoa dark chocolate.', price: 120, category: 'cat10',
    imageUrl: 'https://placehold.co/600x450/5C3317/ffffff.png',
    rating: 4.9, reviewsCount: 200, stock: 90, status: 'In Stock',
    weight: '100g bar', origin: 'Belgium', createdAt: nowISO, dataAiHint: 'chocolate bar'
  },
  { id: 'prod29', name: 'Strawberry Jam', description: 'Sweet strawberry jam/preserve.', price: 95, category: 'cat11',
    imageUrl: 'https://placehold.co/600x450/FFB6C1/000000.png',
    rating: 4.6, reviewsCount: 70, stock: 40, status: 'In Stock',
    weight: '350g jar', origin: 'India', createdAt: nowISO, dataAiHint: 'jam jar'
  },
  { id: 'prod30', name: 'Chicken Breast (500g)', description: 'Fresh boneless chicken breast.', price: 250, category: 'cat12',
    imageUrl: 'https://placehold.co/600x450/FFE4E1/000000.png',
    rating: 4.7, reviewsCount: 95, stock: 25, status: 'In Stock',
    weight: '500g pack', origin: 'Local Farm', createdAt: nowISO, dataAiHint: 'raw chicken'
  },
  { id: 'prod31', name: 'Organic Quinoa (500g)', description: 'Healthy organic quinoa grains.', price: 220, category: 'cat13',
    imageUrl: 'https://placehold.co/600x450/F0E68C/000000.png',
    rating: 4.8, reviewsCount: 60, stock: 35, status: 'In Stock',
    weight: '500g pack', origin: 'Peru', createdAt: nowISO, dataAiHint: 'quinoa pack'
  },
  { id: 'prod32', name: 'Mee Mee Aloe Vera Baby Wipes (3×72)', description: 'Gentle baby wipes for sensitive skin.', price: 205, category: 'cat14',
    imageUrl: 'https://placehold.co/600x450/E0FFFF/000000.png',
    rating: 4.9, reviewsCount: 110, stock: 70, status: 'In Stock',
    weight: '3 packs of 72 wipes each', origin: 'India', createdAt: nowISO, dataAiHint: 'wipes pack'
  },
  { id: 'prod33', name: 'Vitamin C Tablets', description: 'Immune boosting Vitamin C supplements.', price: 150, category: 'cat15',
    imageUrl: 'https://placehold.co/600x450/FFE4B5/000000.png',
    rating: 4.7, reviewsCount: 50, stock: 80, status: 'In Stock',
    weight: '60 tablets bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'vitamin bottle'
  },
  { id: 'prod34', name: 'Surf Excel Easy Wash Detergent Powder (1 kg)', description: 'Powerful laundry detergent.', price: 144, category: 'cat16',
    imageUrl: 'https://placehold.co/600x450/ADD8E6/000000.png',
    rating: 4.6, reviewsCount: 90, stock: 0, status: 'Out of Stock',
    weight: '1kg pack', origin: 'India', createdAt: nowISO, dataAiHint: 'detergent bottle'
  },
  { id: 'prod35', name: 'Notebooks (Set of 3)', description: 'Spiral bound notebooks for office/study.', price: 99, category: 'cat17',
    imageUrl: 'https://placehold.co/600x450/D3D3D3/000000.png',
    rating: 4.5, reviewsCount: 40, stock: 100, status: 'In Stock',
    weight: 'Set of 3 notebooks', origin: 'India', createdAt: nowISO, dataAiHint: 'office notebooks'
  },
  { id: 'prod36', name: 'Shampoo (Herbal)', description: 'Nourishing herbal shampoo.', price: 180, category: 'cat18',
    imageUrl: 'https://placehold.co/600x450/C1FFC1/000000.png',
    rating: 4.7, reviewsCount: 120, stock: 60, status: 'In Stock',
    weight: '200ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'shampoo bottle'
  },
  { id: 'prod37', name: 'Drools Adult Dog Wet Food (150 g)', description: 'Nutritious dog food.', price: 40, category: 'cat19',
    imageUrl: 'https://placehold.co/600x450/FFE4C4/000000.png',
    rating: 4.8, reviewsCount: 75, stock: 45, status: 'In Stock',
    weight: '150g pouch', origin: 'India', createdAt: nowISO, dataAiHint: 'dog food'
  },
  { id: 'prod38', name: 'Sweet Paan (Single)', description: 'Traditional sweet betel leaf preparation.', price: 20, category: 'cat20',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.9, reviewsCount: 200, stock: 150, status: 'In Stock',
    weight: 'Single piece', origin: 'Local Paan Shop', createdAt: nowISO, dataAiHint: 'sweet paan'
  },
  { id: 'prod39', name: 'Kellogg’s Original Corn Flakes Cereal - 500g Box', description: 'Classic crispy corn flakes, a popular breakfast choice.', price: 200, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFD700/000000.png',
    rating: 4.6, reviewsCount: 150, stock: 70, status: 'In Stock',
    weight: '500g box', origin: 'India', createdAt: nowISO, dataAiHint: 'corn flakes'
  },
  { id: 'prod40', name: 'Nestlé Maggi 2-Minute Instant Masala Noodles - 70g Pack', description: 'Quick and tasty Maggi masala noodles, ready in 2 minutes.', price: 14, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFFF00/000000.png',
    rating: 4.8, reviewsCount: 300, stock: 100, status: 'In Stock',
    weight: '70g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'instant noodles'
  },
  { id: 'prod41', name: 'Quaker Instant Oats – Nutritious Breakfast Porridge – 500g', description: 'Healthy and quick-cooking Quaker instant oats for a nutritious start.', price: 160, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/DEB887/000000.png',
    rating: 4.7, reviewsCount: 120, stock: 60, status: 'In Stock',
    weight: '500g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'instant oats'
  },
  { id: 'prod42', name: 'MTR Upma Instant Mix – South Indian Style – 200g Pouch', description: 'Authentic South Indian style Upma, ready in minutes with MTR instant mix.', price: 45, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/F5F5DC/000000.png',
    rating: 4.5, reviewsCount: 90, stock: 50, status: 'In Stock',
    weight: '200g pouch', origin: 'India', createdAt: nowISO, dataAiHint: 'upma mix'
  },
  { id: 'prod43', name: 'Safal Frozen Green Peas – Vacuum Packed – 500g', description: 'Freshly frozen green peas, vacuum packed to retain freshness.', price: 60, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.6, reviewsCount: 110, stock: 80, status: 'In Stock',
    weight: '500g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'frozen peas'
  },
  { id: 'prod44', name: 'McCain Air-Fryer French Fries (360 g)', description: 'Classic McCain french fries, ready to fry for a crispy snack.', price: 128, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFEFD5/000000.png',
    rating: 4.7, reviewsCount: 180, stock: 90, status: 'In Stock',
    weight: '360g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'french fries'
  },
  { id: 'prod45', name: 'Coca-Cola (750 ml)', description: 'Classic Coca-Cola soft drink.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C00000/ffffff.png',
    rating: 4.8, reviewsCount: 500, stock: 150, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'cola soda'
  },
  { id: 'prod46', name: 'Pepsi (750ml)', description: 'Refreshing Pepsi cola soft drink.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/0047AB/ffffff.png',
    rating: 4.7, reviewsCount: 450, stock: 140, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'pepsi soda'
  },
  { id: 'prod47', name: 'Sprite Lime (750 ml)', description: 'Crisp lemon-lime flavored Sprite.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/00A86B/ffffff.png',
    rating: 4.6, reviewsCount: 400, stock: 130, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'sprite soda'
  },
  { id: 'prod48', name: 'Fanta Orange (750ml)', description: 'Bubbly orange flavored Fanta.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FF8C00/ffffff.png',
    rating: 4.5, reviewsCount: 380, stock: 120, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'fanta orange'
  },
  { id: 'prod49', name: 'Thums Up (2.25L)', description: 'Strong and fizzy Thums Up cola, 2.25L pack.', price: 100, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/36454F/ffffff.png',
    rating: 4.7, reviewsCount: 420, stock: 100, status: 'In Stock',
    weight: '2.25 Liter bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'thumsup cola large'
  },
  { id: 'prod50', name: 'Real Fruit Power Cranberry (1L)', description: 'Refreshing cranberry fruit juice from Real Fruit Power.', price: 119, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/DC143C/ffffff.png',
    rating: 4.6, reviewsCount: 180, stock: 80, status: 'In Stock',
    weight: '1 Liter Tetra Pak', origin: 'India', createdAt: nowISO, dataAiHint: 'cranberry juice'
  },
  { id: 'prod51', name: 'Tropicana Orange Juice (1L)', description: 'Delicious Tropicana orange juice.', price: 130, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFA500/ffffff.png',
    rating: 4.7, reviewsCount: 350, stock: 70, status: 'In Stock',
    weight: '1 Liter Tetra Pak', origin: 'India', createdAt: nowISO, dataAiHint: 'orange juice tropicana'
  },
  {
    id: 'prod52',
    name: 'Britannia Whole Wheat Bread (400g)',
    description: 'Healthy and delicious whole wheat bread from Britannia.',
    price: 52,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/D2B48C/000000.png',
    rating: 4.5, reviewsCount: 110, stock: 50, status: 'In Stock',
    weight: '400g pack', origin: 'Local Bakery', createdAt: nowISO, dataAiHint: 'wheat bread'
  },
  {
    id: 'prod53',
    name: 'English Oven Premium White Bread (350 g)',
    description: 'Soft and classic white bread from English Oven.',
    price: 30,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/FEFDFB/000000.png',
    rating: 4.3, reviewsCount: 95, stock: 60, status: 'In Stock',
    weight: '350g pack', origin: 'Local Bakery', createdAt: nowISO, dataAiHint: 'white bread'
  },
  {
    id: 'prod54',
    name: 'Eggs (Farm Fresh - Pack of 6)',
    description: 'A pack of farm fresh, high-quality eggs.',
    price: 50,
    category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/FDF5E6/000000.png',
    rating: 4.8, reviewsCount: 210, stock: 70, status: 'In Stock',
    weight: 'Pack of 6', origin: 'Local Poultry Farm', createdAt: nowISO, dataAiHint: 'fresh eggs'
  },
  {
    id: 'prod55',
    name: 'Lay\'s Classic Salted Chips (52g)',
    description: 'Classic, crispy, and perfectly salted potato chips from Lay\'s.',
    price: 20,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFDB58/000000.png',
    rating: 4.7, reviewsCount: 350, stock: 120, status: 'In Stock',
    weight: '52g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'lays chips'
  },
  {
    id: 'prod56',
    name: 'Kurkure Masala Munch (45g)',
    description: 'Spicy and crunchy corn puffs with a tangy masala flavor.',
    price: 10,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFA500/000000.png',
    rating: 4.6, reviewsCount: 280, stock: 100, status: 'In Stock',
    weight: '45g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'kurkure snack'
  },
  {
    id: 'prod57',
    name: 'Haldiram\'s Aloo Bhujia (200g)',
    description: 'Crispy and spicy potato noodle snack from Haldiram\'s.',
    price: 55,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/F4A460/000000.png',
    rating: 4.8, reviewsCount: 220, stock: 80, status: 'In Stock',
    weight: '200g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'aloo bhujia'
  },
  {
    id: 'prod58',
    name: 'Act II Butter Popcorn (70g)',
    description: 'Classic microwave butter popcorn, ready in minutes.',
    price: 30,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFFACD/000000.png',
    rating: 4.5, reviewsCount: 150, stock: 90, status: 'In Stock',
    weight: '70g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'butter popcorn'
  },
  {
    id: 'prod59',
    name: 'Parle-G Biscuits (70g)',
    description: 'India\'s favorite glucose biscuits, perfect with tea or coffee.',
    price: 10,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/FFDEAD/000000.png',
    rating: 4.9, reviewsCount: 500, stock: 200, status: 'In Stock',
    weight: '70g pack', origin: 'India', createdAt: nowISO, dataAiHint: 'parle g'
  },
  {
    id: 'prod60', name: 'Amul Taaza Toned Milk (500ml)',
    description: 'Fresh Amul Taaza toned milk, 500ml pack.', price: 29, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E0E8F0/000000.png', rating: 4.6, reviewsCount: 80, stock: 50, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'toned milk'
  },
  {
    id: 'prod61', name: 'Amul Gold Full Cream Milk (500ml)',
    description: 'Rich Amul Gold full cream milk, 500ml pack.', price: 35, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E1E9F1/000000.png', rating: 4.7, reviewsCount: 90, stock: 40, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'full cream milk'
  },
  {
    id: 'prod62', name: 'Mother Dairy Toned Milk (500ml)',
    description: 'Mother Dairy toned milk, 500ml pack.', price: 29, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E2EAF2/000000.png', rating: 4.5, reviewsCount: 75, stock: 55, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'toned milk motherdairy'
  },
  {
    id: 'prod63', name: 'Amul Cow Milk (500ml)',
    description: 'Fresh Amul cow milk, 500ml pack.', price: 30, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E3EBF3/000000.png', rating: 4.6, reviewsCount: 85, stock: 45, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'cow milk'
  },
  {
    id: 'prod64', name: 'Mother Dairy Cow Milk (500ml)',
    description: 'Fresh Mother Dairy cow milk, 500ml pack.', price: 30, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E4ECF4/000000.png', rating: 4.6, reviewsCount: 82, stock: 48, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'cow milk motherdairy'
  },
  {
    id: 'prod65', name: 'Amul Taaza Homogenized Toned Milk (1L)',
    description: 'Amul Taaza homogenized toned milk, 1 liter pack.', price: 71, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E5EDF5/000000.png', rating: 4.7, reviewsCount: 100, stock: 30, status: 'In Stock',
    weight: '1 Liter', origin: 'India', createdAt: nowISO, dataAiHint: 'toned milk liter'
  },
  {
    id: 'prod66', name: 'Amul Buffalo A2 Milk (500ml)',
    description: 'Nutritious Amul Buffalo A2 milk, 500ml pack.', price: 38, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E6EEF6/000000.png', rating: 4.8, reviewsCount: 70, stock: 25, status: 'In Stock',
    weight: '500ml', origin: 'India', createdAt: nowISO, dataAiHint: 'buffalo milk a2'
  },
  {
    id: 'prod67', name: 'Amul Lactose-Free Milk (250ml)',
    description: 'Amul lactose-free milk, convenient 250ml pack.', price: 25, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E7EFF7/000000.png', rating: 4.5, reviewsCount: 60, stock: 35, status: 'In Stock',
    weight: '250ml', origin: 'India', createdAt: nowISO, dataAiHint: 'lactose free milk'
  },
  {
    id: 'prod68', name: 'Mother Dairy FIT-Life Double Toned (450ml)',
    description: 'Mother Dairy FIT-Life double toned milk, 450ml pack.', price: 33, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E8F0F8/000000.png', rating: 4.4, reviewsCount: 50, stock: 40, status: 'In Stock',
    weight: '450ml', origin: 'India', createdAt: nowISO, dataAiHint: 'double toned milk'
  },
  {
    id: 'prod69', name: 'Amul Slim ’n’ Trim Skimmed Milk (1L)',
    description: 'Amul Slim ’n’ Trim skimmed milk, 1 liter pack for the health-conscious.', price: 80, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E9F1F9/000000.png', rating: 4.6, reviewsCount: 95, stock: 28, status: 'In Stock',
    weight: '1 Liter', origin: 'India', createdAt: nowISO, dataAiHint: 'skimmed milk liter'
  },
  {
    id: 'prod70', name: 'Coca-Cola (300ml can)',
    description: 'Classic Coca-Cola in a convenient 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C10000/ffffff.png', rating: 4.8, reviewsCount: 180, stock: 100, status: 'In Stock',
    weight: '300ml can', origin: 'India', createdAt: nowISO, dataAiHint: 'coca cola can'
  },
  {
    id: 'prod71', name: 'Coca-Cola (2.25L Party Pack)',
    description: 'Large 2.25L party pack of Coca-Cola.', price: 97, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C20000/ffffff.png', rating: 4.7, reviewsCount: 150, stock: 80, status: 'In Stock',
    weight: '2.25 Liter bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'coca cola large'
  },
  {
    id: 'prod72', name: 'Thums Up (750ml x 2)',
    description: 'Pack of two 750ml Thums Up bottles.', price: 85, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/404D57/ffffff.png', rating: 4.6, reviewsCount: 100, stock: 60, status: 'In Stock',
    weight: '2 x 750ml bottles', origin: 'India', createdAt: nowISO, dataAiHint: 'thumsup multipack'
  },
  {
    id: 'prod73', name: 'Mountain Dew (750ml)',
    description: 'Refreshing Mountain Dew, 750ml bottle.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/3EB489/000000.png', rating: 4.5, reviewsCount: 120, stock: 70, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'mountain dew'
  },
  {
    id: 'prod74', name: 'Coca-Cola Zero (300ml can)',
    description: 'Zero sugar Coca-Cola in a 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/2C2C2C/ffffff.png', rating: 4.7, reviewsCount: 140, stock: 90, status: 'In Stock',
    weight: '300ml can', origin: 'India', createdAt: nowISO, dataAiHint: 'coke zero'
  },
  {
    id: 'prod75', name: 'Diet Coke (300ml can)',
    description: 'Light taste Diet Coke in a 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/D3D3D3/000000.png', rating: 4.6, reviewsCount: 130, stock: 85, status: 'In Stock',
    weight: '300ml can', origin: 'India', createdAt: nowISO, dataAiHint: 'diet coke'
  },
  {
    id: 'prod76', name: 'Appy Fizz (600ml)',
    description: 'Sparkling apple drink, Appy Fizz 600ml.', price: 36, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/E21329/ffffff.png', rating: 4.7, reviewsCount: 160, stock: 95, status: 'In Stock',
    weight: '600ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'appy fizz'
  },
  {
    id: 'prod77', name: 'Maaza Mango (600ml)',
    description: 'Rich and pulpy Maaza Mango drink, 600ml.', price: 42, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFC300/000000.png', rating: 4.8, reviewsCount: 200, stock: 110, status: 'In Stock',
    weight: '600ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'maaza mango'
  },
  {
    id: 'prod78', name: 'B Natural Mixed Fruit (1L)',
    description: 'Delicious mixed fruit juice from B Natural, 1L pack.', price: 70, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FF7F50/ffffff.png', rating: 4.5, reviewsCount: 90, stock: 60, status: 'In Stock',
    weight: '1 Liter Tetra Pak', origin: 'India', createdAt: nowISO, dataAiHint: 'b natural mixedfruit'
  },
  {
    id: 'prod79', name: 'B Natural Guava (1L)',
    description: 'Refreshing guava juice from B Natural, 1L pack.', price: 70, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FED8B1/000000.png', rating: 4.6, reviewsCount: 80, stock: 55, status: 'In Stock',
    weight: '1 Liter Tetra Pak', origin: 'India', createdAt: nowISO, dataAiHint: 'b natural guava'
  },
  {
    id: 'prod80', name: 'Paper Boat Pomegranate (600ml)',
    description: 'Authentic pomegranate juice by Paper Boat, 600ml.', price: 45, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C25A7C/ffffff.png', rating: 4.7, reviewsCount: 110, stock: 75, status: 'In Stock',
    weight: '600ml pouch', origin: 'India', createdAt: nowISO, dataAiHint: 'paper boat pomegranate'
  },
  {
    id: 'prod81', name: 'Schweppes Ginger Ale (300ml can)',
    description: 'Classic Schweppes Ginger Ale in a 300ml can.', price: 60, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/DAA520/ffffff.png', rating: 4.8, reviewsCount: 90, stock: 50, status: 'In Stock',
    weight: '300ml can', origin: 'India', createdAt: nowISO, dataAiHint: 'schweppes gingerale'
  },
  {
    id: 'prod82', name: 'Schweppes Tonic Water (300ml can)',
    description: 'Crisp Schweppes Tonic Water in a 300ml can.', price: 60, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/ADD8E6/000000.png', rating: 4.7, reviewsCount: 85, stock: 45, status: 'In Stock',
    weight: '300ml can', origin: 'India', createdAt: nowISO, dataAiHint: 'schweppes tonic'
  },
  {
    id: 'prod83', name: 'Bisleri Club Soda (750ml)',
    description: 'Classic Bisleri Club Soda, 750ml bottle.', price: 20, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/F0F8FF/000000.png', rating: 4.6, reviewsCount: 150, stock: 120, status: 'In Stock',
    weight: '750ml bottle', origin: 'India', createdAt: nowISO, dataAiHint: 'bisleri soda'
  },
  {
    id: 'prod84', name: 'Bisleri Mineral Water (5L)',
    description: 'Large 5L jar of Bisleri Mineral Water.', price: 75, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/B0E0E6/000000.png', rating: 4.9, reviewsCount: 250, stock: 90, status: 'In Stock',
    weight: '5 Liter Jar', origin: 'India', createdAt: nowISO, dataAiHint: 'bisleri water large'
  }
];


export const mockUser: UserProfile = {
  id: 'user123',
  name: 'Priya S.',
  email: 'priya@example.com',
  pastPurchases: [mockProducts[3], mockProducts[0]],
  browsingHistory: [mockProducts[1], mockProducts[4]],
  preferences: ['cat1', 'cat2'], 
  tastePreferences: 'Likes mild, savory, and slightly sweet flavors. Enjoys Indian and Italian cuisine.',
  dietaryRequirements: 'Vegetarian, prefers low-carb options.'
};

export const mockDeliveryPartners: DeliveryPartner[] = [
  { id: 'dp1', name: 'Ravi K.', vehicleDetails: 'Bike - KA01AB1234', rating: 4.8 },
  { id: 'dp2', name: 'Sunita M.', vehicleDetails: 'Scooter - MH02CD5678', rating: 4.9 },
];

export const mockOrders: Order[] = [
  {
    id: 'order001',
    userId: 'user123',
    items: [
      { productId: 'prod1', name: 'Apples (Shimla)', quantity: 1, price: 120, imageUrl: mockProducts.find(p=>p.id==='prod1')?.imageUrl },
      { productId: 'prod4', name: 'Whole Milk (1L)', quantity: 2, price: 65, imageUrl: mockProducts.find(p=>p.id==='prod4')?.imageUrl },
    ],
    totalAmount: 120 + (2 * 65), // Manual calc for example
    status: 'Delivered',
    deliveryAddress: { street: '123 Main St', city: 'Mumbai', postalCode: '400001', country: 'India', name: 'Priya S.', phoneNumber: '9876543210' },
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    estimatedDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    deliveryPartnerId: 'dp1',
    name: 'Priya S.',
    phoneNumber: '9876543210',
    shippingMethod: 'Standard',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'order002',
    userId: 'user123',
    items: [
      { productId: 'prod6', name: 'Potato Chips (Salted)', quantity: 3, price: 20, imageUrl: mockProducts.find(p=>p.id==='prod6')?.imageUrl },
    ],
    totalAmount: 3 * 20, // Manual calc
    status: 'Out for Delivery',
    deliveryAddress: { street: '456 Oak Ave', city: 'Delhi', postalCode: '110001', country: 'India', name: 'Priya S.', phoneNumber: '9876543210' },
    orderDate: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 8 * 60 * 1000).toISOString(), 
    deliveryPartnerId: 'dp2',
    name: 'Priya S.',
    phoneNumber: '9876543210',
    shippingMethod: 'Express',
    paymentMethod: 'UPI',
  },
   {
    id: 'order003',
    userId: 'user123',
    items: [
      { productId: 'prod2', name: 'Bananas (Robusta)', quantity: 1, price: 40, imageUrl: mockProducts.find(p=>p.id==='prod2')?.imageUrl },
      { productId: 'prod5', name: 'Zero Maida Whole-Wheat Bread', quantity: 1, price: 52, imageUrl: mockProducts.find(p=>p.id==='prod5')?.imageUrl },
    ],
    totalAmount: 40 + 52, // Manual calc
    status: 'Confirmed',
    deliveryAddress: { street: '789 Pine Ln', city: 'Bangalore', postalCode: '560001', country: 'India', name: 'Priya S.', phoneNumber: '9876543210' },
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    name: 'Priya S.',
    phoneNumber: '9876543210',
    shippingMethod: 'Standard',
    paymentMethod: 'COD',
  }
];

export const mockPromoCodesData: PromoCode[] = [
  { id: 'SAVE20', code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrderValue: 199, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), isActive: true, description: 'Get 20% off on orders above ₹199' },
  { id: 'FLAT50', code: 'FLAT50', discountType: 'fixed', discountValue: 50, minOrderValue: 299, expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), isActive: true, description: 'Flat ₹50 off on orders above ₹299' },
  { id: 'FREEDEL', code: 'FREEDEL', discountType: 'fixed', discountValue: 50, // Assuming standard delivery is 50
    minOrderValue: 99, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), isActive: true, description: 'Free Delivery on orders above ₹99' },
  { id: 'EXPIRED10', code: 'EXPIRED10', discountType: 'percentage', discountValue: 10, expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isActive: false, description: '10% off (Expired)' },
];
