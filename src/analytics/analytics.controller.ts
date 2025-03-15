import { Controller, Get, } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // @Get('top-products')
  // async getTopSellingProducts() {
  //   const products = await this.productRepository.find();
    
  //   const result: { productId: number; name: string; totalSales: number }[] = [];

  //   for (const product of products) {
  //     const totalSales = await this.orderRepository
  //       .createQueryBuilder('order')
  //       .select('SUM(order.quantity)', 'totalSales')
  //       .where('order.productId = :productId', { productId: product.id })
  //       .getRawOne();

  //     result.push({
  //       productId: product.id,
  //       name: product.name,
  //       totalSales: totalSales?.totalSales || 0,
  //     });
  //   }

  //   return result.sort((a, b) => b.totalSales - a.totalSales).slice(0, 10);
  // }

  // Optimize Query
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

}
