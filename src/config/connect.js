require("dotenv").config();
const { Sequelize } = require("sequelize");


const DB_CONNECTION = process.env.DB_CONNECTION
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_DATABASE = process.env.DB_DATABASE
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_PORT = process.env.DB_PORT
// const DB_URL = process.env.DB_URL

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

let conn = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

module.exports = { conn, sequelize }