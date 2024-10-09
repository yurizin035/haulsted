const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const jsonUrl = 'https://haulsted.netlify.app/data/users.json';

  // Verifica se o parâmetro email foi passado na URL
  const email = event.queryStringParameters.email;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parâmetro email é necessário' }),
    };
  }

  try {
    // Faz a requisição para obter o arquivo JSON
    const response = await fetch(jsonUrl);
    const data = await response.json();

    // Busca o usuário com o email fornecido
    const user = data.users.find(u => u.email === email);

    // Verifica se o usuário foi encontrado
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuário não encontrado' }),
      };
    }

    // Retorna o usuário dentro da array 'users'
    return {
      statusCode: 200,
      body: JSON.stringify({ users: [user] }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar o arquivo JSON' }),
    };
  }
};
