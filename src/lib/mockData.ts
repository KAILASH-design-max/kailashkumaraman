
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
  { id: 'prod1', slug: 'apples', name: 'Apples', description: 'Crisp and juicy red apples, perfect for snacking or baking.', price: 2.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/E74C3C/ffffff.png', dataAiHint: 'apple pack front' },
        { url: 'https://placehold.co/600x450/C0392B/ffffff.png', dataAiHint: 'apple pack side' },
        { url: 'https://placehold.co/600x450/E67E22/ffffff.png', dataAiHint: 'apples fruit bowl' },
        { url: 'https://placehold.co/600x450/D35400/ffffff.png', dataAiHint: 'apple closeup' }
    ],
    dataAiHint: 'red apples', rating: 4.5, reviewsCount: 120, stock: 50 },
  { id: 'prod2', slug: 'bananas-ecuador', name: 'Bananas (Ecuador)', description: 'Sweet and ripe bananas from Ecuador.', price: 1.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F1C40F/000000.png', dataAiHint: 'bananas pack front' },
        { url: 'https://placehold.co/600x450/F39C12/000000.png', dataAiHint: 'bananas pack side' },
        { url: 'https://placehold.co/600x450/E67E22/000000.png', dataAiHint: 'bananas fruit bowl' },
        { url: 'https://placehold.co/600x450/D35400/000000.png', dataAiHint: 'banana closeup' }
    ],
    dataAiHint: 'yellow bananas', rating: 4.7, reviewsCount: 90, stock: 30 },
  { id: 'prod3', slug: 'fresh-carrots-local', name: 'Fresh Carrots (Local)', description: 'Fresh, crunchy local carrots.', price: 0.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/E67E22/ffffff.png', dataAiHint: 'carrots pack front' },
        { url: 'https://placehold.co/600x450/D35400/ffffff.png', dataAiHint: 'carrots pack side' },
        { url: 'https://placehold.co/600x450/F39C12/ffffff.png', dataAiHint: 'carrots in produce' },
        { url: 'https://placehold.co/600x450/E74C3C/ffffff.png', dataAiHint: 'carrot closeup' }
    ],
    dataAiHint: 'orange carrots', stock: 100 },
  { id: 'prod4', slug: 'whole-milk', name: 'Whole Milk (1L)', description: 'Fresh pasteurized whole milk.', price: 1.50, category: 'cat1',
    imageUrls: [
        { url: 'https://placehold.co/600x450/ECF0F1/000000.png', dataAiHint: 'milk carton front' },
        { url: 'https://placehold.co/600x450/BDC3C7/000000.png', dataAiHint: 'milk carton side' },
        { url: 'https://placehold.co/600x450/95A5A6/000000.png', dataAiHint: 'milk glass pour' },
        { url: 'https://placehold.co/600x450/7F8C8D/000000.png', dataAiHint: 'milk texture' }
    ],
    dataAiHint: 'milk carton', rating: 4.8, reviewsCount: 200, stock: 75 },
  { id: 'prod5', slug: 'sliced-bread', name: 'Zero Maida Whole-Wheat Bread', description: 'Soft whole wheat sliced bread.', price: 52, category: 'cat6',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F5E1DA/000000.png', dataAiHint: 'bread pack front' },
        { url: 'https://placehold.co/600x450/EAD6C9/000000.png', dataAiHint: 'bread pack side' },
        { url: 'https://placehold.co/600x450/DCC4B8/000000.png', dataAiHint: 'bread slices sandwich' },
        { url: 'https://placehold.co/600x450/CDBBAD/000000.png', dataAiHint: 'bread crumb texture' }
    ],
    dataAiHint: 'bread loaf', stock: 60 },
  { id: 'prod6', slug: 'potato-chips', name: 'Potato Chips (Salted)', description: 'Classic salted potato chips.', price: 1.75, category: 'cat5',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F9E79F/000000.png', dataAiHint: 'chips bag front' },
        { url: 'https://placehold.co/600x450/F7DC6F/000000.png', dataAiHint: 'chips bag side' },
        { url: 'https://placehold.co/600x450/F4D03F/000000.png', dataAiHint: 'chips in bowl' },
        { url: 'https://placehold.co/600x450/F1C40F/000000.png', dataAiHint: 'chip closeup' }
    ],
    dataAiHint: 'chips bag', rating: 4.2, reviewsCount: 150, stock: 120 },
  { id: 'prod7', slug: 'cola-drink', name: 'Cola Drink (2L)', description: 'Refreshing cola beverage.', price: 2.50, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/A93226/ffffff.png', dataAiHint: 'soda bottle front' },
        { url: 'https://placehold.co/600x450/922B21/ffffff.png', dataAiHint: 'soda bottle side' },
        { url: 'https://placehold.co/600x450/7B241C/ffffff.png', dataAiHint: 'soda glass ice' },
        { url: 'https://placehold.co/600x450/641E16/ffffff.png', dataAiHint: 'soda fizz closeup' }
    ],
    dataAiHint: 'soda bottle', stock: 80 },
  { id: 'prod8', slug: 'dish-soap', name: 'Dish Soap (500ml)', description: 'Effective grease-cutting dish soap.', price: 3.00, category: 'cat16',
    imageUrls: [
        { url: 'https://placehold.co/600x450/AED6F1/000000.png', dataAiHint: 'soap bottle front' },
        { url: 'https://placehold.co/600x450/85C1E9/000000.png', dataAiHint: 'soap bottle side' },
        { url: 'https://placehold.co/600x450/5DADE2/000000.png', dataAiHint: 'soap lather dishes' },
        { url: 'https://placehold.co/600x450/3498DB/000000.png', dataAiHint: 'soap liquid closeup' }
    ],
    dataAiHint: 'soap bottle', rating: 4.6, reviewsCount: 70, stock: 40 },
  { id: 'prod9', slug: 'toothpaste', name: 'Toothpaste (Mint)', description: 'Mint flavored toothpaste for fresh breath.', price: 2.10, category: 'cat18',
    imageUrls: [
        { url: 'https://placehold.co/600x450/A2D9CE/000000.png', dataAiHint: 'toothpaste box front' },
        { url: 'https://placehold.co/600x450/73C6B6/000000.png', dataAiHint: 'toothpaste tube side' },
        { url: 'https://placehold.co/600x450/48C9B0/000000.png', dataAiHint: 'toothpaste on brush' },
        { url: 'https://placehold.co/600x450/1ABC9C/000000.png', dataAiHint: 'toothpaste gel closeup' }
    ],
    dataAiHint: 'toothpaste tube', stock: 90 },
  { id: 'prod10', slug: 'avocado', name: 'Avocado Hass (Single)', description: 'Creamy Hass avocado.', price: 1.20, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/588157/ffffff.png', dataAiHint: 'avocado whole front' },
        { url: 'https://placehold.co/600x450/4A7242/ffffff.png', dataAiHint: 'avocado whole side' },
        { url: 'https://placehold.co/600x450/3A6B35/ffffff.png', dataAiHint: 'avocado sliced half' },
        { url: 'https://placehold.co/600x450/2C5A2E/ffffff.png', dataAiHint: 'avocado flesh closeup' }
    ],
    dataAiHint: 'green avocado', rating: 4.9, reviewsCount: 250, stock: 0 },
  { id: 'prod11', slug: 'organic-spinach', name: 'Organic Spinach', description: 'Fresh organic spinach leaves, packed with nutrients.', price: 2.49, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/8FBC8F/000000.png', dataAiHint: 'spinach pack front' },
        { url: 'https://placehold.co/600x450/6A996A/000000.png', dataAiHint: 'spinach pack side' },
        { url: 'https://placehold.co/600x450/4F794F/000000.png', dataAiHint: 'spinach leaves bowl' },
        { url: 'https://placehold.co/600x450/3E633E/000000.png', dataAiHint: 'spinach leaf closeup' }
    ],
    dataAiHint: 'green spinach', rating: 4.6, reviewsCount: 55, stock: 40 },
  { id: 'prod12', slug: 'orange', name: 'Orange', description: 'Juicy and sweet oranges, rich in Vitamin C.', price: 0.79, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFA500/000000.png', dataAiHint: 'orange fruit front' },
        { url: 'https://placehold.co/600x450/FF8C00/000000.png', dataAiHint: 'orange fruit side' },
        { url: 'https://placehold.co/600x450/FF7F50/000000.png', dataAiHint: 'orange slices' },
        { url: 'https://placehold.co/600x450/FF6347/000000.png', dataAiHint: 'orange peel texture' }
    ],
    dataAiHint: 'orange fruit', rating: 4.4, reviewsCount: 70, stock: 60 },
  { id: 'prod13', slug: 'broccoli-organic', name: 'Broccoli (Organic)', description: 'Fresh organic broccoli head, great for steaming or roasting.', price: 2.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/556B2F/ffffff.png', dataAiHint: 'broccoli head front' },
        { url: 'https://placehold.co/600x450/6B8E23/ffffff.png', dataAiHint: 'broccoli head side' },
        { url: 'https://placehold.co/600x450/8FBC8F/ffffff.png', dataAiHint: 'broccoli florets bowl' },
        { url: 'https://placehold.co/600x450/9ACD32/ffffff.png', dataAiHint: 'broccoli floret closeup' }
    ],
    dataAiHint: 'green broccoli', rating: 4.7, reviewsCount: 65, stock: 35 },
  { id: 'prod14', slug: 'mangoes-alphonso', name: 'Mangoes (Alphonso)', description: 'Sweet and flavorful Alphonso mangoes, the king of mangoes.', price: 4.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFBF00/000000.png', dataAiHint: 'mango fruit front' },
        { url: 'https://placehold.co/600x450/FFC933/000000.png', dataAiHint: 'mango fruit side' },
        { url: 'https://placehold.co/600x450/FFD466/000000.png', dataAiHint: 'mango slices plate' },
        { url: 'https://placehold.co/600x450/FFDF99/000000.png', dataAiHint: 'mango pulp closeup' }
    ],
    dataAiHint: 'yellow mango', rating: 4.9, reviewsCount: 150, stock: 20 },
  { id: 'prod15', slug: 'hybrid-tomato', name: 'Hybrid Tomato (Tamatar)', description: 'Sweet and juicy hybrid tomatoes, perfect for salads.', price: 25, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FF6347/ffffff.png', dataAiHint: 'tomato pack front' },
        { url: 'https://placehold.co/600x450/FF4500/ffffff.png', dataAiHint: 'tomato pack side' },
        { url: 'https://placehold.co/600x450/DC143C/ffffff.png', dataAiHint: 'tomatoes in salad' },
        { url: 'https://placehold.co/600x450/B22222/ffffff.png', dataAiHint: 'tomato slice closeup' }
    ],
    dataAiHint: 'red tomatoes', rating: 4.5, reviewsCount: 80, stock: 45 },
  { id: 'prod16', slug: 'pomegranate', name: 'Pomegranate', description: 'Fresh pomegranate with antioxidant-rich seeds.', price: 3.99, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/D22B2B/ffffff.png', dataAiHint: 'pomegranate fruit front' },
        { url: 'https://placehold.co/600x450/C01C1C/ffffff.png', dataAiHint: 'pomegranate fruit side' },
        { url: 'https://placehold.co/600x450/AE0E0E/ffffff.png', dataAiHint: 'pomegranate seeds bowl' },
        { url: 'https://placehold.co/600x450/9C0000/ffffff.png', dataAiHint: 'pomegranate seed closeup' }
    ],
    dataAiHint: 'red pomegranate', rating: 4.6, reviewsCount: 90, stock: 25 },
  { id: 'prod17', slug: 'potatoes', name: 'Potato (Aloo)', description: 'Versatile potatoes, ideal for mashing, baking, or frying.', price: 29, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/D2B48C/000000.png', dataAiHint: 'potatoes bag front' },
        { url: 'https://placehold.co/600x450/C1A57B/000000.png', dataAiHint: 'potatoes bag side' },
        { url: 'https://placehold.co/600x450/B0966A/000000.png', dataAiHint: 'potatoes cooked dish' },
        { url: 'https://placehold.co/600x450/A08759/000000.png', dataAiHint: 'potato skin closeup' }
    ],
    dataAiHint: 'brown potatoes', rating: 4.3, reviewsCount: 110, stock: 70 },
  { id: 'prod18', slug: 'strawberries-fresh', name: 'Strawberries (Fresh)', description: 'Sweet, ripe, and fresh strawberries.', price: 4.50, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FF69B4/ffffff.png', dataAiHint: 'strawberries punnet front' },
        { url: 'https://placehold.co/600x450/FF1493/ffffff.png', dataAiHint: 'strawberries punnet side' },
        { url: 'https://placehold.co/600x450/DB7093/ffffff.png', dataAiHint: 'strawberries in dessert' },
        { url: 'https://placehold.co/600x450/C71585/ffffff.png', dataAiHint: 'strawberry closeup' }
    ],
    dataAiHint: 'red strawberries', rating: 4.8, reviewsCount: 100, stock: 30 },
  { id: 'prod19', slug: 'cucumber', name: 'English Cucumber (Kheera)', description: 'Cool and crisp cucumber, great for salads and hydration.', price: 33, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/90EE90/000000.png', dataAiHint: 'cucumber whole front' },
        { url: 'https://placehold.co/600x450/3CB371/000000.png', dataAiHint: 'cucumber whole side' },
        { url: 'https://placehold.co/600x450/2E8B57/000000.png', dataAiHint: 'cucumber slices' },
        { url: 'https://placehold.co/600x450/006400/000000.png', dataAiHint: 'cucumber skin texture' }
    ],
    dataAiHint: 'green cucumber', rating: 4.4, reviewsCount: 60, stock: 55 },
  { id: 'prod20', slug: 'eggs-dozen', name: 'Eggs (Dozen)', description: 'Farm fresh brown eggs.', price: 3.50, category: 'cat1',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F5DEB3/000000.png', dataAiHint: 'eggs carton front' },
        { url: 'https://placehold.co/600x450/DEB887/000000.png', dataAiHint: 'eggs carton side' },
        { url: 'https://placehold.co/600x450/CD853F/000000.png', dataAiHint: 'eggs broken pan' },
        { url: 'https://placehold.co/600x450/A0522D/000000.png', dataAiHint: 'egg shell closeup' }
    ],
    dataAiHint: 'eggs carton', rating: 4.7, reviewsCount: 180, stock: 50 },
  { id: 'prod21', slug: 'cereal-flakes', name: 'Cereal Flakes', description: 'Healthy corn cereal flakes for breakfast.', price: 4.20, category: 'cat3',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFDAB9/000000.png', dataAiHint: 'cereal box front' },
        { url: 'https://placehold.co/600x450/FFC082/000000.png', dataAiHint: 'cereal box side' },
        { url: 'https://placehold.co/600x450/FFA54F/000000.png', dataAiHint: 'cereal bowl milk' },
        { url: 'https://placehold.co/600x450/FF8C27/000000.png', dataAiHint: 'cereal flake closeup' }
    ],
    dataAiHint: 'cereal box', rating: 4.5, reviewsCount: 90, stock: 60 },
  { id: 'prod22', slug: 'orange-juice', name: 'Orange Juice (1L)', description: 'Freshly squeezed orange juice.', price: 3.00, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFEBCD/000000.png', dataAiHint: 'juice carton front' },
        { url: 'https://placehold.co/600x450/FFDEAD/000000.png', dataAiHint: 'juice carton side' },
        { url: 'https://placehold.co/600x450/FFD700/000000.png', dataAiHint: 'juice glass orange' },
        { url: 'https://placehold.co/600x450/FFC125/000000.png', dataAiHint: 'juice liquid closeup' }
    ],
    dataAiHint: 'juice carton', rating: 4.6, reviewsCount: 110, stock: 70 },
  { id: 'prod23', slug: 'chocolate-cookies', name: 'Chocolate Cookies', description: 'Delicious chocolate chip cookies.', price: 2.80, category: 'cat5',
    imageUrls: [
        { url: 'https://placehold.co/600x450/8B4513/ffffff.png', dataAiHint: 'cookies pack front' },
        { url: 'https://placehold.co/600x450/7A3C0F/ffffff.png', dataAiHint: 'cookies pack side' },
        { url: 'https://placehold.co/600x450/69330A/ffffff.png', dataAiHint: 'cookies on plate' },
        { url: 'https://placehold.co/600x450/582A06/ffffff.png', dataAiHint: 'cookie chip closeup' }
    ],
    dataAiHint: 'cookies pack', rating: 4.8, reviewsCount: 130, stock: 80 },
  { id: 'prod24', slug: 'croissants', name: 'Croissants (Pack of 4)', description: 'Buttery and flaky croissants.', price: 3.99, category: 'cat6',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F0E68C/000000.png', dataAiHint: 'croissants pack front' },
        { url: 'https://placehold.co/600x450/E9D7A0/000000.png', dataAiHint: 'croissants pack side' },
        { url: 'https://placehold.co/600x450/DFC8B4/000000.png', dataAiHint: 'croissant on plate' },
        { url: 'https://placehold.co/600x450/D4B9C8/000000.png', dataAiHint: 'croissant layers closeup' }
    ],
    dataAiHint: 'bakery croissants', rating: 4.9, reviewsCount: 100, stock: 40 },
  { id: 'prod25', slug: 'green-tea', name: 'Green Tea Bags (25 count)', description: 'Refreshing green tea bags.', price: 2.50, category: 'cat7',
    imageUrls: [
        { url: 'https://placehold.co/600x450/98FB98/000000.png', dataAiHint: 'tea box front' },
        { url: 'https://placehold.co/600x450/88EE88/000000.png', dataAiHint: 'tea box side' },
        { url: 'https://placehold.co/600x450/78DD78/000000.png', dataAiHint: 'tea cup steam' },
        { url: 'https://placehold.co/600x450/68CC68/000000.png', dataAiHint: 'tea bag closeup' }
    ],
    dataAiHint: 'tea box', rating: 4.7, reviewsCount: 85, stock: 55 },
  { id: 'prod26', slug: 'basmati-rice', name: 'Basmati Rice (1kg)', description: 'Premium long-grain basmati rice.', price: 5.50, category: 'cat8',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FAF0E6/000000.png', dataAiHint: 'rice bag front' },
        { url: 'https://placehold.co/600x450/F0E0D6/000000.png', dataAiHint: 'rice bag side' },
        { url: 'https://placehold.co/600x450/E0D0C6/000000.png', dataAiHint: 'rice cooked bowl' },
        { url: 'https://placehold.co/600x450/D0C0B6/000000.png', dataAiHint: 'rice grains closeup' }
    ],
    dataAiHint: 'rice bag', rating: 4.9, reviewsCount: 150, stock: 65 },
  { id: 'prod27', slug: 'olive-oil', name: 'Olive Oil (500ml)', description: 'Extra virgin olive oil.', price: 7.00, category: 'cat9',
    imageUrls: [
        { url: 'https://placehold.co/600x450/BDB76B/000000.png', dataAiHint: 'oil bottle front' },
        { url: 'https://placehold.co/600x450/ADA75B/000000.png', dataAiHint: 'oil bottle side' },
        { url: 'https://placehold.co/600x450/9D974B/000000.png', dataAiHint: 'oil pouring salad' },
        { url: 'https://placehold.co/600x450/8D873B/000000.png', dataAiHint: 'oil liquid closeup' }
    ],
    dataAiHint: 'oil bottle', rating: 4.8, reviewsCount: 120, stock: 30 },
  { id: 'prod28', slug: 'dark-chocolate', name: 'Dark Chocolate Bar', description: 'Rich 70% cocoa dark chocolate.', price: 3.20, category: 'cat10',
    imageUrls: [
        { url: 'https://placehold.co/600x450/5C3317/ffffff.png', dataAiHint: 'chocolate bar front' },
        { url: 'https://placehold.co/600x450/4A2A12/ffffff.png', dataAiHint: 'chocolate bar side' },
        { url: 'https://placehold.co/600x450/39210E/ffffff.png', dataAiHint: 'chocolate pieces' },
        { url: 'https://placehold.co/600x450/281809/ffffff.png', dataAiHint: 'chocolate texture closeup' }
    ],
    dataAiHint: 'chocolate bar', rating: 4.9, reviewsCount: 200, stock: 90 },
  { id: 'prod29', slug: 'strawberry-jam', name: 'Strawberry Jam', description: 'Sweet strawberry jam/preserve.', price: 2.75, category: 'cat11',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFB6C1/000000.png', dataAiHint: 'jam jar front' },
        { url: 'https://placehold.co/600x450/FFAAB5/000000.png', dataAiHint: 'jam jar side' },
        { url: 'https://placehold.co/600x450/FF9FAD/000000.png', dataAiHint: 'jam on toast' },
        { url: 'https://placehold.co/600x450/FF94A5/000000.png', dataAiHint: 'jam texture closeup' }
    ],
    dataAiHint: 'jam jar', rating: 4.6, reviewsCount: 70, stock: 40 },
  { id: 'prod30', slug: 'chicken-breast', name: 'Chicken Breast (500g)', description: 'Fresh boneless chicken breast.', price: 6.00, category: 'cat12',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFE4E1/000000.png', dataAiHint: 'chicken pack front' },
        { url: 'https://placehold.co/600x450/FFD3D1/000000.png', dataAiHint: 'chicken pack side' },
        { url: 'https://placehold.co/600x450/FFC2C1/000000.png', dataAiHint: 'chicken raw pieces' },
        { url: 'https://placehold.co/600x450/FFB1B1/000000.png', dataAiHint: 'chicken meat closeup' }
    ],
    dataAiHint: 'raw chicken', rating: 4.7, reviewsCount: 95, stock: 25 },
  { id: 'prod31', slug: 'organic-quinoa', name: 'Organic Quinoa (500g)', description: 'Healthy organic quinoa grains.', price: 4.50, category: 'cat13',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F0E68C/000000.png', dataAiHint: 'quinoa pack front' },
        { url: 'https://placehold.co/600x450/EAE07C/000000.png', dataAiHint: 'quinoa pack side' },
        { url: 'https://placehold.co/600x450/E0DA6C/000000.png', dataAiHint: 'quinoa cooked bowl' },
        { url: 'https://placehold.co/600x450/D6D45C/000000.png', dataAiHint: 'quinoa grains closeup' }
    ],
    dataAiHint: 'quinoa pack', rating: 4.8, reviewsCount: 60, stock: 35 },
  { id: 'prod32', slug: 'baby-wipes', name: 'Mee Mee Aloe Vera Baby Wipes (3×72)', description: 'Gentle baby wipes for sensitive skin.', price: 205, category: 'cat14',
    imageUrls: [
        { url: 'https://placehold.co/600x450/E0FFFF/000000.png', dataAiHint: 'wipes pack front' },
        { url: 'https://placehold.co/600x450/D0EFEF/000000.png', dataAiHint: 'wipes pack side' },
        { url: 'https://placehold.co/600x450/C0DFDF/000000.png', dataAiHint: 'wipes pulled out' },
        { url: 'https://placehold.co/600x450/B0CFCF/000000.png', dataAiHint: 'wipe texture closeup' }
    ],
    dataAiHint: 'wipes pack', rating: 4.9, reviewsCount: 110, stock: 70 },
  { id: 'prod33', slug: 'vitamin-c-tablets', name: 'Vitamin C Tablets', description: 'Immune boosting Vitamin C supplements.', price: 8.50, category: 'cat15',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFE4B5/000000.png', dataAiHint: 'vitamin bottle front' },
        { url: 'https://placehold.co/600x450/FFDAB9/000000.png', dataAiHint: 'vitamin bottle side' },
        { url: 'https://placehold.co/600x450/FFCF9F/000000.png', dataAiHint: 'vitamin tablets hand' },
        { url: 'https://placehold.co/600x450/FFC485/000000.png', dataAiHint: 'vitamin tablet closeup' }
    ],
    dataAiHint: 'vitamin bottle', rating: 4.7, reviewsCount: 50, stock: 80 },
  { id: 'prod34', slug: 'laundry-detergent', name: 'Surf Excel Easy Wash Detergent Powder (1 kg)', description: 'Powerful laundry detergent.', price: 144, category: 'cat16',
    imageUrls: [
        { url: 'https://placehold.co/600x450/ADD8E6/000000.png', dataAiHint: 'detergent box front' },
        { url: 'https://placehold.co/600x450/9DCBE0/000000.png', dataAiHint: 'detergent box side' },
        { url: 'https://placehold.co/600x450/8DBEDA/000000.png', dataAiHint: 'detergent powder scoop' },
        { url: 'https://placehold.co/600x450/7DAFD4/000000.png', dataAiHint: 'detergent powder closeup' }
    ],
    dataAiHint: 'detergent bottle', rating: 4.6, reviewsCount: 90, stock: 0 },
  { id: 'prod35', slug: 'notebooks-set', name: 'Notebooks (Set of 3)', description: 'Spiral bound notebooks for office/study.', price: 4.00, category: 'cat17',
    imageUrls: [
        { url: 'https://placehold.co/600x450/D3D3D3/000000.png', dataAiHint: 'notebooks stack front' },
        { url: 'https://placehold.co/600x450/C3C3C3/000000.png', dataAiHint: 'notebooks stack side' },
        { url: 'https://placehold.co/600x450/B3B3B3/000000.png', dataAiHint: 'notebook open pen' },
        { url: 'https://placehold.co/600x450/A3A3A3/000000.png', dataAiHint: 'notebook paper texture' }
    ],
    dataAiHint: 'office notebooks', rating: 4.5, reviewsCount: 40, stock: 100 },
  { id: 'prod36', slug: 'shampoo-herbal', name: 'Shampoo (Herbal)', description: 'Nourishing herbal shampoo.', price: 5.20, category: 'cat18',
    imageUrls: [
        { url: 'https://placehold.co/600x450/C1FFC1/000000.png', dataAiHint: 'shampoo bottle front' },
        { url: 'https://placehold.co/600x450/B1EEB1/000000.png', dataAiHint: 'shampoo bottle side' },
        { url: 'https://placehold.co/600x450/A1DDA1/000000.png', dataAiHint: 'shampoo lather hair' },
        { url: 'https://placehold.co/600x450/91CC91/000000.png', dataAiHint: 'shampoo liquid closeup' }
    ],
    dataAiHint: 'shampoo bottle', rating: 4.7, reviewsCount: 120, stock: 60 },
  { id: 'prod37', slug: 'dog-food-dry', name: 'Drools Adult Dog Wet Food (150 g)', description: 'Nutritious dog food.', price: 40, category: 'cat19',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFE4C4/000000.png', dataAiHint: 'dog food bag front' },
        { url: 'https://placehold.co/600x450/FFDAB9/000000.png', dataAiHint: 'dog food bag side' },
        { url: 'https://placehold.co/600x450/FFCFB0/000000.png', dataAiHint: 'dog food bowl' },
        { url: 'https://placehold.co/600x450/FFC4A7/000000.png', dataAiHint: 'dog food kibble closeup' }
    ],
    dataAiHint: 'dog food', rating: 4.8, reviewsCount: 75, stock: 45 },
  { id: 'prod38', slug: 'sweet-paan', name: 'Sweet Paan (Single)', description: 'Traditional sweet betel leaf preparation.', price: 1.00, category: 'cat20',
    imageUrls: [
        { url: 'https://placehold.co/600x450/90EE90/000000.png', dataAiHint: 'paan folded front' },
        { url: 'https://placehold.co/600x450/80DD80/000000.png', dataAiHint: 'paan folded side' },
        { url: 'https://placehold.co/600x450/70CC70/000000.png', dataAiHint: 'paan ingredients display' },
        { url: 'https://placehold.co/600x450/60BB60/000000.png', dataAiHint: 'paan leaf texture' }
    ],
    dataAiHint: 'sweet paan', rating: 4.9, reviewsCount: 200, stock: 150 },
  { id: 'prod39', slug: 'kelloggs-corn-flakes-500g', name: 'Kellogg’s Original Corn Flakes Cereal - 500g Box', description: 'Classic crispy corn flakes, a popular breakfast choice.', price: 4.50, category: 'cat3',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFD700/000000.png', dataAiHint: 'kelloggs box front' },
        { url: 'https://placehold.co/600x450/FFC800/000000.png', dataAiHint: 'kelloggs box side' },
        { url: 'https://placehold.co/600x450/FFB900/000000.png', dataAiHint: 'kelloggs flakes bowl' },
        { url: 'https://placehold.co/600x450/FFAA00/000000.png', dataAiHint: 'kelloggs flake closeup' }
    ],
    dataAiHint: 'corn flakes', rating: 4.6, reviewsCount: 150, stock: 70 },
  { id: 'prod40', slug: 'maggi-masala-noodles-70g', name: 'Nestlé Maggi 2-Minute Instant Masala Noodles - 70g Pack', description: 'Quick and tasty Maggi masala noodles, ready in 2 minutes.', price: 0.50, category: 'cat3',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFFF00/000000.png', dataAiHint: 'maggi pack front' },
        { url: 'https://placehold.co/600x450/EEEE00/000000.png', dataAiHint: 'maggi pack side' },
        { url: 'https://placehold.co/600x450/DDDD00/000000.png', dataAiHint: 'maggi cooked bowl' },
        { url: 'https://placehold.co/600x450/CCCC00/000000.png', dataAiHint: 'maggi noodles closeup' }
    ],
    dataAiHint: 'instant noodles', rating: 4.8, reviewsCount: 300, stock: 100 },
  { id: 'prod41', slug: 'quaker-instant-oats-500g', name: 'Quaker Instant Oats – Nutritious Breakfast Porridge – 500g', description: 'Healthy and quick-cooking Quaker instant oats for a nutritious start.', price: 3.80, category: 'cat3',
    imageUrls: [
        { url: 'https://placehold.co/600x450/DEB887/000000.png', dataAiHint: 'quaker oats pack front' },
        { url: 'https://placehold.co/600x450/CDAA7D/000000.png', dataAiHint: 'quaker oats pack side' },
        { url: 'https://placehold.co/600x450/BC9C6D/000000.png', dataAiHint: 'quaker oats bowl cooked' },
        { url: 'https://placehold.co/600x450/AC8C5D/000000.png', dataAiHint: 'quaker oats flakes closeup' }
    ],
    dataAiHint: 'instant oats', rating: 4.7, reviewsCount: 120, stock: 60 },
  { id: 'prod42', slug: 'mtr-upma-instant-mix-200g', name: 'MTR Upma Instant Mix – South Indian Style – 200g Pouch', description: 'Authentic South Indian style Upma, ready in minutes with MTR instant mix.', price: 1.50, category: 'cat3',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F5F5DC/000000.png', dataAiHint: 'mtr upma pack front' },
        { url: 'https://placehold.co/600x450/E5E5CC/000000.png', dataAiHint: 'mtr upma pack side' },
        { url: 'https://placehold.co/600x450/D5D5BC/000000.png', dataAiHint: 'mtr upma cooked plate' },
        { url: 'https://placehold.co/600x450/C5C5AC/000000.png', dataAiHint: 'mtr upma mix closeup' }
    ],
    dataAiHint: 'upma mix', rating: 4.5, reviewsCount: 90, stock: 50 },
  { id: 'prod43', slug: 'safal-frozen-green-peas-500g', name: 'Safal Frozen Green Peas – Vacuum Packed – 500g', description: 'Freshly frozen green peas, vacuum packed to retain freshness.', price: 1.20, category: 'cat2',
    imageUrls: [
        { url: 'https://placehold.co/600x450/90EE90/000000.png', dataAiHint: 'safal peas pack front' },
        { url: 'https://placehold.co/600x450/7CDD7C/000000.png', dataAiHint: 'safal peas pack side' },
        { url: 'https://placehold.co/600x450/68CC68/000000.png', dataAiHint: 'safal peas bowl' },
        { url: 'https://placehold.co/600x450/54BB54/000000.png', dataAiHint: 'safal pea closeup' }
    ],
    dataAiHint: 'frozen peas', rating: 4.6, reviewsCount: 110, stock: 80 },
  { id: 'prod44', slug: 'mccain-frozen-french-fries-500g', name: 'McCain Air-Fryer French Fries (360 g)', description: 'Classic McCain french fries, ready to fry for a crispy snack.', price: 128, category: 'cat5',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFEFD5/000000.png', dataAiHint: 'mccain fries pack front' },
        { url: 'https://placehold.co/600x450/FFE4C4/000000.png', dataAiHint: 'mccain fries pack side' },
        { url: 'https://placehold.co/600x450/FFDAB9/000000.png', dataAiHint: 'mccain fries cooked plate' },
        { url: 'https://placehold.co/600x450/FFCFAD/000000.png', dataAiHint: 'mccain fry closeup' }
    ],
    dataAiHint: 'french fries', rating: 4.7, reviewsCount: 180, stock: 90 },
  { id: 'prod45', slug: 'coca-cola-750ml', name: 'Coca-Cola (750 ml)', description: 'Classic Coca-Cola soft drink.', price: 43, category: 'cat4', // Updated price
    imageUrls: [
        { url: 'https://placehold.co/600x450/C00000/ffffff.png', dataAiHint: 'cocacola bottle front' },
        { url: 'https://placehold.co/600x450/B00000/ffffff.png', dataAiHint: 'cocacola bottle side' },
        { url: 'https://placehold.co/600x450/A00000/ffffff.png', dataAiHint: 'cocacola glass ice' },
        { url: 'https://placehold.co/600x450/900000/ffffff.png', dataAiHint: 'cocacola bubbles closeup' }
    ],
    dataAiHint: 'cola soda', rating: 4.8, reviewsCount: 500, stock: 150 },
  { id: 'prod46', slug: 'pepsi-750ml', name: 'Pepsi (750ml)', description: 'Refreshing Pepsi cola soft drink.', price: 40, category: 'cat4', // Updated name and price
    imageUrls: [
        { url: 'https://placehold.co/600x450/0047AB/ffffff.png', dataAiHint: 'pepsi can front' },
        { url: 'https://placehold.co/600x450/003DA5/ffffff.png', dataAiHint: 'pepsi can side' },
        { url: 'https://placehold.co/600x450/003399/ffffff.png', dataAiHint: 'pepsi glass ice' },
        { url: 'https://placehold.co/600x450/00298C/ffffff.png', dataAiHint: 'pepsi bubbles closeup' }
    ],
    dataAiHint: 'pepsi soda', rating: 4.7, reviewsCount: 450, stock: 140 },
  { id: 'prod47', slug: 'sprite-lime-750ml', name: 'Sprite Lime (750 ml)', description: 'Crisp lemon-lime flavored Sprite.', price: 43, category: 'cat4', // Updated price
    imageUrls: [
        { url: 'https://placehold.co/600x450/00A86B/ffffff.png', dataAiHint: 'sprite bottle front' },
        { url: 'https://placehold.co/600x450/009A5B/ffffff.png', dataAiHint: 'sprite bottle side' },
        { url: 'https://placehold.co/600x450/008C4B/ffffff.png', dataAiHint: 'sprite glass ice' },
        { url: 'https://placehold.co/600x450/007E3B/ffffff.png', dataAiHint: 'sprite bubbles closeup' }
    ],
    dataAiHint: 'sprite soda', rating: 4.6, reviewsCount: 400, stock: 130 },
  { id: 'prod48', slug: 'fanta-orange-750ml', name: 'Fanta Orange (750ml)', description: 'Bubbly orange flavored Fanta.', price: 43, category: 'cat4', // Updated name and price
    imageUrls: [
        { url: 'https://placehold.co/600x450/FF8C00/ffffff.png', dataAiHint: 'fanta bottle front' },
        { url: 'https://placehold.co/600x450/FF7C00/ffffff.png', dataAiHint: 'fanta bottle side' },
        { url: 'https://placehold.co/600x450/FF6C00/ffffff.png', dataAiHint: 'fanta glass ice' },
        { url: 'https://placehold.co/600x450/FF5C00/ffffff.png', dataAiHint: 'fanta bubbles closeup' }
    ],
    dataAiHint: 'fanta orange', rating: 4.5, reviewsCount: 380, stock: 120 },
  { id: 'prod49', slug: 'thums-up-2-25l', name: 'Thums Up (2.25L)', description: 'Strong and fizzy Thums Up cola, 2.25L pack.', price: 100, category: 'cat4', // Updated name and price
    imageUrls: [
        { url: 'https://placehold.co/600x450/36454F/ffffff.png', dataAiHint: 'thumsup bottle front' },
        { url: 'https://placehold.co/600x450/2F3E47/ffffff.png', dataAiHint: 'thumsup bottle side' },
        { url: 'https://placehold.co/600x450/28373F/ffffff.png', dataAiHint: 'thumsup glass ice' },
        { url: 'https://placehold.co/600x450/213037/ffffff.png', dataAiHint: 'thumsup bubbles closeup' }
    ],
    dataAiHint: 'thumsup cola large', rating: 4.7, reviewsCount: 420, stock: 100 },
  { id: 'prod50', slug: 'real-fruit-power-cranberry-1l', name: 'Real Fruit Power Cranberry (1L)', description: 'Refreshing cranberry fruit juice from Real Fruit Power.', price: 119, category: 'cat4', // Updated name, desc, price
    imageUrls: [
        { url: 'https://placehold.co/600x450/DC143C/ffffff.png', dataAiHint: 'cranberry juice pack front' },
        { url: 'https://placehold.co/600x450/C21030/ffffff.png', dataAiHint: 'cranberry juice pack side' },
        { url: 'https://placehold.co/600x450/A80C28/ffffff.png', dataAiHint: 'cranberry juice glass' },
        { url: 'https://placehold.co/600x450/8E0820/ffffff.png', dataAiHint: 'cranberry juice liquid' }
    ],
    dataAiHint: 'cranberry juice', rating: 4.6, reviewsCount: 180, stock: 80 },
  { id: 'prod51', slug: 'tropicana-juice', name: 'Tropicana', description: 'Delicious Tropicana orange juice.', price: 2.50, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFA500/ffffff.png', dataAiHint: 'tropicana carton front' },
        { url: 'https://placehold.co/600x450/FF9500/ffffff.png', dataAiHint: 'tropicana carton side' },
        { url: 'https://placehold.co/600x450/FF8500/ffffff.png', dataAiHint: 'tropicana glass orange' },
        { url: 'https://placehold.co/600x450/FF7500/ffffff.png', dataAiHint: 'tropicana liquid pour' }
    ],
    dataAiHint: 'orange juice', rating: 4.7, reviewsCount: 350, stock: 70 },
  {
    id: 'prod52',
    slug: 'britannia-whole-wheat-bread',
    name: 'Zero Maida Whole-Wheat Bread',
    description: 'Healthy and delicious whole wheat bread from Britannia.',
    price: 52,
    category: 'cat6', // Bakery & Biscuits
    imageUrls: [
      { url: 'https://placehold.co/600x450/D2B48C/000000.png', dataAiHint: 'wheat bread pack front' },
      { url: 'https://placehold.co/600x450/C1A97E/000000.png', dataAiHint: 'wheat bread pack side' },
      { url: 'https://placehold.co/600x450/B09E70/000000.png', dataAiHint: 'wheat bread slices toast' },
      { url: 'https://placehold.co/600x450/A09362/000000.png', dataAiHint: 'wheat bread texture closeup' }
    ],
    dataAiHint: 'wheat bread',
    rating: 4.5,
    reviewsCount: 110,
    stock: 50
  },
  {
    id: 'prod53',
    slug: 'modern-bread-white',
    name: 'English Oven Premium White Bread (350 g)',
    description: 'Soft and classic white bread from Modern.',
    price: 30,
    category: 'cat6', // Bakery & Biscuits
    imageUrls: [
      { url: 'https://placehold.co/600x450/FEFDFB/000000.png', dataAiHint: 'white bread pack front' },
      { url: 'https://placehold.co/600x450/FDFCF9/000000.png', dataAiHint: 'white bread pack side' },
      { url: 'https://placehold.co/600x450/FCFBF7/000000.png', dataAiHint: 'white bread slices sandwich' },
      { url: 'https://placehold.co/600x450/FAF9F5/000000.png', dataAiHint: 'white bread crumb closeup' }
    ],
    dataAiHint: 'white bread',
    rating: 4.3,
    reviewsCount: 95,
    stock: 60
  },
  {
    id: 'prod54',
    slug: 'eggs-farm-fresh-multi',
    name: 'Eggs (Farm Fresh)',
    description: 'A pack of farm fresh, high-quality eggs.',
    price: 2.50,
    category: 'cat1', // Dairy & Eggs
    imageUrls: [
      { url: 'https://placehold.co/600x450/FDF5E6/000000.png', dataAiHint: 'eggs carton pack front' },
      { url: 'https://placehold.co/600x450/FCEECF/000000.png', dataAiHint: 'eggs carton pack side' },
      { url: 'https://placehold.co/600x450/FAE3B8/000000.png', dataAiHint: 'eggs cracked bowl' },
      { url: 'https://placehold.co/600x450/F7DCA1/000000.png', dataAiHint: 'egg shell texture closeup' }
    ],
    dataAiHint: 'fresh eggs',
    rating: 4.8,
    reviewsCount: 210,
    stock: 70
  },
  {
    id: 'prod55',
    slug: 'lays-classic-salted',
    name: 'Lay\'s Classic Salted',
    description: 'Classic, crispy, and perfectly salted potato chips from Lay\'s.',
    price: 1.00,
    category: 'cat5', // Snacks & Munchies
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFDB58/000000.png', dataAiHint: 'lays chips bag front' },
        { url: 'https://placehold.co/600x450/FFD43B/000000.png', dataAiHint: 'lays chips bag side' },
        { url: 'https://placehold.co/600x450/FFCD1E/000000.png', dataAiHint: 'lays chips bowl pile' },
        { url: 'https://placehold.co/600x450/FFC600/000000.png', dataAiHint: 'lays chip texture closeup' }
    ],
    dataAiHint: 'lays chips',
    rating: 4.7,
    reviewsCount: 350,
    stock: 120
  },
  {
    id: 'prod56',
    slug: 'kurkure-masala-munch',
    name: 'Kurkure Masala Munch',
    description: 'Spicy and crunchy corn puffs with a tangy masala flavor.',
    price: 0.75,
    category: 'cat5', // Snacks & Munchies
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFA500/000000.png', dataAiHint: 'kurkure pack front' },
        { url: 'https://placehold.co/600x450/FF9500/000000.png', dataAiHint: 'kurkure pack side' },
        { url: 'https://placehold.co/600x450/FF8500/000000.png', dataAiHint: 'kurkure snack bowl' },
        { url: 'https://placehold.co/600x450/FF7500/000000.png', dataAiHint: 'kurkure puff closeup' }
    ],
    dataAiHint: 'kurkure snack',
    rating: 4.6,
    reviewsCount: 280,
    stock: 100
  },
  {
    id: 'prod57',
    slug: 'haldirams-aloo-bhujia',
    name: 'Haldiram\'s Aloo Bhujia',
    description: 'Crispy and spicy potato noodle snack from Haldiram\'s.',
    price: 1.50,
    category: 'cat5', // Snacks & Munchies
    imageUrls: [
        { url: 'https://placehold.co/600x450/F4A460/000000.png', dataAiHint: 'bhujia pack front' },
        { url: 'https://placehold.co/600x450/E39450/000000.png', dataAiHint: 'bhujia pack side' },
        { url: 'https://placehold.co/600x450/D28440/000000.png', dataAiHint: 'bhujia snack pile' },
        { url: 'https://placehold.co/600x450/C17430/000000.png', dataAiHint: 'bhujia texture closeup' }
    ],
    dataAiHint: 'aloo bhujia',
    rating: 4.8,
    reviewsCount: 220,
    stock: 80
  },
  {
    id: 'prod58',
    slug: 'act-ii-butter-popcorn',
    name: 'Act II Butter Popcorn',
    description: 'Classic microwave butter popcorn, ready in minutes.',
    price: 2.00,
    category: 'cat5', // Snacks & Munchies
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFFACD/000000.png', dataAiHint: 'popcorn pack front' },
        { url: 'https://placehold.co/600x450/FFF9BD/000000.png', dataAiHint: 'popcorn pack side' },
        { url: 'https://placehold.co/600x450/FFF8AD/000000.png', dataAiHint: 'popcorn bowl popped' },
        { url: 'https://placehold.co/600x450/FFF79D/000000.png', dataAiHint: 'popcorn kernel closeup' }
    ],
    dataAiHint: 'butter popcorn',
    rating: 4.5,
    reviewsCount: 150,
    stock: 90
  },
  {
    id: 'prod59',
    slug: 'parle-g-biscuits',
    name: 'Parle-G Biscuits',
    description: 'India\'s favorite glucose biscuits, perfect with tea or coffee.',
    price: 0.50,
    category: 'cat6', // Bakery & Biscuits
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFDEAD/000000.png', dataAiHint: 'parle g pack front' },
        { url: 'https://placehold.co/600x450/FDDDB9/000000.png', dataAiHint: 'parle g pack side' },
        { url: 'https://placehold.co/600x450/FCDCA5/000000.png', dataAiHint: 'parle g biscuits tea' },
        { url: 'https://placehold.co/600x450/FBCB91/000000.png', dataAiHint: 'parle g biscuit closeup' }
    ],
    dataAiHint: 'parle g',
    rating: 4.9,
    reviewsCount: 500,
    stock: 200
  },
  {
    id: 'prod60',
    slug: 'amul-taaza-toned-milk-500ml',
    name: 'Amul Taaza Toned Milk (500ml)',
    description: 'Fresh Amul Taaza toned milk, 500ml pack.',
    price: 29,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E0E8F0/000000.png', dataAiHint: 'toned milk pack front' },
      { url: 'https://placehold.co/600x450/D0D8E0/000000.png', dataAiHint: 'toned milk pack side' },
      { url: 'https://placehold.co/600x450/C0C8D0/000000.png', dataAiHint: 'milk in glass' },
      { url: 'https://placehold.co/600x450/B0B8C0/000000.png', dataAiHint: 'milk texture closeup' }
    ],
    dataAiHint: 'toned milk',
    rating: 4.6,
    reviewsCount: 80,
    stock: 50
  },
  {
    id: 'prod61',
    slug: 'amul-gold-full-cream-milk-500ml',
    name: 'Amul Gold Full Cream Milk (500ml)',
    description: 'Rich Amul Gold full cream milk, 500ml pack.',
    price: 35,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E1E9F1/000000.png', dataAiHint: 'full cream milk pack front' },
      { url: 'https://placehold.co/600x450/D1D9E1/000000.png', dataAiHint: 'full cream milk pack side' },
      { url: 'https://placehold.co/600x450/C1C9D1/000000.png', dataAiHint: 'creamy milk glass' },
      { url: 'https://placehold.co/600x450/B1B9C1/000000.png', dataAiHint: 'milk drops closeup' }
    ],
    dataAiHint: 'full cream milk',
    rating: 4.7,
    reviewsCount: 90,
    stock: 40
  },
  {
    id: 'prod62',
    slug: 'mother-dairy-toned-milk-500ml',
    name: 'Mother Dairy Toned Milk (500ml)',
    description: 'Mother Dairy toned milk, 500ml pack.',
    price: 29,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E2EAF2/000000.png', dataAiHint: 'mother dairy milk pack front' },
      { url: 'https://placehold.co/600x450/D2DAE2/000000.png', dataAiHint: 'mother dairy milk pack side' },
      { url: 'https://placehold.co/600x450/C2CAD2/000000.png', dataAiHint: 'milk with cereal' },
      { url: 'https://placehold.co/600x450/B2BAC2/000000.png', dataAiHint: 'milk splash closeup' }
    ],
    dataAiHint: 'toned milk motherdairy',
    rating: 4.5,
    reviewsCount: 75,
    stock: 55
  },
  {
    id: 'prod63',
    slug: 'amul-cow-milk-500ml',
    name: 'Amul Cow Milk (500ml)',
    description: 'Fresh Amul cow milk, 500ml pack.',
    price: 30,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E3EBF3/000000.png', dataAiHint: 'cow milk pack front' },
      { url: 'https://placehold.co/600x450/D3DBE3/000000.png', dataAiHint: 'cow milk pack side' },
      { url: 'https://placehold.co/600x450/C3CBD3/000000.png', dataAiHint: 'milk with cookies' },
      { url: 'https://placehold.co/600x450/B3BBC3/000000.png', dataAiHint: 'milk surface closeup' }
    ],
    dataAiHint: 'cow milk',
    rating: 4.6,
    reviewsCount: 85,
    stock: 45
  },
  {
    id: 'prod64',
    slug: 'mother-dairy-cow-milk-500ml',
    name: 'Mother Dairy Cow Milk (500ml)',
    description: 'Fresh Mother Dairy cow milk, 500ml pack.',
    price: 30,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E4ECF4/000000.png', dataAiHint: 'motherdairy cow milk front' },
      { url: 'https://placehold.co/600x450/D4DCE4/000000.png', dataAiHint: 'motherdairy cow milk side' },
      { url: 'https://placehold.co/600x450/C4CCE4/000000.png', dataAiHint: 'milk for tea coffee' },
      { url: 'https://placehold.co/600x450/B4BCC4/000000.png', dataAiHint: 'milk carton spout' }
    ],
    dataAiHint: 'cow milk motherdairy',
    rating: 4.6,
    reviewsCount: 82,
    stock: 48
  },
  {
    id: 'prod65',
    slug: 'amul-taaza-homogenized-toned-milk-1l',
    name: 'Amul Taaza Homogenized Toned Milk (1L)',
    description: 'Amul Taaza homogenized toned milk, 1 liter pack.',
    price: 71,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E5EDF5/000000.png', dataAiHint: 'toned milk 1l front' },
      { url: 'https://placehold.co/600x450/D5DDF5/000000.png', dataAiHint: 'toned milk 1l side' },
      { url: 'https://placehold.co/600x450/C5CDF5/000000.png', dataAiHint: 'milk carton large' },
      { url: 'https://placehold.co/600x450/B5BCF5/000000.png', dataAiHint: 'milk pouring large' }
    ],
    dataAiHint: 'toned milk liter',
    rating: 4.7,
    reviewsCount: 100,
    stock: 30
  },
  {
    id: 'prod66',
    slug: 'amul-buffalo-a2-milk-500ml',
    name: 'Amul Buffalo A2 Milk (500ml)',
    description: 'Nutritious Amul Buffalo A2 milk, 500ml pack.',
    price: 38,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E6EEF6/000000.png', dataAiHint: 'a2 milk pack front' },
      { url: 'https://placehold.co/600x450/D6DEE6/000000.png', dataAiHint: 'a2 milk pack side' },
      { url: 'https://placehold.co/600x450/C6CEDE/000000.png', dataAiHint: 'buffalo milk product' },
      { url: 'https://placehold.co/600x450/B6BEDE/000000.png', dataAiHint: 'a2 milk closeup' }
    ],
    dataAiHint: 'buffalo milk a2',
    rating: 4.8,
    reviewsCount: 70,
    stock: 25
  },
  {
    id: 'prod67',
    slug: 'amul-lactose-free-milk-250ml',
    name: 'Amul Lactose-Free Milk (250ml)',
    description: 'Amul lactose-free milk, convenient 250ml pack.',
    price: 25,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E7EFF7/000000.png', dataAiHint: 'lactose free milk front' },
      { url: 'https://placehold.co/600x450/D7DFE7/000000.png', dataAiHint: 'lactose free milk side' },
      { url: 'https://placehold.co/600x450/C7CFD7/000000.png', dataAiHint: 'milk small pack' },
      { url: 'https://placehold.co/600x450/B7BFC7/000000.png', dataAiHint: 'special milk closeup' }
    ],
    dataAiHint: 'lactose free milk',
    rating: 4.5,
    reviewsCount: 60,
    stock: 35
  },
  {
    id: 'prod68',
    slug: 'mother-dairy-fit-life-double-toned-450ml',
    name: 'Mother Dairy FIT-Life Double Toned (450ml)',
    description: 'Mother Dairy FIT-Life double toned milk, 450ml pack.',
    price: 33,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E8F0F8/000000.png', dataAiHint: 'double toned milk front' },
      { url: 'https://placehold.co/600x450/D8E0E8/000000.png', dataAiHint: 'double toned milk side' },
      { url: 'https://placehold.co/600x450/C8D0D8/000000.png', dataAiHint: 'fit life milk pack' },
      { url: 'https://placehold.co/600x450/B8C0C8/000000.png', dataAiHint: 'low fat milk closeup' }
    ],
    dataAiHint: 'double toned milk',
    rating: 4.4,
    reviewsCount: 50,
    stock: 40
  },
  {
    id: 'prod69',
    slug: 'amul-slim-trim-skimmed-milk-1l',
    name: 'Amul Slim ’n’ Trim Skimmed Milk (1L)',
    description: 'Amul Slim ’n’ Trim skimmed milk, 1 liter pack for the health-conscious.',
    price: 80,
    category: 'cat1',
    imageUrls: [
      { url: 'https://placehold.co/600x450/E9F1F9/000000.png', dataAiHint: 'skimmed milk 1l front' },
      { url: 'https://placehold.co/600x450/D9E1E9/000000.png', dataAiHint: 'skimmed milk 1l side' },
      { url: 'https://placehold.co/600x450/C9D1D9/000000.png', dataAiHint: 'slim trim milk carton' },
      { url: 'https://placehold.co/600x450/B9C1C9/000000.png', dataAiHint: 'no fat milk closeup' }
    ],
    dataAiHint: 'skimmed milk liter',
    rating: 4.6,
    reviewsCount: 95,
    stock: 28
  },
  {
    id: 'prod70', slug: 'coca-cola-300ml-can', name: 'Coca-Cola (300ml can)',
    description: 'Classic Coca-Cola in a convenient 300ml can.',
    price: 40, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/C10000/ffffff.png', dataAiHint: 'cola can front' },
        { url: 'https://placehold.co/600x450/B00000/ffffff.png', dataAiHint: 'cola can side' },
        { url: 'https://placehold.co/600x450/A00000/ffffff.png', dataAiHint: 'cola can display' },
        { url: 'https://placehold.co/600x450/900000/ffffff.png', dataAiHint: 'cola can group' }
    ],
    dataAiHint: 'coca cola can', rating: 4.8, reviewsCount: 180, stock: 100
  },
  {
    id: 'prod71', slug: 'coca-cola-2-25l-party-pack', name: 'Coca-Cola (2.25L Party Pack)',
    description: 'Large 2.25L party pack of Coca-Cola.',
    price: 97, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/C20000/ffffff.png', dataAiHint: 'cola bottle large front' },
        { url: 'https://placehold.co/600x450/B10000/ffffff.png', dataAiHint: 'cola bottle large side' },
        { url: 'https://placehold.co/600x450/A10000/ffffff.png', dataAiHint: 'cola party pack' },
        { url: 'https://placehold.co/600x450/910000/ffffff.png', dataAiHint: 'cola pouring large' }
    ],
    dataAiHint: 'coca cola large', rating: 4.7, reviewsCount: 150, stock: 80
  },
  {
    id: 'prod72', slug: 'thums-up-750ml-x-2', name: 'Thums Up (750ml x 2)',
    description: 'Pack of two 750ml Thums Up bottles.',
    price: 85, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/404D57/ffffff.png', dataAiHint: 'thumsup twin front' },
        { url: 'https://placehold.co/600x450/3A464F/ffffff.png', dataAiHint: 'thumsup twin side' },
        { url: 'https://placehold.co/600x450/343F47/ffffff.png', dataAiHint: 'thumsup bottles group' },
        { url: 'https://placehold.co/600x450/2E383F/ffffff.png', dataAiHint: 'thumsup multipack' }
    ],
    dataAiHint: 'thumsup multipack', rating: 4.6, reviewsCount: 100, stock: 60
  },
  {
    id: 'prod73', slug: 'mountain-dew-750ml', name: 'Mountain Dew (750ml)',
    description: 'Refreshing Mountain Dew, 750ml bottle.',
    price: 40, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/3EB489/000000.png', dataAiHint: 'mountaindew bottle front' },
        { url: 'https://placehold.co/600x450/38A37A/000000.png', dataAiHint: 'mountaindew bottle side' },
        { url: 'https://placehold.co/600x450/32926B/000000.png', dataAiHint: 'mountaindew glass' },
        { url: 'https://placehold.co/600x450/2C815C/000000.png', dataAiHint: 'mountaindew liquid' }
    ],
    dataAiHint: 'mountain dew', rating: 4.5, reviewsCount: 120, stock: 70
  },
  {
    id: 'prod74', slug: 'coca-cola-zero-300ml-can', name: 'Coca-Cola Zero (300ml can)',
    description: 'Zero sugar Coca-Cola in a 300ml can.',
    price: 40, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/2C2C2C/ffffff.png', dataAiHint: 'cola zero can front' },
        { url: 'https://placehold.co/600x450/222222/ffffff.png', dataAiHint: 'cola zero can side' },
        { url: 'https://placehold.co/600x450/1C1C1C/ffffff.png', dataAiHint: 'cola zero display' },
        { url: 'https://placehold.co/600x450/161616/ffffff.png', dataAiHint: 'cola zero group' }
    ],
    dataAiHint: 'coke zero', rating: 4.7, reviewsCount: 140, stock: 90
  },
  {
    id: 'prod75', slug: 'diet-coke-300ml-can', name: 'Diet Coke (300ml can)',
    description: 'Light taste Diet Coke in a 300ml can.',
    price: 40, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/D3D3D3/000000.png', dataAiHint: 'diet coke can front' },
        { url: 'https://placehold.co/600x450/C8C8C8/000000.png', dataAiHint: 'diet coke can side' },
        { url: 'https://placehold.co/600x450/BCBCBC/000000.png', dataAiHint: 'diet coke display' },
        { url: 'https://placehold.co/600x450/B0B0B0/000000.png', dataAiHint: 'diet coke group' }
    ],
    dataAiHint: 'diet coke', rating: 4.6, reviewsCount: 130, stock: 85
  },
  {
    id: 'prod76', slug: 'appy-fizz-600ml', name: 'Appy Fizz (600ml)',
    description: 'Sparkling apple drink, Appy Fizz 600ml.',
    price: 36, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/E21329/ffffff.png', dataAiHint: 'appy fizz bottle front' },
        { url: 'https://placehold.co/600x450/D01020/ffffff.png', dataAiHint: 'appy fizz bottle side' },
        { url: 'https://placehold.co/600x450/C00D1A/ffffff.png', dataAiHint: 'appy fizz glass' },
        { url: 'https://placehold.co/600x450/B00A14/ffffff.png', dataAiHint: 'appy fizz bubbles' }
    ],
    dataAiHint: 'appy fizz', rating: 4.7, reviewsCount: 160, stock: 95
  },
  {
    id: 'prod77', slug: 'maaza-mango-600ml', name: 'Maaza Mango (600ml)',
    description: 'Rich and pulpy Maaza Mango drink, 600ml.',
    price: 42, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FFC300/000000.png', dataAiHint: 'maaza bottle front' },
        { url: 'https://placehold.co/600x450/FFB800/000000.png', dataAiHint: 'maaza bottle side' },
        { url: 'https://placehold.co/600x450/FFAE00/000000.png', dataAiHint: 'maaza mango glass' },
        { url: 'https://placehold.co/600x450/FFA300/000000.png', dataAiHint: 'maaza liquid' }
    ],
    dataAiHint: 'maaza mango', rating: 4.8, reviewsCount: 200, stock: 110
  },
  {
    id: 'prod78', slug: 'b-natural-mixed-fruit-1l', name: 'B Natural Mixed Fruit (1L)',
    description: 'Delicious mixed fruit juice from B Natural, 1L pack.',
    price: 70, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FF7F50/ffffff.png', dataAiHint: 'bnatural mixed front' },
        { url: 'https://placehold.co/600x450/FF7040/ffffff.png', dataAiHint: 'bnatural mixed side' },
        { url: 'https://placehold.co/600x450/FF6030/ffffff.png', dataAiHint: 'bnatural mixed glass' },
        { url: 'https://placehold.co/600x450/FF5020/ffffff.png', dataAiHint: 'bnatural mixed liquid' }
    ],
    dataAiHint: 'b natural mixedfruit', rating: 4.5, reviewsCount: 90, stock: 60
  },
  {
    id: 'prod79', slug: 'b-natural-guava-1l', name: 'B Natural Guava (1L)',
    description: 'Refreshing guava juice from B Natural, 1L pack.',
    price: 70, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/FED8B1/000000.png', dataAiHint: 'bnatural guava front' },
        { url: 'https://placehold.co/600x450/FECDA1/000000.png', dataAiHint: 'bnatural guava side' },
        { url: 'https://placehold.co/600x450/FEBF91/000000.png', dataAiHint: 'bnatural guava glass' },
        { url: 'https://placehold.co/600x450/FDB481/000000.png', dataAiHint: 'bnatural guava liquid' }
    ],
    dataAiHint: 'b natural guava', rating: 4.6, reviewsCount: 80, stock: 55
  },
  {
    id: 'prod80', slug: 'paper-boat-pomegranate-600ml', name: 'Paper Boat Pomegranate (600ml)',
    description: 'Authentic pomegranate juice by Paper Boat, 600ml.',
    price: 45, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/C25A7C/ffffff.png', dataAiHint: 'paperboat pomegranate front' },
        { url: 'https://placehold.co/600x450/B24A6C/ffffff.png', dataAiHint: 'paperboat pomegranate side' },
        { url: 'https://placehold.co/600x450/A23A5C/ffffff.png', dataAiHint: 'paperboat pomegranate pouch' },
        { url: 'https://placehold.co/600x450/922A4C/ffffff.png', dataAiHint: 'paperboat pomegranate juice' }
    ],
    dataAiHint: 'paper boat pomegranate', rating: 4.7, reviewsCount: 110, stock: 75
  },
  {
    id: 'prod81', slug: 'schweppes-ginger-ale-300ml-can', name: 'Schweppes Ginger Ale (300ml can)',
    description: 'Classic Schweppes Ginger Ale in a 300ml can.',
    price: 60, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/DAA520/ffffff.png', dataAiHint: 'gingerale can front' },
        { url: 'https://placehold.co/600x450/C99510/ffffff.png', dataAiHint: 'gingerale can side' },
        { url: 'https://placehold.co/600x450/B88500/ffffff.png', dataAiHint: 'gingerale display' },
        { url: 'https://placehold.co/600x450/A77500/ffffff.png', dataAiHint: 'gingerale group' }
    ],
    dataAiHint: 'schweppes gingerale', rating: 4.8, reviewsCount: 90, stock: 50
  },
  {
    id: 'prod82', slug: 'schweppes-tonic-water-300ml-can', name: 'Schweppes Tonic Water (300ml can)',
    description: 'Crisp Schweppes Tonic Water in a 300ml can.',
    price: 60, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/ADD8E6/000000.png', dataAiHint: 'tonicwater can front' },
        { url: 'https://placehold.co/600x450/9DCBE0/000000.png', dataAiHint: 'tonicwater can side' },
        { url: 'https://placehold.co/600x450/8DBEDA/000000.png', dataAiHint: 'tonicwater display' },
        { url: 'https://placehold.co/600x450/7DAFD4/000000.png', dataAiHint: 'tonicwater group' }
    ],
    dataAiHint: 'schweppes tonic', rating: 4.7, reviewsCount: 85, stock: 45
  },
  {
    id: 'prod83', slug: 'bisleri-club-soda-750ml', name: 'Bisleri Club Soda (750ml)',
    description: 'Classic Bisleri Club Soda, 750ml bottle.',
    price: 20, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/F0F8FF/000000.png', dataAiHint: 'clubsoda bottle front' },
        { url: 'https://placehold.co/600x450/E0E8EF/000000.png', dataAiHint: 'clubsoda bottle side' },
        { url: 'https://placehold.co/600x450/D0D8DF/000000.png', dataAiHint: 'clubsoda glass' },
        { url: 'https://placehold.co/600x450/C0C8CF/000000.png', dataAiHint: 'clubsoda bubbles' }
    ],
    dataAiHint: 'bisleri soda', rating: 4.6, reviewsCount: 150, stock: 120
  },
  {
    id: 'prod84', slug: 'bisleri-mineral-water-5l', name: 'Bisleri Mineral Water (5L)',
    description: 'Large 5L jar of Bisleri Mineral Water.',
    price: 75, category: 'cat4',
    imageUrls: [
        { url: 'https://placehold.co/600x450/B0E0E6/000000.png', dataAiHint: 'water jar front' },
        { url: 'https://placehold.co/600x450/A0D0D6/000000.png', dataAiHint: 'water jar side' },
        { url: 'https://placehold.co/600x450/90C0C6/000000.png', dataAiHint: 'water jar large' },
        { url: 'https://placehold.co/600x450/80B0B6/000000.png', dataAiHint: 'water pouring glass' }
    ],
    dataAiHint: 'bisleri water large', rating: 4.9, reviewsCount: 250, stock: 90
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
      { productId: 'prod5', name: 'Zero Maida Whole-Wheat Bread', quantity: 1, price: 52 },
    ],
    totalAmount: 53.99, // Recalculated: 1.99 + 52 = 53.99
    status: 'Confirmed',
    deliveryAddress: { street: '789 Pine Ln', city: 'Bangalore', postalCode: '560001', country: 'India' },
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Ordered 10 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Approx 15 mins
  }
];

    
