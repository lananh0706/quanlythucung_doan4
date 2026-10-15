const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Kết nối MySQL XAMPP qua Connection Pool (tự động duy trì và tái tạo kết nối khi idle)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'petcare_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

db.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        console.log('💡 Lưu ý: Hãy chắc chắn bạn đã bật MySQL trong XAMPP và import file `petcare_db.sql`.');
        return;
    }
    console.log('✅ Đã kết nối MySQL XAMPP (petcare_db) thành công qua Connection Pool!');
    conn.release();
});

// ==========================================
// 1. APIS SẢN PHẨM (PRODUCTS CRUD)
// ==========================================

// Lấy danh sách toàn bộ sản phẩm
app.get('/api/products', (req, res) => {
    db.query("SELECT * FROM products WHERE status = 'active' ORDER BY id ASC", (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        // Parse các trường JSON nếu có
        const formatted = results.map(item => {
            try { if (item.weight_options && typeof item.weight_options === 'string') item.weight_options = JSON.parse(item.weight_options); } catch (e) {}
            try { if (item.gallery_images && typeof item.gallery_images === 'string') item.gallery_images = JSON.parse(item.gallery_images); } catch (e) {}
            try { if (item.scents && typeof item.scents === 'string') item.scents = JSON.parse(item.scents); } catch (e) {}
            return item;
        });
        res.json({ success: true, data: formatted });
    });
});

// Lấy chi tiết 1 sản phẩm theo ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        
        const item = results[0];
        try { if (item.weight_options && typeof item.weight_options === 'string') item.weight_options = JSON.parse(item.weight_options); } catch (e) {}
        try { if (item.gallery_images && typeof item.gallery_images === 'string') item.gallery_images = JSON.parse(item.gallery_images); } catch (e) {}
        try { if (item.scents && typeof item.scents === 'string') item.scents = JSON.parse(item.scents); } catch (e) {}

        // Kèm reviews
        db.query("SELECT * FROM reviews WHERE product_id = ? AND status = 'approved' ORDER BY id DESC", [id], (revErr, revResults) => {
            item.reviews = (!revErr && revResults) ? revResults : [];
            res.json({ success: true, data: item });
        });
    });
});

// Thêm mới sản phẩm (Admin)
app.post('/api/products', (req, res) => {
    const { name, price, original_price, discount_percent, sku, brand, category_slug, category, description, image, stock, product_type } = req.body;
    if (!name || !price) {
        return res.status(400).json({ success: false, message: 'Tên và giá sản phẩm không được để trống!' });
    }

    const itemSku = sku || `PET-${Date.now().toString().slice(-6)}`;
    const img = image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500';
    const origPrice = original_price || Math.round(price * 1.18);
    const disc = discount_percent || 15;
    const desc = description || '';

    const sql = `
        INSERT INTO products (sku, name, brand, category_slug, category, price, original_price, discount_percent, stock, image, description, product_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [itemSku, name, brand || 'PetCare Food', category_slug || 'hat', category || 'Thức ăn khô / Hạt', price, origPrice, disc, stock || 100, img, desc, product_type || 'food'], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({
            success: true,
            message: 'Thêm sản phẩm thành công!',
            data: { id: result.insertId, sku: itemSku, name, price, original_price: origPrice, image: img }
        });
    });
});

// Cập nhật sản phẩm (Admin)
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, original_price, discount_percent, brand, category_slug, category, description, image, stock } = req.body;

    const sql = `
        UPDATE products 
        SET name = COALESCE(?, name), price = COALESCE(?, price), original_price = COALESCE(?, original_price),
            discount_percent = COALESCE(?, discount_percent), brand = COALESCE(?, brand), category_slug = COALESCE(?, category_slug),
            category = COALESCE(?, category), description = COALESCE(?, description), image = COALESCE(?, image), stock = COALESCE(?, stock)
        WHERE id = ?
    `;
    db.query(sql, [name, price, original_price, discount_percent, brand, category_slug, category, description, image, stock, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm cần cập nhật!' });
        res.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
    });
});

// Xóa sản phẩm (Admin)
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa!' });
        res.json({ success: true, message: 'Đã xóa sản phẩm thành công!' });
    });
});

// ==========================================
// 2. APIS ĐƠN HÀNG (ORDERS CRUD)
// ==========================================

// Lấy danh sách toàn bộ đơn hàng
app.get('/api/orders', (req, res) => {
    db.query('SELECT * FROM orders ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

// Tạo đơn hàng mới từ giỏ hàng
app.post('/api/orders', (req, res) => {
    const { customer_name, customer_phone, customer_address, customer_note, shipping_method, shipping_fee, voucher_code, discount_amount, total_amount, payment_method, items } = req.body;
    if (!customer_name || !customer_phone || !customer_address || !total_amount) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng!' });
    }

    const orderCode = 'PET-' + Math.floor(100000 + Math.random() * 900000);
    const itemsJson = items ? JSON.stringify(items) : null;
    const method = payment_method || 'COD';
    const shipFee = shipping_fee || 0;
    const disc = discount_amount || 0;
    const note = customer_note || '';

    const sql = `
        INSERT INTO orders (order_code, customer_name, customer_phone, customer_address, customer_note, shipping_method, shipping_fee, voucher_code, discount_amount, total_amount, status, payment_method, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'processing', ?, ?)
    `;

    db.query(sql, [orderCode, customer_name, customer_phone, customer_address, note, shipping_method || 'standard', shipFee, voucher_code || '', disc, total_amount, method, itemsJson], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        
        const orderId = result.insertId;

        // Lưu chi tiết order_items nếu có
        if (Array.isArray(items) && items.length > 0) {
            const itemValues = items.map(it => [
                orderId,
                it.id || null,
                it.name || 'Sản phẩm',
                it.image || null,
                it.weight || it.packaging || 'Gói tiêu chuẩn',
                it.price || 0,
                it.quantity || 1,
                (it.price || 0) * (it.quantity || 1)
            ]);
            const itemSql = 'INSERT INTO order_items (order_id, product_id, product_name, product_image, packaging, price, quantity, total_price) VALUES ?';
            db.query(itemSql, [itemValues], () => {
                // Tự động trừ kho & tăng lượt bán trong products
                items.forEach(it => {
                    const pId = it.id || 0;
                    const pQty = it.quantity || 1;
                    if (pId > 0) {
                        db.query('UPDATE products SET stock = GREATEST(0, stock - ?), sold_count = sold_count + ?, in_stock = IF(stock - ? <= 0, 0, 1) WHERE id = ?', [pQty, pQty, pQty, pId]);
                    }
                });
            });
        }

        // Tích lũy điểm PetXu & doanh số khách hàng
        const xuEarned = Math.floor(total_amount / 10000);
        db.query('UPDATE customers SET orders_count = orders_count + 1, total_spent = total_spent + ?, pet_xu = pet_xu + ? WHERE phone = ?', [total_amount, xuEarned, customer_phone]);

        res.json({
            success: true,
            message: 'Tạo đơn hàng thành công! Đã tự động cập nhật tồn kho và tích điểm PetXu.',
            data: {
                id: orderId,
                order_code: orderCode,
                total_amount,
                xu_earned: xuEarned
            }
        });
    });
});

// Cập nhật trạng thái đơn hàng (Admin)
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Thiếu trạng thái cập nhật!' });
    }

    db.query('SELECT status FROM orders WHERE id = ? LIMIT 1', [id], (errCheck, orderRows) => {
        const prevStatus = (orderRows && orderRows.length > 0) ? orderRows[0].status : '';

        db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });

            // Tự động hoàn kho nếu hủy đơn hàng
            if (status === 'cancelled' && prevStatus !== 'cancelled') {
                db.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id], (errItems, items) => {
                    if (!errItems && items) {
                        items.forEach(it => {
                            if (it.product_id && it.quantity > 0) {
                                db.query('UPDATE products SET stock = stock + ?, sold_count = GREATEST(0, sold_count - ?), in_stock = 1 WHERE id = ?', [it.quantity, it.quantity, it.product_id]);
                            }
                        });
                    }
                });
            }

            res.json({ success: true, message: 'Đã cập nhật trạng thái đơn hàng thành công!' + (status === 'cancelled' ? ' Đã tự động hoàn trả số lượng hàng vào kho.' : '') });
        });
    });
});

// Xóa đơn hàng (Admin)
app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM orders WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã xóa đơn hàng thành công!' });
    });
});

// ==========================================
// 3. APIS THỐNG KÊ DASHBOARD (ADMIN STATS)
// ==========================================
app.get('/api/stats', (req, res) => {
    const statsSql = `
        SELECT 
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM customers) AS total_customers,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT IFNULL(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') AS total_revenue,
            (SELECT COUNT(*) FROM orders WHERE status IN ('processing', 'pending', 'packing')) AS pending_orders
    `;

    db.query(statsSql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({
            success: true,
            data: {
                totalProducts: results[0].total_products || 0,
                totalCustomers: results[0].total_customers || 0,
                totalOrders: results[0].total_orders || 0,
                totalRevenue: Number(results[0].total_revenue) || 0,
                pendingOrders: results[0].pending_orders || 0
            }
        });
    });
});

// ==========================================
// 4. APIS KHÁCH HÀNG (CUSTOMERS)
// ==========================================
app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM customers ORDER BY id DESC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, name: 'Nguyễn Văn Minh', email: 'minh.nguyen@gmail.com', phone: '0982.112.233', membership_rank: 'Vàng', pet_xu: 285, total_spent: 2850000, orders_count: 7, status: 'active' },
                { id: 2, name: 'Lê Hoàng Yến', email: 'hoangyen.design@gmail.com', phone: '0977.221.144', membership_rank: 'Kim Cương', pet_xu: 412, total_spent: 4120000, orders_count: 11, status: 'active' }
            ]
        });
    });
});

// ==========================================
// 5. APIS MÃ KHUYẾN MÃI (VOUCHERS)
// ==========================================
app.get('/api/vouchers', (req, res) => {
    db.query('SELECT * FROM vouchers WHERE status = "active" ORDER BY id ASC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, code: 'PETCARE10', description: 'Giảm 10% tổng đơn hàng', discount_type: 'percent', discount_value: 10, min_order: 150000, status: 'active' },
                { id: 2, code: 'FREESHIP', description: 'Miễn phí giao hàng cho đơn từ 300K', discount_type: 'fixed', discount_value: 25000, min_order: 300000, status: 'active' }
            ]
        });
    });
});

// ==========================================
// 6. APIS BÀI VIẾT BLOG (BLOG POSTS)
// ==========================================
app.get('/api/blogs', (req, res) => {
    db.query('SELECT * FROM blogs WHERE status = "published" ORDER BY id DESC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, title: '10 Dấu hiệu nhận biết boss đang thiếu hụt dinh dưỡng', category: 'Dinh dưỡng', author: 'BS. CKI Nguyễn Minh Tuấn', views: 1840, status: 'published' }
            ]
        });
    });
});

// ==========================================
// 7. APIS QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================
app.get('/api/categories', (req, res) => {
    db.query("SELECT * FROM categories WHERE status = 'active' ORDER BY id ASC", (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, slug: 'hat', name: 'Thức ăn hạt khô', icon: '🥣', description: 'Hạt dinh dưỡng cân bằng AAFCO' },
                { id: 2, slug: 'pate', name: 'Pate & Thức ăn ướt', icon: '🥫', description: 'Sốt & pate mọng nước' }
            ]
        });
    });
});

// ==========================================
// 8. APIS BÁC SĨ THÚ Y (DOCTORS)
// ==========================================
app.get('/api/doctors', (req, res) => {
    db.query('SELECT * FROM doctors ORDER BY id ASC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, name: 'BS. CKI Nguyễn Minh Tuấn', title: 'Trưởng khoa Dinh dưỡng & Nội khoa', specialty: 'Dinh dưỡng & Tiêu hóa thú cưng', status: 'available' }
            ]
        });
    });
});

// ==========================================
// 9. APIS HỒ SƠ THÚ CƯNG (PETS)
// ==========================================
app.get('/api/pets', (req, res) => {
    db.query('SELECT * FROM pets ORDER BY id ASC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({
            success: true,
            data: [
                { id: 1, name: 'Bé Lu', type: 'dog', breed: 'Corgi Pembroke', age: '1.5 tuổi', weight: '11.5 kg' },
                { id: 3, name: 'Miu Miu', type: 'cat', breed: 'Mèo Anh Lông Ngắn', age: '2 tuổi', weight: '4.2 kg' }
            ]
        });
    });
});

// Thêm mũi tiêm vào sổ khám bệnh
app.post('/api/pets/:id/vaccines', (req, res) => {
    const { id } = req.params;
    const { vaccine_name, injection_date, vet_name, notes } = req.body;
    const sql = 'INSERT INTO pet_vaccinations (pet_id, vaccine_name, injection_date, vet_name, notes) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id, vaccine_name || 'Vaccine định kỳ', injection_date || new Date(), vet_name || 'BS. PetCare', notes || ''], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã thêm mũi tiêm vào sổ khám!', data: { id: result.insertId, vaccine_name } });
    });
});

// ==========================================
// 10. APIS ĐÁNH GIÁ (REVIEWS)
// ==========================================
app.get('/api/reviews', (req, res) => {
    db.query('SELECT * FROM reviews ORDER BY id DESC', (err, results) => {
        if (!err && results && results.length > 0) {
            return res.json({ success: true, data: results });
        }
        res.json({ success: true, data: [] });
    });
});

// ==========================================
// 11. APIS CA LÀM VIỆC NHÂN VIÊN (SHIFTS)
// ==========================================
app.get('/api/shifts', (req, res) => {
    db.query("SELECT id, employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, DATE_FORMAT(shift_date, '%Y-%m-%d') as shift_date, start_time, end_time, branch, status, check_in_time, check_out_time, note, created_at FROM employee_shifts ORDER BY shift_date DESC, start_time ASC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results || [] });
    });
});

app.post('/api/shifts', (req, res) => {
    const { employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, shift_date, start_time, end_time, branch, status, note } = req.body;
    const sql = 'INSERT INTO employee_shifts (employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, shift_date, start_time, end_time, branch, status, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [
        employee_id || 'NV-001',
        employee_name || 'Nhân viên mới',
        employee_phone || '',
        employee_role || 'Tư vấn bán hàng',
        shift_name || 'Ca Sáng (07:30 - 12:00)',
        shift_type || 'morning',
        shift_date || new Date().toISOString().split('T')[0],
        start_time || '07:30',
        end_time || '12:00',
        branch || 'Cơ sở chính Ba Đình',
        status || 'scheduled',
        note || ''
    ], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã tạo ca làm việc mới thành công!', id: result.insertId });
    });
});

app.put('/api/shifts/:id', (req, res) => {
    const { id } = req.params;
    const { quick_status } = req.body;
    if (quick_status) {
        const now = new Date().toTimeString().slice(0, 5);
        let sql = 'UPDATE employee_shifts SET status = ? WHERE id = ?';
        let params = [quick_status, id];
        if (quick_status === 'checked_in') {
            sql = 'UPDATE employee_shifts SET status = ?, check_in_time = ? WHERE id = ?';
            params = [quick_status, now, id];
        } else if (quick_status === 'completed') {
            sql = 'UPDATE employee_shifts SET status = ?, check_out_time = ? WHERE id = ?';
            params = [quick_status, now, id];
        }
        db.query(sql, params, (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Cập nhật trạng thái ca thành công!' });
        });
        return;
    }

    const { employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, shift_date, start_time, end_time, branch, status, note } = req.body;
    const sql = 'UPDATE employee_shifts SET employee_id = ?, employee_name = ?, employee_phone = ?, employee_role = ?, shift_name = ?, shift_type = ?, shift_date = ?, start_time = ?, end_time = ?, branch = ?, status = ?, note = ? WHERE id = ?';
    db.query(sql, [employee_id, employee_name, employee_phone, employee_role, shift_name, shift_type, shift_date, start_time, end_time, branch, status, note, id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Cập nhật thông tin ca trực thành công!' });
    });
});

app.delete('/api/shifts/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employee_shifts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã xóa ca trực!' });
    });
});

// ==========================================
// 12. APIS XÁC THỰC & ĐĂNG NHẬP (AUTH APIS)
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const username = (req.body.username || req.body.email || req.body.account || '').trim();
    const password = (req.body.password || '').trim();

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu!' });
    }

    // 1. Kiểm tra Admin
    db.query('SELECT id, username, password, full_name, email, role, status FROM admins WHERE (username = ? OR email = ?) LIMIT 1', [username, username], (errAdmin, adminRows) => {
        if (errAdmin) return res.status(500).json({ success: false, message: errAdmin.message });
        if (adminRows && adminRows.length > 0) {
            const admin = adminRows[0];
            if (admin.status === 'locked') {
                return res.json({ success: false, message: 'Tài khoản quản trị viên đã bị khóa!' });
            }
            if (password === admin.password) {
                db.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);
                const payload = { sub: admin.id, name: admin.full_name, role: admin.role, type: 'admin', iat: Date.now() };
                const token = 'PETCARE_BEARER_' + Buffer.from(JSON.stringify(payload)).toString('base64');
                return res.json({
                    success: true,
                    message: 'Đăng nhập Quản trị viên thành công!',
                    token,
                    user: { id: admin.id, username: admin.username, name: admin.full_name, email: admin.email, role: admin.role, type: 'admin' }
                });
            }
        }

        // 2. Kiểm tra Khách hàng
        db.query('SELECT id, customer_code, name, email, phone, password, membership_rank, pet_xu, status FROM customers WHERE (phone = ? OR email = ?) LIMIT 1', [username, username], (errCust, custRows) => {
            if (errCust) return res.status(500).json({ success: false, message: errCust.message });
            if (custRows && custRows.length > 0) {
                const cust = custRows[0];
                if (cust.status === 'blocked') {
                    return res.json({ success: false, message: 'Tài khoản khách hàng đã bị tạm khóa!' });
                }
                if (password === cust.password) {
                    const payload = { sub: cust.id, name: cust.name, phone: cust.phone, type: 'customer', iat: Date.now() };
                    const token = 'PETCARE_BEARER_' + Buffer.from(JSON.stringify(payload)).toString('base64');
                    return res.json({
                        success: true,
                        message: 'Đăng nhập thành công!',
                        token,
                        user: { id: cust.id, code: cust.customer_code, name: cust.name, email: cust.email, phone: cust.phone, membershipRank: cust.membership_rank, petXu: cust.pet_xu, type: 'customer' }
                    });
                }
            }

            return res.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        });
    });
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PetCare Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 Endpoints sẵn sàng cho ứng dụng Web và Mobile:`);
    console.log(`   - GET/POST/PUT/DELETE /api/products`);
    console.log(`   - GET /api/categories`);
    console.log(`   - GET /api/doctors`);
    console.log(`   - GET/POST /api/pets`);
    console.log(`   - GET /api/customers`);
    console.log(`   - GET /api/vouchers`);
    console.log(`   - GET /api/blogs`);
    console.log(`   - GET /api/reviews`);
    console.log(`   - GET/POST/PUT/DELETE /api/orders`);
    console.log(`   - GET /api/stats`);
});