const express = require("express");
const router = express.Router();
const Catergory = require("../model/Category");
const slugify = require("slugify");
const Category = require("../model/Category");
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new");
});



router.post("/categories/save", adminAuth, (req, res) => {
    let title = req.body.title;
    if (title != undefined) {
        Catergory.create({
            title: title,
            slug: slugify(title) //transformar uma string em um slug, por exemplo "Desenvolvimento Web Mobile" para "desenvolvimento-web-mobile"
        }).then(() => {
            res.redirect("/admin/categories");
        })
    } else {
        res.redirect("admin/categories/new")
    }
})

router.get("/admin/categories", adminAuth, (req, res) => {
    Catergory.findAll().then(categories => {
        res.render("admin/categories/index", {
            categories: categories
        });
    })

})

router.post("/categories/delete", adminAuth,(req, res) => {
    let id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(
                Article.destroy({
                    where: {
                        id: id
                    }
                }).then(res.redirect("/admin/categories")))
        } else {
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
})

router.get("/admin/categories/edit/:id", adminAuth,(req, res) => {
    let id = req.params.id

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id) //pesquisar pela chave primaria
        .then(category => {
            if (category != undefined) {
                res.render("admin/categories/edit", {
                    category: category
                })
            } else {
                res.redirect("/admin/categories");
            }
        })
})

router.post("/categories/update", adminAuth,(req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    Category.update({
        title: title,
        slug: slugify(title)

    }, {
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    })
})




module.exports = router;