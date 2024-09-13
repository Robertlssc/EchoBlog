import Postagem from "../models/postagensModel.js";
import { z } from "zod";
import formatZodError from "../helpers/formatZodError.js";

const createSchema = z.object({
  titulo: z
    .string()
    .min(3, { message: "o titulo deve ter pelo menos 3 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  conteudo: z
    .string()
    .min(3, { message: "o conteúdo deve ter pelo menos 3 caracteres" }),
});
const getSchema = z.object({
  id: z.string().uuid({ message: "o id da tarefa está inválido" }),
});
const updateSchema = z.object({
  titulo: z
    .string()
    .min(3, { message: "o titulo deve ter pelo menos 3 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  conteudo: z
    .string()
    .min(5, { message: "o conteúdo deve ter pelo menos 5 caracteres" })
    .transform((txt) => txt.toLowerCase()),
});
const deleteSchema = z.object({
  id: z.string().uuid({ message: "o id da tarefa está inválido" }),
});
//*importar o helpers zod para a validação

export const criarPostagem = async (request, response) => {
  const bodyValidation = createSchema.safeParse(request.body);
  if (!bodyValidation.success) {
    response.status(400).json({
      message: "os dados recebidos do corpo da aplicação são inválidos",
      detalhes: bodyValidation.error,
    });
    return;
  }
  const { titulo, conteudo, dataPublicacao, autor } = request.body;
  let imagem
  if(request.file){
    imagem = request.file.filename
  }else {
    imagem = "postagemDefault.png"
  }
  console.log(imagem)
  const novaPostagem = {
    titulo,
    conteudo,
    dataPublicacao,
    autor,
    imagem,
  };
  try {
    await Postagem.create(novaPostagem);
    response.status(201).json({ message: "postagem criada" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "erro ao cadastrar postagem" });
  }
};

export const ListarPostagens = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * 10;
  try {
    const postagens = await Postagem.findAndCountAll({
      limit,
      offset,
    });
    const totalPaginas = Math.ceil(postagens.count / limit);
    response.status(200).json({
      totalPostagens: postagens.count,
      totalPaginas,
      paginaAtual: page,
      itemsPorPagina: limit,
      proximaPagina:
        totalPaginas === 0
          ? null
          : `http://localhost:3333/postagens?page=${page + 1}`,
      postagens: postagens.rows,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "erro ao buscar postagens" });
  }
};
export const ListarUnicaPostagem = async (request, response) => {
  const paramValidator = getSchema.safeParse(request.params);
  if (!paramValidator.success) {
    response.status(400).json({
      message: "número de identificação está inválido",
      detalhes: formatZodError(paramValidator.error),
    });
    return;
  }
  const { id } = request.params;
  try {
    const postagem = await Postagem.findByPk(id);
    if (postagem === null) {
      response.status(404).json({ message: "postagem não encontrada" });
      return;
    }
    response.status(200).json(postagem);
  } catch (error) {
    response.status(500).json({ error: "erro ao buscar postagens" });
  }
};
export const AtualizarPostagem = async (request, response) => {
  const paramValidator = getSchema.safeParse(request.params);
  if (!paramValidator.success) {
    response.status(400).json({
      message: "Numero de identificação está inválido",
      detalhes: formatZodError(paramValidator.error),
    });
    return;
  }
  const updateValidator = updateSchema.safeParse(request.body);
  if (!updateValidator.success) {
    response.status(400).json({
      message: "dados para tualização estão incorretos",
      details: formatZodError(updateValidator.error),
    });
    return;
  }
  const { id } = request.params;
  const { titulo, conteudo, imagem } = request.body;
  const postagemAtualizada = {
    titulo,
    conteudo,
    imagem,
  };
  try {
    const [linhasAfetadas] = await Postagem.update(postagemAtualizada, {
      where: { id },
    });
    if (linhasAfetadas === 0) {
      response.status(404).json({ message: "Postagem não encontrada" });
      return;
    }
    response.status(200).json({ message: "postagem atualizada" });
  } catch (error) {
    response.status(500).json({ error: "erro ao atualizar postagem" });
  }
};
export const DeletarPostagem = async (request, response) => {
  const paramValidator = getSchema.safeParse(request.params);
  if (!paramValidator.success) {
    response.status(400).json({
      message: "número de identificação está inválido",
      detalhes: formatZodError(paramValidator.error),
    });
    return;
  }
  const { id } = request.params;
  try {
    const linhasAfetadas = await Postagem.destroy({
      where: { id },
    });
    if (linhasAfetadas === 0) {
      response.status(404).json({ message: "postagem não encontrada" });
      return;
    }
    response.status(200).json({ message: "postagem deletada" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "erro ao deletar postagem" });
  }
};
export const UploadImagem = async (request, response) => {
  try {
    const { id } = request.params;
    if (!request.file) {
      return response.status(400).json({ error: "imagem não enviada" });
    }
    const post = await Postagem.findByPk(id);
    if (!post) {
      return response.status(404).json({ message: "postagem nao encontrada" });
    }
    post.imagem = `/img/${request.file.filename}`;
    await post.save();
    response
      .status(200)
      .json({ message: "imagem enviada com sucesso", imagem: post.imagem });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    console.error(error)
    response.status(500).json({error: "erro ao enviar a imagem"})
  }
};
