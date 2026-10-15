<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT id, name, country, flag, description, product_count, is_official, status FROM brands ORDER BY id ASC";
$result = $conn->query($sql);
$brands = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (string)$row['id'];
        $row['productCount'] = (int)($row['product_count'] ?? 0);
        $row['isOfficial'] = (bool)($row['is_official'] ?? 1);
        $row['status'] = ($row['status'] === 'paused') ? 'paused' : 'active';
        $brands[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $brands, "total" => count($brands)], JSON_UNESCAPED_UNICODE);
$conn->close();
