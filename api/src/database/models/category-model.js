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
        allowNull: false
    }
},{
    timestamps: false,
    tableName: "categorie"
});