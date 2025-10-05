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

// Criar diretório do banco se não existir
if (!is_dir(dirname($db_path))) {
    mkdir(dirname($db_path), 0777, true);
}

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

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['nome']) || !isset($dados['email']) || !isset($dados['senha'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados incompletos']);
    exit;
}

$nome = trim($dados['nome']);
$email = trim($dados['email']);
$senha = $dados['senha'];
$telefone = isset($dados['telefone']) ? trim($dados['telefone']) : null;
$endereco = isset($dados['endereco']) ? trim($dados['endereco']) : null;

// Validações básicas
if (empty($nome) || empty($email) || empty($senha)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nome, email e senha são obrigatórios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Email inválido']);
    exit;
}

if (strlen($senha) < 6) {
    http_response_code(400);
    echo json_encode(['erro' => 'Senha deve ter pelo menos 6 caracteres']);
    exit;
}

try {
    // Verificar se email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['erro' => 'Email já cadastrado']);
        exit;
    }
    
    // Hash da senha
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    
    // Inserir usuário
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha_hash, telefone, endereco) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nome, $email, $senha_hash, $telefone, $endereco]);
    
    http_response_code(201);
    echo json_encode([
        'mensagem' => 'Usuário cadastrado com sucesso', 
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar usuário']);
}
?>