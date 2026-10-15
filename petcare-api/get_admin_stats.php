<?php
require_once __DIR__ . '/db.php';

// 1. Tổng sản phẩm
$res_prod = $conn->query("SELECT COUNT(*) AS total FROM products");
$total_products = $res_prod ? (int)$res_prod->fetch_assoc()['total'] : 0;

// 2. Tổng khách hàng
$res_cust = $conn->query("SELECT COUNT(*) AS total FROM customers");
$total_customers = $res_cust ? (int)$res_cust->fetch_assoc()['total'] : 0;

// 3. Tổng doanh thu & đơn hàng
$res_rev = $conn->query("SELECT SUM(total_amount) AS revenue, COUNT(*) AS total_orders FROM orders WHERE status != 'cancelled'");
$rev_row = $res_rev ? $res_rev->fetch_assoc() : null;
$total_revenue = $rev_row ? (float)($rev_row['revenue'] ?? 0) : 0;
$total_orders = $rev_row ? (int)($rev_row['total_orders'] ?? 0) : 0;

// 4. Đơn hàng chờ xử lý
$res_pending = $conn->query("SELECT COUNT(*) AS pending FROM orders WHERE status IN ('pending', 'processing', 'PLACED')");
$pending_orders = $res_pending ? (int)$res_pending->fetch_assoc()['pending'] : 0;

// 5. Đơn hàng gần đây
$res_recent = $conn->query("SELECT id, order_code, customer_name, customer_phone, customer_address, total_amount, payment_method, status, created_at FROM orders ORDER BY id DESC LIMIT 10");
$recent_orders = [];
if ($res_recent) {
    while ($r = $res_recent->fetch_assoc()) {
        $recent_orders[] = $r;
    }
}

echo json_encode([
    "success" => true,
    "data" => [
        "total_products" => $total_products,
        "total_customers" => $total_customers,
        "total_revenue" => $total_revenue,
        "total_orders" => $total_orders,
        "pending_orders" => $pending_orders,
        "recent_orders" => $recent_orders
    ]
], JSON_UNESCAPED_UNICODE);

$conn->close();
