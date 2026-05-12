const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

dotenv.config();

const products = [
  ["iPhone 15 Pro", "Apple", 58999, 62999, "Smart Phones", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80"],
  ["Samsung Galaxy S24", "Samsung", 42999, 46999, "Smart Phones", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80"],
  ["Google Pixel 8", "Google", 33999, 36999, "Smart Phones", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"],
  ["Xiaomi Redmi Note 13", "Xiaomi", 11999, 13999, "Smart Phones", "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=900&q=80"],
  ["Oppo Reno 11", "Oppo", 16999, 18999, "Smart Phones", "https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=900&q=80"],
  ["iPad Air", "Apple", 29999, 32999, "Tablets", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80"],
  ["Samsung Galaxy Tab S9", "Samsung", 34999, 37999, "Tablets", "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80"],
  ["Lenovo Tab P12", "Lenovo", 17999, 19999, "Tablets", "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=900&q=80"],
  ["Logitech MX Master 3S", "Logitech", 4999, 5499, "Mouses", "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80"],
  ["Razer Basilisk V3", "Razer", 3699, 4299, "Mouses", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80"],
  ["Canon EOS R50", "Canon", 38999, 42999, "Cameras", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"],
  ["Sony ZV-E10", "Sony", 42999, 46999, "Cameras", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80"],
  ["Apple Watch Series 9", "Apple", 18999, 20999, "Smart Watches", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
  ["Samsung Galaxy Watch 6", "Samsung", 13999, 15999, "Smart Watches", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"],
  ["MacBook Air 13", "Apple", 57999, 61999, "Laptops", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"],
  ["Dell XPS 15", "Dell", 69999, 74999, "Laptops", "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80"],
  ["HP Pavilion 15", "HP", 27999, 30999, "Laptops", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"],
  ["Lenovo Legion 5", "Lenovo", 54999, 58999, "Laptops", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
  ["Gaming PC RTX 4060", "Techtronic", 64999, 69999, "PCs", "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80"],
  ["Office Desktop PC", "Dell", 24999, 27999, "PCs", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80"],
  ["HP LaserJet Pro", "HP", 8999, 9999, "Printers", "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80"],
  ["Canon Pixma G3420", "Canon", 6999, 7999, "Printers", "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80"],
  ["AirPods Pro 2", "Apple", 11999, 13499, "Earbuds", "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80"],
  ["Samsung Buds2 Pro", "Samsung", 7499, 8499, "Earbuds", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80"],
  ["Sony WH-1000XM5", "Sony", 16999, 18999, "Head Phones", "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80"],
  ["JBL Tune 720BT", "JBL", 3999, 4699, "Head Phones", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"],
  ["Asus ROG Strix Laptop", "Asus", 74999, 80999, "Laptops", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80"],
  ["Acer Nitro V", "Acer", 39999, 43999, "Laptops", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80"],
  ["Huawei Watch GT 4", "Huawei", 9999, 11499, "Smart Watches", "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?auto=format&fit=crop&w=900&q=80"],
  ["Garmin Venu 3", "Garmin", 21999, 23999, "Smart Watches", "https://images.unsplash.com/photo-1503328427499-d92d1ac3d174?auto=format&fit=crop&w=900&q=80"],
  ["Canon EOS 250D", "Canon", 29999, 32999, "Cameras", "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=900&q=80"],
  ["Nikon Z30", "Nikon", 35999, 38999, "Cameras", "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?auto=format&fit=crop&w=900&q=80"],
  ["Logitech Pebble Mouse", "Logitech", 1299, 1599, "Mouses", "https://images.unsplash.com/photo-1613141412501-9012977f1969?auto=format&fit=crop&w=900&q=80"],
  ["Apple Magic Mouse", "Apple", 5999, 6499, "Mouses", "https://images.unsplash.com/photo-1629429407756-124a2d01fd86?auto=format&fit=crop&w=900&q=80"],
  ["iPad Mini", "Apple", 24999, 27999, "Tablets", "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=80"],
  ["Microsoft Surface Pro", "Microsoft", 45999, 49999, "Tablets", "https://images.unsplash.com/photo-1527698266440-12104e498b76?auto=format&fit=crop&w=900&q=80"],
  ["Beats Studio Pro", "Beats", 14999, 16999, "Head Phones", "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80"],
  ["Anker Soundcore Life Q30", "Anker", 3499, 3999, "Head Phones", "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80"],
  ["Nothing Ear 2", "Nothing", 4999, 5799, "Earbuds", "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&w=900&q=80"],
  ["Jabra Elite 8 Active", "Jabra", 6999, 7999, "Earbuds", "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=80"]
];

const users = Array.from({ length: 10 }, (_, index) => ({
  name: `Student User ${index + 1}`,
  email: `user${index + 1}@student.com`,
  password: "123456"
}));

async function seed() {
  await connectDB();
  await mongoose.connection.collection("categories").deleteMany({}).catch(() => {});

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({})
  ]);

  await Product.insertMany(products.map(([name, brand, price, oldPrice, category, image], index) => ({
    name,
    brand,
    price,
    oldPrice,
    image,
    gallery: [image],
    category,
    stock: 8 + (index % 18),
    featured: index < 12,
    specs: ["Original product", "Warranty included", "Fast delivery"],
    description: `${name} is a high quality ${brand} product available now at Techtronic.`
  })));

  for (const user of users) {
    await User.create(user);
  }

  console.log(`Seed complete: ${users.length} users and ${products.length} products.`);
  console.log("Demo login: user1@student.com / 123456");
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
