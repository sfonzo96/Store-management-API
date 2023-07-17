/* import mongoose from 'mongoose';
import supertest from 'supertest';
import chai from 'chai';
import dbtest from '../dbtest.js';

const expect = chai.expect;

const requester = supertest('http://localhost:8080');

// Mocks
const productMock = {
  title: 'Producto 3',
  description: 'Este es el producto 3',
  price: 200,
  thumbnail: 'Sin imagen',
  stock: 23,
  code: 'AAA003',
  category: 'tipo2',
  status: true,
};

const cartMock = {
  products: [
    { product: '63c9c4c8de32fc136566faf8', quantity: 2 },
    { product: '63c9c515de32fc136566fb00', quantity: 1 },
    { product: '63c9c5b0de32fc136566fb06', quantity: 3 },
  ],
};

const userMock = {
  firstName: 'Santiago',
  lastName: 'Fonzo',
  email: 'sfonzo@test.com',
  age: '26',
  password: 'santi123',
  role: 'admin', // to pass authorization middleware
  id: '63e643afe7b38d2141f2cf35', //fake id to simulate logged user
};

describe('Testing Routers', () => {
  before(async () => {
    await dbtest();
  });
  beforeEach(async () => {
    await mongoose.connection.collection('carts').deleteMany({});
    await mongoose.connection.collection('products').deleteMany({});
    await mongoose.connection.collection('users').deleteMany({});
  });
  after(async () => {
    mongoose.connection.close();
  });

  //Carts Router tests

  describe('Testing CartsRouter', () => {
    it('Creates a cart', async () => {
      const response = await requester.post('/api/carts');
      expect(response.statusCode).to.equal(201);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
    it('Soft deletes (empties) a cart', async () => {
      const createCartResponse = await requester.post('/api/carts');
      const cartID = createCartResponse._body.data.id;
      const response = await requester.delete(`/api/carts/${cartID}}`);
      expect(response.statusCode).to.equal(200);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
    it('Updates a cart', async () => {
      const createCartResponse = await requester.post('/api/carts');
      const cartID = createCartResponse._body.data.id;
      const response = await requester
        .put(`/api/carts/${cartID}`)
        .send(cartMock);
      expect(response.statusCode).to.equal(200);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
    it('Updates the quantity of a product in a cart ', async () => {
      const createCartResponse = await requester.post('/api/carts');
      const cartID = createCartResponse._body.data.id;
      const updateCartResponse = await requester
        .put(`/api/carts/${cartID}`)
        .send(cartMock);
      const response = await requester
        .put(`/api/carts/${cartID}/product/63c9c4c8de32fc136566faf8`)
        .send({ quantity: 5 });
      expect(response.statusCode).to.equal(200);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
  });

  //Products Router tests

  describe('Testing ProductsRouter', () => {
    it('Creates a product', async () => {
      const response = await requester
        .post('/api/products')
        .set('user', JSON.stringify(userMock)) //User object in headers in order to pass required authorization
        .send(productMock);
      expect(response.statusCode).to.equal(201);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
    it('Gets all the products', async () => {
      const response = await requester.get('/api/products');
      expect(response.statusCode).to.equal(200);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
    it('Gets a product', async () => {
      const createProductResponse = await requester
        .post('/api/products')
        .set('user', JSON.stringify(userMock)) //User object in headers in order to pass required authorization
        .send(productMock);
      const response = await requester.get(
        `/api/products/${createProductResponse._body.data.id}`
      );
      expect(response.statusCode).to.equal(200);
      expect(response.ok).to.be.true;
      expect(response._body.success).to.be.true;
    });
  });

  // Passport Local (Sessions) Router tests
  describe('Testing PassportRouter', () => {
    it('Logs in a user', async () => {
      delete userMock.id;
      delete userMock.role;
      const createUserResponse = await requester
        .post('/api/users')
        .send(userMock);
      expect(createUserResponse.statusCode).to.equal(302); // If creation successful controller redirects (302 code)
      const response = await requester.post('/api/passport/login').send({
        email: userMock.email,
        password: userMock.password,
      });
      expect(response.statusCode).to.equal(302); // If creation successful controller redirects (302 code)
    });
    it('Logs out a user', async () => {});
  });
});
 */
