<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT' || $method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $badge = trim($input['badge'] ?? 'SIÊU KHUYẾN MÃI');
    $title = trim($input['title'] ?? 'Banner');
    $highlight = trim($input['highlight'] ?? '');
    $subtitle = trim($input['subtitle'] ?? '');
    $cta_text = trim($input['ctaText'] ?? $input['cta_text'] ?? 'Khám phá ngay');
    $image = trim($input['image'] ?? '');
    $theme_color = trim($input['themeColor'] ?? $input['theme_color'] ?? '#0284C7');
    $status = trim($input['status'] ?? 'active');

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE banners SET badge = ?, title = ?, highlight = ?, subtitle = ?, cta_text = ?, image = ?, theme_color = ?, status = ? WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("ssssssssi", $badge, $title, $highlight, $subtitle, $cta_text, $image, $theme_color, $status, $id);
            $stmt->execute();
        }
        echo json_encode(["success" => true, "message" => "Cập nhật banner thành công!"]);
        exit();
    } else {
        $stmt = $conn->prepare("INSERT INTO banners (badge, title, highlight, subtitle, cta_text, image, theme_color, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("ssssssss", $badge, $title, $highlight, $subtitle, $cta_text, $image, $theme_color, $status);
            $stmt->execute();
            $newId = $conn->insert_id;
            echo json_encode(["success" => true, "id" => $newId, "message" => "Thêm banner mới thành công!"]);
            exit();
        }
    }
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM banners WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
        }
        echo json_encode(["success" => true, "message" => "Đã xóa banner!"]);
        exit();
    }
}
$conn->close();
