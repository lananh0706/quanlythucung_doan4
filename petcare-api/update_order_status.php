<?php
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input['id'] ?? 0);
$status = trim($input['status'] ?? '');

if ($id <= 0 || empty($status)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Dữ liệu cập nhật trạng thái không hợp lệ!"]);
    exit();
}

$conn->begin_transaction();

try {
    // 1. Kiểm tra trạng thái hiện tại của đơn hàng
    $check_stmt = $conn->prepare("SELECT status FROM orders WHERE id = ? LIMIT 1");
    $check_stmt->bind_param("i", $id);
    $check_stmt->execute();
    $res_check = $check_stmt->get_result();
    $current_row = $res_check ? $res_check->fetch_assoc() : null;
    $prev_status = $current_row ? $current_row['status'] : '';
    $check_stmt->close();

    // 2. Cập nhật trạng thái mới cho đơn hàng
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
    $stmt->close();

    // 3. TỰ ĐỘNG HOÀN KHO NẾU HỦY ĐƠN HÀNG (KHI TRƯỚC ĐÓ CHƯA BỊ HỦY)
    if ($status === 'cancelled' && $prev_status !== 'cancelled') {
        $items_stmt = $conn->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $items_stmt->bind_param("i", $id);
        $items_stmt->execute();
        $res_items = $items_stmt->get_result();

        if ($res_items) {
            $restore_stmt = $conn->prepare("UPDATE products SET stock = stock + ?, sold_count = GREATEST(0, sold_count - ?), in_stock = 1 WHERE id = ?");
            while ($row_item = $res_items->fetch_assoc()) {
                $p_id = (int)$row_item['product_id'];
                $p_qty = (int)$row_item['quantity'];
                if ($p_id > 0 && $p_qty > 0) {
                    $restore_stmt->bind_param("iii", $p_qty, $p_qty, $p_id);
                    $restore_stmt->execute();
                }
            }
            $restore_stmt->close();
        }
        $items_stmt->close();
    }

    $conn->commit();
    echo json_encode([
        "success" => true,
        "message" => "Cập nhật trạng thái đơn hàng thành công!" . ($status === 'cancelled' ? " Đã tự động hoàn trả số lượng hàng vào kho." : "")
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Lỗi cập nhật: " . $e->getMessage()]);
}

$conn->close();
