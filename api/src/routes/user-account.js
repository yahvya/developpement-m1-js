const {Router} = require("express");
const AdminLogin = require("../utils/login/admin-login");
const UserLogin = require("../utils/login/user-login");
const sequelize = require("../database/utils/config");
const UserModel = require("../database/models/user-model")(sequelize);
const router = Router();
const notLoggedRouter = Router();

/**
 * gestion de compte administrateur (connexion, création de compte)
 */

router
    /**
     * déconnexion de l'utilisateur
     */
    .post("/deconnexion",(request,response) => {
        UserLogin.logout(request);

        response.json({
            success: true
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
     * connexion utilisateur
     * @post pseudo pseudo utilisateur
     * @post password mot de passe
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
            await UserLogin.logUserFrom(request,request.body.pseudo,request.body.password);

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
    })
    /**
     * inscription utilisateur
     * @post pseudo pseudo utilisateur
     * @post password mot de passe utilisateur
     */
    .post("/inscription",(request,response) => {
        if("pseudo" in request.body && "password" in request.body){
            // tentative de création du compte
            UserModel.create({
                pseudo: request.body.pseudo,
                password: request.body.password,
                role: "user"
            }).then(() => {
                response.json({success: true});
            }).catch(err => {
                const errorMessage = "errors" in err ? err.errors[0].message : "Echec de création du compte";

                response.json({
                    success: false,
                    error: errorMessage
                });
            });
        }
        else
            response.json({
                success: false,
                error: "Veuillez saisir votre pseudo et votre mot de passe"
            });
    });

router.use(notLoggedRouter);

module.exports = router;