const {Router} = require("express");
const AdminLogin = require("../utils/login/admin-login");
const UserLogin = require("../utils/login/user-login");
const sequelize = require("../database/utils/config");
const UserModel = require("../database/models/user-model")(sequelize);
const generator = require("generate-password");
const router = Router();
const notLoggedRouter = Router();
const crypto = require("crypto");

/**
 * gestion de compte administrateur (connexion, création de compte)
 */

router
    /**
     * déconnexion de l'administrateur
     */
    .post("/deconnexion",(request,response) => {
        AdminLogin.logout(request);

        response.json({
            success: true
        });
    })
    /**
     * ajout d'un nouvel administrateur
     * @post pseudo pseudo de l'administrateur
     */
    .post("/nouveau",(request,response) => {
        if(!AdminLogin.isLogged(request) ){
            response.json({
                success: false,
                error: "Vous devez être connecté en tant qu'administrateur"
            });
            return;
        }

        if(!("pseudo" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez créer un pseudo pour l'administrateur"
            });
            return;
        }

        // génération du mot de passe
        const minLen = 11;
        const maxLen = 14;
        const adminPassword = generator.generate({
            length: crypto.randomInt(minLen,maxLen + 1),
            numbers: true,
            excludeSimilarCharacters: true,
            symbols: true
        });

        UserModel.create({
            role: "admin",
            pseudo: request.body.pseudo,
            password: adminPassword
        }).then(() => {
            response.json({
                success: true,
                adminPassword: adminPassword
            });
        }).catch(err => {
            const errorMessage = "errors" in err ? err.errors[0].message : "Echec de création du compte administrateur";

            response.json({
                success: false,
                error: errorMessage
            });
        });
    });

notLoggedRouter
    /**
     * vérification de non connexion
     */
    .use((request,response,next) => {
        if(AdminLogin.isLogged(request) || UserLogin.isLogged(request) )
            response.json({
                success: false,
                error: "Vous êtes déjà connecté"
            });
        else
            next();
    })
    /**
     * connexion administrateur
     * @post pseudo pseudo admin
     * @post password mot de passe admin
     */
    .post("/connexion",async (request,response) => {
        // vérification des données post attentues
        if(!("pseudo" in request.body) || !("password" in request.body) ){
            response.json({
                success: false,
                error: "Veuillez fournir le pseudo et le mot de passe"
            });
            return;
        }

        try{
            // tentative de connexion utilisateur
            await AdminLogin.logAdminFrom(request,request.body.pseudo,request.body.password);

            response.json({
                success: true
            });
        }
        catch(error){
            response.json({
                success: false,
                error: error.message
            });
        }
    });


router.use(notLoggedRouter);

module.exports = router;