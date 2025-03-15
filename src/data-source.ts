import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./products/entities/product.entity";
import { Order } from "./orders/entities/order.entity";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "nest",
  password: process.env.DB_PASSWORD || "nest",
  database: process.env.DB_NAME || "nest_perf",
  entities: [Product, Order],
  synchronize: true, // Set to `false` in production
  logging: true,
});
