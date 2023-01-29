import productsServices from "../services/products.db.services.js";
import cartsServices from "../services/carts.db.services.js";

export async function getHome(req, res) { // Shoulb be replaced by a real home view
    try {
        res.status(200).render('index', {});
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}

export async function getProducts(req, res) {
    try {
        const {limit, sort, page} = req.query;
        const options = {
            limit: limit? Number(limit) : 10,
            sort: sort? {price: sort} : {},
            page: page? Number(page) : 1,
            lean: true
        }
        let query = {}
        if (req.query.category) query.category = req.query.category;
        const paginatedData = await productsServices.getProducts(query, options);
        if (paginatedData) {
            res.status(200).render('products', paginatedData)
        }
        else {
            res.status(404).json({ Error: "Products not found" })
        };
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}

export async function getRealTimeProducts(req, res) {
    try {
        const paginatedData = await productsServices.getProducts({},{lean: true});
        if (paginatedData) {
            res.status(200).render('realTimeProducts', paginatedData)
        }
        else {
            res.status(404).json({ Error: "Products not found" })
        };
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}

export async function getCart(req, res) {
    try {
        const {cartID} = req.params;
        const cart = await cartsServices.getCart(cartID);
        if (cart) {
            res.status(200).render('cart', cart)
        }
        else {
            res.status(404).json({ Error: "Cart not found" })
        };
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}

export async function getChat(req, res) {
    try {
        res.status(200).render('chat')
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}

