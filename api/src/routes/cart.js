const {Router} = require("express");
const UserLogin = require("../utils/login/user-login");
const sequelize = require("../database/utils/config");
const router = Router();
const CartModel = require("../database/models/cart-model")(sequelize);
const CartItemModel = require("../database/models/cart-items-model")(sequelize);
const ProductModel = require("../database/models/product-model")(sequelize);

router
    /**
     * vérification de connexion utilisateur
     */
    .use((request,response,next) => {
        if(!UserLogin.isLogged(request) ){
            response.json({
                success: false,
                error: "Veuillez vous connectez avant d'utiliser votre panier"
            });
        }
        else next();
    })
    /**
     * créer un nouveau panier
     * @post cart-name nom du panier
     */
    .post("/nouveau",async (request,response) => {
        if(!("cart-name" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez donner à votre panier"
            });
            return;
        }

        const userId = UserLogin.getLoginData(request,"id").id;

        // on vérifie que l'utilisateur n'a pas déjà un panier portant ce nom
        const foundedCart = await CartModel.findOne({
            where: {
                userId: userId,
                cartName: request.body["cart-name"]
            }
        });

        if(foundedCart !== null){
            response.json({
                success: false,
                error: "Vous possédez déjà un panier avec ce nom"
            });
            return;
        }

        CartModel.create({
            cartName: request.body["cart-name"],
            userId: userId
        }).then((cart) => {
            response.json({
                success: true,
                cartId: cart.id
            });
        }).catch((err) => {
            const errorMessage = "errors" in err ? err.errors[0].message : "Echec de création du panier";

            response.json({
                success: false,
                error: errorMessage
            });
        });
    })
    /**
     * supprime le panier
     */
    .post("/supprimer/:cartId",async (request,response) => {
        // ré&cupération du panier à supprimer
        const cart = await CartModel.findOne({
            where: {
                id: request.params.cartId,
                userId: UserLogin.getLoginData(request,"id").id
            }
        });

        if(cart == null){
            response.json({
                success: false,
                error: "Vous ne pouvez pas supprimer ce panier"
            });
            return;
        }

        // suppression du panier et ses articles
        CartItemModel.destroy({
            where: {
                cartId: cart.id
            }
        });

        await cart.destroy();

        response.json({success: true});
    })
    /**
     * affiche le panier utilisateur
     */
    .post("/mon-panier/:cartId",async (request,response) => {
        const cart = await CartModel.findOne({
            where: {
                id: request.params.cartId,
                userId: UserLogin.getLoginData(request,"id").id
            }
        });

        if(cart === null){
            response.json({
                success: false,
                error: "Vous ne pouvez pas utiliser ce panier"
            });
            return;
        }

        // élements du panier
        const items = await CartItemModel.findAll({
            where: {
                cartId: cart.id
            }
        });

        // rangement par catégorie
        const ordereredItems = {};

        for (const item of items) {
            // récupération de la catégorie
            const product= await ProductModel.findByPk(item.productId);

            if(!(product.categoryId in ordereredItems) ) ordereredItems[product.categoryId] = [];

            // ajout parmis les élements de la catégorie
            ordereredItems[product.categoryId].push({
                itemId: item.id,
                quantity: item.quantity,
                product: product
            });
        }

        response.json({
            success: true,
            cart: cart,
            itemsPerCategory: ordereredItems
        });
    })
    /**
     * ajoute un élement dans le panier ou met à jour l'élement si déjà présent
     * @post product-id id du produit
     * @post quantity quantité du produit
     */
    .post("/ajouter-element/:cartId",async (request,response) => {
        if(!("product-id" in request.body) || ! ("quantity" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez choisir le produit et sa quantité"
            });
            return;
        }

        // récupération du panier
        const cart = await CartModel.findOne({
            where: {
                id: request.params.cartId,
                userId: UserLogin.getLoginData(request,"id").id
            }
        });

        if(cart === null){
            response.json({
                success: false,
                error: "Vous ne pouvez pas utiliser ce panier"
            });
            return;
        }

        // récupération de l'article s'il existe
        const cartItem = await CartItemModel.findOne({
            cartId: cart.id,
            productId: request.body["product-id"]
        });

        let actionPromise;

        if(cartItem !== null){
            // mise à jour de la quantité
            actionPromise = cartItem.update({
                quantity: request.body["quantity"]
            });
        }
        else{
            // création
            actionPromise = CartItemModel.create({
                cartId: cart.id,
                productId: request.body["product-id"],
                quantity: request.body["quantity"]
            });
        }

        actionPromise
            .then(() => {
                response.json({success: true});
            })
            .catch(err => {
                const errorMessage = "errors" in err ? err.errors[0].message : "Echec de mise à jour du panier";

                response.json({
                    success: false,
                    error: errorMessage
                });
            })
    });

module.exports = router;
