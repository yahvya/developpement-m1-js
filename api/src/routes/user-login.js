const {Router} = require("express");
const AdminLogin = require("../utils/login/admin-login");
const UserLogin = require("../utils/login/user-login");
const router = Router();

/**
 * gestion de la connexion utilisateur
 */

router
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

        if(!AdminLogin.isLogged(request) && !UserLogin.isLogged(request) ){
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
        }
        else
            response.json({
                success: false,
                error: "Vous êtes déjà connecté"
            });
    })
    /**
     * déconnexion de l'administrateur
     */
    .post("/deconnexion",(request,response) => {
        UserLogin.logout(request);

        response.json({
            success: true
        });
    });

module.exports = router;