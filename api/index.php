<?php
// Define o caminho para o arquivo JSON
$jsonFile = 'users.json';

// Verifica se o parâmetro email foi passado na URL
if (!isset($_GET['email'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Parâmetro email é necessário']);
    exit;
}

$email = $_GET['email'];

// Lê o conteúdo do arquivo JSON
$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

// Verifica se a decodificação do JSON foi bem-sucedida
if ($data === null) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Erro ao processar o arquivo JSON']);
    exit;
}

// Busca o usuário com o email fornecido
$user = null;
foreach ($data['users'] as $u) {
    if ($u['email'] === $email) {
        $user = $u;
        break;
    }
}

// Verifica se o usuário foi encontrado
if ($user === null) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'Usuário não encontrado']);
    exit;
}

// Retorna o usuário dentro da array 'users'
header('Content-Type: application/json');
echo json_encode(['users' => [$user]]);
?>
