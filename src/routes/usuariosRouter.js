import { Router } from "express";

import {
  atualizarUsuario,
  criarUsuario,
  loginUsuario,
} from "../controllers/usuariosController.js";

import imageUpload from "../helpers/image-upload.js";

const router = Router();

router.post("/", imageUpload.single("imagem"), criarUsuario);
router.put("/:id", imageUpload.single("imagem"), atualizarUsuario);
router.post("/login", loginUsuario);

export default router;
