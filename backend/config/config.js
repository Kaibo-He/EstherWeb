require('dotenv').config(); // 读取 .env 配置

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "EstherWeb",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false, // 关闭 SQL 日志
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME_TEST || "EstherWeb_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false, // 关闭 SQL 日志
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME_PROD || "EstherWeb_prod",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
};
