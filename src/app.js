const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const categoriesController = require("../categories/CategoriesController.js");
const articlesController = require("../articles/ArticlesController.js");
const userController = require("../user/UserController.js")
const Article = require("../articles/Article.js");
const Category = require("../categories/Category.js");
const { Op } = require("sequelize");

app.use(cors());

app.set('view engine', 'ejs');

app.use('/uploads', express.static('uploads'));

app.use(cookieParser("senhacookie"));

app.use(session({
    secret: "password", 
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: (1000 * 60 * 60 * 24)} 
}));
 
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use("/", categoriesController);

app.use("/", articlesController);

app.use("/", userController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ], 
        limit: 6
    }).then(articlesA => {
        Category.findAll().then(categories => {
            Article.findAll({
                order: [
                    ['id', 'DESC']
                ], 
                limit: 10
            }).then(articles => {
                const authenticated = req.session.user !== undefined;
              res.render("pagination/indexpage/index", {articlesA: articlesA, categories: categories, articles: articles, authenticated: authenticated });  
            })
        });
    });
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                Article.findAll({
                    where: {
                        slug: {
                            [Op.ne]: slug
                        }
                    },
                    order: [
                        ['id', 'DESC']
                    ], 
                    limit: 10
                }).then(articles => {
                    const authenticated = req.session.user !== undefined;
                    res.render("pagination/indexpage/article", {article: article, categories: categories, articles: articles, authenticated: authenticated });  
                });
            }); 
        }else{
            res.redirect("/");
        }
    });
})

module.exports = app;