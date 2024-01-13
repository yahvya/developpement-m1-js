const bcrypt = require("bcrypt");
const {DataTypes} = require("sequelize");

/**
 * table utilisateur
 */

module.exports = (sequelize) => {
    const model = sequelize.define("UserModel",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pseudo: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("admin","user"),
            allowNull: false
        },
        joinDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false,
        tableName: "wuser"
    });

    // hashage de mot de passe avant insertion
    model.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password);
    });

    return model;
}