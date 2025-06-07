import type { Product, Category, Order, UserProfile, DeliveryPartner } from './types';

export const mockCategories: Category[] = [
  { id: 'cat1', slug: 'fresh-produce', name: 'Fresh Produce', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png', dataAiHint: 'fruits vegetables' },
  { id: 'cat2', slug: 'dairy-bakery', name: 'Dairy & Bakery', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-3_9.png', dataAiHint: 'milk bread' },
  { id: 'cat3', slug: 'snacks-beverages', name: 'Snacks & Beverages', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png', dataAiHint: 'chips soda' },
  { id: 'cat4', slug: 'household-items', name: 'Household Items', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png', dataAiHint: 'cleaning supplies' },
  { id: 'cat5', slug: 'personal-care', name: 'Personal Care', imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png', dataAiHint: 'soap shampoo' },
];

export const mockProducts: Product[] = [
  // Updated Fresh Produce
  { id: 'prod1', slug: 'apples', name: 'Apples', description: 'Crisp and juicy red apples.', price: 2.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/apple/9-apple-png-image.png', dataAiHint: 'red apples', rating: 4.5, reviewsCount: 120, stock: 50 },
  { id: 'prod2', slug: 'bananas-ecuador', name: 'Bananas (Ecuador)', description: 'Sweet and ripe bananas from Ecuador.', price: 1.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/banana/4-bananas-png-image.png', dataAiHint: 'yellow bananas', rating: 4.7, reviewsCount: 90, stock: 30 },
  { id: 'prod3', slug: 'fresh-carrots-local', name: 'Fresh Carrots (Local)', description: 'Fresh, crunchy local carrots.', price: 0.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/carrot/1-carrot-png-image.png', dataAiHint: 'orange carrots', stock: 100 },
  // Dairy & Bakery
  { id: 'prod4', slug: 'whole-milk', name: 'Whole Milk (1L)', description: 'Fresh pasteurized whole milk.', price: 1.50, category: 'cat2', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'milk carton', rating: 4.8, reviewsCount: 200, stock: 75 },
  { id: 'prod5', slug: 'sliced-bread', name: 'Sliced Bread (Whole Wheat)', description: 'Soft whole wheat sliced bread.', price: 2.20, category: 'cat2', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'bread loaf', stock: 60 },
  // Snacks & Beverages
  { id: 'prod6', slug: 'potato-chips', name: 'Potato Chips (Salted)', description: 'Classic salted potato chips.', price: 1.75, category: 'cat3', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'chips bag', rating: 4.2, reviewsCount: 150, stock: 120 },
  { id: 'prod7', slug: 'cola-drink', name: 'Cola Drink (2L)', description: 'Refreshing cola beverage.', price: 2.50, category: 'cat3', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'soda bottle', stock: 80 },
  // Household Items
  { id: 'prod8', slug: 'dish-soap', name: 'Dish Soap (500ml)', description: 'Effective grease-cutting dish soap.', price: 3.00, category: 'cat4', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'soap bottle', rating: 4.6, reviewsCount: 70, stock: 40 },
  // Personal Care
  { id: 'prod9', slug: 'toothpaste', name: 'Toothpaste (Mint)', description: 'Mint flavored toothpaste for fresh breath.', price: 2.10, category: 'cat5', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'toothpaste tube', stock: 90 },
  { id: 'prod10', slug: 'avocado', name: 'Avocado Hass (Single)', description: 'Creamy Hass avocado.', price: 1.20, category: 'cat1', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'green avocado', rating: 4.9, reviewsCount: 250, stock: 0 }, // Out of stock example

  // New Products from the list
  { id: 'prod11', slug: 'organic-spinach', name: 'Organic Spinach', description: 'Fresh organic spinach leaves, packed with nutrients.', price: 2.49, category: 'cat1', imageUrl: 'https://img.freepik.com/premium-photo/sorrel-herbs-isolated-white_183352-422.jpg?w=740', dataAiHint: 'green spinach', rating: 4.6, reviewsCount: 55, stock: 40 },
  { id: 'prod12', slug: 'orange', name: 'Orange', description: 'Juicy and sweet oranges, rich in Vitamin C.', price: 0.79, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/orange/4-orange-png-image-download.png', dataAiHint: 'orange fruit', rating: 4.4, reviewsCount: 70, stock: 60 },
  { id: 'prod13', slug: 'broccoli-organic', name: 'Broccoli (Organic)', description: 'Fresh organic broccoli head, great for steaming or roasting.', price: 2.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/broccoli/99291-green-broccoli-hd-image-free.png', dataAiHint: 'green broccoli', rating: 4.7, reviewsCount: 65, stock: 35 },
  { id: 'prod14', slug: 'mangoes-alphonso', name: 'Mangoes (Alphonso)', description: 'Sweet and flavorful Alphonso mangoes, the king of mangoes.', price: 4.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/mango/11-2-mango-png-clipart.png', dataAiHint: 'yellow mango', rating: 4.9, reviewsCount: 150, stock: 20 },
  { id: 'prod15', slug: 'cherry-tomatoes', name: 'Cherry Tomatoes', description: 'Sweet and juicy cherry tomatoes, perfect for salads.', price: 3.29, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/tomato/1-tomato-png-image.png', dataAiHint: 'red tomatoes', rating: 4.5, reviewsCount: 80, stock: 45 },
  { id: 'prod16', slug: 'pomegranate', name: 'Pomegranate', description: 'Fresh pomegranate with antioxidant-rich seeds.', price: 3.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/pomegranate/5-pomegranate-png-image.png', dataAiHint: 'red pomegranate', rating: 4.6, reviewsCount: 90, stock: 25 },
  { id: 'prod17', slug: 'potatoes', name: 'Potatoes', description: 'Versatile potatoes, ideal for mashing, baking, or frying.', price: 1.49, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/potato/11-2-potato-transparent.png', dataAiHint: 'brown potatoes', rating: 4.3, reviewsCount: 110, stock: 70 },
  { id: 'prod18', slug: 'strawberries-fresh', name: 'Strawberries (Fresh)', description: 'Sweet, ripe, and fresh strawberries.', price: 4.50, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/strawberry/23343-7-strawberry-image.png', dataAiHint: 'red strawberries', rating: 4.8, reviewsCount: 100, stock: 30 },
  { id: 'prod19', slug: 'cucumber', name: 'Cucumber', description: 'Cool and crisp cucumber, great for salads and hydration.', price: 0.99, category: 'cat1', imageUrl: 'https://freepngimg.com/thumb/cucumber/20-cucumbers-png-image.png', dataAiHint: 'green cucumber', rating: 4.4, reviewsCount: 60, stock: 55 },
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
      { productId: 'prod1', name: 'Apples', quantity: 1, price: 2.99 }, // Updated name
      { productId: 'prod4', name: 'Whole Milk (1L)', quantity: 2, price: 1.50 },
    ],
    totalAmount: 5.99, // Recalculate if prices changed significantly, here it's fine
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
      { productId: 'prod2', name: 'Bananas (Ecuador)', quantity: 1, price: 1.99 }, // Updated name
      { productId: 'prod5', name: 'Sliced Bread (Whole Wheat)', quantity: 1, price: 2.20 },
    ],
    totalAmount: 4.19, // Recalculate if prices changed significantly
    status: 'Confirmed',
    deliveryAddress: { street: '789 Pine Ln', city: 'Bangalore', postalCode: '560001', country: 'India' },
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Ordered 10 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Approx 15 mins
  }
];
