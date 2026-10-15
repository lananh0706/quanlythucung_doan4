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

$sql = "SELECT id, sku, name, brand, category_slug, category, price, original_price, discount_percent, stock, sold_count, rating, review_count, image, gallery_images, description, product_type, scents, weight_options, in_stock, status FROM products WHERE status = 'active' ORDER BY id ASC";
$result = $conn->query($sql);
$products = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
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
        
        $products[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "data" => $products
], JSON_UNESCAPED_UNICODE);

$conn->close();
