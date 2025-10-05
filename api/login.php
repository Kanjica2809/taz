<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

// Configurações do banco de dados
$db_path = __DIR__ . '/../database/sistema.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao conectar com o banco de dados']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
}

session_start();

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['email']) || !isset($dados['senha'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Email e senha são obrigatórios']);
    exit;
}

$email = trim($dados['email']);
$senha = $dados['senha'];

try {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome'];
        $_SESSION['usuario_email'] = $usuario['email'];
        
        echo json_encode([
            'mensagem' => 'Login realizado com sucesso',
            'usuario' => [
                'id' => $usuario['id'],
                'nome' => $usuario['nome'],
                'email' => $usuario['email'],
                'telefone' => $usuario['telefone'],
                'endereco' => $usuario['endereco']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['erro' => 'Email ou senha incorretos']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao fazer login']);
}
?>