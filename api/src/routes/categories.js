/**
 * gestion des catégories
 */

const {Router} = require("express");
const AdminLogin = require("../utils/login/admin-login");
const sequelize = require("../database/utils/config");
const CategoryModel = require("../database/models/category-model")(sequelize);
const ProductModel = require("../database/models/product-model")(sequelize);
const router = Router();
const adminRequireRouter = Router();

router
    /**
     * récupère la liste des catégories
     */
    .post("/",async (request,response) => {
        response.json({
            success: true,
            categories: await CategoryModel.findAll()
        });
    });

adminRequireRouter
    /**
     * vérification de connexion admin
     */
    .use((request,response,next) => {
        if(!AdminLogin.isLogged(request)){
            response.json({
                success: false,
                error: "Vous devez être connecté en tant qu'administrateur"
            });
        }
        else next();
    })
    /**
     * crée une catégorie
     * @post name
     */
    .post("/creer",async (request,response) => {
        if(!("name" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez fournir le nom de la nouvelle catégorie"
            });
            return;
        }

        CategoryModel.create({
            categoryName: request.body.name
        }).then(() => {
            response.json({success: true});
        }).catch(err => {
            const errorMessage = "errors" in err ? err.errors[0].message : "Echec de création de la catégorie";

            response.json({
                success: false,
                error: errorMessage
            });
        });
    })
    /**
     * suppression d'une catégorie
     */
    .post("/supprimer/:categoryId",async (request,response) => {
        await ProductModel.destroy({
            where: {categoryId: request.params.categoryId}
        });

        await CategoryModel.destroy({
            where: {
                id: request.params.categoryId
            }
        });

        response.json({
            success: true
        });
    })
    /**
     * mettre à jour une catégorie
     * @post name nouveau nom de la catégorie
     */
    .post("/mettre-a-jour/:categoryId",async (request,response) => {
        if(!("name" in request.body) ){
            response.json({
               success: false,
               error: "Veuillez fournir le nouveau nom de la catégorie"
            });
            return;
        }

        const category = await CategoryModel.findByPk(request.params.categoryId);

        if(category !== null){
            category.update({
                categoryName: request.body.name
            }).then(() => {
                response.json({success: true});
            }).catch(err => {
                const errorMessage = "errors" in err ? err.errors[0].message : "Echec de mise à jour du nom de la catégorie";

                response.json({
                    success: false,
                    error: errorMessage
                });
            });
        }
        else
            response.json({
                success: false,
                error: "La catégorie à mettre à jour n'a pas été trouvée"
            });
    });

router.use(adminRequireRouter);

module.exports = router;