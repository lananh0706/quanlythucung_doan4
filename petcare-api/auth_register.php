<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($name) || empty($phone) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ họ tên, số điện thoại và mật khẩu!"]);
    exit();
}

// 1. Kiểm tra số điện thoại đã tồn tại chưa
$check = $conn->prepare("SELECT id FROM customers WHERE phone = ? LIMIT 1");
$check->bind_param("s", $phone);
$check->execute();
$resCheck = $check->get_result();

if ($resCheck && $resCheck->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Số điện thoại này đã được đăng ký!"]);
    $check->close();
    exit();
}
$check->close();

// 2. Tạo mã khách hàng KH-xxxxxx
$code = "KH-" . rand(10000, 99999);
$hashed_pass = password_hash($password, PASSWORD_BCRYPT);
$rank = "Thành Viên Đồng";

$stmt = $conn->prepare("INSERT INTO customers (customer_code, name, email, phone, password, membership_rank, pet_xu, total_spent, orders_count, status, join_date) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 'active', CURDATE())");
$stmt->bind_param("ssssss", $code, $name, $email, $phone, $hashed_pass, $rank);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    $payload = [
        "sub" => $newId,
        "name" => $name,
        "phone" => $phone,
        "type" => "customer",
        "iat" => time(),
        "exp" => time() + (86400 * 30)
    ];
    $token = base64_encode(json_encode($payload));

    echo json_encode([
        "success" => true,
        "message" => "Đăng ký thành viên thành công!",
        "token" => "PETCARE_BEARER_" . $token,
        "user" => [
            "id" => $newId,
            "code" => $code,
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "membershipRank" => $rank,
            "petXu" => 0,
            "type" => "customer"
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi lưu dữ liệu: " . $stmt->error]);
}

$stmt->close();
$conn->close();
