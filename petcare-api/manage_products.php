<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Hàm chuyển đổi chuỗi Base64 Data URL thành tệp ảnh thực tế lưu trữ trong thư mục uploads/
function save_base64_image($str, $prefix = 'prod') {
    if (empty($str) || !is_string($str)) return $str;
    $str = trim($str);
    if (preg_match('/^data:image\/(\w+);base64,/', $str, $matches)) {
        $ext = strtolower($matches[1]);
        if ($ext === 'jpeg') $ext = 'jpg';
        $data = substr($str, strpos($str, ',') + 1);
        $decoded = base64_decode($data);
        if ($decoded !== false) {
            $uploads_dir = __DIR__ . '/uploads';
            if (!is_dir($uploads_dir)) {
                @mkdir($uploads_dir, 0777, true);
            }
            $filename = $prefix . '_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
            $filepath = $uploads_dir . '/' . $filename;
            if (file_put_contents($filepath, $decoded)) {
                $target_dirs = [
                    'C:/xampp1/htdocs/petcare-api/uploads',
                    'C:/Users/Admin/baitaplon/petcare-api/uploads'
                ];
                foreach ($target_dirs as $td) {
                    if (is_dir($td) && realpath($uploads_dir) !== realpath($td)) {
                        @copy($filepath, $td . '/' . $filename);
                    }
                }
                return 'http://localhost/petcare-api/uploads/' . $filename;
            }
        }
    }
    return $str;
}

// Hàm chuẩn hóa mảng an toàn (JSON string, comma-separated hoặc array)
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

// 1. GET: Lấy danh sách sản phẩm hoặc chi tiết 1 sản phẩm
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id > 0) {
        $stmt = $conn->prepare("SELECT id, sku, name, brand, category_slug, category, price, original_price, discount_percent, stock, sold_count, rating, review_count, image, gallery_images, description, product_type, scents, weight_options, in_stock, status FROM products WHERE id = ?");
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
            echo json_encode(["success" => true, "data" => $row], JSON_UNESCAPED_UNICODE);
            exit();
        } else {
            echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm"], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    $sql = "SELECT id, sku, name, brand, category_slug, category, price, original_price, discount_percent, stock, sold_count, rating, review_count, image, gallery_images, description, product_type, scents, weight_options, in_stock, status FROM products ORDER BY id DESC";
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
    echo json_encode(["success" => true, "data" => $products], JSON_UNESCAPED_UNICODE);
    exit();
}

// 2. POST: Thêm sản phẩm mới vào MySQL
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $name = trim($input['name'] ?? '');
    $price = (int)($input['price'] ?? 0);
    $original_price = (int)($input['originalPrice'] ?? $input['original_price'] ?? ($price > 0 ? (int)round($price * 1.15) : 0));
    $desc = trim($input['description'] ?? '');
    
    // Tự động giải mã & lưu ảnh nếu gửi base64
    $rawImage = trim($input['image'] ?? 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500');
    $image = save_base64_image($rawImage, 'prod_main');

    $sku = trim($input['sku'] ?? ('PET-' . rand(10, 99) . '-' . rand(100, 999)));
    $brand = trim($input['brand'] ?? 'Chính hãng');
    $category = trim($input['category'] ?? 'Thức ăn hạt khô');
    $category_slug = trim($input['category_slug'] ?? $input['categorySlug'] ?? 'hat');
    $discount_percent = (int)($input['discountPercent'] ?? $input['discount_percent'] ?? 0);
    $stock = (int)($input['stock'] ?? 100);
    $sold_count = (int)($input['soldCount'] ?? $input['sold_count'] ?? 0);
    $rating = (float)($input['rating'] ?? 5.0);
    $product_type = trim($input['productType'] ?? $input['product_type'] ?? 'food');
    $in_stock = isset($input['inStock']) ? ($input['inStock'] ? 1 : 0) : 1;
    $status = trim($input['status'] ?? 'active');

    // Thư viện ảnh chi tiết
    $rawGal = parse_safe_array($input['gallery_images'] ?? $input['galleryImages'] ?? []);
    $galleryList = [];
    foreach ($rawGal as $g) {
        $galleryList[] = save_base64_image($g, 'prod_gal');
    }
    $gallery_images = !empty($galleryList) ? json_encode($galleryList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null;

    // Mùi hương
    $scentsList = parse_safe_array($input['scents'] ?? []);
    $scents = !empty($scentsList) ? json_encode($scentsList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null;

    // Trọng lượng
    $weightsList = $input['weight_options'] ?? $input['weightOptions'] ?? null;
    $weight_options = is_array($weightsList) && !empty($weightsList) ? json_encode($weightsList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null;

    if (empty($name)) {
        echo json_encode(["success" => false, "message" => "Tên sản phẩm không được để trống!"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO products (sku, name, brand, category, category_slug, price, original_price, discount_percent, stock, sold_count, rating, image, gallery_images, description, product_type, scents, weight_options, in_stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssiiiidsssssssis", $sku, $name, $brand, $category, $category_slug, $price, $original_price, $discount_percent, $stock, $sold_count, $rating, $image, $gallery_images, $desc, $product_type, $scents, $weight_options, $in_stock, $status);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Thêm sản phẩm thành công!",
            "data" => [
                "id" => $newId,
                "sku" => $sku,
                "name" => $name,
                "brand" => $brand,
                "category" => $category,
                "category_slug" => $category_slug,
                "price" => $price,
                "original_price" => $original_price,
                "discount_percent" => $discount_percent,
                "stock" => $stock,
                "sold_count" => $sold_count,
                "rating" => $rating,
                "image" => $image,
                "gallery_images" => $galleryList,
                "description" => $desc,
                "product_type" => $product_type,
                "scents" => $scentsList,
                "weight_options" => is_array($weightsList) ? $weightsList : [],
                "in_stock" => (bool)$in_stock,
                "status" => $status
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi thêm sản phẩm: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// 3. PUT: Cập nhật sản phẩm trong MySQL
if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $price = (int)($input['price'] ?? 0);
    $original_price = (int)($input['originalPrice'] ?? $input['original_price'] ?? ($price > 0 ? (int)round($price * 1.15) : 0));
    $desc = trim($input['description'] ?? '');
    
    // Tự động giải mã & lưu ảnh nếu gửi base64
    $rawImage = trim($input['image'] ?? '');
    $image = !empty($rawImage) ? save_base64_image($rawImage, 'prod_main') : '';

    $brand = trim($input['brand'] ?? 'Chính hãng');
    $category = trim($input['category'] ?? 'Thức ăn hạt khô');
    $category_slug = trim($input['category_slug'] ?? $input['categorySlug'] ?? 'hat');
    $discount_percent = (int)($input['discountPercent'] ?? $input['discount_percent'] ?? 0);
    $stock = (int)($input['stock'] ?? 100);
    $rating = (float)($input['rating'] ?? 5.0);
    $in_stock = isset($input['inStock']) ? ($input['inStock'] ? 1 : 0) : 1;
    $status = trim($input['status'] ?? 'active');
    $product_type = trim($input['product_type'] ?? $input['productType'] ?? 'food');

    // Thư viện ảnh chi tiết
    $galleryList = null;
    $gallery_images = null;
    if (isset($input['gallery_images']) || isset($input['galleryImages'])) {
        $rawGal = parse_safe_array($input['gallery_images'] ?? $input['galleryImages'] ?? []);
        $galleryList = [];
        foreach ($rawGal as $g) {
            $galleryList[] = save_base64_image($g, 'prod_gal');
        }
        $gallery_images = json_encode($galleryList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    // Mùi hương
    $scentsList = null;
    $scents = null;
    if (isset($input['scents'])) {
        $scentsList = parse_safe_array($input['scents']);
        $scents = json_encode($scentsList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    // Trọng lượng
    $weight_options = null;
    $weightsList = null;
    if (isset($input['weight_options']) || isset($input['weightOptions'])) {
        $weightsList = $input['weight_options'] ?? $input['weightOptions'];
        $weight_options = is_array($weightsList) ? json_encode($weightsList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : (string)$weightsList;
    }

    if ($id <= 0 || empty($name)) {
        echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật không hợp lệ!"]);
        exit();
    }

    if (empty($image) && $gallery_images === null) {
        $stmt = $conn->prepare("UPDATE products SET name = ?, brand = ?, category = ?, category_slug = ?, price = ?, original_price = ?, discount_percent = ?, stock = ?, rating = ?, description = ?, product_type = ?, scents = COALESCE(?, scents), weight_options = COALESCE(?, weight_options), in_stock = ?, status = ? WHERE id = ?");
        $stmt->bind_param("ssssiiiidssssisi", $name, $brand, $category, $category_slug, $price, $original_price, $discount_percent, $stock, $rating, $desc, $product_type, $scents, $weight_options, $in_stock, $status, $id);
    } else if (empty($image) && $gallery_images !== null) {
        $stmt = $conn->prepare("UPDATE products SET name = ?, brand = ?, category = ?, category_slug = ?, price = ?, original_price = ?, discount_percent = ?, stock = ?, rating = ?, gallery_images = ?, description = ?, product_type = ?, scents = COALESCE(?, scents), weight_options = COALESCE(?, weight_options), in_stock = ?, status = ? WHERE id = ?");
        $stmt->bind_param("ssssiiiidsssssisi", $name, $brand, $category, $category_slug, $price, $original_price, $discount_percent, $stock, $rating, $gallery_images, $desc, $product_type, $scents, $weight_options, $in_stock, $status, $id);
    } else if (!empty($image) && $gallery_images === null) {
        $stmt = $conn->prepare("UPDATE products SET name = ?, brand = ?, category = ?, category_slug = ?, price = ?, original_price = ?, discount_percent = ?, stock = ?, rating = ?, image = ?, description = ?, product_type = ?, scents = COALESCE(?, scents), weight_options = COALESCE(?, weight_options), in_stock = ?, status = ? WHERE id = ?");
        $stmt->bind_param("ssssiiiidsssssisi", $name, $brand, $category, $category_slug, $price, $original_price, $discount_percent, $stock, $rating, $image, $desc, $product_type, $scents, $weight_options, $in_stock, $status, $id);
    } else {
        $stmt = $conn->prepare("UPDATE products SET name = ?, brand = ?, category = ?, category_slug = ?, price = ?, original_price = ?, discount_percent = ?, stock = ?, rating = ?, image = ?, gallery_images = ?, description = ?, product_type = ?, scents = COALESCE(?, scents), weight_options = COALESCE(?, weight_options), in_stock = ?, status = ? WHERE id = ?");
        $stmt->bind_param("ssssiiiidssssssisi", $name, $brand, $category, $category_slug, $price, $original_price, $discount_percent, $stock, $rating, $image, $gallery_images, $desc, $product_type, $scents, $weight_options, $in_stock, $status, $id);
    }

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Cập nhật sản phẩm thành công!",
            "data" => [
                "id" => $id,
                "image" => $image,
                "gallery_images" => $galleryList,
                "scents" => $scentsList,
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

// 4. DELETE: Xóa sản phẩm khỏi MySQL
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Thiếu mã sản phẩm cần xóa!"]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Xóa sản phẩm thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi xóa sản phẩm: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

$conn->close();
