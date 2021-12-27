const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define("categories",{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Sincronizar os models para criar as tabelas no banco
//Category.sync({force: true})
// Sempre que recarregar irá recriar a tabela


module.exports = Category;