<?php
require_once __DIR__ . '/db.php';

$showAll = isset($_GET['all']) && $_GET['all'] == '1';
$sql = $showAll 
    ? "SELECT id, slug, name, icon, description, product_count, status FROM categories ORDER BY id ASC"
    : "SELECT id, slug, name, icon, description, product_count, status FROM categories WHERE status = 'active' ORDER BY id ASC";
$result = $conn->query($sql);
$categories = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['product_count'] = (int)$row['product_count'];
        $categories[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $categories], JSON_UNESCAPED_UNICODE);
$conn->close();
