const express = require("express");
const router = express.Router();
const Category = require("../model/Category");
const Article = require("../model/Article");
const slugify = require("slugify");
const { text } = require("body-parser");
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/articles", adminAuth, (req,res)=>{
    Article.findAll({
        include: [{model: Category}] // JOIN, sempre que encontrar um artigo, irá encontrar os dados de categoria referente
    }).then((articles)=>{
        res.render("admin/articles/index", { articles: articles})     
    })
   
})

router.get("/admin/articles/new", adminAuth, (req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
    
});

router.post("/articles/save", adminAuth, (req,res)=>{
   let title = req.body.title;
   let body = req.body.body;
   let category = req.body.category;

   Article.create({
       title: title,
       slug: slugify(title),
       body: body,
       //Campo criado após ser relacionado - Chave Estrangeria
       categoryId: category
   }).then(()=>{
       res.redirect("/admin/articles")
   })
   
});


router.post("/articles/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(res.redirect("/admin/articles"))
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
})



router.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
    let id = req.params.id

    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }
    Category.findAll().then(categories => {
        return categories
    }).then((categories)=>{
        Article.findByPk(id) 
        .then((article)=> {
            if (article == undefined) {
                res.redirect("/admin/articles");
            }else{
                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                })
            }
            
        })
    })
    
})

router.post("/articles/update", adminAuth,(req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.categoryId

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId

    }, {
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.get("/articles/page/:num",(req,res)=>{
    let page = req.params.num;
    let offset = 0;
    let totalArticlesByPage = 3

    if(isNaN(page) || page == 1){
        offset=0;
    }else{
        offset = parseInt(page -1) * totalArticlesByPage //calculo para mostrar 3 por pagina
    }

    Article.findAndCountAll(
        {
            limit: totalArticlesByPage,   // limitando os dados para 3, ou seja criando page com 3 artigosz
            offset: offset,  //Irá mostrar a partir de ...
            order: [['id', 'DESC']]

        }
    ).then(articles => { 
        let next = true;
        if(offset + totalArticlesByPage >= articles.count){
            next = false;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles, 
        }

        Category.findAll().then(categories => {
            res.render("articles/page",{result:result,categories:categories,session: req.session.user})
        })

       //devolve um resposta em json para o brownser
    })
})

module.exports = router;