const Sequelize = require("sequelize");
const connection = require("../databases/database");
const Category = require("../categories/Category");
const User = require("../user/User.js")

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        
    },slug:{
        type: Sequelize.STRING,
       
    },
    body: {
        type: Sequelize.TEXT,
        
    },
    image: {
        type: Sequelize.STRING,
       
    }
})

Category.hasMany(Article);

Article.belongsTo(Category);

User.hasMany(Article);

Article.belongsTo(User, {
    constraint: true,
    foreignKey: 'userId'
});

Article.sync({force: false});

module.exports = Article;