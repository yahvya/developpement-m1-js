/**
 * crée les tables de la base de données
 * @param sequelize instance sequelize
 */
module.exports = async (sequelize) => {
    // définition des modèles
    require("../models/product-model")(sequelize);
    require("../models/category-model")(sequelize);
    require("../models/cart-items-model")(sequelize);
    require("../models/cart-model")(sequelize);
    const UserModel = require("../models/user-model")(sequelize);

    // synchronisation des modèles avec la base de donnée
    await sequelize.sync({force: true,logging: true});

    // création de l'administrateur par défaut
    await UserModel.create({
        pseudo: "defaultadmin",
        password: "motdepasse",
        role: "admin"
    });

    // création de l'utilisateur par défaut
    await UserModel.create({
        pseudo: "sael",
        password: "motdepasse",
        role: "user"
    });
}