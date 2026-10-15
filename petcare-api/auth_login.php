<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$username = trim($input['username'] ?? $input['email'] ?? $input['account'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Vui lòng nhập tài khoản và mật khẩu!"]);
    exit();
}

// 1. Kiểm tra trong bảng admins trước (Quản trị viên & Bác sĩ)
$stmt = $conn->prepare("SELECT id, username, password, full_name, email, role, status FROM admins WHERE (username = ? OR email = ?) LIMIT 1");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$resAdmin = $stmt->get_result();

if ($resAdmin && $rowAdmin = $resAdmin->fetch_assoc()) {
    if ($rowAdmin['status'] === 'locked') {
        echo json_encode(["success" => false, "message" => "Tài khoản quản trị viên đã bị khóa!"]);
        exit();
    }
    
    // Kiểm tra mật khẩu (hỗ trợ cả hash bcrypt và plaintext)
    $pwdMatch = password_verify($password, $rowAdmin['password']) || ($password === $rowAdmin['password']);
    if ($pwdMatch) {
        $upd = $conn->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
        $upd->bind_param("i", $rowAdmin['id']);
        $upd->execute();
        $upd->close();

        $payload = [
            "sub" => $rowAdmin['id'],
            "name" => $rowAdmin['full_name'],
            "role" => $rowAdmin['role'],
            "type" => "admin",
            "iat" => time(),
            "exp" => time() + (86400 * 7)
        ];
        $token = base64_encode(json_encode($payload));

        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập Quản trị viên thành công!",
            "token" => "PETCARE_BEARER_" . $token,
            "user" => [
                "id" => (int)$rowAdmin['id'],
                "username" => $rowAdmin['username'],
                "name" => $rowAdmin['full_name'],
                "email" => $rowAdmin['email'],
                "role" => $rowAdmin['role'],
                "type" => "admin"
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}
$stmt->close();

// 2. Kiểm tra trong bảng customers (Khách hàng)
$stmt = $conn->prepare("SELECT id, customer_code, name, email, phone, password, membership_rank, pet_xu, status FROM customers WHERE (phone = ? OR email = ?) LIMIT 1");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$resCust = $stmt->get_result();

if ($resCust && $rowCust = $resCust->fetch_assoc()) {
    if ($rowCust['status'] === 'blocked') {
        echo json_encode(["success" => false, "message" => "Tài khoản khách hàng đã bị tạm khóa!"]);
        exit();
    }

    $pwdMatch = password_verify($password, $rowCust['password']) || ($password === $rowCust['password']);
    if ($pwdMatch) {
        $payload = [
            "sub" => $rowCust['id'],
            "name" => $rowCust['name'],
            "phone" => $rowCust['phone'],
            "type" => "customer",
            "iat" => time(),
            "exp" => time() + (86400 * 30)
        ];
        $token = base64_encode(json_encode($payload));

        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công!",
            "token" => "PETCARE_BEARER_" . $token,
            "user" => [
                "id" => (int)$rowCust['id'],
                "code" => $rowCust['customer_code'],
                "name" => $rowCust['name'],
                "email" => $rowCust['email'],
                "phone" => $rowCust['phone'],
                "membershipRank" => $rowCust['membership_rank'],
                "petXu" => (int)$rowCust['pet_xu'],
                "type" => "customer"
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}
$stmt->close();

echo json_encode([
    "success" => false,
    "message" => "Tài khoản hoặc mật khẩu không chính xác!"
], JSON_UNESCAPED_UNICODE);

$conn->close();
