<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Chỉ hỗ trợ phương thức POST!"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$customerName = trim($input['customerName'] ?? $input['customer_name'] ?? 'Khách hàng');
$customerPhone = trim($input['customerPhone'] ?? $input['customer_phone'] ?? '');
$petName = trim($input['petName'] ?? $input['pet_name'] ?? 'Bé cưng');
$petType = trim($input['petType'] ?? $input['pet_type'] ?? 'dog');
$issue = trim($input['issue'] ?? 'Tư vấn chế độ dinh dưỡng');
$doctor = trim($input['doctor'] ?? 'BS. CKI Nguyễn Minh Tuấn');
$appointmentDate = trim($input['date'] ?? $input['appointment_date'] ?? date('Y-m-d'));
$appointmentTime = trim($input['time'] ?? $input['appointment_time'] ?? '09:00:00');
$status = 'pending';

if (empty($customerPhone)) {
    echo json_encode(["success" => false, "message" => "Số điện thoại không được để trống!"]);
    exit();
}

$stmt = $conn->prepare("INSERT INTO appointments (customer_name, customer_phone, pet_name, pet_type, issue, doctor, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $customerName, $customerPhone, $petName, $petType, $issue, $doctor, $appointmentDate, $appointmentTime, $status);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Đặt lịch hẹn tư vấn thành công!",
        "data" => [
            "id" => $newId,
            "customerName" => $customerName,
            "customerPhone" => $customerPhone,
            "petName" => $petName,
            "petType" => $petType,
            "issue" => $issue,
            "doctor" => $doctor,
            "date" => $appointmentDate,
            "time" => $appointmentTime,
            "status" => $status
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi lưu lịch hẹn: " . $stmt->error]);
}

$stmt->close();
$conn->close();
