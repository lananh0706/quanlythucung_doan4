<?php
require_once __DIR__ . '/db.php';

// 1. Vouchers (Khuyến mãi)
$res_vouchers = $conn->query("SELECT id, code, description, discount_type, discount_value, min_order, max_discount, expiry_date AS expiry, used_count AS usedCount, max_count AS maxCount, status FROM vouchers ORDER BY id DESC");
$vouchers = [];
if ($res_vouchers) {
    while ($r = $res_vouchers->fetch_assoc()) { 
        $r['id'] = (int)$r['id'];
        $r['discount_value'] = (int)$r['discount_value'];
        $r['min_order'] = (int)$r['min_order'];
        $vouchers[] = $r; 
    }
}

// 2. Customers (Khách hàng)
$res_cust = $conn->query("SELECT id, customer_code AS code, name, email, phone, membership_rank AS rank, pet_xu AS petXu, total_spent AS totalSpent, orders_count AS ordersCount, status, DATE_FORMAT(join_date, '%d/%m/%Y') AS joinDate FROM customers ORDER BY id DESC");
$customers = [];
if ($res_cust) {
    while ($r = $res_cust->fetch_assoc()) { 
        $r['id'] = (int)$r['id'];
        $r['petXu'] = (int)$r['petXu'];
        $r['totalSpent'] = (int)$r['totalSpent'];
        $r['ordersCount'] = (int)$r['ordersCount'];
        $customers[] = $r; 
    }
}

// 3. Blogs (Bài viết)
$res_blogs = $conn->query("SELECT id, title, category, summary, author, author_role AS authorRole, read_time AS readTime, views, likes, image, status, DATE_FORMAT(created_at, '%d/%m/%Y') AS date FROM blogs ORDER BY id DESC");
$blogs = [];
if ($res_blogs) {
    while ($r = $res_blogs->fetch_assoc()) { 
        $r['id'] = (int)$r['id'];
        $r['views'] = (int)$r['views'];
        $r['likes'] = (int)$r['likes'];
        $blogs[] = $r; 
    }
}

// 4. Appointments (Phản hồi & Lịch hẹn)
$res_app = $conn->query("SELECT id, customer_name AS customerName, customer_phone AS customerPhone, pet_name AS petName, pet_type AS petType, issue, doctor, TIME_FORMAT(appointment_time, '%H:%i') AS time, DATE_FORMAT(appointment_date, '%d/%m/%Y') AS date, status FROM appointments ORDER BY id DESC");
$appointments = [];
if ($res_app) {
    while ($r = $res_app->fetch_assoc()) { 
        $r['id'] = (int)$r['id'];
        $appointments[] = $r; 
    }
}

// 5. Kho hàng (Inventory)
$res_inv = $conn->query("SELECT id, sku, product_name AS productName, category, packaging, stock_qty AS stockQty, min_alert_qty AS minAlertQty, location, status FROM inventory ORDER BY id ASC");
$inventory = [];
if ($res_inv) {
    while ($r = $res_inv->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['stockQty'] = (int)$r['stockQty'];
        $r['minAlertQty'] = (int)$r['minAlertQty'];
        $inventory[] = $r;
    }
}

// 6. Lô hàng & Hạn sử dụng (Batches)
$res_bat = $conn->query("SELECT id, batch_code AS batchCode, product_name AS productName, DATE_FORMAT(mfg_date, '%d/%m/%Y') AS mfgDate, DATE_FORMAT(exp_date, '%d/%m/%Y') AS expDate, days_remaining AS daysRemaining, package_type AS packageType, status FROM batches ORDER BY id ASC");
$batches = [];
if ($res_bat) {
    while ($r = $res_bat->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['daysRemaining'] = (int)$r['daysRemaining'];
        $batches[] = $r;
    }
}

// 7. Vận chuyển / Tài xế (Shippers)
$res_ships = $conn->query("SELECT id, name, phone, license_plate AS licensePlate, service_type AS serviceType, active_orders AS activeOrders, rating, status FROM shippers ORDER BY id ASC");
$shippers = [];
if ($res_ships) {
    while ($r = $res_ships->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['activeOrders'] = (int)$r['activeOrders'];
        $r['rating'] = (float)$r['rating'];
        $shippers[] = $r;
    }
}

// 8. Cổng thanh toán & Giao dịch (Payments)
$res_pay = $conn->query("SELECT id, txn_code AS txnCode, order_code AS orderCode, customer_name AS customerName, amount, payment_method AS method, status, DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS time FROM payments ORDER BY id DESC");
$payments = [];
if ($res_pay) {
    while ($r = $res_pay->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['amount'] = (int)$r['amount'];
        $payments[] = $r;
    }
}

// 9. Nhà cung cấp (Suppliers)
$res_sup = $conn->query("SELECT id, name, code, brands_supplied AS brandsSupplied, contact_person AS contactPerson, phone, email, warehouse_city AS warehouseCity, contract_until AS contractUntil, rating FROM suppliers ORDER BY id ASC");
$suppliers = [];
if ($res_sup) {
    while ($r = $res_sup->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['rating'] = (float)$r['rating'];
        $suppliers[] = $r;
    }
}

// 10. Đánh giá khách hàng (Reviews)
$res_rev = $conn->query("SELECT id, product_name AS productName, customer_name AS customerName, rating, comment, DATE_FORMAT(created_at, '%d/%m/%Y') AS date, status FROM reviews ORDER BY id DESC");
$reviews = [];
if ($res_rev) {
    while ($r = $res_rev->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['rating'] = (int)$r['rating'];
        $reviews[] = $r;
    }
}

// 11. Banners (Quảng cáo slide)
$res_ban = $conn->query("SELECT id, badge, title, highlight, subtitle, cta_text AS ctaText, image, theme_color AS themeColor, order_num AS `order`, status FROM banners ORDER BY order_num ASC, id ASC");
$banners = [];
if ($res_ban) {
    while ($r = $res_ban->fetch_assoc()) {
        $r['id'] = (string)$r['id'];
        $r['order'] = (int)$r['order'];
        $img = strtolower($r['image'] ?? '');
        $r['mediaType'] = (strpos($img, '.mp4') !== false || strpos($img, '.mov') !== false) ? 'video' : 'image';
        $banners[] = $r;
    }
}

echo json_encode([
    "success" => true,
    "data" => [
        "vouchers" => $vouchers,
        "customers" => $customers,
        "blogs" => $blogs,
        "appointments" => $appointments,
        "inventory" => $inventory,
        "batches" => $batches,
        "shippers" => $shippers,
        "payments" => $payments,
        "suppliers" => $suppliers,
        "reviews" => $reviews,
        "banners" => $banners
    ]
], JSON_UNESCAPED_UNICODE);

$conn->close();
