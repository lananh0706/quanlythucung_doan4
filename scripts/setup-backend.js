const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'petcare-api'),
  'C:\\xampp1\\htdocs\\petcare-api'
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.log('Could not create dir:', dir, e.message);
    }
  }
});

const files = {
  'db.php': `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "petcare_db";

$conn = new mysqli($host, $user, $pass, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi kết nối MySQL: " . $conn->connect_error]);
    exit();
}
`,

  'get_products.php': `<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT id, name, price, description, image FROM products ORDER BY id DESC";
$result = $conn->query($sql);
$products = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['price'] = (int)$row['price'];
        $products[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "data" => $products
], JSON_UNESCAPED_UNICODE);

$conn->close();
`,

  'get_product_detail.php': `<?php
require_once __DIR__ . '/db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu mã sản phẩm id"]);
    exit();
}

$stmt = $conn->prepare("SELECT id, name, price, description, image FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $row = $res->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['price'] = (int)$row['price'];
    echo json_encode(["success" => true, "data" => $row], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm"]);
}

$stmt->close();
$conn->close();
`,

  'manage_products.php': `<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT id, name, price, description, image FROM products ORDER BY id DESC";
    $result = $conn->query($sql);
    $products = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['price'] = (int)$row['price'];
            $products[] = $row;
        }
    }
    echo json_encode(["success" => true, "data" => $products], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $name = trim($input['name'] ?? '');
    $price = (int)($input['price'] ?? 0);
    $desc = trim($input['description'] ?? '');
    $image = trim($input['image'] ?? 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500');

    if (empty($name)) {
        echo json_encode(["success" => false, "message" => "Tên sản phẩm không được để trống!"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $name, $price, $desc, $image);
    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Thêm sản phẩm thành công!",
            "data" => ["id" => $newId, "name" => $name, "price" => $price, "description" => $desc, "image" => $image]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi thêm sản phẩm: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $price = (int)($input['price'] ?? 0);
    $desc = trim($input['description'] ?? '');
    $image = trim($input['image'] ?? '');

    if ($id <= 0 || empty($name)) {
        echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật không hợp lệ!"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?");
    $stmt->bind_param("sissi", $name, $price, $desc, $image, $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật sản phẩm thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $stmt->error]);
    }
    $stmt->close();
    exit();
}

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
`,

  'get_categories.php': `<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT id, name, slug, description FROM categories ORDER BY id ASC";
$result = $conn->query($sql);
$categories = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $categories[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $categories], JSON_UNESCAPED_UNICODE);
$conn->close();
`,

  'get_admin_stats.php': `<?php
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
`,

  'get_admin_orders.php': `<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT id, order_code, customer_name, customer_phone, customer_address, total_amount, payment_method, status, created_at FROM orders ORDER BY id DESC";
$result = $conn->query($sql);
$orders = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $orders], JSON_UNESCAPED_UNICODE);
$conn->close();
`,

  'update_order_status.php': `<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input['id'] ?? 0);
$status = trim($input['status'] ?? '');

if ($id <= 0 || empty($status)) {
    echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật trạng thái không hợp lệ!"]);
    exit();
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật trạng thái đơn hàng thành công!"], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $stmt->error]);
}

$stmt->close();
$conn->close();
`,

  'get_admin_extra.php': `<?php
require_once __DIR__ . '/db.php';

// 1. Vouchers
$res_vouchers = $conn->query("SELECT id, code, discount_desc AS discount, discount_percent AS discountPercent, min_order AS minOrder, expiry_date AS expiry, used_count AS usedCount, max_count AS maxCount, status FROM vouchers ORDER BY id DESC");
$vouchers = [];
if ($res_vouchers) {
    while ($r = $res_vouchers->fetch_assoc()) { $vouchers[] = $r; }
}

// 2. Customers
$res_cust = $conn->query("SELECT id, name, email, phone, membership_rank AS rank, total_spent AS totalSpent, orders_count AS ordersCount, status, join_date AS joinDate FROM customers ORDER BY id DESC");
$customers = [];
if ($res_cust) {
    while ($r = $res_cust->fetch_assoc()) { $customers[] = $r; }
}

// 3. Blogs
$res_blogs = $conn->query("SELECT id, title, category, author, views, status, DATE_FORMAT(created_at, '%d/%m/%Y') AS date FROM blogs ORDER BY id DESC");
$blogs = [];
if ($res_blogs) {
    while ($r = $res_blogs->fetch_assoc()) { $blogs[] = $r; }
}

// 4. Appointments
$res_app = $conn->query("SELECT id, customer_name AS customerName, pet_name AS petName, pet_type AS petType, issue, doctor, TIME_FORMAT(appointment_time, '%H:%i') AS time, DATE_FORMAT(appointment_date, '%d/%m/%Y') AS date, status FROM appointments ORDER BY id DESC");
$appointments = [];
if ($res_app) {
    while ($r = $res_app->fetch_assoc()) { $appointments[] = $r; }
}

echo json_encode([
    "success" => true,
    "data" => [
        "vouchers" => $vouchers,
        "customers" => $customers,
        "blogs" => $blogs,
        "appointments" => $appointments
    ]
], JSON_UNESCAPED_UNICODE);

$conn->close();
`,

  'create_order.php': `<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);

$customer_name = trim($input['customer_name'] ?? '');
$customer_phone = trim($input['customer_phone'] ?? '');
$customer_address = trim($input['customer_address'] ?? '');
$total_amount = (float)($input['total_amount'] ?? 0);
$payment_method = trim($input['payment_method'] ?? 'COD');
$items = $input['items'] ?? [];

if (empty($customer_name) || empty($customer_phone) || empty($customer_address) || $total_amount <= 0) {
    echo json_encode(["success" => false, "message" => "Vui lòng cung cấp đầy đủ họ tên, số điện thoại, địa chỉ và tổng tiền hợp lệ!"]);
    exit();
}

$order_code = 'PET-' . rand(100000, 999999);
$status = 'processing';

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO orders (order_code, customer_name, customer_phone, customer_address, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssdss", $order_code, $customer_name, $customer_phone, $customer_address, $total_amount, $payment_method, $status);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    $stmt->close();

    // Thêm các món hàng vào order_items nếu có
    if (!empty($items) && is_array($items)) {
        $stmt_item = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($items as $it) {
            $prod_id = (int)($it['id'] ?? 0);
            $prod_name = $it['name'] ?? 'Sản phẩm';
            $price = (float)($it['price'] ?? 0);
            $qty = (int)($it['quantity'] ?? 1);
            $total_price = $price * $qty;
            $stmt_item->bind_param("iisdid", $order_id, $prod_id, $prod_name, $price, $qty, $total_price);
            $stmt_item->execute();
        }
        $stmt_item->close();
    }

    $conn->commit();
    echo json_encode([
        "success" => true,
        "message" => "Đặt hàng thành công!",
        "order_id" => $order_id,
        "order_code" => $order_code
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Lỗi tạo đơn hàng: " . $e->getMessage()]);
}

$conn->close();
`
};

for (const [filename, content] of Object.entries(files)) {
  for (const dir of targetDirs) {
    const fullPath = path.join(dir, filename);
    try {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Successfully wrote:', fullPath);
    } catch (err) {
      console.error('Failed to write:', fullPath, err.message);
    }
  }
}
console.log('DONE setup all PHP backend files!');
