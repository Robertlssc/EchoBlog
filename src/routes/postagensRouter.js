import { Router } from "express";
import upload from "../helpers/uploadMiddleware.js";
import {
  AtualizarPostagem,
  criarPostagem,
  DeletarPostagem,
  ListarPostagens,
  ListarUnicaPostagem,
  UploadImagem,
} from "../controllers/postagensController.js";

import imageUpload from "../helpers/image-upload.js";

const router = Router();

router.post("/", imageUpload.single("imagem"), criarPostagem);
router.get("/", ListarPostagens);
router.get("/:id", ListarUnicaPostagem);
router.put("/:id", imageUpload.single("imagem"), AtualizarPostagem);
router.delete("/:id", DeletarPostagem);
router.post("/:id/imagem", imageUpload.single("imagem"), UploadImagem);

export default router;
