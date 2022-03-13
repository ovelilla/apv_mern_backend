import express from "express";
import { registrar, perfil, confirmar, autenticar, recuperar, comprobarToken, restablecer, actualizarPerfil, actualizarPassword } from '../controllers/usuarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/recuperar', recuperar);
router.route('/recuperar/:token').get(comprobarToken).post(restablecer);

router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;
