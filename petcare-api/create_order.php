<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);

$customer_name = trim($input['customer_name'] ?? '');
$customer_phone = trim($input['customer_phone'] ?? '');
$customer_address = trim($input['customer_address'] ?? '');
$customer_note = trim($input['customer_note'] ?? ($input['note'] ?? ''));
$shipping_method = trim($input['shipping_method'] ?? 'standard');
$shipping_fee = (int)($input['shipping_fee'] ?? 0);
$voucher_code = trim($input['voucher_code'] ?? '');
$discount_amount = (int)($input['discount_amount'] ?? 0);
$total_amount = (int)($input['total_amount'] ?? 0);
$payment_method = trim($input['payment_method'] ?? 'COD');
$items = $input['items'] ?? [];

if (empty($customer_name) || empty($customer_phone) || empty($customer_address) || $total_amount <= 0) {
    echo json_encode(["success" => false, "message" => "Vui lòng cung cấp đầy đủ họ tên, số điện thoại, địa chỉ và tổng tiền hợp lệ!"]);
    exit();
}

$order_code = 'PET-' . rand(100000, 999999);
$status = 'processing';
$items_json = !empty($items) ? json_encode($items, JSON_UNESCAPED_UNICODE) : null;

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO orders (order_code, customer_name, customer_phone, customer_address, customer_note, shipping_method, shipping_fee, voucher_code, discount_amount, total_amount, payment_method, status, items_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssisiisss", $order_code, $customer_name, $customer_phone, $customer_address, $customer_note, $shipping_method, $shipping_fee, $voucher_code, $discount_amount, $total_amount, $payment_method, $status, $items_json);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    $stmt->close();

    // Thêm các món hàng vào order_items nếu có
    if (!empty($items) && is_array($items)) {
        $stmt_item = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, packaging, price, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($items as $it) {
            $prod_id = (int)($it['id'] ?? 0);
            $prod_name = $it['name'] ?? 'Sản phẩm';
            $packaging = $it['weight'] ?? ($it['packaging'] ?? 'Gói tiêu chuẩn');
            $price = (int)($it['price'] ?? 0);
            $qty = (int)($it['quantity'] ?? 1);
            $total_price = $price * $qty;
            $stmt_item->bind_param("iissiii", $order_id, $prod_id, $prod_name, $packaging, $price, $qty, $total_price);
            $stmt_item->execute();
        }
        $stmt_item->close();
    }

    $conn->commit();
    echo json_encode([
        "success" => true,
        "message" => "Đặt hàng thành công!",
        "data" => [
            "order_id" => $order_id,
            "order_code" => $order_code,
            "total_amount" => $total_amount
        ]
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Lỗi tạo đơn hàng: " . $e->getMessage()]);
}

$conn->close();
