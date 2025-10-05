<?php
// config.php - Configuração do banco de dados

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurações do banco de dados
$db_path = __DIR__ . '/../database/sistema.db';

// Criar diretório do banco se não existir
if (!is_dir(dirname($db_path))) {
    mkdir(dirname($db_path), 0777, true);
}

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Criar tabelas se não existirem
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            telefone TEXT,
            endereco TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cartoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            numero TEXT NOT NULL,
            titular TEXT NOT NULL,
            validade TEXT NOT NULL,
            cvv TEXT NOT NULL,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );

        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            apartamento_id TEXT NOT NULL,
            apartamento_nome TEXT NOT NULL,
            data_entrada DATE NOT NULL,
            data_saida DATE NOT NULL,
            valor_total DECIMAL(10,2) NOT NULL,
            status TEXT DEFAULT 'pendente',
            dados_pessoais TEXT,
            endereco_completo TEXT,
            data_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );

        CREATE TABLE IF NOT EXISTS apartamentos (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco DECIMAL(10,2),
            capacidade INTEGER,
            tamanho INTEGER,
            localizacao TEXT,
            imagem TEXT,
            caracteristicas TEXT
        );
    ");

    // Inserir apartamentos padrão se a tabela estiver vazia
    $apartamentos = [
        ['9', 'Pousada Beach House Coqueirinho', 'Pousada Beach House Coqueirinho fornece acomodação com jardim, estacionamento privativo, terraço e restaurante em Jacumã.', 100, 4, 35, 'Jacumã', '/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png', 'Jardim,Estacionamento Privativo,Terraço,Restaurante,Bar,Piscina ao Ar Livre,Wi-Fi Grátis'],
        ['8', 'Casa moderna Malvinas Campina Grande', 'Casa moderna Malvinas fica em Campina Grande e oferece jardim, terraço e churrasqueira.', 200, 10, 190, 'Campina Grande - Malvinas', '/lovable-uploads/02722158-e81f-4f0f-9e15-843a68bf7c50.png', 'Wi-Fi Grátis,Ar Condicionado,Estacionamento Privativo,Jardim,Terraço,Churrasqueira,PS3,Banheira de Hidromassagem'],
        ['7', 'Get One - Bessa', 'Get One - Bessa está em João Pessoa e conta com acomodação com piscina ao ar livre e lounge compartilhado.', 100, 2, 30, 'João Pessoa - Bessa', '/lovable-uploads/69e2f672-50dc-4410-a191-8579550bc3e0.png', 'Piscina ao Ar Livre,Lounge Compartilhado,Cozinha Equipada,Geladeira,Micro-ondas,Frigobar,Wi-Fi Grátis']
    ];

    $stmt = $pdo->prepare("INSERT OR IGNORE INTO apartamentos (id, nome, descricao, preco, capacidade, tamanho, localizacao, imagem, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($apartamentos as $apt) {
        $stmt->execute($apt);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao conectar com o banco de dados: ' . $e->getMessage()]);
    exit;
}
?>