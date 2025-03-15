# Optimization of `getTopSellingProducts` API

## 📌 Overview
This document outlines the optimization process applied to the `getTopSellingProducts` API to enhance its performance. The initial implementation faced inefficiencies due to redundant queries, which were addressed through query optimization using SQL joins.

---

## **Previous Issues**

The original implementation suffered from the following performance bottlenecks:

1. **N+1 Query Problem**: The previous approach retrieved product details separately for each product, leading to multiple database queries.
2. **Unoptimized Query Execution**: Fetching sales data and product details separately increased the overall query execution time.
3. **Higher Database Load**: Due to multiple queries, the database had to process more requests than necessary, affecting response time and scalability.


## **Optimized Solution**

To address these inefficiencies, I refactored the query to:

- Use a **single query with JOINs** to retrieve product details and aggregated sales data.
- Reduce the number of database queries from multiple to just **one efficient query**.
- Utilize **GROUP BY and ORDER BY** to efficiently rank the top-selling products.

### **🔹 Optimized Code Implementation**
```typescript
@Get('top-products')
async getTopSellingProducts() {
  const result = await this.orderRepository
    .createQueryBuilder('order')
    .select('product.id', 'productId')
    .addSelect('product.name', 'name')
    .addSelect('SUM(order.quantity)', 'totalSales')
    .innerJoin('order.product', 'product')
    .groupBy('product.id')
    .orderBy('totalSales', 'DESC')
    .limit(10)
    .getRawMany();

  return {
    success: true,
    data: result,
  };
}
```


## 📊 **Performance Improvements**

By implementing this optimized query, I have significantly improved the efficiency of the `getTopSellingProducts` API, reducing database load and enhancing response times.

---

## 📌 **Setup & Execution**

### **🔹 Project Setup**
- Ensure that your database and TypeORM are properly configured.

clone the repo:
  ```bash

  ```
- Install dependencies using:
  ```bash
  npm install
  ```

### **🔹 Running the Project Locally**
1. **Start the required services using Docker:**
   ```bash
   docker-compose up -d
   ```
2. **Seed the database with test data:**
   ```bash
   npm run seed
   ```
3. **Start the NestJS application:**
   ```bash
   npm run start:dev
   ```

Once the server is running, access the API at:
```bash
GET http://localhost:4000/analytics/top-products
```

---

## 📌 **Conclusion**
This optimization has successfully eliminated redundant queries, improving the API’s efficiency and reducing the load on the database. The optimized approach ensures better performance and scalability while maintaining data accuracy.
