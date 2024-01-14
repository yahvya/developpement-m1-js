// routing
const {Router} = require("express");
const router = Router();
const adminRequiredRouter = Router();
const AdminLogin = require("../utils/login/admin-login");

// base de données
const sequelize = require("../database/utils/config");
const ProductModel = require("../database/models/product-model")(sequelize);
const CategoryModel = require("../database/models/category-model")(sequelize);



/**
 * crud produits
 */

router
    /**
     * récupération de la liste des produits
     */
    .post("/",async (request,response) => {
        response.json({
            success: true,
            products: await ProductModel.findAll()
        });
    })
    /**
     * récupération des produits d'une catégorie
     */
    .post("/categories/:categoryId",async (request,response) => {
        response.json({
            success: true,
            products: await ProductModel.findAll({where: {categoryId: request.params.categoryId} })
        });
    })
    /**
     * récupération d'un produit particulier
     */
    .post("/produit/:productId",async (request,response) => {
        const product = await ProductModel.findOne({
            where: {id : request.params.productId}
        });

        if(product === null)
            response.json({
                success: false,
                error: "Produit non trouvé"
            });
        else
            response.json({
                success: true,
                product: product
            });
    });

adminRequiredRouter
    /**
     * vérificateur de connexion en tant qu'administrateur
     */
    .use((request,response,next) => {
        if(AdminLogin.isLogged(request) )
            next();
        else
            response.json({
                success: false,
                error: "Vous devez être connecté en tant qu'administrateur"
            });
    })
    /**
     * création d'un produit
     * @post name nom du produit
     * @post price prix du produit
     */
    .post("/creer/:categoryId",async (request,response) => {
        // vérification d'existance de la catégorie
        if(await CategoryModel.findByPk(request.params.categoryId) === null){
            response.json({
                success: false,
                error: "La catégorie fournie n'existe pas"
            });

            return;
        }

        // vérification des données necessairs à la création
        if("name" in request.body && "price" in request.body){
            // création du produit
            ProductModel.create({
                name: request.body.name,
                price: request.body.price,
                categoryId: request.params.categoryId
            }).then(() => {
                response.json({success: true});
            }).catch(err => {
                // gestion de l'erreur de création
                const errorMessage = "errors" in err ? err.errors[0]["message"] : "Echec de création du produit";

                response.json({
                    success: false,
                    error: errorMessage
                });
            });
        }
        else
            response.json({
                success: false,
                error: "Veuillez fournir le nom et le prix de l'objet"
            });
    })
    /**
     * supprimer un produit
     */
    .post("/supprimer/:productId",async (request,response) => {
        const success = await ProductModel.destroy({
            where: {
                id: request.params.productId
            }
        });

        if(success)
            response.json({success: true});
        else
            response.json({
                success: false,
                error: "Le produit à supprimer n'existe pas"
            });
    })
    /**
     * mettre à jour un produit
     * @post price prix du produit
     * @post name nom du produit
     */
    .post("/mettre-a-jour/:productId/:categoryId",async (request,response) => {
        // on vérifie que le nouveau prix ou le nom soient présent
        if(!("price" in request.body) || !("name" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez fournir le nouveau nom et prix du produit"
            });
            return;
        }

        // on vérifie que la nouvelle catégorie existe
        if(await CategoryModel.findByPk(request.params.categoryId) === null){
            response.json({
                success: false,
                error: "La nouvelle catégorie n'a pas été trouvée"
            });
            return;
        }

        // on récupère le produit s'il n'existe
        const product = await ProductModel.findByPk(request.params.productId);

        if(product !== null){
            // mise à jour du produit
            product.update({
                name: request.body.name,
                price: request.body.price
            }).then(() => {
                response.json({success: true});
            }).catch(err => {
                // gestion de l'erreur de création
                const errorMessage = "errors" in err ? err.errors[0]["message"] : "Echec de mise à jour du produit";

                response.json({
                    success: false,
                    error: errorMessage
                });
            });
        }
        else
            response.json({
                success: false,
                error: "Le produit à mettre à jour n'a pas été trouvée"
            });
    });

router.use(adminRequiredRouter);

module.exports = router;