import productDTO_res from '../dto/productDTO.res.js';
import mailing from '../utils/mailing.js';
export default class ProductsService {
  constructor({ ProductRepository, WebsocketService, UserRepository }) {
    this.productsDao = ProductRepository;
    this.usersDao = UserRepository;
    this.websocketService = WebsocketService;
  }

  createProduct = async (data) => {
    try {
      const newProduct = await this.productsDao.create(data);

      // ws emit to all clients to update real time view
      const productsList = await this.productsDao.getManyPaginated();
      this.websocketService.io.emit('reloadList', productsList);

      return new productDTO_res(newProduct);
    } catch (error) {
      throw error;
    }
  };

  getProducts = async (query, options) => {
    try {
      query = { ...{ deleted: false }, ...query };

      const paginatedList = await this.productsDao.getManyPaginated(
        query,
        options
      );

      // ws emit to all clients to update real time view
      this.websocketService.io.emit('reloadList', paginatedList.docs);

      const newData = {
        ...paginatedList,
        options,
      };
      // MEMO: Hacer DTO para lista de productos??
      return newData;
    } catch (error) {
      throw error;
    }
  };

  getProduct = async (productID) => {
    try {
      const product = await this.productsDao.getById(productID);
      return new productDTO_res(product);
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (productID, data) => {
    try {
      const updatedProduct = await this.productsDao.update(
        { _id: productID },
        data,
        {
          new: true,
        }
      );

      // ws emit to all clients to update real time view
      const productsList = await this.productsDao.getManyPaginated();
      this.websocketService.io.emit('reloadList', productsList);

      return new productDTO_res(updatedProduct);
    } catch (error) {
      throw error;
    }
  };

  deleteProduct = async (productID) => {
    try {
      const product = await this.productsDao.getById(productID);

      if (!product) {
        throw new CustomError('NOT_FOUND', 'Product not found.');
      }

      const productOwner = await this.usersDao.getById(product.owner.ownerId);

      if (productOwner.role === 'premium') {
        // Checks if the owner is premium, if so, notifies product deletion
        await mailing.sendProductDeletionNotice(product, productOwner.email);
      }

      await this.productsDao.delete(productID);

      // ws emit to all clients to update real time view
      const productsList = await this.getProducts();
      this.websocketService.io.emit('reloadList', productsList);

      return true;
    } catch (error) {
      throw error;
    }
  };
}
