'use strict';

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import userRoutes from "../src/users/user.routes.js";
import authRoutes from "../src//auth/auth.routes.js";
import publicacionRoutes from "../src//publicaciones/publicaciones.routes.js";
import comentarioRoutes from "../src//comentarios/comentario.routes.js";
import limiter from "../src/middlewares/validar-cant-peticiones.js";


const middlewares = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use("/gestorOpiniones/v1/auth", authRoutes)
    app.use("/gestorOpiniones/v1/user", userRoutes)
    app.use("/gestorOpiniones/v1/posts" , publicacionRoutes)
    app.use("/gestorOpiniones/v1/comments", comentarioRoutes)
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