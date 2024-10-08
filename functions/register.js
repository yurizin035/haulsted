const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { username, whatsapp, email, password } = JSON.parse(event.body);
        const filePath = path.join(__dirname, '../users.json');

        const current_balance = 0;
        const total_spent = 0;
        const total_deposited = 20;
        const current_status = "novato";
        const porcentagem = 8;
        const spend_to_level_up = 230.00;
        const recent_acquisitions = [];
        const next_status = "junior";

        // Lê o conteúdo do arquivo JSON existente
        let data = { users: [] };

        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath);
            data = JSON.parse(jsonData);
        }

        // Verifica se o username, whatsapp ou email já foram usados
        for (const user of data.users) {
            if (user.username === username) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "O nome de usuário já está em uso." }),
                };
            }
            if (user.whatsapp === whatsapp) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "O número de WhatsApp já está em uso." }),
                };
            }
            if (user.email === email) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "O email já está em uso." }),
                };
            }
        }

        // Adiciona o novo usuário ao array de usuários
        data.users.push({
            username,
            whatsapp,
            email,
            password,
            current_balance,
            total_spent,
            total_deposited,
            current_status,
            porcentagem,
            spend_to_level_up,
            next_status,
            recent_acquisitions,
        });

        // Converte o array atualizado de volta para JSON e salva no arquivo
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Cadastro realizado com sucesso!" }),
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método não permitido." }),
        };
    }
};
