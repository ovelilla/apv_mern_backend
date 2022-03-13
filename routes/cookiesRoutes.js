import express from "express";
import { setCookie, getCookie, deleteCookie } from '../controllers/cookiesController.js';

const router = express.Router();

router.post('/setcookie', setCookie);
router.post('/getcookie', getCookie);
router.post('/deletecookie', deleteCookie);

export default router;
