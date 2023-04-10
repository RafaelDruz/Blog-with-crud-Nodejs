const express = require("express");
const Category = require("./Category");
const router  = express.Router();
const slugify = require("slugify");
const Article = require("../articles/Article");
const adminAuth = require("../middlewares/adminAuth"); 

router.get("/categories/new", adminAuth, (req, res) => {
    const userIdauth = req.session.user.id;
    res.render("admin/categories/new", { userIdauth });
});

router.post("/categories/save", async (req, res) => {
    var title = req.body.title;
    var user = req.body.userId;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title),
            userId: user
        }).then(() => {
            res.redirect("/categories"); 
        })
    }else{
        res.redirect("/categories/new");
    }
});

router.get("/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/categories");
            });
        }else{
            res.redirect("/categories");
        }
    }else{
        res.redirect("/categories");
    }
});

router.get("/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/categories")
    } else {
       Category.findByPk(id).then(category => {
            if(category != undefined){
                res.render("admin/categories/edit", {category: category})
            } else {
                res.redirect("/categories");
            }
        }).catch(err => {
            res.redirect("/categories")
        }) 
    }
});
 
router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/categories");
    }).catch(err => {
        res.redirect("/categories");
        console.log("fall Update.")
    });
    
});

router.get("/categories/page/:num/:categoryId/:title", (req, res) => {
    var pagec = req.params.num;
    var id = req.params.categoryId;
    var title = req.params.title;
    var offset = 0;
    if(isNaN(pagec) || pagec == 1){
        offset = 0;
    } else {
        offset = (parseInt(pagec) - 1) * 5;
    }
    Promise.all([
        Article.findAndCountAll({
            limit: 5,
            offset: offset,
            order: [
                ['id', 'DESC']
            ],
            where: {
                categoryId: id
            }
        }),
        Article.findAll({
            order: [['id', 'DESC']],
            limit: 10,
        }),
        Category.findAll()
    ]).then(([articlesz, articles, categories]) => {
        var nextc;
        if(offset + 5 >= articlesz.count){
            nextc = false;
        }else{
            nextc = true;
        }
        var resultc = {
            pagec: parseInt(pagec),
            nextc: nextc,
            articlesz: articlesz,
            id,
            title,
        }
        const authenticated = req.session.user !== undefined;
        res.render("pagination/categories/page", {resultc: resultc, articles: articles, categories: categories, authenticated: authenticated})
    }).catch(err => {
        json.error(err);
    })
});

module.exports = router;