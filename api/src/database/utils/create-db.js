/**
 * crée les tables de la base de données
 * @param sequelize instance sequelize
 */
module.exports = (sequelize) => {
    // définition des modèles
    require("../models/category-model")(sequelize);
    require("../models/product-model")(sequelize);
    require("../models/user-model")(sequelize);

    // synchronisation des modèles avec la base de donnée
    (async () => sequelize.sync({force: true,logging: true}))();
}