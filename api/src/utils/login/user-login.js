const sequelize = require("../../database/utils/config");
const UserModel = require("../../database/models/user-model")(sequelize);
const bcrypt = require("bcrypt");

/**
 * gestionnaire de session utilisateur
 */
class UserLogin{
    /**
     * clé de stockage en session des données administrarteurs
     * @type {string}
     */
    static USER_SESSION_STORAGE_KEY = "userloginsession";

    /**
     * connecte l'utilisateur
     * @param request la requête
     * @param userPseudo pseudo utilisateur
     * @param userPassword mot de passe utilisateur
     * @throws Error en cas d'echec de connexion
     */
    static async logUserFrom(request,userPseudo,userPassword){
        // recherche du compte
        const user = await UserModel.findOne({
            where: { pseudo: userPseudo,role: "user" }
        });

        if(user === null) throw new Error("Compte non trouvé");

        // vérification du mot de passe
        if(!bcrypt.compareSync(userPassword,user.password) ) throw new Error("Mot de passe incorrect");

        request.session[UserLogin.USER_SESSION_STORAGE_KEY] = {
            pseudo: user.pseudo,
            joinDate: user.joinDate,
            id: user.id
        };
    }

    /**
     *
     * @param request requête
     * @return si l'utilisateur est connecté
     */
    static isLogged(request){
        return UserLogin.USER_SESSION_STORAGE_KEY in request.session;
    }

    /**
     * déconnecte l'utilisateur
     * @param request requête
     */
    static logout(request){
        delete request.session[UserLogin.USER_SESSION_STORAGE_KEY];
    }
}
module.exports = UserLogin;