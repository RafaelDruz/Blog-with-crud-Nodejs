const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth"); 
const multer = require('multer');
const path = require("path");
const fs = require("fs");
 
router.get("/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category, required: true}]
    }).then(articles => {
        if(req.session.user.email == '') {
            res.render("admin/articles/indexadmin",{ articles: articles});
        }else{
            const userId = req.session.user.id;
            Article.findAll({
                where: { userId: userId },
                include: [Category]
            }).then(articles => {
                res.render("client/articles/index", { articles });
            });
        }
    });
});

router.get("/articles/new", adminAuth,(req, res) => {
    const userIdauthart = req.session.user.id;
    Category.findAll().then(categories => {
       res.render("client/articles/new", {categories: categories, userIdauthart}) 
    })
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + Date.now() + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else {
        cb(null, false);
        console.log('Insert a JPEG, PNG or JPG image.')
    }
}

const upload = multer({storage, fileFilter, overwrite: true});

const checkUploadLimit = (req, res, next) => {
    if (!req.file || req.file.length > 1) {
        return res.status(400).send('Maximum of 1 photos');
    }
    next();
};

router.post("/articles/save", upload.single('file'), checkUploadLimit, adminAuth, async (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var image = req.file.path; 
    var user = req.body.userId;
    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        image: image,
        categoryId: category,
        userId: user
    }).then(() => {
        res.redirect("/articles")
    });
});

router.post("/articles/delete", async (req, res) => {
    const { id } = req.body;
    if (!id || isNaN(id)) {
      return res.redirect("/articles");
    }
    try {
        const article = await Article.findByPk(id);
        const imagePath = article.image;
        await fs.promises.unlink(imagePath);
        await Article.destroy({ where: { id } });
        res.redirect("/articles");
      } catch (err) {
        console.error(err);
        res.redirect("/articles");
      }
});

router.get("/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/articles")
    } else {
        Article.findByPk(id).then(article => {
            if(article != undefined){
                Category.findAll().then(categories => {
                    res.render("client/articles/edit", {article: article, categories: categories})
                });
            } else {
                res.redirect("/articles");
            }
        }).catch(err => {
            res.redirect("/articles");
            console.log(err)
        });
    }
});

router.post("/articles/update", upload.single('image'), (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var image_path = req.body.image_path;
    if(req.file){
        var image = req.file.path;
        fs.unlink(image_path, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Old deleted file');
            }
        });
    } else {
        var image = image_path;
    }
    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        image: image,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/articles")
    });
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    if(isNaN(page) || page == 1){
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 6;
    }
    Promise.all([
        Article.findAndCountAll({
            limit: 6,
            offset: offset,
            order: [['id', 'DESC']]
        }),
        Article.findAll({
            order: [['id', 'DESC']],
            limit: 10
        }),
        Category.findAll()
    ]).then(([articlesw, articles, categories]) => {
        var next;
        if(offset + 4 >= articlesw.count){
            next = false;
        }else{
            next = true;
        }
        var result = {
            page: parseInt(page),
            next: next,
            articlesw: articlesw
        }
        const authenticated = req.session.user !== undefined;
        res.render('pagination/articles/page', { result: result, articles: articles, categories: categories, authenticated: authenticated });
    }).catch(err => {
        json.error(err);
    })
});

module.exports = router;

