import { AppDataSource } from '../data-source'; // Import your TypeORM DataSource
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';


async function seed() {
  console.log("Initializing database connection...");

  await AppDataSource.initialize()
    .then(() => console.log("Database connected successfully!"))
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });

  const connection = AppDataSource;

  // Seed products
  const products = Array.from({ length: 100 }, (_, i) => ({
    name: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
  }));
  await connection.getRepository(Product).save(products);
  console.log("Products seeded successfully!");

  // Fetch all products
  const productRepository = connection.getRepository(Product);
  const allProducts = await productRepository.find();

  // Seed orders
  console.log("Seeding orders...");
  const orders: Array<Partial<Order>> = [];
  for (let i = 0; i < 10_000; i++) {
    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
    if (randomProduct) {
      orders.push({
        product: randomProduct,
        quantity: Math.floor(Math.random() * 10) + 1,
      });
    }
  }
  await connection.getRepository(Order).save(orders);
  console.log("Orders seeded successfully!");

  await connection.destroy();
  console.log("Database connection closed.");
}

seed().catch((error) => console.error("Seeding failed:", error));
