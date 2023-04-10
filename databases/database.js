const Sequelize = require('sequelize')

const connection = new Sequelize("", "", "", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
});

connection .authenticate()
.then(() => {
    console.log("Connected with the database.");
}).catch((error) => {
    console.log("Error: The connection to the database was not made.");
});

module.exports = connection;