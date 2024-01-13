const {Router} = require("express");
const router = Router();
const sequelize = require("../database/utils/config");
const ProductModel = require("../database/models/product-model")(sequelize);

/**
 * récupération de la liste des routes
 */
router.get("/",async (request,response) => {
    const products = await ProductModel.findAll();

    return response.json({
        success: true,
        products: products
    });
});

module.exports = router;