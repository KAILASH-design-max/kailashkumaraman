
import type { Product, Category, Order, UserProfile, DeliveryPartner } from './types';

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
  // Updated Fresh Produce
  { id: 'prod1', slug: 'apples', name: 'Apples', description: 'Crisp and juicy red apples.', price: 2.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/apple/9-apple-png-image.png', dataAiHint: 'red apples', rating: 4.5, reviewsCount: 120, stock: 50 },
  { id: 'prod2', slug: 'bananas-ecuador', name: 'Bananas (Ecuador)', description: 'Sweet and ripe bananas from Ecuador.', price: 1.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/banana/4-bananas-png-image.png', dataAiHint: 'yellow bananas', rating: 4.7, reviewsCount: 90, stock: 30 },
  { id: 'prod3', slug: 'fresh-carrots-local', name: 'Fresh Carrots (Local)', description: 'Fresh, crunchy local carrots.', price: 0.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/carrot/1-carrot-png-image.png', dataAiHint: 'orange carrots', stock: 100 },
  // Dairy & Bakery (cat1 / cat6)
  { id: 'prod4', slug: 'whole-milk', name: 'Whole Milk (1L)', description: 'Fresh pasteurized whole milk.', price: 1.50, category: 'cat1', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'milk carton', rating: 4.8, reviewsCount: 200, stock: 75 },
  { id: 'prod5', slug: 'sliced-bread', name: 'Sliced Bread (Whole Wheat)', description: 'Soft whole wheat sliced bread.', price: 2.20, category: 'cat6', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'bread loaf', stock: 60 },
  // Snacks & Beverages (cat5 / cat4)
  { id: 'prod6', slug: 'potato-chips', name: 'Potato Chips (Salted)', description: 'Classic salted potato chips.', price: 1.75, category: 'cat5', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'chips bag', rating: 4.2, reviewsCount: 150, stock: 120 },
  { id: 'prod7', slug: 'cola-drink', name: 'Cola Drink (2L)', description: 'Refreshing cola beverage.', price: 2.50, category: 'cat4', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'soda bottle', stock: 80 },
  // Household Items (cat16 / cat17)
  { id: 'prod8', slug: 'dish-soap', name: 'Dish Soap (500ml)', description: 'Effective grease-cutting dish soap.', price: 3.00, category: 'cat16', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'soap bottle', rating: 4.6, reviewsCount: 70, stock: 40 },
  // Personal Care (cat18)
  { id: 'prod9', slug: 'toothpaste', name: 'Toothpaste (Mint)', description: 'Mint flavored toothpaste for fresh breath.', price: 2.10, category: 'cat18', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'toothpaste tube', stock: 90 },
  { id: 'prod10', slug: 'avocado', name: 'Avocado Hass (Single)', description: 'Creamy Hass avocado.', price: 1.20, category: 'cat2', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'green avocado', rating: 4.9, reviewsCount: 250, stock: 0 }, // Out of stock example

  // New Products from the list - assigning to new categories
  { id: 'prod11', slug: 'organic-spinach', name: 'Organic Spinach', description: 'Fresh organic spinach leaves, packed with nutrients.', price: 2.49, category: 'cat2', imageUrl: 'https://img.freepik.com/premium-photo/sorrel-herbs-isolated-white_183352-422.jpg?w=740', dataAiHint: 'green spinach', rating: 4.6, reviewsCount: 55, stock: 40 },
  { id: 'prod12', slug: 'orange', name: 'Orange', description: 'Juicy and sweet oranges, rich in Vitamin C.', price: 0.79, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/orange/4-orange-png-image-download.png', dataAiHint: 'orange fruit', rating: 4.4, reviewsCount: 70, stock: 60 },
  { id: 'prod13', slug: 'broccoli-organic', name: 'Broccoli (Organic)', description: 'Fresh organic broccoli head, great for steaming or roasting.', price: 2.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/broccoli/99291-green-broccoli-hd-image-free.png', dataAiHint: 'green broccoli', rating: 4.7, reviewsCount: 65, stock: 35 },
  { id: 'prod14', slug: 'mangoes-alphonso', name: 'Mangoes (Alphonso)', description: 'Sweet and flavorful Alphonso mangoes, the king of mangoes.', price: 4.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/mango/11-2-mango-png-clipart.png', dataAiHint: 'yellow mango', rating: 4.9, reviewsCount: 150, stock: 20 },
  { id: 'prod15', slug: 'cherry-tomatoes', name: 'Cherry Tomatoes', description: 'Sweet and juicy cherry tomatoes, perfect for salads.', price: 3.29, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/tomato/1-tomato-png-image.png', dataAiHint: 'red tomatoes', rating: 4.5, reviewsCount: 80, stock: 45 },
  { id: 'prod16', slug: 'pomegranate', name: 'Pomegranate', description: 'Fresh pomegranate with antioxidant-rich seeds.', price: 3.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/pomegranate/5-pomegranate-png-image.png', dataAiHint: 'red pomegranate', rating: 4.6, reviewsCount: 90, stock: 25 },
  { id: 'prod17', slug: 'potatoes', name: 'Potatoes', description: 'Versatile potatoes, ideal for mashing, baking, or frying.', price: 1.49, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/potato/11-2-potato-transparent.png', dataAiHint: 'brown potatoes', rating: 4.3, reviewsCount: 110, stock: 70 },
  { id: 'prod18', slug: 'strawberries-fresh', name: 'Strawberries (Fresh)', description: 'Sweet, ripe, and fresh strawberries.', price: 4.50, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/strawberry/23343-7-strawberry-image.png', dataAiHint: 'red strawberries', rating: 4.8, reviewsCount: 100, stock: 30 },
  { id: 'prod19', slug: 'cucumber', name: 'Cucumber', description: 'Cool and crisp cucumber, great for salads and hydration.', price: 0.99, category: 'cat2', imageUrl: 'https://freepngimg.com/thumb/cucumber/20-cucumbers-png-image.png', dataAiHint: 'green cucumber', rating: 4.4, reviewsCount: 60, stock: 55 },
  
  // Assigning remaining mock products to relevant new categories
  { id: 'prod20', slug: 'eggs-dozen', name: 'Eggs (Dozen)', description: 'Farm fresh brown eggs.', price: 3.50, category: 'cat1', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'eggs carton', rating: 4.7, reviewsCount: 180, stock: 50 },
  { id: 'prod21', slug: 'cereal-flakes', name: 'Cereal Flakes', description: 'Healthy corn cereal flakes for breakfast.', price: 4.20, category: 'cat3', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'cereal box', rating: 4.5, reviewsCount: 90, stock: 60 },
  { id: 'prod22', slug: 'orange-juice', name: 'Orange Juice (1L)', description: 'Freshly squeezed orange juice.', price: 3.00, category: 'cat4', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'juice carton', rating: 4.6, reviewsCount: 110, stock: 70 },
  { id: 'prod23', slug: 'chocolate-cookies', name: 'Chocolate Cookies', description: 'Delicious chocolate chip cookies.', price: 2.80, category: 'cat5', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'cookies pack', rating: 4.8, reviewsCount: 130, stock: 80 },
  { id: 'prod24', slug: 'croissants', name: 'Croissants (Pack of 4)', description: 'Buttery and flaky croissants.', price: 3.99, category: 'cat6', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'bakery croissants', rating: 4.9, reviewsCount: 100, stock: 40 },
  { id: 'prod25', slug: 'green-tea', name: 'Green Tea Bags (25 count)', description: 'Refreshing green tea bags.', price: 2.50, category: 'cat7', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'tea box', rating: 4.7, reviewsCount: 85, stock: 55 },
  { id: 'prod26', slug: 'basmati-rice', name: 'Basmati Rice (1kg)', description: 'Premium long-grain basmati rice.', price: 5.50, category: 'cat8', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'rice bag', rating: 4.9, reviewsCount: 150, stock: 65 },
  { id: 'prod27', slug: 'olive-oil', name: 'Olive Oil (500ml)', description: 'Extra virgin olive oil.', price: 7.00, category: 'cat9', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'oil bottle', rating: 4.8, reviewsCount: 120, stock: 30 },
  { id: 'prod28', slug: 'dark-chocolate', name: 'Dark Chocolate Bar', description: 'Rich 70% cocoa dark chocolate.', price: 3.20, category: 'cat10', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'chocolate bar', rating: 4.9, reviewsCount: 200, stock: 90 },
  { id: 'prod29', slug: 'strawberry-jam', name: 'Strawberry Jam', description: 'Sweet strawberry jam/preserve.', price: 2.75, category: 'cat11', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'jam jar', rating: 4.6, reviewsCount: 70, stock: 40 },
  { id: 'prod30', slug: 'chicken-breast', name: 'Chicken Breast (500g)', description: 'Fresh boneless chicken breast.', price: 6.00, category: 'cat12', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'raw chicken', rating: 4.7, reviewsCount: 95, stock: 25 },
  { id: 'prod31', slug: 'organic-quinoa', name: 'Organic Quinoa (500g)', description: 'Healthy organic quinoa grains.', price: 4.50, category: 'cat13', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'quinoa pack', rating: 4.8, reviewsCount: 60, stock: 35 },
  { id: 'prod32', slug: 'baby-wipes', name: 'Baby Wipes (Sensitive)', description: 'Gentle baby wipes for sensitive skin.', price: 3.00, category: 'cat14', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'wipes pack', rating: 4.9, reviewsCount: 110, stock: 70 },
  { id: 'prod33', slug: 'vitamin-c-tablets', name: 'Vitamin C Tablets', description: 'Immune boosting Vitamin C supplements.', price: 8.50, category: 'cat15', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'vitamin bottle', rating: 4.7, reviewsCount: 50, stock: 80 },
  { id: 'prod34', slug: 'laundry-detergent', name: 'Laundry Detergent (1L)', description: 'Powerful laundry detergent.', price: 6.50, category: 'cat16', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'detergent bottle', rating: 4.6, reviewsCount: 90, stock: 0 }, // Out of stock example
  { id: 'prod35', slug: 'notebooks-set', name: 'Notebooks (Set of 3)', description: 'Spiral bound notebooks for office/study.', price: 4.00, category: 'cat17', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'office notebooks', rating: 4.5, reviewsCount: 40, stock: 100 },
  { id: 'prod36', slug: 'shampoo-herbal', name: 'Shampoo (Herbal)', description: 'Nourishing herbal shampoo.', price: 5.20, category: 'cat18', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'shampoo bottle', rating: 4.7, reviewsCount: 120, stock: 60 },
  { id: 'prod37', slug: 'dog-food-dry', name: 'Dog Food (Dry, 1kg)', description: 'Nutritious dry dog food.', price: 9.00, category: 'cat19', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'dog food', rating: 4.8, reviewsCount: 75, stock: 45 },
  { id: 'prod38', slug: 'sweet-paan', name: 'Sweet Paan (Single)', description: 'Traditional sweet betel leaf preparation.', price: 1.00, category: 'cat20', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'sweet paan', rating: 4.9, reviewsCount: 200, stock: 150 },
  {
    id: 'prod39',
    slug: 'kelloggs-corn-flakes-500g',
    name: 'Kellogg’s Original Corn Flakes Cereal - 500g Box',
    description: 'Classic crispy corn flakes, a popular breakfast choice.',
    price: 4.50,
    category: 'cat3', 
    imageUrl: 'https://banner2.cleanpng.com/20180706/sak/kisspng-corn-flakes-breakfast-cereal-frosted-flakes-crunch-5b3ee9533ec330.6440127315308496192571.jpg',
    dataAiHint: 'corn flakes',
    rating: 4.6,
    reviewsCount: 150,
    stock: 70
  },
  {
    id: 'prod40',
    slug: 'maggi-masala-noodles-70g',
    name: 'Nestlé Maggi 2-Minute Instant Masala Noodles - 70g Pack',
    description: 'Quick and tasty Maggi masala noodles, ready in 2 minutes.',
    price: 0.50,
    category: 'cat3', 
    imageUrl: 'https://banner2.cleanpng.com/20180802/iwj/7fe24f455f6efc4d7846117d09657c45.webp',
    dataAiHint: 'instant noodles',
    rating: 4.8,
    reviewsCount: 300,
    stock: 100
  },
  {
    id: 'prod41',
    slug: 'quaker-instant-oats-500g',
    name: 'Quaker Instant Oats – Nutritious Breakfast Porridge – 500g',
    description: 'Healthy and quick-cooking Quaker instant oats for a nutritious start.',
    price: 3.80,
    category: 'cat3', 
    imageUrl: 'https://banner2.cleanpng.com/20180625/sgq/kisspng-breakfast-cereal-quaker-instant-oatmeal-quaker-oat-avena-5b31657d390cb6.5793488015299639012337.jpg',
    dataAiHint: 'instant oats',
    rating: 4.7,
    reviewsCount: 120,
    stock: 60
  },
  {
    id: 'prod42',
    slug: 'mtr-upma-instant-mix-200g',
    name: 'MTR Upma Instant Mix – South Indian Style – 200g Pouch',
    description: 'Authentic South Indian style Upma, ready in minutes with MTR instant mix.',
    price: 1.50,
    category: 'cat3', 
    imageUrl: 'https://shop.mtrfoods.com/cdn/shop/products/Upma-170g-front_1024x1024@2x.png?v=1611241717',
    dataAiHint: 'upma mix',
    rating: 4.5,
    reviewsCount: 90,
    stock: 50
  },
  {
    id: 'prod43',
    slug: 'safal-frozen-green-peas-500g',
    name: 'Safal Frozen Green Peas – Vacuum Packed – 500g',
    description: 'Freshly frozen green peas, vacuum packed to retain freshness.',
    price: 1.20,
    category: 'cat2',
    imageUrl: 'https://banner2.cleanpng.com/20180528/fai/kisspng-green-peas-vegetable-freezing-frozen-food-5b0c99d42ac8b1.7766075115275295566396.jpg',
    dataAiHint: 'frozen peas',
    rating: 4.6,
    reviewsCount: 110,
    stock: 80
  },
  {
    id: 'prod44',
    slug: 'mccain-frozen-french-fries-500g',
    name: 'McCain Frozen French Fries – Crispy Potato Snack – 500g Pack',
    description: 'Classic McCain french fries, ready to fry for a crispy snack.',
    price: 2.50,
    category: 'cat5', 
    imageUrl: 'https://banner2.cleanpng.com/20180319/gwe/kisspng-french-fries-potato-frying-deep-frying-frozen-fren-potato-fries-5ab031d21d4000.2829797615214953788307.jpg',
    dataAiHint: 'french fries',
    rating: 4.7,
    reviewsCount: 180,
    stock: 90
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
      { productId: 'prod1', name: 'Apples', quantity: 1, price: 2.99 }, 
      { productId: 'prod4', name: 'Whole Milk (1L)', quantity: 2, price: 1.50 },
    ],
    totalAmount: 5.99, 
    status: 'Delivered',
    deliveryAddress: { street: '123 Main St', city: 'Mumbai', postalCode: '400001', country: 'India' },
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    estimatedDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    deliveryPartnerId: 'dp1',
  },
  {
    id: 'order002',
    userId: 'user123',
    items: [
      { productId: 'prod6', name: 'Potato Chips (Salted)', quantity: 3, price: 1.75 },
    ],
    totalAmount: 5.25,
    status: 'Out for Delivery',
    deliveryAddress: { street: '456 Oak Ave', city: 'Delhi', postalCode: '110001', country: 'India' },
    orderDate: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 8 * 60 * 1000).toISOString(), // Arriving in 8 minutes
    deliveryPartnerId: 'dp2',
  },
   {
    id: 'order003',
    userId: 'user123',
    items: [
      { productId: 'prod2', name: 'Bananas (Ecuador)', quantity: 1, price: 1.99 }, 
      { productId: 'prod5', name: 'Sliced Bread (Whole Wheat)', quantity: 1, price: 2.20 },
    ],
    totalAmount: 4.19, 
    status: 'Confirmed',
    deliveryAddress: { street: '789 Pine Ln', city: 'Bangalore', postalCode: '560001', country: 'India' },
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Ordered 10 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Approx 15 mins
  }
];


    