const {DataTypes} = require("sequelize");

/**
 * table des catégories
 */

module.exports = (sequelize) => sequelize.define("CategoryModel",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_categorie"
    },
    categoryName: {
        type: DataTypes.STRING(40),
        field: "designation",
        allowNull: false,
        unique: {
            msg: "Une catégorie portant le même nom existe déjà"
        },
        validate: {
            len: {
                args: [2,40],
                msg: "Le nom de la catégorie doit contenir entre 2 et 40 caractères"
            }
        }
    }
},{
    timestamps: false,
    tableName: "categorie"
});