<?php
require_once __DIR__ . '/db.php';

// Lấy danh sách ca làm việc nhân viên
$sql = "SELECT id, employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, DATE_FORMAT(shift_date, '%Y-%m-%d') as shift_date, start_time, end_time, branch, status, check_in_time, check_out_time, note, created_at FROM employee_shifts ORDER BY shift_date DESC, start_time ASC";
$result = $conn->query($sql);
$shifts = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $shifts[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "total" => count($shifts),
    "data" => $shifts
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>
