const fetch = require('node-fetch'); // Se estiver usando Node.js 18+, fetch já é nativo

exports.handler = async (event, context) => {
    // Verifica se o parâmetro de email foi passado
    const email = event.queryStringParameters.email;
    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Parâmetro email é necessário' }),
        };
    }

    try {
        // URL do arquivo JSON hospedado
        const jsonFileUrl = 'https://haulsted.netlify.app/data/users.json';
        
        // Faz a requisição para buscar o arquivo JSON
        const response = await fetch(jsonFileUrl);
        
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao acessar o arquivo JSON');
        }

        // Converte a resposta em JSON
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

        // Retorna o usuário
        return {
            statusCode: 200,
            body: JSON.stringify({ users: [user] }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        // Tratamento de erros
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao processar o arquivo JSON' }),
        };
    }
};
