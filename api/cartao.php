<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'config.php';

session_start();

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não autorizado. Faça login.']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        // Adicionar cartão
        $dados = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($dados['numero']) || !isset($dados['titular']) || !isset($dados['validade']) || !isset($dados['cvv'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("INSERT INTO cartoes (usuario_id, numero, titular, validade, cvv) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$usuario_id, $dados['numero'], $dados['titular'], $dados['validade'], $dados['cvv']]);
            
            echo json_encode(['mensagem' => 'Cartão adicionado com sucesso', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao adicionar cartão: ' . $e->getMessage()]);
        }
        break;
        
    case 'GET':
        // Listar cartões do usuário
        try {
            $stmt = $pdo->prepare("SELECT * FROM cartoes WHERE usuario_id = ? ORDER BY data_cadastro DESC");
            $stmt->execute([$usuario_id]);
            $cartoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($cartoes);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao buscar cartões: ' . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        // Remover cartão
        $dados = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($dados['id'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID do cartão não informado']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM cartoes WHERE id = ? AND usuario_id = ?");
            $stmt->execute([$dados['id'], $usuario_id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['mensagem' => 'Cartão removido com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Cartão não encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao remover cartão: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
?>