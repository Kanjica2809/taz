<?php
session_start();

// Configurações
$admin_password = "admin123"; // Senha do admin - ALTERE PARA PRODUÇÃO
$db_path = __DIR__ . '/database/sistema.db';

// Verificar login
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    if (isset($_POST['password'])) {
        if ($_POST['password'] === $admin_password) {
            $_SESSION['admin_logged_in'] = true;
        } else {
            $error = "Senha incorreta!";
        }
    }
    
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        ?>
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Login - GF Temporadas</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-container {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                }
                h1 { 
                    text-align: center; 
                    color: #333;
                    margin-bottom: 10px;
                }
                .subtitle {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    color: #333;
                    font-weight: 500;
                }
                input[type="password"] {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: border-color 0.3s;
                }
                input[type="password"]:focus {
                    outline: none;
                    border-color: #667eea;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                button:hover {
                    background: #5a6fd8;
                }
                .error {
                    background: #fee;
                    color: #c33;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h1>🔐 Admin GF Temporadas</h1>
                <p class="subtitle">Painel Administrativo</p>
                
                <?php if (isset($error)): ?>
                    <div class="error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="password">Senha de Administrador:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">Acessar Painel</button>
                </form>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// Conectar ao banco de dados
try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro ao conectar com o banco de dados: " . $e->getMessage());
}

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
    ['9', 'Pousada Beach House Coqueirinho', 'Pousada Beach House Coqueirinho fornece acomodação com jardim...', 100, 4, 35, 'Jacumã', '/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png', 'Jardim,Estacionamento Privativo,Terraço,Restaurante'],
    ['8', 'Casa moderna Malvinas Campina Grande', 'Casa moderna Malvinas fica em Campina Grande...', 200, 10, 190, 'Campina Grande - Malvinas', '/lovable-uploads/02722158-e81f-4f0f-9e15-843a68bf7c50.png', 'Wi-Fi Grátis,Ar Condicionado,Estacionamento Privativo'],
    ['7', 'Get One - Bessa', 'Get One - Bessa está em João Pessoa e conta com acomodação...', 100, 2, 30, 'João Pessoa - Bessa', '/lovable-uploads/69e2f672-50dc-4410-a191-8579550bc3e0.png', 'Piscina ao Ar Livre,Lounge Compartilhado,Cozinha Equipada'],
    // ... adicione os outros apartamentos
];

$stmt = $pdo->prepare("INSERT OR IGNORE INTO apartamentos (id, nome, descricao, preco, capacidade, tamanho, localizacao, imagem, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($apartamentos as $apt) {
    $stmt->execute($apt);
}

// Processar ações do admin
if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'delete_user':
            $pdo->prepare("DELETE FROM usuarios WHERE id = ?")->execute([$_POST['user_id']]);
            break;
        case 'delete_reserva':
            $pdo->prepare("DELETE FROM reservas WHERE id = ?")->execute([$_POST['reserva_id']]);
            break;
        case 'delete_cartao':
            $pdo->prepare("DELETE FROM cartoes WHERE id = ?")->execute([$_POST['cartao_id']]);
            break;
    }
    header("Location: admin.php");
    exit;
}

// Buscar dados
$usuarios = $pdo->query("SELECT * FROM usuarios ORDER BY data_cadastro DESC")->fetchAll();
$reservas = $pdo->query("SELECT r.*, u.nome as usuario_nome, u.email as usuario_email FROM reservas r LEFT JOIN usuarios u ON r.usuario_id = u.id ORDER BY r.data_reserva DESC")->fetchAll();
$cartoes = $pdo->query("SELECT c.*, u.nome as usuario_nome, u.email as usuario_email FROM cartoes c LEFT JOIN usuarios u ON c.usuario_id = u.id ORDER BY c.data_cadastro DESC")->fetchAll();

// Estatísticas
$total_usuarios = $pdo->query("SELECT COUNT(*) as total FROM usuarios")->fetch()['total'];
$total_reservas = $pdo->query("SELECT COUNT(*) as total FROM reservas")->fetch()['total'];
$total_cartoes = $pdo->query("SELECT COUNT(*) as total FROM cartoes")->fetch()['total'];
$ultimo_usuario = $pdo->query("SELECT nome, data_cadastro FROM usuarios ORDER BY data_cadastro DESC LIMIT 1")->fetch();

// Exportar CSV
if (isset($_GET['export'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=dados_' . date('Y-m-d') . '.csv');
    
    $output = fopen('php://output', 'w');
    
    switch ($_GET['export']) {
        case 'usuarios':
            fputcsv($output, ['ID', 'Nome', 'Email', 'Telefone', 'Endereço', 'Data Cadastro']);
            foreach ($usuarios as $user) {
                fputcsv($output, [
                    $user['id'],
                    $user['nome'],
                    $user['email'],
                    $user['telefone'],
                    $user['endereco'],
                    $user['data_cadastro']
                ]);
            }
            break;
            
        case 'reservas':
            fputcsv($output, ['ID', 'Usuário', 'Email', 'Apartamento', 'Check-in', 'Check-out', 'Valor', 'Status', 'Data Reserva']);
            foreach ($reservas as $reserva) {
                fputcsv($output, [
                    $reserva['id'],
                    $reserva['usuario_nome'],
                    $reserva['usuario_email'],
                    $reserva['apartamento_nome'],
                    $reserva['data_entrada'],
                    $reserva['data_saida'],
                    $reserva['valor_total'],
                    $reserva['status'],
                    $reserva['data_reserva']
                ]);
            }
            break;
            
        case 'cartoes':
            fputcsv($output, ['ID', 'Usuário', 'Email', 'Número Cartão', 'Titular', 'Validade', 'CVV', 'Data Cadastro']);
            foreach ($cartoes as $cartao) {
                fputcsv($output, [
                    $cartao['id'],
                    $cartao['usuario_nome'],
                    $cartao['usuario_email'],
                    $cartao['numero'],
                    $cartao['titular'],
                    $cartao['validade'],
                    $cartao['cvv'],
                    $cartao['data_cadastro']
                ]);
            }
            break;
    }
    fclose($output);
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Admin - GF Temporadas</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f5f6fa;
            color: #333;
            line-height: 1.6;
        }
        .admin-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1 { font-size: 24px; font-weight: 600; }
        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.3s;
        }
        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            text-align: center;
            border-left: 4px solid #667eea;
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        .section {
            background: white;
            margin: 30px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .section-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .export-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
        }
        .export-btn:hover {
            background: #218838;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #555;
            font-size: 14px;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .card-number {
            font-family: monospace;
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
        }
        .security-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <div class="container">
            <div class="header-content">
                <h1>🏠 Painel Admin - GF Temporadas</h1>
                <a href="?logout" class="logout-btn">🚪 Sair</a>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Estatísticas -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_usuarios; ?></div>
                <div class="stat-label">Total de Usuários</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_reservas; ?></div>
                <div class="stat-label">Total de Reservas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_cartoes; ?></div>
                <div class="stat-label">Cartões Cadastrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $ultimo_usuario ? htmlspecialchars($ultimo_usuario['nome']) : 'Nenhum'; ?></div>
                <div class="stat-label">Último Cadastro</div>
            </div>
        </div>

        <div class="security-warning">
            ⚠️ <strong>Área Restrita:</strong> Este painel contém dados sensíveis. Mantenha o acesso seguro.
        </div>

        <!-- Seção de Usuários -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">👥 Usuários Cadastrados</h2>
                <a href="?export=usuarios" class="export-btn">📊 Exportar CSV</a>
            </div>
            <?php if (empty($usuarios)): ?>
                <div class="empty-state">Nenhum usuário cadastrado ainda.</div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Endereço</th>
                            <th>Data Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($usuarios as $usuario): ?>
                        <tr>
                            <td><?php echo $usuario['id']; ?></td>
                            <td><?php echo htmlspecialchars($usuario['nome']); ?></td>
                            <td><?php echo htmlspecialchars($usuario['email']); ?></td>
                            <td><?php echo htmlspecialchars($usuario['telefone'] ?? 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($usuario['endereco'] ?? 'N/A'); ?></td>
                            <td><?php echo date('d/m/Y H:i', strtotime($usuario['data_cadastro'])); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="action" value="delete_user">
                                    <input type="hidden" name="user_id" value="<?php echo $usuario['id']; ?>">
                                    <button type="submit" class="btn-danger" onclick="return confirm('Tem certeza que deseja excluir este usuário?')">Excluir</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

      <!-- Seção de Reservas -->
<div class="section">
    <div class="section-header">
        <h2 class="section-title">📅 Reservas Realizadas</h2>
        <a href="?export=reservas" class="export-btn">📊 Exportar CSV</a>
    </div>
    <?php if (empty($reservas)): ?>
        <div class="empty-state">Nenhuma reserva realizada ainda.</div>
    <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuário</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Apartamento</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Data Reserva</th>
                    <th>Detalhes</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($reservas as $reserva): 
                    // Decodificar os dados pessoais para obter o telefone
                    $dados_pessoais = json_decode($reserva['dados_pessoais'] ?? '{}', true);
                    $telefone = $dados_pessoais['telefone'] ?? 'N/A';
                ?>
                <tr>
                    <td><?php echo $reserva['id']; ?></td>
                    <td><?php echo htmlspecialchars($reserva['usuario_nome']); ?></td>
                    <td><?php echo htmlspecialchars($reserva['usuario_email']); ?></td>
                    <td><?php echo htmlspecialchars($telefone); ?></td>
                    <td><?php echo htmlspecialchars($reserva['apartamento_nome']); ?></td>
                    <td><?php echo date('d/m/Y', strtotime($reserva['data_entrada'])); ?></td>
                    <td><?php echo date('d/m/Y', strtotime($reserva['data_saida'])); ?></td>
                    <td>R$ <?php echo number_format($reserva['valor_total'], 2, ',', '.'); ?></td>
                    <td><?php echo htmlspecialchars($reserva['status']); ?></td>
                    <td><?php echo date('d/m/Y H:i', strtotime($reserva['data_reserva'])); ?></td>
                    <td>
                        <button type="button" class="btn-details" onclick="openDetailsModal(<?php echo htmlspecialchars(json_encode($reserva)); ?>)">Ver detalhes</button>
                    </td>
                    <td>
                        <form method="POST" style="display: inline;">
                            <input type="hidden" name="action" value="delete_reserva">
                            <input type="hidden" name="reserva_id" value="<?php echo $reserva['id']; ?>">
                            <button type="submit" class="btn-danger" onclick="return confirm('Tem certeza que deseja excluir esta reserva?')">Excluir</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<!-- Modal para detalhes da reserva -->
<div id="detailsModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Detalhes Completo da Reserva</h2>
        <div id="modalBody"></div>
    </div>
</div>

<script>
// Função para abrir o modal com os detalhes
function openDetailsModal(reserva) {
    // Decodificar os dados pessoais
    let dadosPessoais = {};
    try {
        dadosPessoais = JSON.parse(reserva.dados_pessoais || '{}');
    } catch (e) {
        dadosPessoais = {};
    }

    // Construir o HTML com todos os dados
    let html = `
        <div class="details-section">
            <h3>Informações do Imóvel</h3>
            <p><strong>Apartamento:</strong> ${reserva.apartamento_nome}</p>
            <p><strong>Check-in:</strong> ${new Date(reserva.data_entrada).toLocaleDateString('pt-BR')}</p>
            <p><strong>Check-out:</strong> ${new Date(reserva.data_saida).toLocaleDateString('pt-BR')}</p>
            <p><strong>Valor Total:</strong> R$ ${parseFloat(reserva.valor_total).toFixed(2)}</p>
            <p><strong>Status:</strong> ${reserva.status}</p>
            <p><strong>Data da Reserva:</strong> ${new Date(reserva.data_reserva).toLocaleString('pt-BR')}</p>
        </div>

        <div class="details-section">
            <h3>Dados Pessoais</h3>
            <p><strong>Nome:</strong> ${dadosPessoais.nome || 'N/A'}</p>
            <p><strong>CPF:</strong> ${dadosPessoais.cpf || 'N/A'}</p>
            <p><strong>Email:</strong> ${dadosPessoais.email || 'N/A'}</p>
            <p><strong>Telefone:</strong> ${dadosPessoais.telefone || 'N/A'}</p>
        </div>

        <div class="details-section">
            <h3>Endereço</h3>
            <p>${reserva.endereco_completo || 'N/A'}</p>
        </div>
    `;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailsModal').style.display = 'block';
}

// Fechar o modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('detailsModal').style.display = 'none';
});

// Fechar o modal clicando fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
</script>

<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fff;
    margin: 5% auto;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: #000;
}

.details-section {
    margin-bottom: 20px;
}

.details-section h3 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.btn-details {
    background: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.btn-details:hover {
    background: #0056b3;
}
</style>

        <!-- Seção de Cartões -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">💳 Cartões de Crédito</h2>
                <a href="?export=cartoes" class="export-btn">📊 Exportar CSV</a>
            </div>
            <?php if (empty($cartoes)): ?>
                <div class="empty-state">Nenhum cartão cadastrado ainda.</div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Email</th>
                            <th>Número do Cartão</th>
                            <th>Titular</th>
                            <th>Validade</th>
                            <th>CVV</th>
                            <th>Data Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($cartoes as $cartao): ?>
                        <tr>
                            <td><?php echo $cartao['id']; ?></td>
                            <td><?php echo htmlspecialchars($cartao['usuario_nome']); ?></td>
                            <td><?php echo htmlspecialchars($cartao['usuario_email']); ?></td>
                            <td><span class="card-number"><?php echo htmlspecialchars($cartao['numero']); ?></span></td>
                            <td><?php echo htmlspecialchars($cartao['titular']); ?></td>
                            <td><?php echo htmlspecialchars($cartao['validade']); ?></td>
                            <td><span class="card-number"><?php echo htmlspecialchars($cartao['cvv']); ?></span></td>
                            <td><?php echo date('d/m/Y H:i', strtotime($cartao['data_cadastro'])); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="action" value="delete_cartao">
                                    <input type="hidden" name="cartao_id" value="<?php echo $cartao['id']; ?>">
                                    <button type="submit" class="btn-danger" onclick="return confirm('Tem certeza que deseja excluir este cartão?')">Excluir</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>

    <?php
    // Logout
    if (isset($_GET['logout'])) {
        session_destroy();
        header("Location: admin.php");
        exit;
    }
    ?>
</body>
</html>