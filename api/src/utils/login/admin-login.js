const sequelize = require("../../database/utils/config");
const UserModel = require("../../database/models/user-model")(sequelize);
const bcrypt = require("bcrypt");

/**
 * gestionnaire de session admin
 */
class AdminLogin{
    /**
     * clé de stockage en session des données administrarteurs
     * @type {string}
     */
    static ADMIN_SESSION_STORAGE_KEY = "adminloginsession";

    /**
     * tente de créer la session administrateur
     * @param request la requête
     * @param adminPseudo pseudo admin
     * @param adminPassword mot de passe admin
     * @throws Error en cas d'erreur
     */
    static async logAdminFrom(request,adminPseudo,adminPassword){
        // recherche du compte
        const user = await UserModel.findOne({
            where: { pseudo: adminPseudo,role: "admin" }
        });

        if(user === null) throw new Error("Compte non trouvé");

        // vérification du mot de passe
        if(!bcrypt.compareSync(adminPassword,user.password) ) throw new Error("Mot de passe incorrect");

        request.session[AdminLogin.ADMIN_SESSION_STORAGE_KEY] = {
            pseudo: user.pseudo,
            joinDate: user.joinDate,
            id: user.id
        };
    }

    /**
     * @param request la requête
     * @return {boolean} si l'administrateur est connecté
     */
    static isLogged(request){
        return AdminLogin.ADMIN_SESSION_STORAGE_KEY in request.session;
    }

    /**
     * déconnecte l'administrateur
     * @param request requête
     */
    static logout(request){
        delete request.session[AdminLogin.ADMIN_SESSION_STORAGE_KEY];
    }

    /**
     * récupère les données de session admin
     * @param request la requete
     * @param toGet clés à récupérer {id, pseudo, joinDate}
     */
    static getLoginData(request,...toGet){
        // map de liaison des clés pouvant être envoyé par l'utilisateur aux réelles clés
        const linkMap = {
            id: "id",
            pseudo: "pseudo",
            joinDate: "joinDate"
        };

        const result = {};

        if(AdminLogin.ADMIN_SESSION_STORAGE_KEY in request.session){
            // récupération des données
            for(const key of toGet){
                if (key in linkMap) result[key] = request.session[AdminLogin.ADMIN_SESSION_STORAGE_KEY][linkMap[key] ];
            }
        }

        return result;
    }
}

module.exports = AdminLogin;