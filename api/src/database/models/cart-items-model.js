/**
 * table du contenu des paniers
 */
const {DataTypes} = require("sequelize");
module.exports = (sequelize) => {
    return sequelize.define("CartItemModel",{
        productId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "produits",
                key: "id"
            }
        },
        cartId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "cart",
                key: "id"
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: "La quantité doit être d'au moins 1"
                }
            }
        }
    },{
        timestamps: false,
        tableName: "cart_items"
    });
};