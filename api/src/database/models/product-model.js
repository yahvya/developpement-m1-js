const {DataTypes, Deferrable} = require("sequelize");

/**
 * table des produits
 */

module.exports = (sequelize) => {
    const model = sequelize.define("ProductModel",{
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
                key: "id_categorie",
                name: "id"
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
            field: "designation",
            unique: {
                msg: "Un produit portant le même nom existe déjà"
            },
            validate: {
                len: {
                    args: [2,40],
                    msg: "Le nom doit contenir entre 2 et 40 caractères"
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            field: "prix",
            validate: {
                min: {
                    args: [0],
                    msg: "Le produit doit avoir un prix supérieur à 0"
                }
            }
        }
    },{
        timestamps: false,
        tableName: "produits"
    });

    model.beforeUpdate(modelInstance => {
        modelInstance.updateDate = new Date().toISOString();
    });

    return model;
};