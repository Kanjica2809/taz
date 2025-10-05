<?php
// reserva.php - Versão à prova de erros
require_once 'config.php';

// Headers para CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Log para debug
error_log("=== RESERVA.PHP CHAMADO ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);
error_log("Headers: " . json_encode(getallheaders()));

// Verificar sessão
if (!isset($_SESSION['usuario_id'])) {
    error_log("❌ SESSÃO NÃO ENCONTRADA");
    http_response_code(401);
    echo json_encode(['erro' => 'Não autorizado. Faça login. Sessão: ' . session_id()]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];
error_log("Usuário ID: " . $usuario_id);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        // Log do body recebido
        $input = file_get_contents('php://input');
        error_log("Body recebido: " . $input);
        
        $dados = json_decode($input, true);
        
        if (!$dados) {
            error_log("❌ JSON INVÁLIDO");
            http_response_code(400);
            echo json_encode(['erro' => 'Dados JSON inválidos: ' . json_last_error_msg()]);
            exit;
        }
        
        error_log("Dados decodificados: " . json_encode($dados));
        
        // Validação dos campos obrigatórios
        $required = ['apartamento_id', 'apartamento_nome', 'data_entrada', 'data_saida', 'valor_total'];
        $missing = [];
        foreach ($required as $field) {
            if (!isset($dados[$field]) || empty($dados[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            error_log("❌ CAMPOS FALTANDO: " . implode(', ', $missing));
            http_response_code(400);
            echo json_encode(['erro' => 'Campos obrigatórios faltando: ' . implode(', ', $missing)]);
            exit;
        }
        
        try {
            // Preparar dados
            $dados_pessoais = null;
            if (isset($dados['dados_pessoais'])) {
                $dados_pessoais = is_string($dados['dados_pessoais']) 
                    ? $dados['dados_pessoais'] 
                    : json_encode($dados['dados_pessoais'], JSON_UNESCAPED_UNICODE);
            }
            
            $endereco_completo = $dados['endereco_completo'] ?? null;
            $status = 'pendente';
            
            error_log("Tentando inserir reserva no banco...");
            
            // Inserir no banco
            $stmt = $pdo->prepare("INSERT INTO reservas 
                (usuario_id, apartamento_id, apartamento_nome, data_entrada, data_saida, valor_total, dados_pessoais, endereco_completo, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $usuario_id,
                $dados['apartamento_id'],
                $dados['apartamento_nome'],
                $dados['data_entrada'],
                $dados['data_saida'],
                floatval($dados['valor_total']),
                $dados_pessoais,
                $endereco_completo,
                $status
            ]);
            
            $reserva_id = $pdo->lastInsertId();
            
            error_log("✅ RESERVA CRIADA COM SUCESSO - ID: " . $reserva_id);
            
            echo json_encode([
                'mensagem' => 'Reserva realizada com sucesso', 
                'id' => $reserva_id,
                'status' => $status
            ]);
            
        } catch (PDOException $e) {
            error_log("❌ ERRO NO BANCO: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao criar reserva no banco: ' . $e->getMessage()]);
        }
        break;
        
    case 'GET':
        try {
            error_log("Buscando reservas para usuário: " . $usuario_id);
            
            $stmt = $pdo->prepare("SELECT * FROM reservas WHERE usuario_id = ? ORDER BY data_reserva DESC");
            $stmt->execute([$usuario_id]);
            $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            error_log("Reservas encontradas: " . count($reservas));
            
            // Processar dados_pessoais
            foreach ($reservas as &$reserva) {
                if (!empty($reserva['dados_pessoais'])) {
                    $reserva['dados_pessoais'] = json_decode($reserva['dados_pessoais'], true);
                }
            }
            
            echo json_encode($reservas);
            
        } catch (PDOException $e) {
            error_log("❌ ERRO AO BUSCAR RESERVAS: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao buscar reservas: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}

error_log("=== FIM RESERVA.PHP ===");
?>