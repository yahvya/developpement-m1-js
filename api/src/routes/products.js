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
        if(await CategoryModel.findOne({where: {id: request.params.categoryId} }) === null){
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
    });

router.use(adminRequiredRouter);

module.exports = router;