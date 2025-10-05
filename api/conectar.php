<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão com o banco SQLite
$db_path = __DIR__ . '/database/sistema.db';
$db_dir = dirname($db_path);
if (!is_dir($db_dir)) {
    mkdir($db_dir, 0777, true);
}

try {
    $pdo = new PDO("sqlite:$db_path");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Criar tabela de usuários se não existir
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Criar tabela de cartões se não existir
    $pdo->exec("CREATE TABLE IF NOT EXISTS cartoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        numero TEXT NOT NULL,
        titular TEXT NOT NULL,
        validade TEXT NOT NULL,
        cvv TEXT NOT NULL,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )");

    // Criar tabela de reservas se não existir
    $pdo->exec("CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        apartamento_id TEXT NOT NULL,
        data_entrada DATE NOT NULL,
        data_saida DATE NOT NULL,
        valor_total REAL NOT NULL,
        status TEXT DEFAULT 'pendente',
        data_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )");

    // Criar tabela de apartamentos se não existir (vamos preencher com os dados do seu frontend)
    $pdo->exec("CREATE TABLE IF NOT EXISTS apartamentos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        capacidade INTEGER,
        tamanho REAL,
        localizacao TEXT,
        imagem TEXT,
        features TEXT
    )");

    // Inserir apartamentos se não existirem
    $apartamentos = [
        [
            'id' => '9',
            'nome' => 'Pousada Beach House Coqueirinho',
            'descricao' => 'Pousada Beach House Coqueirinho fornece acomodação com jardim, estacionamento privativo, terraço e restaurante em Jacumã. Praia Encantada fica a poucos passos de distância. Com bar, a acomodação está localizada a cerca de 29 km de Cabo Branco Lighthouse. A pousada conta com piscina ao ar livre e um balcão de turismo e Wi-Fi grátis em toda a propriedade. Em Pousada Beach House Coqueirinho, você pode tomar um café da manhã em estilo buffet. Pousada Beach House Coqueirinho fica a 36 km de Rodoviária de João Pessoa e a 36 km de Estação de Trem. O Aeroporto Internacional Presidente Castro Pinto - João Pessoa fica a 40 km de distância, e a acomodação oferece um serviço de transfer (aeroporto) a um custo adicional.',
            'preco' => 100,
            'capacidade' => 4,
            'tamanho' => 35,
            'localizacao' => 'Jacumã',
            'imagem' => '/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png',
            'features' => 'Jardim,Estacionamento Privativo,Terraço,Restaurante,Bar,Piscina ao Ar Livre,Wi-Fi Grátis,Café da Manhã Buffet,Transfer Aeroporto,Poucos Passos da Praia,Balcão de Turismo'
        ],
        // ... adicione os outros apartamentos aqui
    ];

    $stmt = $pdo->prepare("INSERT OR IGNORE INTO apartamentos (id, nome, descricao, preco, capacidade, tamanho, localizacao, imagem, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($apartamentos as $apt) {
        $stmt->execute([$apt['id'], $apt['nome'], $apt['descricao'], $apt['preco'], $apt['capacidade'], $apt['tamanho'], $apt['localizacao'], $apt['imagem'], $apt['features']]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao conectar com o banco de dados: ' . $e->getMessage()]);
    exit;
}
?>