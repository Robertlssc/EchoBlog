import jwt from "jsonwebtoken";

//assincrono
const creatUserToken = async (usuario, request, response) => {
  //criar token
  const token = jwt.sign({
      email: usuario.email,
      senha: usuario.senha,
      papel: usuario.papel,
    },
    "SENHASUPERSEGURAEDIFICIL" //senha
  );
  //console.log(token)
  //Retorna o token
  response.status(200).json({
    message: "Você está logado!",
    token: token,
    usuarioId: usuario.id,
  });
};

export default creatUserToken;