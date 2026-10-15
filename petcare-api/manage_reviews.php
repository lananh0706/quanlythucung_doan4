<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT' || $method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $status = trim($input['status'] ?? 'approved');

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE reviews SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Cập nhật đánh giá thành công!"]);
        exit();
    }
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM reviews WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Đã xóa đánh giá!"]);
        exit();
    }
}
$conn->close();
