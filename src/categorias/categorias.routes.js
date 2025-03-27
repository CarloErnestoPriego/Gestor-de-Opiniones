import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { postCategory, getCategories, searchCategory, updateCategory, deleteCategory } from './categorias.controller.js';

const router = new Router();

router.post(
    '/', 
    
    validarJWT,
    postCategory
);

router.get(
    '/',
    getCategories
);

router.get(
    '/:id',
    searchCategory
);

router.delete(
    '/:id',
    validarJWT,
    deleteCategory
);

router.put(
    '/:id',
    validarJWT,
    updateCategory
);

export default router;