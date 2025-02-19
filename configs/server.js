'use strict';

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import { connect } from "mongoose";

const middlewares = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {

}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexion a la base de datos exitosa');
    } catch (error) {
        console.log('Error connecting to the database: ', error);
        proccess.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.port || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (e) {
        console.log(`Error starting the server: ${e}`);
    }
}