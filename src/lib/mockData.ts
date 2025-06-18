
import type { Product, Category, Order, UserProfile, DeliveryPartner } from './types';

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
  { id: 'prod1', slug: 'apples', name: 'Apples', description: 'Crisp and juicy red apples, perfect for snacking or baking.', price: 2.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/E74C3C/ffffff.png',
    rating: 4.5, reviewsCount: 120, inStock: true, stockCount: 50,
    weightVolume: 'Approx. 1kg (6-7 apples)', origin: 'Himachal Pradesh, India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: ['FRUIT20'], createdAt: nowISO, dataAiHint: 'red apples'
  },
  { id: 'prod2', slug: 'bananas-ecuador', name: 'Bananas (Ecuador)', description: 'Sweet and ripe bananas from Ecuador.', price: 1.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/F1C40F/000000.png',
    rating: 4.7, reviewsCount: 90, inStock: true, stockCount: 30,
    weightVolume: 'Bunch (6-8 bananas)', origin: 'Ecuador', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'yellow bananas'
  },
  { id: 'prod3', slug: 'fresh-carrots-local', name: 'Fresh Carrots (Local)', description: 'Fresh, crunchy local carrots.', price: 0.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/E67E22/ffffff.png',
    inStock: true, stockCount: 100, rating: 4.3, reviewsCount: 50,
    weightVolume: '500g', origin: 'Local Farms', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['VEGGIE10'], createdAt: nowISO, dataAiHint: 'orange carrots'
  },
  { id: 'prod4', slug: 'whole-milk', name: 'Whole Milk (1L)', description: 'Fresh pasteurized whole milk.', price: 1.50, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/ECF0F1/000000.png',
    rating: 4.8, reviewsCount: 200, inStock: true, stockCount: 75,
    weightVolume: '1 Liter', origin: 'Local Dairy', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['MILKDEAL'], createdAt: nowISO, dataAiHint: 'milk carton'
  },
  { id: 'prod5', slug: 'sliced-bread', name: 'Zero Maida Whole-Wheat Bread', description: 'Soft whole wheat sliced bread.', price: 52, category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/F5E1DA/000000.png',
    inStock: true, stockCount: 60, rating: 4.6, reviewsCount: 80,
    weightVolume: '400g pack', origin: 'Local Bakery', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'bread loaf'
  },
  { id: 'prod6', slug: 'potato-chips', name: 'Potato Chips (Salted)', description: 'Classic salted potato chips.', price: 1.75, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/F9E79F/000000.png',
    rating: 4.2, reviewsCount: 150, inStock: true, stockCount: 120,
    weightVolume: '150g bag', origin: 'Processed locally', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['SNACKTIME'], createdAt: nowISO, dataAiHint: 'chips bag'
  },
  { id: 'prod7', slug: 'cola-drink', name: 'Cola Drink (2L)', description: 'Refreshing cola beverage.', price: 2.50, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/A93226/ffffff.png',
    inStock: true, stockCount: 80, rating: 4.5, reviewsCount: 100,
    weightVolume: '2 Liter Bottle', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'soda bottle'
  },
  { id: 'prod8', slug: 'dish-soap', name: 'Dish Soap (500ml)', description: 'Effective grease-cutting dish soap.', price: 3.00, category: 'cat16',
    imageUrl: 'https://placehold.co/600x450/AED6F1/000000.png',
    rating: 4.6, reviewsCount: 70, inStock: true, stockCount: 40,
    weightVolume: '500ml Bottle', origin: 'India', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['CLEAN15'], createdAt: nowISO, dataAiHint: 'soap bottle'
  },
  { id: 'prod9', slug: 'toothpaste', name: 'Toothpaste (Mint)', description: 'Mint flavored toothpaste for fresh breath.', price: 2.10, category: 'cat18',
    imageUrl: 'https://placehold.co/600x450/A2D9CE/000000.png',
    inStock: true, stockCount: 90, rating: 4.7, reviewsCount: 90,
    weightVolume: '100g Tube', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'toothpaste tube'
  },
  { id: 'prod10', slug: 'avocado', name: 'Avocado Hass (Single)', description: 'Creamy Hass avocado.', price: 1.20, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/588157/ffffff.png',
    rating: 4.9, reviewsCount: 250, inStock: false, stockCount: 0,
    weightVolume: 'Approx. 150g per piece', origin: 'Imported', deliveryInfo: 'Check availability', promoCodes: [], createdAt: nowISO, dataAiHint: 'green avocado'
  },
  { id: 'prod11', slug: 'organic-spinach', name: 'Organic Spinach', description: 'Fresh organic spinach leaves, packed with nutrients.', price: 2.49, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/8FBC8F/000000.png',
    rating: 4.6, reviewsCount: 55, inStock: true, stockCount: 40,
    weightVolume: '250g bunch', origin: 'Organic Farm', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['ORGANIC10'], createdAt: nowISO, dataAiHint: 'green spinach'
  },
  { id: 'prod12', slug: 'orange', name: 'Orange', description: 'Juicy and sweet oranges, rich in Vitamin C.', price: 0.79, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FFA500/000000.png',
    rating: 4.4, reviewsCount: 70, inStock: true, stockCount: 60,
    weightVolume: 'Approx. 1kg (4-5 oranges)', origin: 'Nagpur, India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: ['FRUIT20'], createdAt: nowISO, dataAiHint: 'orange fruit'
  },
  { id: 'prod13', slug: 'broccoli-organic', name: 'Broccoli (Organic)', description: 'Fresh organic broccoli head, great for steaming or roasting.', price: 2.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/556B2F/ffffff.png',
    rating: 4.7, reviewsCount: 65, inStock: true, stockCount: 35,
    weightVolume: 'Approx. 300g per head', origin: 'Organic Farm', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['ORGANIC10'], createdAt: nowISO, dataAiHint: 'green broccoli'
  },
  { id: 'prod14', slug: 'mangoes-alphonso', name: 'Mangoes (Alphonso)', description: 'Sweet and flavorful Alphonso mangoes, the king of mangoes.', price: 4.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FFBF00/000000.png',
    rating: 4.9, reviewsCount: 150, inStock: true, stockCount: 20,
    weightVolume: 'Box of 6', origin: 'Ratnagiri, India', deliveryInfo: 'Seasonal, delivers in 15-20 mins', promoCodes: ['MANGOJOY'], createdAt: nowISO, dataAiHint: 'yellow mango'
  },
  { id: 'prod15', slug: 'hybrid-tomato', name: 'Hybrid Tomato (Tamatar)', description: 'Sweet and juicy hybrid tomatoes, perfect for salads.', price: 25, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FF6347/ffffff.png',
    rating: 4.5, reviewsCount: 80, inStock: true, stockCount: 45,
    weightVolume: '500g', origin: 'Local Farms', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'red tomatoes'
  },
  { id: 'prod16', slug: 'pomegranate', name: 'Pomegranate', description: 'Fresh pomegranate with antioxidant-rich seeds.', price: 3.99, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/D22B2B/ffffff.png',
    rating: 4.6, reviewsCount: 90, inStock: true, stockCount: 25,
    weightVolume: 'Approx. 300g per piece', origin: 'Maharashtra, India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'red pomegranate'
  },
  { id: 'prod17', slug: 'potatoes', name: 'Potato (Aloo)', description: 'Versatile potatoes, ideal for mashing, baking, or frying.', price: 29, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/D2B48C/000000.png',
    rating: 4.3, reviewsCount: 110, inStock: true, stockCount: 70,
    weightVolume: '1kg', origin: 'Local Farms', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['VEGGIE10'], createdAt: nowISO, dataAiHint: 'brown potatoes'
  },
  { id: 'prod18', slug: 'strawberries-fresh', name: 'Strawberries (Fresh)', description: 'Sweet, ripe, and fresh strawberries.', price: 4.50, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/FF69B4/ffffff.png',
    rating: 4.8, reviewsCount: 100, inStock: true, stockCount: 30,
    weightVolume: '200g punnet', origin: 'Mahabaleshwar, India', deliveryInfo: 'Seasonal, delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'red strawberries'
  },
  { id: 'prod19', slug: 'cucumber', name: 'English Cucumber (Kheera)', description: 'Cool and crisp cucumber, great for salads and hydration.', price: 33, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.4, reviewsCount: 60, inStock: true, stockCount: 55,
    weightVolume: 'Approx. 250g per piece', origin: 'Local Farms', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'green cucumber'
  },
  { id: 'prod20', slug: 'eggs-dozen', name: 'Eggs (Dozen)', description: 'Farm fresh brown eggs.', price: 3.50, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/F5DEB3/000000.png',
    rating: 4.7, reviewsCount: 180, inStock: true, stockCount: 50,
    weightVolume: 'Pack of 12', origin: 'Local Poultry Farm', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['EGGSAVE'], createdAt: nowISO, dataAiHint: 'eggs carton'
  },
  { id: 'prod21', slug: 'cereal-flakes', name: 'Cereal Flakes', description: 'Healthy corn cereal flakes for breakfast.', price: 4.20, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFDAB9/000000.png',
    rating: 4.5, reviewsCount: 90, inStock: true, stockCount: 60,
    weightVolume: '500g box', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'cereal box'
  },
  { id: 'prod22', slug: 'orange-juice', name: 'Orange Juice (1L)', description: 'Freshly squeezed orange juice.', price: 3.00, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFEBCD/000000.png',
    rating: 4.6, reviewsCount: 110, inStock: true, stockCount: 70,
    weightVolume: '1 Liter Tetra Pak', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['JUICEUP'], createdAt: nowISO, dataAiHint: 'juice carton'
  },
  { id: 'prod23', slug: 'chocolate-cookies', name: 'Chocolate Cookies', description: 'Delicious chocolate chip cookies.', price: 2.80, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/8B4513/ffffff.png',
    rating: 4.8, reviewsCount: 130, inStock: true, stockCount: 80,
    weightVolume: '200g pack', origin: 'Local Bakery', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'cookies pack'
  },
  { id: 'prod24', slug: 'croissants', name: 'Croissants (Pack of 4)', description: 'Buttery and flaky croissants.', price: 3.99, category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/F0E68C/000000.png',
    rating: 4.9, reviewsCount: 100, inStock: true, stockCount: 40,
    weightVolume: 'Pack of 4', origin: 'Local Bakery', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['BAKERYFRESH'], createdAt: nowISO, dataAiHint: 'bakery croissants'
  },
  { id: 'prod25', slug: 'green-tea', name: 'Green Tea Bags (25 count)', description: 'Refreshing green tea bags.', price: 2.50, category: 'cat7',
    imageUrl: 'https://placehold.co/600x450/98FB98/000000.png',
    rating: 4.7, reviewsCount: 85, inStock: true, stockCount: 55,
    weightVolume: '25 tea bags box', origin: 'Assam, India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'tea box'
  },
  { id: 'prod26', slug: 'basmati-rice', name: 'Basmati Rice (1kg)', description: 'Premium long-grain basmati rice.', price: 5.50, category: 'cat8',
    imageUrl: 'https://placehold.co/600x450/FAF0E6/000000.png',
    rating: 4.9, reviewsCount: 150, inStock: true, stockCount: 65,
    weightVolume: '1kg bag', origin: 'Punjab, India', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['RICE10'], createdAt: nowISO, dataAiHint: 'rice bag'
  },
  { id: 'prod27', slug: 'olive-oil', name: 'Olive Oil (500ml)', description: 'Extra virgin olive oil.', price: 7.00, category: 'cat9',
    imageUrl: 'https://placehold.co/600x450/BDB76B/000000.png',
    rating: 4.8, reviewsCount: 120, inStock: true, stockCount: 30,
    weightVolume: '500ml Bottle', origin: 'Spain', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'oil bottle'
  },
  { id: 'prod28', slug: 'dark-chocolate', name: 'Dark Chocolate Bar', description: 'Rich 70% cocoa dark chocolate.', price: 3.20, category: 'cat10',
    imageUrl: 'https://placehold.co/600x450/5C3317/ffffff.png',
    rating: 4.9, reviewsCount: 200, inStock: true, stockCount: 90,
    weightVolume: '100g bar', origin: 'Belgium', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['CHOCOLATE5'], createdAt: nowISO, dataAiHint: 'chocolate bar'
  },
  { id: 'prod29', slug: 'strawberry-jam', name: 'Strawberry Jam', description: 'Sweet strawberry jam/preserve.', price: 2.75, category: 'cat11',
    imageUrl: 'https://placehold.co/600x450/FFB6C1/000000.png',
    rating: 4.6, reviewsCount: 70, inStock: true, stockCount: 40,
    weightVolume: '350g jar', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'jam jar'
  },
  { id: 'prod30', slug: 'chicken-breast', name: 'Chicken Breast (500g)', description: 'Fresh boneless chicken breast.', price: 6.00, category: 'cat12',
    imageUrl: 'https://placehold.co/600x450/FFE4E1/000000.png',
    rating: 4.7, reviewsCount: 95, inStock: true, stockCount: 25,
    weightVolume: '500g pack', origin: 'Local Farm', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['MEATDEAL'], createdAt: nowISO, dataAiHint: 'raw chicken'
  },
  { id: 'prod31', slug: 'organic-quinoa', name: 'Organic Quinoa (500g)', description: 'Healthy organic quinoa grains.', price: 4.50, category: 'cat13',
    imageUrl: 'https://placehold.co/600x450/F0E68C/000000.png',
    rating: 4.8, reviewsCount: 60, inStock: true, stockCount: 35,
    weightVolume: '500g pack', origin: 'Peru', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['ORGANIC10'], createdAt: nowISO, dataAiHint: 'quinoa pack'
  },
  { id: 'prod32', slug: 'baby-wipes', name: 'Mee Mee Aloe Vera Baby Wipes (3×72)', description: 'Gentle baby wipes for sensitive skin.', price: 205, category: 'cat14',
    imageUrl: 'https://placehold.co/600x450/E0FFFF/000000.png',
    rating: 4.9, reviewsCount: 110, inStock: true, stockCount: 70,
    weightVolume: '3 packs of 72 wipes each', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'wipes pack'
  },
  { id: 'prod33', slug: 'vitamin-c-tablets', name: 'Vitamin C Tablets', description: 'Immune boosting Vitamin C supplements.', price: 8.50, category: 'cat15',
    imageUrl: 'https://placehold.co/600x450/FFE4B5/000000.png',
    rating: 4.7, reviewsCount: 50, inStock: true, stockCount: 80,
    weightVolume: '60 tablets bottle', origin: 'India', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['WELLNESS10'], createdAt: nowISO, dataAiHint: 'vitamin bottle'
  },
  { id: 'prod34', slug: 'laundry-detergent', name: 'Surf Excel Easy Wash Detergent Powder (1 kg)', description: 'Powerful laundry detergent.', price: 144, category: 'cat16',
    imageUrl: 'https://placehold.co/600x450/ADD8E6/000000.png',
    rating: 4.6, reviewsCount: 90, inStock: false, stockCount: 0,
    weightVolume: '1kg pack', origin: 'India', deliveryInfo: 'Check availability', promoCodes: ['CLEAN15'], createdAt: nowISO, dataAiHint: 'detergent bottle'
  },
  { id: 'prod35', slug: 'notebooks-set', name: 'Notebooks (Set of 3)', description: 'Spiral bound notebooks for office/study.', price: 4.00, category: 'cat17',
    imageUrl: 'https://placehold.co/600x450/D3D3D3/000000.png',
    rating: 4.5, reviewsCount: 40, inStock: true, stockCount: 100,
    weightVolume: 'Set of 3 notebooks', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'office notebooks'
  },
  { id: 'prod36', slug: 'shampoo-herbal', name: 'Shampoo (Herbal)', description: 'Nourishing herbal shampoo.', price: 5.20, category: 'cat18',
    imageUrl: 'https://placehold.co/600x450/C1FFC1/000000.png',
    rating: 4.7, reviewsCount: 120, inStock: true, stockCount: 60,
    weightVolume: '200ml bottle', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'shampoo bottle'
  },
  { id: 'prod37', slug: 'dog-food-dry', name: 'Drools Adult Dog Wet Food (150 g)', description: 'Nutritious dog food.', price: 40, category: 'cat19',
    imageUrl: 'https://placehold.co/600x450/FFE4C4/000000.png',
    rating: 4.8, reviewsCount: 75, inStock: true, stockCount: 45,
    weightVolume: '150g pouch', origin: 'India', deliveryInfo: 'Delivers in 20-25 mins', promoCodes: ['PETLOVE'], createdAt: nowISO, dataAiHint: 'dog food'
  },
  { id: 'prod38', slug: 'sweet-paan', name: 'Sweet Paan (Single)', description: 'Traditional sweet betel leaf preparation.', price: 1.00, category: 'cat20',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.9, reviewsCount: 200, inStock: true, stockCount: 150,
    weightVolume: 'Single piece', origin: 'Local Paan Shop', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'sweet paan'
  },
  { id: 'prod39', slug: 'kelloggs-corn-flakes-500g', name: 'Kellogg’s Original Corn Flakes Cereal - 500g Box', description: 'Classic crispy corn flakes, a popular breakfast choice.', price: 4.50, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFD700/000000.png',
    rating: 4.6, reviewsCount: 150, inStock: true, stockCount: 70,
    weightVolume: '500g box', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: ['BREAKFASTDEAL'], createdAt: nowISO, dataAiHint: 'corn flakes'
  },
  { id: 'prod40', slug: 'maggi-masala-noodles-70g', name: 'Nestlé Maggi 2-Minute Instant Masala Noodles - 70g Pack', description: 'Quick and tasty Maggi masala noodles, ready in 2 minutes.', price: 0.50, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/FFFF00/000000.png',
    rating: 4.8, reviewsCount: 300, inStock: true, stockCount: 100,
    weightVolume: '70g pack', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'instant noodles'
  },
  { id: 'prod41', slug: 'quaker-instant-oats-500g', name: 'Quaker Instant Oats – Nutritious Breakfast Porridge – 500g', description: 'Healthy and quick-cooking Quaker instant oats for a nutritious start.', price: 3.80, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/DEB887/000000.png',
    rating: 4.7, reviewsCount: 120, inStock: true, stockCount: 60,
    weightVolume: '500g pack', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'instant oats'
  },
  { id: 'prod42', slug: 'mtr-upma-instant-mix-200g', name: 'MTR Upma Instant Mix – South Indian Style – 200g Pouch', description: 'Authentic South Indian style Upma, ready in minutes with MTR instant mix.', price: 1.50, category: 'cat3',
    imageUrl: 'https://placehold.co/600x450/F5F5DC/000000.png',
    rating: 4.5, reviewsCount: 90, inStock: true, stockCount: 50,
    weightVolume: '200g pouch', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'upma mix'
  },
  { id: 'prod43', slug: 'safal-frozen-green-peas-500g', name: 'Safal Frozen Green Peas – Vacuum Packed – 500g', description: 'Freshly frozen green peas, vacuum packed to retain freshness.', price: 1.20, category: 'cat2',
    imageUrl: 'https://placehold.co/600x450/90EE90/000000.png',
    rating: 4.6, reviewsCount: 110, inStock: true, stockCount: 80,
    weightVolume: '500g pack', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: ['VEGGIE10'], createdAt: nowISO, dataAiHint: 'frozen peas'
  },
  { id: 'prod44', slug: 'mccain-frozen-french-fries-500g', name: 'McCain Air-Fryer French Fries (360 g)', description: 'Classic McCain french fries, ready to fry for a crispy snack.', price: 128, category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFEFD5/000000.png',
    rating: 4.7, reviewsCount: 180, inStock: true, stockCount: 90,
    weightVolume: '360g pack', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['FRIESLOVE'], createdAt: nowISO, dataAiHint: 'french fries'
  },
  { id: 'prod45', slug: 'coca-cola-750ml', name: 'Coca-Cola (750 ml)', description: 'Classic Coca-Cola soft drink.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C00000/ffffff.png',
    rating: 4.8, reviewsCount: 500, inStock: true, stockCount: 150,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['COKEZERO'], createdAt: nowISO, dataAiHint: 'cola soda'
  },
  { id: 'prod46', slug: 'pepsi-750ml', name: 'Pepsi (750ml)', description: 'Refreshing Pepsi cola soft drink.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/0047AB/ffffff.png',
    rating: 4.7, reviewsCount: 450, inStock: true, stockCount: 140,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'pepsi soda'
  },
  { id: 'prod47', slug: 'sprite-lime-750ml', name: 'Sprite Lime (750 ml)', description: 'Crisp lemon-lime flavored Sprite.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/00A86B/ffffff.png',
    rating: 4.6, reviewsCount: 400, inStock: true, stockCount: 130,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'sprite soda'
  },
  { id: 'prod48', slug: 'fanta-orange-750ml', name: 'Fanta Orange (750ml)', description: 'Bubbly orange flavored Fanta.', price: 43, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FF8C00/ffffff.png',
    rating: 4.5, reviewsCount: 380, inStock: true, stockCount: 120,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'fanta orange'
  },
  { id: 'prod49', slug: 'thums-up-2-25l', name: 'Thums Up (2.25L)', description: 'Strong and fizzy Thums Up cola, 2.25L pack.', price: 100, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/36454F/ffffff.png',
    rating: 4.7, reviewsCount: 420, inStock: true, stockCount: 100,
    weightVolume: '2.25 Liter bottle', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['THUNDER'], createdAt: nowISO, dataAiHint: 'thumsup cola large'
  },
  { id: 'prod50', slug: 'real-fruit-power-cranberry-1l', name: 'Real Fruit Power Cranberry (1L)', description: 'Refreshing cranberry fruit juice from Real Fruit Power.', price: 119, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/DC143C/ffffff.png',
    rating: 4.6, reviewsCount: 180, inStock: true, stockCount: 80,
    weightVolume: '1 Liter Tetra Pak', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'cranberry juice'
  },
  { id: 'prod51', slug: 'tropicana-juice', name: 'Tropicana', description: 'Delicious Tropicana orange juice.', price: 2.50, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFA500/ffffff.png',
    rating: 4.7, reviewsCount: 350, inStock: true, stockCount: 70,
    weightVolume: '1 Liter Tetra Pak', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['JUICEUP'], createdAt: nowISO, dataAiHint: 'orange juice'
  },
  {
    id: 'prod52',
    slug: 'britannia-whole-wheat-bread',
    name: 'Zero Maida Whole-Wheat Bread',
    description: 'Healthy and delicious whole wheat bread from Britannia.',
    price: 52,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/D2B48C/000000.png',
    rating: 4.5, reviewsCount: 110, inStock: true, stockCount: 50,
    weightVolume: '400g pack', origin: 'Local Bakery', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'wheat bread'
  },
  {
    id: 'prod53',
    slug: 'modern-bread-white',
    name: 'English Oven Premium White Bread (350 g)',
    description: 'Soft and classic white bread from Modern.',
    price: 30,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/FEFDFB/000000.png',
    rating: 4.3, reviewsCount: 95, inStock: true, stockCount: 60,
    weightVolume: '350g pack', origin: 'Local Bakery', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'white bread'
  },
  {
    id: 'prod54',
    slug: 'eggs-farm-fresh-multi',
    name: 'Eggs (Farm Fresh)',
    description: 'A pack of farm fresh, high-quality eggs.',
    price: 2.50,
    category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/FDF5E6/000000.png',
    rating: 4.8, reviewsCount: 210, inStock: true, stockCount: 70,
    weightVolume: 'Pack of 6', origin: 'Local Poultry Farm', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['EGGSAVE'], createdAt: nowISO, dataAiHint: 'fresh eggs'
  },
  {
    id: 'prod55',
    slug: 'lays-classic-salted',
    name: 'Lay\'s Classic Salted',
    description: 'Classic, crispy, and perfectly salted potato chips from Lay\'s.',
    price: 1.00,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFDB58/000000.png',
    rating: 4.7, reviewsCount: 350, inStock: true, stockCount: 120,
    weightVolume: '52g pack', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['CHIPSDEAL'], createdAt: nowISO, dataAiHint: 'lays chips'
  },
  {
    id: 'prod56',
    slug: 'kurkure-masala-munch',
    name: 'Kurkure Masala Munch',
    description: 'Spicy and crunchy corn puffs with a tangy masala flavor.',
    price: 0.75,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFA500/000000.png',
    rating: 4.6, reviewsCount: 280, inStock: true, stockCount: 100,
    weightVolume: '45g pack', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'kurkure snack'
  },
  {
    id: 'prod57',
    slug: 'haldirams-aloo-bhujia',
    name: 'Haldiram\'s Aloo Bhujia',
    description: 'Crispy and spicy potato noodle snack from Haldiram\'s.',
    price: 1.50,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/F4A460/000000.png',
    rating: 4.8, reviewsCount: 220, inStock: true, stockCount: 80,
    weightVolume: '200g pack', origin: 'India', deliveryInfo: 'Delivers in 15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'aloo bhujia'
  },
  {
    id: 'prod58',
    slug: 'act-ii-butter-popcorn',
    name: 'Act II Butter Popcorn',
    description: 'Classic microwave butter popcorn, ready in minutes.',
    price: 2.00,
    category: 'cat5',
    imageUrl: 'https://placehold.co/600x450/FFFACD/000000.png',
    rating: 4.5, reviewsCount: 150, inStock: true, stockCount: 90,
    weightVolume: '70g pack', origin: 'India', deliveryInfo: 'Delivers in 10-15 mins', promoCodes: ['POPCORNFUN'], createdAt: nowISO, dataAiHint: 'butter popcorn'
  },
  {
    id: 'prod59',
    slug: 'parle-g-biscuits',
    name: 'Parle-G Biscuits',
    description: 'India\'s favorite glucose biscuits, perfect with tea or coffee.',
    price: 0.50,
    category: 'cat6',
    imageUrl: 'https://placehold.co/600x450/FFDEAD/000000.png',
    rating: 4.9, reviewsCount: 500, inStock: true, stockCount: 200,
    weightVolume: '70g pack', origin: 'India', deliveryInfo: 'Delivers in 10 mins', promoCodes: ['PARLEGSAVE'], createdAt: nowISO, dataAiHint: 'parle g'
  },
  {
    id: 'prod60', slug: 'amul-taaza-toned-milk-500ml', name: 'Amul Taaza Toned Milk (500ml)',
    description: 'Fresh Amul Taaza toned milk, 500ml pack.', price: 29, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E0E8F0/000000.png', rating: 4.6, reviewsCount: 80, inStock: true, stockCount: 50,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'toned milk'
  },
  {
    id: 'prod61', slug: 'amul-gold-full-cream-milk-500ml', name: 'Amul Gold Full Cream Milk (500ml)',
    description: 'Rich Amul Gold full cream milk, 500ml pack.', price: 35, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E1E9F1/000000.png', rating: 4.7, reviewsCount: 90, inStock: true, stockCount: 40,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: ['AMULGOLD'], createdAt: nowISO, dataAiHint: 'full cream milk'
  },
  {
    id: 'prod62', slug: 'mother-dairy-toned-milk-500ml', name: 'Mother Dairy Toned Milk (500ml)',
    description: 'Mother Dairy toned milk, 500ml pack.', price: 29, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E2EAF2/000000.png', rating: 4.5, reviewsCount: 75, inStock: true, stockCount: 55,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'toned milk motherdairy'
  },
  {
    id: 'prod63', slug: 'amul-cow-milk-500ml', name: 'Amul Cow Milk (500ml)',
    description: 'Fresh Amul cow milk, 500ml pack.', price: 30, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E3EBF3/000000.png', rating: 4.6, reviewsCount: 85, inStock: true, stockCount: 45,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'cow milk'
  },
  {
    id: 'prod64', slug: 'mother-dairy-cow-milk-500ml', name: 'Mother Dairy Cow Milk (500ml)',
    description: 'Fresh Mother Dairy cow milk, 500ml pack.', price: 30, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E4ECF4/000000.png', rating: 4.6, reviewsCount: 82, inStock: true, stockCount: 48,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'cow milk motherdairy'
  },
  {
    id: 'prod65', slug: 'amul-taaza-homogenized-toned-milk-1l', name: 'Amul Taaza Homogenized Toned Milk (1L)',
    description: 'Amul Taaza homogenized toned milk, 1 liter pack.', price: 71, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E5EDF5/000000.png', rating: 4.7, reviewsCount: 100, inStock: true, stockCount: 30,
    weightVolume: '1 Liter', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: ['AMULTAAZA1L'], createdAt: nowISO, dataAiHint: 'toned milk liter'
  },
  {
    id: 'prod66', slug: 'amul-buffalo-a2-milk-500ml', name: 'Amul Buffalo A2 Milk (500ml)',
    description: 'Nutritious Amul Buffalo A2 milk, 500ml pack.', price: 38, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E6EEF6/000000.png', rating: 4.8, reviewsCount: 70, inStock: true, stockCount: 25,
    weightVolume: '500ml', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'buffalo milk a2'
  },
  {
    id: 'prod67', slug: 'amul-lactose-free-milk-250ml', name: 'Amul Lactose-Free Milk (250ml)',
    description: 'Amul lactose-free milk, convenient 250ml pack.', price: 25, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E7EFF7/000000.png', rating: 4.5, reviewsCount: 60, inStock: true, stockCount: 35,
    weightVolume: '250ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'lactose free milk'
  },
  {
    id: 'prod68', slug: 'mother-dairy-fit-life-double-toned-450ml', name: 'Mother Dairy FIT-Life Double Toned (450ml)',
    description: 'Mother Dairy FIT-Life double toned milk, 450ml pack.', price: 33, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E8F0F8/000000.png', rating: 4.4, reviewsCount: 50, inStock: true, stockCount: 40,
    weightVolume: '450ml', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'double toned milk'
  },
  {
    id: 'prod69', slug: 'amul-slim-trim-skimmed-milk-1l', name: 'Amul Slim ’n’ Trim Skimmed Milk (1L)',
    description: 'Amul Slim ’n’ Trim skimmed milk, 1 liter pack for the health-conscious.', price: 80, category: 'cat1',
    imageUrl: 'https://placehold.co/600x450/E9F1F9/000000.png', rating: 4.6, reviewsCount: 95, inStock: true, stockCount: 28,
    weightVolume: '1 Liter', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: ['SLIMTRIM'], createdAt: nowISO, dataAiHint: 'skimmed milk liter'
  },
  {
    id: 'prod70', slug: 'coca-cola-300ml-can', name: 'Coca-Cola (300ml can)',
    description: 'Classic Coca-Cola in a convenient 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C10000/ffffff.png', rating: 4.8, reviewsCount: 180, inStock: true, stockCount: 100,
    weightVolume: '300ml can', origin: 'India', deliveryInfo: '10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'coca cola can'
  },
  {
    id: 'prod71', slug: 'coca-cola-2-25l-party-pack', name: 'Coca-Cola (2.25L Party Pack)',
    description: 'Large 2.25L party pack of Coca-Cola.', price: 97, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C20000/ffffff.png', rating: 4.7, reviewsCount: 150, inStock: true, stockCount: 80,
    weightVolume: '2.25 Liter bottle', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: ['PARTYPACK'], createdAt: nowISO, dataAiHint: 'coca cola large'
  },
  {
    id: 'prod72', slug: 'thums-up-750ml-x-2', name: 'Thums Up (750ml x 2)',
    description: 'Pack of two 750ml Thums Up bottles.', price: 85, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/404D57/ffffff.png', rating: 4.6, reviewsCount: 100, inStock: true, stockCount: 60,
    weightVolume: '2 x 750ml bottles', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'thumsup multipack'
  },
  {
    id: 'prod73', slug: 'mountain-dew-750ml', name: 'Mountain Dew (750ml)',
    description: 'Refreshing Mountain Dew, 750ml bottle.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/3EB489/000000.png', rating: 4.5, reviewsCount: 120, inStock: true, stockCount: 70,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: '10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'mountain dew'
  },
  {
    id: 'prod74', slug: 'coca-cola-zero-300ml-can', name: 'Coca-Cola Zero (300ml can)',
    description: 'Zero sugar Coca-Cola in a 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/2C2C2C/ffffff.png', rating: 4.7, reviewsCount: 140, inStock: true, stockCount: 90,
    weightVolume: '300ml can', origin: 'India', deliveryInfo: '10 mins', promoCodes: ['COKEZERO'], createdAt: nowISO, dataAiHint: 'coke zero'
  },
  {
    id: 'prod75', slug: 'diet-coke-300ml-can', name: 'Diet Coke (300ml can)',
    description: 'Light taste Diet Coke in a 300ml can.', price: 40, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/D3D3D3/000000.png', rating: 4.6, reviewsCount: 130, inStock: true, stockCount: 85,
    weightVolume: '300ml can', origin: 'India', deliveryInfo: '10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'diet coke'
  },
  {
    id: 'prod76', slug: 'appy-fizz-600ml', name: 'Appy Fizz (600ml)',
    description: 'Sparkling apple drink, Appy Fizz 600ml.', price: 36, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/E21329/ffffff.png', rating: 4.7, reviewsCount: 160, inStock: true, stockCount: 95,
    weightVolume: '600ml bottle', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: ['APPYDEAL'], createdAt: nowISO, dataAiHint: 'appy fizz'
  },
  {
    id: 'prod77', slug: 'maaza-mango-600ml', name: 'Maaza Mango (600ml)',
    description: 'Rich and pulpy Maaza Mango drink, 600ml.', price: 42, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FFC300/000000.png', rating: 4.8, reviewsCount: 200, inStock: true, stockCount: 110,
    weightVolume: '600ml bottle', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'maaza mango'
  },
  {
    id: 'prod78', slug: 'b-natural-mixed-fruit-1l', name: 'B Natural Mixed Fruit (1L)',
    description: 'Delicious mixed fruit juice from B Natural, 1L pack.', price: 70, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FF7F50/ffffff.png', rating: 4.5, reviewsCount: 90, inStock: true, stockCount: 60,
    weightVolume: '1 Liter Tetra Pak', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'b natural mixedfruit'
  },
  {
    id: 'prod79', slug: 'b-natural-guava-1l', name: 'B Natural Guava (1L)',
    description: 'Refreshing guava juice from B Natural, 1L pack.', price: 70, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/FED8B1/000000.png', rating: 4.6, reviewsCount: 80, inStock: true, stockCount: 55,
    weightVolume: '1 Liter Tetra Pak', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'b natural guava'
  },
  {
    id: 'prod80', slug: 'paper-boat-pomegranate-600ml', name: 'Paper Boat Pomegranate (600ml)',
    description: 'Authentic pomegranate juice by Paper Boat, 600ml.', price: 45, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/C25A7C/ffffff.png', rating: 4.7, reviewsCount: 110, inStock: true, stockCount: 75,
    weightVolume: '600ml pouch', origin: 'India', deliveryInfo: '10-15 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'paper boat pomegranate'
  },
  {
    id: 'prod81', slug: 'schweppes-ginger-ale-300ml-can', name: 'Schweppes Ginger Ale (300ml can)',
    description: 'Classic Schweppes Ginger Ale in a 300ml can.', price: 60, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/DAA520/ffffff.png', rating: 4.8, reviewsCount: 90, inStock: true, stockCount: 50,
    weightVolume: '300ml can', origin: 'India', deliveryInfo: '10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'schweppes gingerale'
  },
  {
    id: 'prod82', slug: 'schweppes-tonic-water-300ml-can', name: 'Schweppes Tonic Water (300ml can)',
    description: 'Crisp Schweppes Tonic Water in a 300ml can.', price: 60, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/ADD8E6/000000.png', rating: 4.7, reviewsCount: 85, inStock: true, stockCount: 45,
    weightVolume: '300ml can', origin: 'India', deliveryInfo: '10 mins', promoCodes: [], createdAt: nowISO, dataAiHint: 'schweppes tonic'
  },
  {
    id: 'prod83', slug: 'bisleri-club-soda-750ml', name: 'Bisleri Club Soda (750ml)',
    description: 'Classic Bisleri Club Soda, 750ml bottle.', price: 20, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/F0F8FF/000000.png', rating: 4.6, reviewsCount: 150, inStock: true, stockCount: 120,
    weightVolume: '750ml bottle', origin: 'India', deliveryInfo: '10 mins', promoCodes: ['SODAOFFER'], createdAt: nowISO, dataAiHint: 'bisleri soda'
  },
  {
    id: 'prod84', slug: 'bisleri-mineral-water-5l', name: 'Bisleri Mineral Water (5L)',
    description: 'Large 5L jar of Bisleri Mineral Water.', price: 75, category: 'cat4',
    imageUrl: 'https://placehold.co/600x450/B0E0E6/000000.png', rating: 4.9, reviewsCount: 250, inStock: true, stockCount: 90,
    weightVolume: '5 Liter Jar', origin: 'India', deliveryInfo: '15-20 mins', promoCodes: ['WATERDEAL'], createdAt: nowISO, dataAiHint: 'bisleri water large'
  }
];


export const mockUser: UserProfile = {
  id: 'user123',
  name: 'Priya S.',
  email: 'priya@example.com',
  pastPurchases: [mockProducts[3], mockProducts[0]],
  browsingHistory: [mockProducts[1], mockProducts[4]],
  preferences: ['cat1', 'cat2'], // Prefers Dairy/Eggs and Fruits/Vegetables
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
      { productId: 'prod1', name: 'Apples', quantity: 1, price: 2.99, imageUrl: mockProducts.find(p=>p.id==='prod1')?.imageUrl },
      { productId: 'prod4', name: 'Whole Milk (1L)', quantity: 2, price: 1.50, imageUrl: mockProducts.find(p=>p.id==='prod4')?.imageUrl },
    ],
    totalAmount: 5.99,
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
      { productId: 'prod6', name: 'Potato Chips (Salted)', quantity: 3, price: 1.75, imageUrl: mockProducts.find(p=>p.id==='prod6')?.imageUrl },
    ],
    totalAmount: 5.25,
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
      { productId: 'prod2', name: 'Bananas (Ecuador)', quantity: 1, price: 1.99, imageUrl: mockProducts.find(p=>p.id==='prod2')?.imageUrl },
      { productId: 'prod5', name: 'Zero Maida Whole-Wheat Bread', quantity: 1, price: 52, imageUrl: mockProducts.find(p=>p.id==='prod5')?.imageUrl },
    ],
    totalAmount: 53.99,
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
