/**
 * table des paniers
 * @param sequelize
 */
const {DataTypes, ValidationError} = require("sequelize");
module.exports = (sequelize) => {
    const model = sequelize.define("CartModel",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
            references: {
                model: "wuser",
                key : "id",
                name: "id"
            }
        },
        cartName: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "cart_name",
            validate: {
                len: {
                    args: [2,20],
                    msg: "Le nom de votre panier doit contenir entre 2 et 40 caractères"
                }
            }
        }
    },{
        tableName: "cart"
    });

    model.beforeCreate(async (row) => {
        // on vérifie le nombre de paniers
        const maxCartPerUser = parseInt(process.env.MAX_CART_PER_USER);
        const countOfUserCart = await model.count({
            where: {
                userId: row.userId
            }
        });

        if(countOfUserCart === maxCartPerUser) throw new ValidationError("Vous avez atteint le nombre maximum de panier autorisé", [
            {
                message: "Vous avez atteint le nombre maximum de panier autorisé",
                type: "Validation error",
                path: "userId"
            }
        ]);
    });

    return model;
};