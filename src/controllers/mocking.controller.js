/* import { faker } from '@faker-js/faker';

export default class MockingController {
  // Creates a fake product list with 100 items
  getFakeProducts = async (req, res, next) => {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(await this.createFakeProduct());
      }
      res.status(200).json({ success: true, products });
    } catch (error) {
      next(error);
    }
  };

  // Creates a fake product
  createFakeProduct = async () => {
    return {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      thumbnail: faker.image.imageUrl(),
      stock: faker.datatype.number(),
      code: faker.datatype.uuid(),
      category: faker.commerce.department(),
      owner: faker.database.mongodbObjectId(),
      status: faker.datatype.boolean(),
    };
  };
}
 */
