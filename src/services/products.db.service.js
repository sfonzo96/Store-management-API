import ProductDTO from '../dto/productDTO.js';

export default class ProductsService {
  constructor({ ProductRepository, WebsocketService }) {
    this.productsDao = ProductRepository;
    this.websocketService = WebsocketService;
  }

  createProduct = async (data) => {
    try {
      const newProduct = await this.productsDao.create(data);

      // ws emit to all clients to update real time view
      const productsList = await this.productsDao.getManyPaginated();
      this.websocketService.io.emit('reloadList', productsList);

      return new ProductDTO(newProduct);
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
      return new ProductDTO(product);
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

      return new ProductDTO(updatedProduct);
    } catch (error) {
      throw error;
    }
  };

  deleteProduct = async (productID) => {
    try {
      this.productsDao.delete(productID);

      // ws emit to all clients to update real time view
      const productsList = await this.getProducts();
      this.websocketService.io.emit('reloadList', productsList);
    } catch (error) {
      throw error;
    }
  };
}
