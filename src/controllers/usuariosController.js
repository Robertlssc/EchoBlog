import { z } from "zod";
import Usuarios from "../models/usuariosModel.js";
import formatZodError from "../helpers/formatZodError.js";

//?Helpers
import creatUserToken from "../helpers/create-user-token.js";

const createSchema = z.object({
  nome: z
    .string()
    .min(5, { message: "o nome deve ter pelo menos 3 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  email: z
    .string()
    .min(3, { message: "o email deve ter pelo menos 5 caracteres" })
    .email({ message: "Este email é inválido" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const getSchema = z.object({
  id: z.string().uuid({ message: "o id da tarefa está inválido" }),
});

const updateSchema = z.object({
  nome: z
    .string()
    .min(5, { message: "o nome deve ter pelo menos 5 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  email: z
    .string()
    .min(5, { message: "o email deve ter pelo menos 5 caracteres" })
    .email({ message: "Este email é inválido" }),
});

export const criarUsuario = async (request, response) => {
  const bodyValidation = createSchema.safeParse(request.body);
  if (!bodyValidation.success) {
    response.status(400).json({
      message: "Os dados recebidos são inválidos",
      detalhes: bodyValidation.error,
    });
    return;
  }
  const { nome, email, senha, papel } = request.body;

  let imagem;

  if (request.file) {
    imagem = request.file.filename;
  } else {
    imagem = "usuarioDefault.png";
  }
  const usuario = {
    nome,
    email,
    senha,
    imagem,
    papel,
  };
  try {
    await Usuarios.create(usuario);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "erro ao cadastrar usuario" });
  }
};

export const loginUsuario = async (request, response) => {
  const { email, senha } = request.body;
  console.log(senha)
  console.log(email)
  try {
    const usuario = await Usuarios.findAll({ where: { email: email } });
    console.log(usuario, senha)
    response.status(500).json({ message: "Erro" })
    
  } catch (error) {
    console.log()
  }
};

export const atualizarUsuario = async (request, response) => {
  const paramValidation = getSchema.safeParse(request.params);
  if (!paramValidation.success) {
    response.stsatus(400).json({
      message: "Numero de identificação está inválido",
      details: formatZodError(paramValidation.error),
    });
    return;
  }
  const updateValidation = updateSchema.safeParse(request.body);
  if (!updateValidation.success) {
    response.status(400).json({
      message: "Dados para atualização incorretos",
      details: formatZodError(updateValidation.error),
    });
    return;
  }
  const { id } = request.params;
  const { nome, email, senha } = request.body;

  let imagem;
  if (request.file) {
    imagem = request.file.filename;
  }

  const usuarioAtualizado = {
    nome,
    email,
    senha,
    imagem,
  };
  try {
    const [linhasAfetadas] = await Usuarios.update(usuarioAtualizado, {
      where: { id },
    });
    if (linhasAfetadas === 0) {
      response.status(404).json({ message: "Usuario não encontrado" });
      return;
    }
    response.status(200).json({ message: "Usuario atualizado" });
  } catch (error) {
    response.status(400).json({ error: "Erro ao atualizar usuario" });
    console.log();
  }
};
