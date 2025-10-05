<?php
// teste-completo.php - Teste completo do backend
header('Content-Type: text/html; charset=utf-8');

echo "<h1>🧪 TESTE COMPLETO DO SISTEMA</h1>";

// 1. Testar banco de dados
echo "<h2>1. Banco de Dados</h2>";
try {
    $pdo = new PDO("sqlite:database/sistema.db");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Criar tabelas
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    echo "✅ Tabelas criadas<br>";
    
    // Testar inserção
    $senha_hash = password_hash("123456", PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)");
    $stmt->execute(["Usuário Teste", "teste@teste.com", $senha_hash]);
    
    echo "✅ Usuário teste inserido<br>";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "<br>";
}

// 2. Testar APIs
echo "<h2>2. APIs</h2>";
$apis = ['cadastro.php', 'login.php', 'perfil.php'];
foreach ($apis as $api) {
    if (file_exists("api/$api")) {
        echo "✅ $api encontrado<br>";
    } else {
        echo "❌ $api NÃO encontrado<br>";
    }
}

// 3. Links para teste manual
echo "<h2>3. Testes Manuais</h2>";
echo "<button onclick=\"testarAPI('cadastro')\">🧪 Testar Cadastro</button> ";
echo "<button onclick=\"testarAPI('login')\">🧪 Testar Login</button> ";
echo "<a href='admin.php' style='margin-left: 20px;'>👑 Admin</a>";

echo "
<script>
function testarAPI(tipo) {
    const dados = {
        cadastro: {
            nome: 'Maria Silva',
            email: 'maria@teste.com',
            senha: '123456'
        },
        login: {
            email: 'teste@teste.com', 
            senha: '123456'
        }
    };
    
    fetch('api/' + tipo + '.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dados[tipo])
    })
    .then(r => r.json())
    .then(result => {
        alert('Resposta ' + tipo.toUpperCase() + ': ' + JSON.stringify(result));
    })
    .catch(err => {
        alert('Erro: ' + err);
    });
}
</script>
";
?>