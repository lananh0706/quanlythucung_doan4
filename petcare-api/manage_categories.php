<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// LẤY TẤT CẢ DANH MỤC
if ($method === 'GET') {
    $sql = "SELECT id, slug, name, icon, description, product_count, status FROM categories ORDER BY id ASC";
    $result = $conn->query($sql);
    $categories = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['product_count'] = (int)$row['product_count'];
            $categories[] = $row;
        }
    }

    echo json_encode(["success" => true, "data" => $categories], JSON_UNESCAPED_UNICODE);
    exit();
}

// THÊM DANH MỤC MỚI
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $name = trim($input['name'] ?? '');
    $slug = trim($input['slug'] ?? '');
    $icon = trim($input['icon'] ?? '🥫');
    $description = trim($input['description'] ?? '');
    $status = trim($input['status'] ?? 'active');

    if (empty($name)) {
        echo json_encode(["success" => false, "message" => "Tên danh mục không được để trống!"]);
        exit();
    }

    if (empty($slug)) {
        $slug = preg_replace('/[^a-z0-9]+/i', '-', strtolower($name));
        $slug = trim($slug, '-');
    }

    $stmt = $conn->prepare("INSERT INTO categories (name, slug, icon, description, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $slug, $icon, $description, $status);
    
    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Thêm danh mục thành công!",
            "data" => [
                "id" => $newId,
                "name" => $name,
                "slug" => $slug,
                "icon" => $icon,
                "description" => $description,
                "product_count" => 0,
                "status" => $status
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi thêm danh mục: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// CẬP NHẬT DANH MỤC
if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    $slug = trim($input['slug'] ?? '');
    $name = trim($input['name'] ?? '');
    $icon = trim($input['icon'] ?? '🥫');
    $description = trim($input['description'] ?? '');
    $status = trim($input['status'] ?? 'active');

    // Hỗ trợ tìm theo id hoặc slug
    if ($id <= 0 && !empty($slug)) {
        $find = $conn->prepare("SELECT id FROM categories WHERE slug = ?");
        $find->bind_param("s", $slug);
        $find->execute();
        $findRes = $find->get_result();
        if ($r = $findRes->fetch_assoc()) {
            $id = (int)$r['id'];
        }
        $find->close();
    }

    if ($id <= 0 && empty($name)) {
        echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật không hợp lệ!"]);
        exit();
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE categories SET name = ?, slug = ?, icon = ?, description = ?, status = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $name, $slug, $icon, $description, $status, $id);
    } else {
        $stmt = $conn->prepare("UPDATE categories SET name = ?, icon = ?, description = ?, status = ? WHERE slug = ?");
        $stmt->bind_param("sssss", $name, $icon, $description, $status, $slug);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật danh mục thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật danh mục: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// XÓA DANH MỤC
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

    if ($id <= 0 && empty($slug)) {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = (int)($input['id'] ?? 0);
        $slug = trim($input['slug'] ?? '');
    }

    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->bind_param("i", $id);
    } else if (!empty($slug)) {
        $stmt = $conn->prepare("DELETE FROM categories WHERE slug = ?");
        $stmt->bind_param("s", $slug);
    } else {
        echo json_encode(["success" => false, "message" => "Thiếu mã danh mục cần xóa!"]);
        exit();
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Xóa danh mục thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi xóa danh mục: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

$conn->close();
