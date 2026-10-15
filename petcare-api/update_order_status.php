<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input['id'] ?? 0);
$status = trim($input['status'] ?? '');

if ($id <= 0 || empty($status)) {
    echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật trạng thái không hợp lệ!"]);
    exit();
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật trạng thái đơn hàng thành công!"], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $stmt->error]);
}

$stmt->close();
$conn->close();
