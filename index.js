const express = require("express");
const app = express();
var path=require('path');
const session = require("express-session");
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require("./controller/CategoriesController");
const articlesController = require("./controller/ArticlesController");
const usersController = require("./controller/UsersController");


const Article = require("./model/Article");
const Category = require("./model/Category");


const $_PORT = 2021;
//static
app.use(express.static(path.join((__dirname,'public'))));


//ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Session

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
    // secret: "qualquercoisa", cookie: { maxAge: 30000000 }
}))



//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(()=>{
        console.log('Connected to DB');
    }).catch((err) => {
        console.log(err)
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


app.get("/", (req, res) => {
   Article.findAll({
       order: [['createdAt', 'DESC']], // ordenando pela data de criação
       limit: 3
   }).then((articles) => {
       Category.findAll().then(categories => {
        console.log(req.session.user)
           res.render("index",{articles: articles, categories: categories, session: req.session.user})
       })
   })
})

app.get("/article/:slug", (req,res)=>{
    let slug = req.params.slug;

    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
           Category.findAll().then(categories => {
            res.render("articles/article", { article: article, categories: categories,session: req.session.user})
           })
        }else{
            res.render("/")
        }
        
    }).catch( err => {
        console.log(err)
    })
})

app.get("/category/:slug", (req,res)=>{
    let slug = req.params.slug;

    Category.findOne({
        where:{slug:slug},
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories,session: req.session.user})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => res.redirect("/"))
})


app.listen($_PORT, () => {
    console.log(`server open on port ${$_PORT}` );
})