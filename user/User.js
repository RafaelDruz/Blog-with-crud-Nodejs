
const Sequelize = require("sequelize");
const connection = require("../databases/database.js");

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isadmin: { 
        type: Sequelize.STRING, 
        default: false,
    }
})

User.sync({force: false}); 

module.exports = User;