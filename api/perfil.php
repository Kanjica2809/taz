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
    case 'GET':
        // Obter dados do perfil
        try {
            $stmt = $pdo->prepare("SELECT id, nome, email, telefone, endereco, data_cadastro FROM usuarios WHERE id = ?");
            $stmt->execute([$usuario_id]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($usuario) {
                echo json_encode($usuario);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Usuário não encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao buscar perfil: ' . $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        // Atualizar perfil
        $dados = json_decode(file_get_contents('php://input'), true);
        
        try {
            $campos = [];
            $valores = [];
            
            if (isset($dados['nome'])) {
                $campos[] = 'nome = ?';
                $valores[] = $dados['nome'];
            }
            
            if (isset($dados['telefone'])) {
                $campos[] = 'telefone = ?';
                $valores[] = $dados['telefone'];
            }
            
            if (isset($dados['endereco'])) {
                $campos[] = 'endereco = ?';
                $valores[] = $dados['endereco'];
            }
            
            if (empty($campos)) {
                http_response_code(400);
                echo json_encode(['erro' => 'Nenhum campo para atualizar']);
                exit;
            }
            
            $valores[] = $usuario_id;
            $stmt = $pdo->prepare("UPDATE usuarios SET " . implode(', ', $campos) . " WHERE id = ?");
            $stmt->execute($valores);
            
            echo json_encode(['mensagem' => 'Perfil atualizado com sucesso']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao atualizar perfil: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
?>