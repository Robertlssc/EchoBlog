const getToken = (request) => {
  const autHeader = request.heards.authorization;
  const token = autHeader.split(" ")[1];

  return token;
};

export default getToken;
