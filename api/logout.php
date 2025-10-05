<?php
// logout.php - Logout do usuário
session_start();
session_destroy();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Credentials: true');

echo json_encode(['mensagem' => 'Logout realizado com sucesso']);
?>