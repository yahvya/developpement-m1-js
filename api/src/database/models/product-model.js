const {DataTypes, Deferrable} = require("sequelize");

/**
 * table des produits
 */

module.exports = (sequelize) => sequelize.define("ProductModel",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        field: "categorie",
        allowNull: false,
        references: {
            model: "categorie",
            key: "id_categorie"
        }
    },
    creationDate: {
        type: DataTypes.DATE,
        field: "date_in",
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updateDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "date_up",
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: "designation"
    }
},{
    timestamps: false,
    tableName: "produits"
});