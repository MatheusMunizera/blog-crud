const Sequelize = require("sequelize");
const connection = require("../database/database");

//Criando relação de modelos
const Category = require("./Category");

const Article = connection.define("articles",{

    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})


//Dizendo que um artigo pertence a uma categoria
// Relacionamento 1 - 1: usar belogsTo
 Article.belongsTo(Category);

//Dizendo que um categoria possui muitos artigos
// Relacionamento 1 - N: usar hasMany
Category.hasMany(Article);


//Sincronizar os models para criar as tabelas no banco
 //Article.sync({force: true})
// Sempre que recarregar irá recriar a tabela



module.exports = Article;