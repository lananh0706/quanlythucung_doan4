<?php
require_once __DIR__ . '/db.php';

function parse_safe_array($val) {
    if (is_array($val)) {
        return array_values(array_filter($val, function($v) { return $v !== null && $v !== ''; }));
    }
    if (is_string($val)) {
        $val = trim($val);
        if (empty($val)) return [];
        $decoded = json_decode($val, true);
        if (is_array($decoded)) {
            return array_values(array_filter($decoded, function($v) { return $v !== null && $v !== ''; }));
        }
        if (strpos($val, ',') !== false) {
            return array_values(array_filter(array_map('trim', explode(',', $val))));
        }
        return [$val];
    }
    return [];
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu mã sản phẩm id"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $row = $res->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['price'] = (int)$row['price'];
    $row['original_price'] = (int)$row['original_price'];
    $row['discount_percent'] = (int)$row['discount_percent'];
    $row['stock'] = (int)$row['stock'];
    $row['sold_count'] = (int)$row['sold_count'];
    $row['rating'] = (float)$row['rating'];
    $row['review_count'] = (int)$row['review_count'];
    $row['in_stock'] = (bool)$row['in_stock'];

    $row['gallery_images'] = parse_safe_array($row['gallery_images'] ?? null);
    $row['scents'] = parse_safe_array($row['scents'] ?? null);

    if (!empty($row['weight_options']) && is_string($row['weight_options'])) {
        $row['weight_options'] = json_decode($row['weight_options'], true) ?: [];
    } else if (!is_array($row['weight_options'])) {
        $row['weight_options'] = [];
    }

    // Lấy thêm đánh giá từ bảng reviews nếu có
    $rev_stmt = $conn->prepare("SELECT id, customer_name AS userName, customer_avatar AS userAvatar, rating, DATE_FORMAT(created_at, '%d/%m/%Y') AS date, verified_purchase AS verified, weight_bought AS weightBought, comment, likes FROM reviews WHERE product_id = ? AND status = 'approved' ORDER BY id DESC");
    $rev_stmt->bind_param("i", $id);
    $rev_stmt->execute();
    $rev_res = $rev_stmt->get_result();
    $reviews = [];
    if ($rev_res) {
        while ($r = $rev_res->fetch_assoc()) {
            $r['verified'] = (bool)$r['verified'];
            $reviews[] = $r;
        }
    }
    $row['reviews'] = $reviews;
    $rev_stmt->close();

    echo json_encode(["success" => true, "data" => $row], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm"]);
}

$stmt->close();
$conn->close();
