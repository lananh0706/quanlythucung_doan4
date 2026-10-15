<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $stock_qty = (int)($input['stockQty'] ?? $input['stock_qty'] ?? 0);
    $status = trim($input['status'] ?? ($stock_qty <= 0 ? 'out_of_stock' : ($stock_qty < 15 ? 'low_stock' : 'in_stock')));

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE inventory SET stock_qty = ?, status = ? WHERE id = ?");
        $stmt->bind_param("isi", $stock_qty, $status, $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Cập nhật tồn kho thành công!"]);
        exit();
    }
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM inventory WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Đã xóa mục kho!"]);
        exit();
    }
}
$conn->close();
