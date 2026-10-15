<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $empId = trim($input['employee_id'] ?? 'NV-' . rand(100, 999));
    $empName = trim($input['employee_name'] ?? '');
    $empPhone = trim($input['employee_phone'] ?? '');
    $empRole = trim($input['employee_role'] ?? 'Tư vấn bán hàng');
    $shiftName = trim($input['shift_name'] ?? 'Ca Sáng (07:30 - 12:00)');
    $shiftType = trim($input['shift_type'] ?? 'morning');
    $shiftDate = trim($input['shift_date'] ?? date('Y-m-d'));
    $startTime = trim($input['start_time'] ?? '07:30');
    $endTime = trim($input['end_time'] ?? '12:00');
    $branch = trim($input['branch'] ?? 'Cơ sở chính Ba Đình');
    $status = trim($input['status'] ?? 'scheduled');
    $note = trim($input['note'] ?? '');

    if (empty($empName)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Vui lòng nhập tên nhân viên"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO employee_shifts (employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, shift_date, start_time, end_time, branch, status, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssss", $empId, $empName, $empPhone, $empRole, $shiftName, $shiftType, $shiftDate, $startTime, $endTime, $branch, $status, $note);
    
    if ($stmt->execute()) {
        $insertId = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Thêm ca làm việc thành công!",
            "id" => $insertId
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi lưu ca: " . $stmt->error]);
    }
    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu ID ca làm việc"]);
        exit();
    }

    // Check if it's a quick status update (check-in / check-out / status change)
    if (isset($input['quick_status'])) {
        $newStatus = trim($input['quick_status']);
        $now = date('H:i');
        if ($newStatus === 'checked_in') {
            $stmt = $conn->prepare("UPDATE employee_shifts SET status = ?, check_in_time = ? WHERE id = ?");
            $stmt->bind_param("ssi", $newStatus, $now, $id);
        } else if ($newStatus === 'completed') {
            $stmt = $conn->prepare("UPDATE employee_shifts SET status = ?, check_out_time = ? WHERE id = ?");
            $stmt->bind_param("ssi", $newStatus, $now, $id);
        } else {
            $stmt = $conn->prepare("UPDATE employee_shifts SET status = ? WHERE id = ?");
            $stmt->bind_param("si", $newStatus, $id);
        }
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Cập nhật trạng thái ca thành công!"]);
        exit();
    }

    // Full update
    $empId = trim($input['employee_id'] ?? '');
    $empName = trim($input['employee_name'] ?? '');
    $empPhone = trim($input['employee_phone'] ?? '');
    $empRole = trim($input['employee_role'] ?? 'Tư vấn bán hàng');
    $shiftName = trim($input['shift_name'] ?? '');
    $shiftType = trim($input['shift_type'] ?? 'morning');
    $shiftDate = trim($input['shift_date'] ?? date('Y-m-d'));
    $startTime = trim($input['start_time'] ?? '07:30');
    $endTime = trim($input['end_time'] ?? '12:00');
    $branch = trim($input['branch'] ?? 'Cơ sở chính Ba Đình');
    $status = trim($input['status'] ?? 'scheduled');
    $note = trim($input['note'] ?? '');

    $stmt = $conn->prepare("UPDATE employee_shifts SET employee_id = ?, employee_name = ?, employee_phone = ?, employee_role = ?, shift_name = ?, shift_type = ?, shift_date = ?, start_time = ?, end_time = ?, branch = ?, status = ?, note = ? WHERE id = ?");
    $stmt->bind_param("ssssssssssssi", $empId, $empName, $empPhone, $empRole, $shiftName, $shiftType, $shiftDate, $startTime, $endTime, $branch, $status, $note, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật thông tin ca trực thành công!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $stmt->error]);
    }
    exit();
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? ($_GET['id'] ?? 0));
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM employee_shifts WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Đã xóa ca làm việc!"]);
        exit();
    }
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID ca không hợp lệ"]);
    exit();
}

$conn->close();
?>
