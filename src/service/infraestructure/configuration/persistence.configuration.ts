import { Options } from "sequelize";

require('dotenv').config()
export const persistenceConfig: Options = {
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	dialect: "postgres",
	sync:{alter:true}
}
