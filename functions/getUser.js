const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  // Ajuste o caminho para fora da pasta de funções
  const jsonFile = path.resolve(__dirname, '../data/users.json');

  const email = event.queryStringParameters.email;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parâmetro email é necessário' }),
    };
  }

  try {
    const jsonData = fs.readFileSync(jsonFile, 'utf-8');
    const data = JSON.parse(jsonData);

    const user = data.users.find(u => u.email === email);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuário não encontrado' }),
      };
    }

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
