import ProductModel from '../models/products.model.js.js.js';
import webSocketService from './websocket.services.js';

class ProductsServices {
    
    async createProduct(data) {
        try {
            const newProduct = await ProductModel.create(data);
            // ws emit to all clients to update real time view
            const productsList = await this.getProducts(); // Se puede optimizar para no traer todos los productos?
            webSocketService.io.emit('reloadList', productsList);

            return newProduct;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProducts(query, options) {
        try {
            query = {...{deleted: false}, ...query}
            
            const paginatedList = await ProductModel.paginate(query, options);

            // ws emit to all clients to update real time view
            webSocketService.io.emit('reloadList', paginatedList.docs);

            const newData = {
                ...paginatedList,
                options
            }

            return newData;
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async getProduct(productID) {
        try {
            const product = await ProductModel.findById(productID).lean();
            return product;
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async updateProduct(productID, data) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(productID, data, {new: true}).lean();
            
            // ws emit to all clients to update real time view
            const productsList = await this.getProducts();
            webSocketService.io.emit('reloadList', productsList);

            return updatedProduct;
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async deleteProduct(productID) {
        try {
            await ProductModel.deleteById(productID);

            // ws emit to all clients to update real time view
            const productsList = await this.getProducts();
            webSocketService.io.emit('reloadList', productsList);

        } catch (error) {
            throw new Error(error.message)
        }
    }
}

const productsServices = new ProductsServices();
export default productsServices;