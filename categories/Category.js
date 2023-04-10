const Sequelize = require("sequelize");
const connection = require("../databases/database.js");
const User = require("../user/User.js")

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.hasMany(Category);

Category.belongsTo(User, {
    constraint: true,
    foreignKey: 'userId'
});


Category.sync({force: false}); 

module.exports = Category;