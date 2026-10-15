<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Chỉ hỗ trợ POST!"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$customerCode = 'KH-' . rand(1000, 9999);

if (empty($name) || empty($phone)) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập họ tên và số điện thoại!"]);
    exit();
}

// Kiểm tra xem số điện thoại đã tồn tại chưa
$check = $conn->prepare("SELECT id FROM customers WHERE phone = ?");
$check->bind_param("s", $phone);
$check->execute();
$checkRes = $check->get_result();
if ($checkRes->num_rows > 0) {
    echo json_encode(["success" => true, "message" => "Khách hàng đã có trong hệ thống!"]);
    $check->close();
    exit();
}
$check->close();

$stmt = $conn->prepare("INSERT INTO customers (customer_code, name, email, phone, membership_rank, pet_xu, total_spent, orders_count, status) VALUES (?, ?, ?, ?, 'Bạc', 50, 0, 0, 'active')");
$stmt->bind_param("ssss", $customerCode, $name, $email, $phone);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Đăng ký thành viên thành công!",
        "data" => [
            "id" => $newId,
            "code" => $customerCode,
            "name" => $name,
            "phone" => $phone,
            "email" => $email,
            "rank" => "Bạc",
            "petXu" => 50
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi đăng ký: " . $stmt->error]);
}

$stmt->close();
$conn->close();
