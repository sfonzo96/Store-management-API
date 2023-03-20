import ProductDTO from '../dto/productDTO.js';

export default class ProductsService {
    constructor({ ProductRepository, WebsocketService }) {
        this.dao = ProductRepository;
        this.websocket = WebsocketService;
    }

    createProduct = async (data) => {
        try {
            const newProduct = await this.dao.create(data);

            // ws emit to all clients to update real time view
            const productsList = await this.dao.getManyPaginated();
            this.websocket.io.emit('reloadList', productsList);

            return new ProductDTO(newProduct);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getProducts = async (query, options) => {
        try {
            query = { ...{ deleted: false }, ...query };

            const paginatedList = await this.dao.getManyPaginated(
                query,
                options
            );

            // ws emit to all clients to update real time view
            this.websocket.io.emit('reloadList', paginatedList.docs);

            const newData = {
                ...paginatedList,
                options,
            };
            // MEMO: Hacer DTO para lista de productos??
            return newData;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getProduct = async (productID) => {
        try {
            const product = await this.dao.getById(productID);
            return new ProductDTO(product);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateProduct = async (productID, data) => {
        try {
            const updatedProduct = await this.dao.update(
                { _id: productID },
                data,
                {
                    new: true,
                }
            );

            // ws emit to all clients to update real time view
            const productsList = await this.dao.getManyPaginated();
            this.websocket.io.emit('reloadList', productsList);

            return new ProductDTO(updatedProduct);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteProduct = async (productID) => {
        try {
            this.dao.delete(productID);

            // ws emit to all clients to update real time view
            const productsList = await this.getProducts();
            this.websocket.io.emit('reloadList', productsList);
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
