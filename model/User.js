const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define("users",{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    adm:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

//User.sync({force: true})
// Sempre que recarregar irá recriar a tabela


module.exports = User;