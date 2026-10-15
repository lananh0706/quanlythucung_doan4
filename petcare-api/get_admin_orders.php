<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT id, order_code, customer_name, customer_phone, customer_address, total_amount, payment_method, status, created_at FROM orders ORDER BY id DESC";
$result = $conn->query($sql);
$orders = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $orders], JSON_UNESCAPED_UNICODE);
$conn->close();
