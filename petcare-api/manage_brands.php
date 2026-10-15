<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Lấy toàn bộ thương hiệu
if ($method === 'GET') {
    $sql = "SELECT id, name, country, flag, description, product_count, is_official, status FROM brands ORDER BY id ASC";
    $result = $conn->query($sql);
    $brands = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $brands[] = [
                'id' => (string)$row['id'],
                'name' => $row['name'],
                'country' => $row['country'] ?? 'Việt Nam',
                'flag' => $row['flag'] ?? '🇻🇳',
                'description' => $row['description'] ?? '',
                'productCount' => (int)($row['product_count'] ?? 0),
                'isOfficial' => (bool)($row['is_official'] ?? 1),
                'status' => ($row['status'] === 'paused') ? 'paused' : 'active'
            ];
        }
    }

    echo json_encode(["success" => true, "data" => $brands, "total" => count($brands)], JSON_UNESCAPED_UNICODE);
    exit();
}

// 2. POST: Thêm thương hiệu mới
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $name = trim($input['name'] ?? '');
    $country = trim($input['country'] ?? 'Việt Nam');
    $flag = trim($input['flag'] ?? '🇻🇳');
    $description = trim($input['description'] ?? '');
    $product_count = (int)($input['productCount'] ?? $input['product_count'] ?? 0);
    $is_official = isset($input['isOfficial']) ? ($input['isOfficial'] ? 1 : 0) : 1;
    $status = trim($input['status'] ?? 'active');

    if (empty($name)) {
        echo json_encode(["success" => false, "message" => "Tên thương hiệu không được để trống!"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO brands (name, country, flag, description, product_count, is_official, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiis", $name, $country, $flag, $description, $product_count, $is_official, $status);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Thêm thương hiệu thành công!",
            "data" => [
                "id" => (string)$newId,
                "name" => $name,
                "country" => $country,
                "flag" => $flag,
                "description" => $description,
                "productCount" => $product_count,
                "isOfficial" => (bool)$is_official,
                "status" => $status
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi thêm thương hiệu: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// 3. PUT: Cập nhật thương hiệu
if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $country = trim($input['country'] ?? 'Việt Nam');
    $flag = trim($input['flag'] ?? '🇻🇳');
    $description = trim($input['description'] ?? '');
    $product_count = (int)($input['productCount'] ?? $input['product_count'] ?? 0);
    $is_official = isset($input['isOfficial']) ? ($input['isOfficial'] ? 1 : 0) : 1;
    $status = trim($input['status'] ?? 'active');

    if ($id <= 0 || empty($name)) {
        echo json_encode(["success" => false, "message" => "Dữ liệu thương hiệu không hợp lệ!"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE brands SET name = ?, country = ?, flag = ?, description = ?, product_count = ?, is_official = ?, status = ? WHERE id = ?");
    $stmt->bind_param("ssssiisi", $name, $country, $flag, $description, $product_count, $is_official, $status, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật thương hiệu thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật thương hiệu: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// 4. DELETE: Xóa thương hiệu
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Thiếu ID thương hiệu cần xóa!"]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM brands WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Xóa thương hiệu thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi xóa thương hiệu: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

$conn->close();
