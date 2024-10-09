// netlify/functions/getUserByEmail.js

exports.handler = async (event) => {
    // Verifica se o parâmetro email foi passado na URL
    const email = event.queryStringParameters.email;

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Parâmetro email é necessário' }),
        };
    }

    try {
        // Define o caminho para o arquivo JSON (deve estar no mesmo servidor)
        const jsonFileUrl = 'https://haulsted.netlify.app/users.json';
        
        // Faz uma requisição para o arquivo JSON
        const response = await fetch(jsonFileUrl);

        if (!response.ok) {
            throw new Error('Erro ao acessar o arquivo JSON');
        }

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
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao processar o arquivo JSON' }),
        };
    }
};
