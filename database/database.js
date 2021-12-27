
const Sequelize = require('sequelize');

const connection = new Sequelize('blog','root','Bl0g123',{
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: "-03:00" //Trocando UTC Universal para UTC do Brazil
});

module.exports = connection;