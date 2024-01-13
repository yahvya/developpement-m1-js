/**
 * gestionnaire de session admin
 */
class AdminLogin{
    /**
     * clé de stockage en session des données administrarteurs
     * @type {string}
     */
    static ADMIN_SESSION_STORAGE_KEY = "u.l.admin-login.session";

    /**
     *
     * @return {boolean} si l'administrateur est connecté
     */
    static isLogged(){
        return true;
    }
}

module.exports = {
    AdminLogin : AdminLogin
};