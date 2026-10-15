# 🐾 BỘ THƯ VIỆN PROMPT TOÀN DIỆN CHO DỰ ÁN PETCARE SHOP & ADMIN SYSTEM
> **Dự án:** Ứng Dụng Quản Lý Thức Ăn Thú Cưng & Hệ Thống Quản Trị Đa Phân Hệ (PetCare)  
> **Nền tảng:** React Native, Expo SDK 54, Expo Router, TypeScript, MySQL (24 bảng), Backend kép (PHP XAMPP & Node.js Express).  
> **Mục đích:** Bộ tài liệu chứa toàn bộ các prompt chuẩn hóa theo chuẩn Prompt Engineering, hỗ trợ lập trình viên, sinh viên hoặc AI tiếp tục phát triển, tái hiện, kiểm thử, tối ưu và bảo vệ bài tập lớn.

---

## 📑 MỤC LỤC BỘ PROMPT

1. [NHÓM 1: PROMPT KIẾN TRÚC HỆ THỐNG & CƠ SỞ DỮ LIỆU](#nhóm-1-prompt-kiến-trúc-hệ-thống--cơ-sở-dữ-liệu)
   - Prompt 1.1: Khởi tạo Kiến trúc Monorepo & Expo Router v54 đa nền tảng
   - Prompt 1.2: Thiết kế & Khởi tạo CSDL MySQL Chuẩn hóa 24 Bảng
   - Prompt 1.3: Xây dựng Backend kép PHP (XAMPP) & Node.js Express với Connection Pool
2. [NHÓM 2: PROMPT PHÁT TRIỂN GIAO DIỆN NGƯỜI DÙNG (USER APP)](#nhóm-2-prompt-phát-triển-giao-diện-người-dùng-user-app)
   - Prompt 2.1: Màn hình Trang chủ (Shop Home) theo đúng đặc tả bài tập lớn
   - Prompt 2.2: Màn hình Chi tiết Sản phẩm chuẩn y khoa thú y 10 mục AAFCO
   - Prompt 2.3: Tính năng Thuật toán AI Pet Food Matcher (Tìm thức ăn thông minh)
   - Prompt 2.4: Giỏ hàng, Áp mã Voucher & Thanh toán VietQR / MoMo động
   - Prompt 2.5: Quản lý Hồ sơ Bé cưng, Sổ tiêm phòng & Lịch ăn định kỳ
   - Prompt 2.6: Màn hình Theo dõi Vận đơn & Shipper thời gian thực
   - Prompt 2.7: Màn hình Cẩm nang Dinh dưỡng & Blog Thú y
3. [NHÓM 3: PROMPT PHÁT TRIỂN HỆ THỐNG QUẢN TRỊ ADMIN (19 PHÂN HỆ)](#nhóm-3-prompt-phát-triển-hệ-thống-quản-trị-admin-19-phân-hệ)
   - Prompt 3.1: Kiến trúc Dashboard Quản trị đa phân hệ & Biểu đồ thống kê
   - Prompt 3.2: Phân hệ Quản lý Phân Ca & Điểm Danh Nhân Viên (Shift Management)
   - Prompt 3.3: Phân hệ Quản lý Kho Hàng & Lô Hàng HSD (Batches & Expiry)
   - Prompt 3.4: Phân hệ Quản lý Đơn hàng & Vận chuyển (Orders & Shippers)
   - Prompt 3.5: Phân hệ Quản lý Khách hàng & Hồ sơ thú cưng của khách
4. [NHÓM 4: PROMPT MỞ RỘNG TÍNH NĂNG NÂNG CAO (ADVANCED EXTENSIONS)](#nhóm-4-prompt-mở-rộng-tính-năng-nâng-cao-advanced-extensions)
   - Prompt 4.1: Tích hợp Chatbot Bác sĩ Thú y AI (Veterinary AI Assistant)
   - Prompt 4.2: Tích hợp Push Notifications nhắc lịch ăn & tiêm chủng
   - Prompt 4.3: Tối ưu Caching Offline (React Query + Local Storage)
   - Prompt 4.4: Tích hợp Cổng thanh toán thực tế (VNPAY / MoMo SDK)
5. [NHÓM 5: PROMPT KIỂM THỬ, BẢO MẬT & TỐI ƯU HIỆU NĂNG](#nhóm-5-prompt-kiểm-thử-bảo-mật--tối-ưu-hiệu-năng)
   - Prompt 5.1: Kiểm thử Tự động (Unit Test & Integration Test với Jest)
   - Prompt 5.2: Kiểm toán Bảo mật Backend & API Security Audit
   - Prompt 5.3: Tối ưu hóa UI/UX Responsive (Mobile, Tablet, Desktop Web)
6. [NHÓM 6: PROMPT BÁO CÁO, THUYẾT TRÌNH & VẤN ĐÁP BẢO VỆ ĐỒ ÁN](#nhóm-6-prompt-báo-cáo-thuyết-trình--vấn-đáp-bảo-vệ-đồ-án)
   - Prompt 6.1: Viết Báo cáo Bài tập lớn / Đồ án hoàn chỉnh theo chuẩn học thuật
   - Prompt 6.2: Soạn thảo Slide Thuyết trình Powerpoint ấn tượng
   - Prompt 6.3: Bộ 50 câu hỏi phản biện & câu trả lời xuất sắc trước Hội đồng chấm thi

---

## NHÓM 1: PROMPT KIẾN TRÚC HỆ THỐNG & CƠ SỞ DỮ LIỆU

### Prompt 1.1: Khởi tạo Kiến trúc Monorepo & Expo Router v54 đa nền tảng
```markdown
Bạn là một Chuyên gia Lập trình Di động React Native & Expo cấp cao. Hãy giúp tôi khởi tạo và cấu hình một dự án thương mại điện tử thú cưng mang tên "PetCare Shop" chạy đồng thời trên Web, Android và iOS với các yêu cầu sau:

1. Công nghệ cốt lõi:
   - Expo SDK 54, React Native 0.81+, React 19, TypeScript (chế độ strict).
   - Định tuyến file-based routing: Expo Router v6 (thư mục `src/app`).
   - Hỗ trợ đa nền tảng: Chạy mượt mà trên trình duyệt máy tính (Web static/SPA) và ứng dụng di động (Expo Go).

2. Cấu trúc thư mục chuẩn:
   - `src/app`: Chứa các route `_layout.tsx`, `index.tsx`, `detail.tsx`, `cart.tsx`, `orders.tsx`, `profile.tsx`, `advisor.tsx`, `blog.tsx`, `admin.tsx`.
   - `src/components`: UI components tái sử dụng (Header, BottomTabs, Card, Charts, Icons, Badge).
   - `src/context`: State management sử dụng React Context (CartContext, ProductContext, CategoryContext, CustomerPetContext).
   - `src/constants`: Dữ liệu seed, theme màu sắc, danh sách tỉnh thành Việt Nam.
   - `src/services`: Cấu hình API client kết nối backend.

3. Yêu cầu giao diện & điều hướng:
   - Thanh điều hướng Bottom Tabs cố định dưới đáy (`app-tabs.tsx`), responsive trên cả Web và Mobile.
   - Quản lý theme sáng/tối linh hoạt với hệ màu HSL hiện đại.
   - Tự động nhận diện IP nội bộ LAN của máy tính để thiết bị di động quét mã QR kết nối API không bị lỗi localhost.

Hãy cung cấp hướng dẫn cài đặt từng bước, file cấu hình `app.json`, `tsconfig.json`, `package.json`, và file gốc `src/app/_layout.tsx` hoàn chỉnh.
```

---

### Prompt 1.2: Thiết kế & Khởi tạo CSDL MySQL Chuẩn hóa 24 Bảng
```markdown
Bạn là một Kỹ sư Thiết kế Cơ sở Dữ liệu (Database Architect) chuyên nghiệp. Hãy thiết kế toàn diện sơ đồ CSDL quan hệ MySQL (InnoDB, utf8mb4_unicode_ci) cho ứng dụng "PetCare Shop" với đầy đủ 24 bảng dữ liệu, khóa ngoại (Foreign Keys) toàn vẹn và dữ liệu mẫu tiếng Việt chuẩn xác:

1. Nhóm Bán hàng & Sản phẩm:
   - `categories`: Quản lý danh mục (Hạt khô, Pate ướt, Snack bánh thưởng, Grain-free...).
   - `brands`: Thương hiệu thức ăn (Royal Canin, Whiskas, Minino, Orijen, Inaba...).
   - `products`: Sản phẩm đầy đủ thông số (tên, mô tả, giá, tồn kho, thành phần đạm/béo/xơ, đối tượng dùng, cảnh báo dị ứng, ảnh chính, gallery).
   - `product_weight_options`: Tùy chọn khối lượng động (400g, 1.5kg, 3.5kg, 10kg) kèm giá riêng.

2. Nhóm Khách hàng, Thú cưng & Chăm sóc y tế:
   - `customers`: Thông tin chủ nuôi, hạng hội viên, tích lũy điểm PetXu, tổng chi tiêu.
   - `pets`: Hồ sơ bé cưng (loài chó/mèo, giống, tuổi, cân nặng, món yêu thích).
   - `pet_vaccinations`: Sổ tiêm phòng vaccine định kỳ, ngày tiêm, bác sĩ phụ trách.
   - `pet_meal_schedules`: Lịch trình các cữ ăn trong ngày (sáng/trưa/tối) kèm trạng thái tick hoàn thành.
   - `doctors`: Đội ngũ bác sĩ thú y (họ tên, học vị CKI, chuyên khoa, phòng khám).
   - `appointments`: Lịch hẹn khám bệnh và tư vấn dinh dưỡng của khách hàng.

3. Nhóm Đơn hàng, Vận chuyển & Thanh toán:
   - `orders`: Đơn đặt hàng, mã `#PET-xxxxxx`, tổng tiền, địa chỉ giao hàng, trạng thái 4 bước.
   - `order_items`: Chi tiết từng món trong đơn, phân loại khối lượng, số lượng, đơn giá.
   - `payments`: Nhật ký giao dịch (VietQR, MoMo, COD, trạng thái thành công/thất bại).
   - `shippers`: Đội ngũ tài xế giao hàng (tên, số điện thoại, biển số xe, đánh giá sao).
   - `vouchers`: Mã giảm giá khuyến mãi (PETCARE10, FREESHIP, hạn dùng, % giảm).

4. Nhóm Kho vận & Chuỗi cung ứng:
   - `inventory`: Vị trí kệ hàng, số lượng tồn thực tế, định mức báo động tồn thấp.
   - `batches`: Quản lý lô hàng theo mã LOT, ngày sản xuất, hạn sử dụng, cảnh báo hết hạn.
   - `suppliers`: Đối tác cung cấp hàng hóa, đại lý phân phối chính hãng.

5. Nhóm Nhân sự, Nội dung & Quản trị:
   - `admins`: Tài khoản quản trị phân quyền (Admin tối cao, Kho, Bác sĩ thú y, CSKH).
   - `employee_shifts`: Phân ca làm việc nhân viên, khung giờ (sáng/chiều/tối/đêm 24/7), ngày trực, chi nhánh, trạng thái điểm danh check-in/out, ghi chú bàn giao ca.
   - `banners`: Slide quảng cáo trang chủ, badge hot deal, màu chủ đề.
   - `blogs`: Bài viết cẩm nang dinh dưỡng & bệnh thú y.
   - `reviews`: Đánh giá sao & nhận xét thực tế kèm ảnh từ người mua.
   - `feedbacks`: Phản hồi và yêu cầu tư vấn thể trạng trực tuyến từ khách hàng.

Hãy viết mã SQL chi tiết: `CREATE DATABASE petcare_db;`, các lệnh `CREATE TABLE` có ràng buộc khóa ngoại `ON DELETE CASCADE`, và lệnh `INSERT INTO` chứa ít nhất 5 bản ghi mẫu sinh động cho mỗi bảng.
```

---

### Prompt 1.3: Xây dựng Backend kép PHP (XAMPP) & Node.js Express với Connection Pool
```markdown
Bạn là một Chuyên gia Lập trình Backend (Full-stack Engineer). Hãy hướng dẫn xây dựng kiến trúc backend kép cho hệ thống PetCare Shop, hỗ trợ 2 môi trường:
1. Môi trường XAMPP (Apache + PHP 8.x): Phù hợp nộp bài thi thực hành trường học, dễ chạy trên máy giáo viên.
2. Môi trường Node.js (Express 5.x + MySQL2 Connection Pool): Phù hợp microservices, hiệu năng cao, chống lỗi ngắt kết nối idle.

Yêu cầu chi tiết:
- Phía PHP XAMPP (`petcare-api/`):
  - Viết file `db.php` xử lý CORS đầy đủ (hỗ trợ `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`), kết nối MySQL với UTF-8 charset.
  - Viết các endpoints: `get_products.php`, `get_product_detail.php`, `create_order.php`, `manage_shifts.php`, `get_shifts.php`, `get_categories.php`, `get_admin_extra.php`.
  - Hỗ trợ cả Web (localhost) và Mobile (IP LAN mạng Wi-Fi như `192.168.1.8`).
- Phía Node.js Express (`petcare-server/`):
  - Cấu hình `mysql2` sử dụng `createPool` với `waitForConnections: true`, `connectionLimit: 10`, `enableKeepAlive: true`, `keepAliveInitialDelay: 10000` để ngăn ngừa triệt để lỗi `PROTOCOL_CONNECTION_LOST`.
  - Định nghĩa RESTful API đầy đủ CRUD cho `/api/products`, `/api/orders`, `/api/shifts`, `/api/customers`, `/api/pets`.
  - Xử lý bắt lỗi tập trung (Error Middleware) và trả về format JSON chuẩn `{ success: boolean, data?: any, message?: string }`.

Hãy cung cấp mã nguồn hoàn chỉnh của các file trọng tâm.
```

---

## NHÓM 2: PROMPT PHÁT TRIỂN GIAO DIỆN NGƯỜI DÙNG (USER APP)

### Prompt 2.1: Màn hình Trang chủ (Shop Home) theo đúng đặc tả bài tập lớn
```markdown
Bạn là Chuyên gia Lập trình Giao diện React Native. Hãy tạo màn hình Trang chủ (`src/app/index.tsx`) cho ứng dụng PetCare Shop tuân thủ 100% các tiêu chí đặc tả sau:

1. Bố cục danh sách sản phẩm bắt buộc (Layout yêu cầu):
   - Hiển thị danh sách thức ăn thú cưng dạng thẻ (Card) chuẩn:
     - Bên trái: Ảnh sản phẩm rõ nét, bo góc mềm mại (`borderRadius: 12`), tỉ lệ vuông hoặc 4:3.
     - Bên phải (Cột thông tin):
       - Dòng 1: Tên sản phẩm in chữ ĐẬM MÀU XANH (`#0284C7` hoặc `#0369A1`, `fontWeight: '700'`).
       - Dòng tiếp theo: Mô tả sản phẩm súc tích (1-2 dòng, màu xám thanh lịch, `numberOfLines={2}`).
       - Dòng cuối: Giá sản phẩm in chữ ĐỎ TÔ ĐẬM (`#DC2626`, `fontWeight: '800'`), hiển thị kèm giá gốc gạch ngang và % giảm giá nếu có.
   - Chạm vào thẻ sản phẩm chuyển hướng ngay sang trang Chi tiết (`/detail?id=...`).

2. Các thành phần bổ trợ cao cấp:
   - Header: Thanh tìm kiếm sản phẩm realtime, nút mở giỏ hàng kèm huy hiệu số lượng (Badge số đỏ).
   - Banner Slider: Slide chuyển động mượt mà hiển thị các chương trình khuyến mãi Hot.
   - Phân loại danh mục nhanh (Horizontal Category Scroll): Thức ăn hạt khô, Pate ướt, Bánh thưởng, Dòng Grain-Free.
   - Nút gọi tính năng AI Pet Food Matcher: Nổi bật ở đầu trang giúp khách tìm thức ăn phù hợp cho chó/mèo trong 30 giây.
   - Hỗ trợ kéo để tải lại (Pull-to-refresh) và hiển thị dữ liệu fallback offline nếu mất kết nối mạng.

Hãy viết code TypeScript hoàn chỉnh, không dùng placeholder, sử dụng StyleSheet của React Native.
```

---

### Prompt 2.2: Màn hình Chi tiết Sản phẩm chuẩn y khoa thú y 10 mục AAFCO
```markdown
Bạn là một Chuyên gia Phát triển Ứng dụng Thú cưng kết hợp Bác sĩ Thú y Dinh dưỡng. Hãy xây dựng màn hình Chi tiết Sản phẩm (`src/app/detail.tsx`) cho PetCare Shop đáp ứng toàn diện "Bộ thông tin sản phẩm đầy đủ 10 mục chuẩn thú y":

1. Mục 1 - Thông tin cơ bản: Tên sản phẩm, thương hiệu, mã SKU, danh mục, giá bán hiện tại, giá gốc, % giảm giá, số lượng đã bán, đánh giá sao, trạng thái còn/hết hàng.
2. Mục 2 - Sản phẩm được làm từ gì?: Thành phần chính, nguồn đạm động vật tươi (gà, cá hồi, bò...), vitamin & khoáng vi lượng, taurine sáng mắt, chất bảo quản tự nhiên, cảnh báo dị ứng.
3. Mục 3 - Thành phần dinh dưỡng: Bảng phân tích Protein thô (thanh tiến trình trực quan %), chất béo thô, chất xơ, độ ẩm, khoáng tro, năng lượng trao đổi Kcal/kg, tỷ lệ Canxi/Phốt pho chuẩn AAFCO.
4. Mục 4 - Phù hợp với bé nào: Phân loại theo độ tuổi (mèo con, trưởng thành, mèo già), môi trường nuôi (trong nhà, vận động nhiều, triệt sản), mức cân nặng đề xuất.
5. Mục 5 - Cần tránh với bé nào: Cảnh báo thú cưng dị ứng đạm gia cầm/hải sản, tiêu hóa nhạy cảm, bệnh lý sỏi tiết niệu, khuyến cáo an toàn từ nhà sản xuất.
6. Mục 6 - Hướng dẫn cho ăn & Chuyển đổi: Bảng khẩu phần thức ăn (g/ngày) theo thể trọng, số bữa/ngày, quy tắc vàng 7 ngày chuyển đổi thức ăn mới tránh tiêu chảy, lời khuyên bổ sung nước.
7. Mục 7 - Thông tin xuất xứ & Bảo quản: Xuất xứ quốc gia, nhà máy sản xuất, ngày sản xuất, hạn sử dụng, bao bì túi zip nhôm chống ẩm, điều kiện nhiệt độ bảo quản.
8. Mục 8 - Đánh giá & Phản hồi: Điểm đánh giá sao trung bình, biểu đồ tỷ lệ sao (5 sao, 4 sao...), danh sách nhận xét thực tế kèm ảnh và tag hàng đã mua.
9. Mục 9 - Bộ sưu tập hình ảnh (Gallery trực quan): Bộ chọn thumbnail xem ảnh bao bì mặt trước, mặt sau, cận cảnh viên hạt/pate thực tế, bảng thành phần.
10. Mục 10 - Tùy chọn mua hàng & Ưu đãi: Bộ chọn khối lượng động (400g, 1.5kg, 3.5kg, 10kg) cập nhật giá realtime, bộ đếm số lượng (+/-), nút "Thêm vào giỏ", nút "Mua ngay", ưu đãi Freeship đơn từ 300K.

Hãy cung cấp mã nguồn TypeScript đầy đủ, giao diện mượt mà và trực quan.
```

---

### Prompt 2.3: Tính năng Thuật toán AI Pet Food Matcher (Tìm thức ăn thông minh)
```markdown
Bạn là Kỹ sư AI & Thuật toán Khuyến nghị (Recommendation Engine). Hãy viết tính năng "Pet Food Matcher - Tìm thức ăn tối ưu cho bé cưng" tích hợp trong `src/app/advisor.tsx` và popup tại màn hình chi tiết sản phẩm:

1. Đầu vào (User Input 4 tiêu chí):
   - Loài thú cưng: Chó hoặc Mèo.
   - Độ tuổi: Sơ sinh (<2 tháng) / Bé con (2-12 tháng) / Trưởng thành (1-7 tuổi) / Lớn tuổi (>7 tuổi).
   - Thể trạng & Cân nặng: Nhẹ cân (cần tăng cân) / Bình thường / Thừa cân (kiểm soát cân nặng) / Mang thai hoặc cho con bú.
   - Nhu cầu đặc biệt hoặc Thành phần cần tránh: Kén ăn, Nhạy cảm tiêu hóa, Dị ứng đạm bò/gà, Chăm sóc lông & da, Ngừa sỏi thận tiết niệu, Grain-Free (không ngũ cốc).

2. Thuật toán chấm điểm tương thích (Scoring Algorithm):
   - Tính điểm tương thích phần trăm (0 - 100%) cho từng sản phẩm trong cơ sở dữ liệu.
   - Cộng điểm thưởng nếu sản phẩm có tag khớp chính xác với nhu cầu chăm sóc đặc biệt (+30đ).
   - Trừ điểm nặng hoặc loại bỏ ngay (-100đ) nếu sản phẩm chứa thành phần dị ứng mà chủ nuôi chọn tránh.
   - Xếp hạng và chọn ra Top 3 sản phẩm đạt điểm cao nhất.

3. Đầu ra giao diện (UX Output):
   - Hiển thị badge % phù hợp (Ví dụ: "98% Tương thích tuyệt đối").
   - Lời giải thích từ chuyên gia thú y: "Tại sao sản phẩm này tốt nhất cho bé của bạn?".
   - Cảnh báo thành phần cần lưu ý nếu điểm dưới 70%.
   - Nút "Chọn mua ngay" chuyển sản phẩm vào giỏ hàng với 1 chạm.

Hãy viết code component hoàn chỉnh kèm thuật toán tính điểm type-safe bằng TypeScript.
```

---

### Prompt 2.4: Giỏ hàng, Áp mã Voucher & Thanh toán VietQR / MoMo động
```markdown
Bạn là Chuyên gia Xây dựng Hệ thống Thanh toán Thương mại điện tử. Hãy thiết kế màn hình Giỏ hàng & Thanh toán (`src/app/cart.tsx`) cho PetCare Shop:

1. Quản lý Giỏ hàng (`CartContext`):
   - Tăng/giảm số lượng, xóa món khỏi giỏ hàng, xóa toàn bộ giỏ.
   - Tự động lưu trữ giỏ hàng vào `AsyncStorage` / `localStorage` để không bị mất khi reload app.

2. Tính toán & Áp dụng Khuyến mãi:
   - Nhập mã voucher: Kiểm tra mã hợp lệ (`PETCARE10` - giảm 10%, `FREESHIP` - miễn phí giao hàng 30.000đ).
   - Tính toán tạm tính, tiền giảm giá, phí vận chuyển (miễn phí khi đơn hàng > 300.000đ) và Tổng thanh toán cuối cùng.

3. Địa chỉ giao hàng Việt Nam chuẩn hóa:
   - Sử dụng danh sách tỉnh thành, quận huyện, phường xã từ `src/constants/vietnam-addresses.ts`.
   - Lựa chọn phương thức giao hàng: Tiêu chuẩn (2-3 ngày) hoặc Hỏa tốc 2 giờ.

4. Cổng thanh toán trực quan:
   - Tùy chọn 1: Thanh toán khi nhận hàng (COD).
   - Tùy chọn 2: Chuyển khoản VietQR - Hiển thị mã QR động chứa đúng Số tài khoản, Ngân hàng MBBank, Tên chủ TK và Số tiền chính xác của đơn hàng.
   - Tùy chọn 3: Ví điện tử MoMo - Hiển thị mã QR MoMo và hướng dẫn quét app.

5. Tạo đơn hàng:
   - Gửi yêu cầu đặt hàng tới backend MySQL (`create_order.php` hoặc `/api/orders`).
   - Xóa giỏ hàng, hiển thị màn hình chúc mừng đặt hàng thành công kèm mã đơn `#PET-xxxxxx` và nút chuyển tới trang theo dõi đơn hàng (`/orders`).

Hãy cung cấp mã nguồn TypeScript chi tiết.
```

---

### Prompt 2.5: Quản lý Hồ sơ Bé cưng, Sổ tiêm phòng & Lịch ăn định kỳ
```markdown
Bạn là Chuyên gia Lập trình React Native. Hãy xây dựng màn hình Hồ sơ Cá nhân & Sổ Thú Y Điện Tử (`src/app/profile.tsx`):

1. Quản lý Hồ sơ Bé cưng (Pet Profiles):
   - Danh sách các thú cưng trong gia đình: Ảnh đại diện bé cưng, Tên, Giống loài (Mèo Anh lông ngắn, Poodle...), Ngày sinh/Tuổi, Cân nặng hiện tại.
   - Modal thêm / chỉnh sửa thông tin bé cưng, lưu vào context và đồng bộ CSDL.

2. Lịch trình các cữ ăn trong ngày (Daily Meal Schedule):
   - Danh sách các cữ ăn: Cữ Sáng (07:30 - Hạt Royal Canin 35g), Cữ Trưa (12:30 - Pate Whiskas 1/2 gói), Cữ Tối (19:00 - Snack xương gặm sạch răng).
   - Checkbox đánh dấu "Đã cho ăn" kèm thanh tiến độ dinh dưỡng trong ngày (% hoàn thành).

3. Sổ tiêm phòng & Khám sức khỏe thú cưng (Vaccination Book):
   - Danh sách các mũi tiêm: Tiêm phòng dại, Vaccine 4 bệnh mèo, Tẩy giun định kỳ, Nhỏ gáy trị ve rận.
   - Hiển thị ngày tiêm, ngày tái chủng dự kiến, bác sĩ thú y phụ trách và trạng thái (Đã tiêm / Sắp tới hạn).

4. Hệ thống Hội viên & Điểm thưởng PetXu:
   - Thẻ hội viên VIP (Hạng Bạc / Vàng / Kim Cương).
   - Hiển thị số điểm PetXu tích lũy (100đ PetXu = 10.000 VNĐ) và danh sách quà tặng/voucher có thể đổi.

Hãy viết code TypeScript hoàn chỉnh với giao diện đẹp mắt, gradient sinh động và animation mượt mà.
```

---

## NHÓM 3: PROMPT PHÁT TRIỂN HỆ THỐNG QUẢN TRỊ ADMIN (19 PHÂN HỆ)

### Prompt 3.1: Kiến trúc Dashboard Quản trị đa phân hệ & Biểu đồ thống kê
```markdown
Bạn là Chuyên gia Phát triển Dashboard Quản trị Doanh nghiệp (Enterprise Admin Architect). Hãy xây dựng khung giao diện Dashboard Quản trị cho PetCare Shop (`src/app/admin.tsx`) với các tiêu chuẩn sau:

1. Bố cục Quản trị 2 Cột (Responsive Sidebar Layout):
   - Cột trái: Sidebar điều hướng cố định với 19 phân hệ được phân loại khoa học:
     - Nhóm Vận hành & Bán hàng: Dashboard, Sản phẩm, Danh mục, Thương hiệu, Kho hàng, Lô hàng & HSD, Đơn hàng, Khách hàng, Vận chuyển, Thanh toán, Khuyến mãi, Nhà cung cấp, Đánh giá.
     - Nhóm Nội dung & Hệ thống: Banner, Bài viết, Phản hồi, Ca nhân viên, Tài khoản quản trị, Báo cáo thống kê.
   - Cột phải: Khung nội dung chính với Header chứa tiêu đề phân hệ, thanh tìm kiếm, nút thêm mới nhanh và khu vực hiển thị danh sách dạng bảng/thẻ cao cấp.

2. Biểu đồ thống kê trực quan (`src/components/admin-charts.tsx`):
   - Biểu đồ cột Doanh thu theo tháng (Bar Chart Canvas/SVG).
   - Biểu đồ tròn Tỷ trọng doanh số theo danh mục thức ăn (Pie Chart SVG).
   - Top 5 sản phẩm bán chạy nhất kèm số lượng đã bán và doanh thu đóng góp.

3. Cơ chế Modal & Form dùng chung (Universal Entity Modal):
   - Quản lý trạng thái form thêm/sửa cho mọi thực thể với cơ chế validation chặt chẽ.
   - Hỗ trợ chọn ảnh từ máy tính (`pickImageFromFile`), xem trước ảnh và upload lên backend.

Hãy viết cấu trúc module, state management và giao diện admin chuyên nghiệp.
```

---

### Prompt 3.2: Phân hệ Quản lý Phân Ca & Điểm Danh Nhân Viên (Shift Management)
```markdown
Bạn là Chuyên gia Phát triển Hệ thống Quản trị Nhân sự (HR & Operations Specialist). Hãy viết phân hệ "Quản Lý Ca Trực & Phân Công Lịch Làm Việc Nhân Viên" trong `src/app/admin.tsx` kết nối bảng CSDL `employee_shifts`:

1. Nghiệp vụ Quản lý Ca Trực:
   - Thông tin ca: Mã nhân viên (`NV-001`, `BS-002`), Họ tên, Chức vụ (Bác sĩ thú y trực ca, Bác sĩ cấp cứu 24/7, Tư vấn bán hàng, Quản lý kho, Kỹ thuật viên Spa, Thu ngân), Khung ca (Ca Sáng 07:30-12:00, Ca Chiều 12:00-17:30, Ca Tối 17:30-22:00, Hành chính 08:00-17:00, Ca Đêm 22:00-07:30), Ngày trực, Chi nhánh, Ghi chú bàn giao.
   - Trạng thái ca: Đã xếp ca (`scheduled`), Đang làm việc (`checked_in`), Đã hoàn thành (`completed`), Nghỉ phép (`leave`), Vắng mặt (`absent`).

2. Giao diện & Thao tác 1 Chạm:
   - 5 Thẻ KPIs thời gian thực: Ca hôm nay, Đang làm việc, Chờ vào ca, Đã hoàn thành, Vắng/Nghỉ phép.
   - Bộ lọc đa chiều: Lọc theo Ngày (Hôm nay / Tất cả), Lọc theo Khung ca, Lọc theo Trạng thái, Ô tìm kiếm nhân sự.
   - Thẻ ca trực trực quan: Hiển thị avatar chức vụ, badge trạng thái màu sắc, giờ check-in/out thực tế, ghi chú công việc.
   - Điểm danh 1 chạm: Nút "Check-in Điểm Danh" (ghi nhận giờ vào ca), Nút "Check-out Hoàn Thành" (ghi nhận giờ tan ca), Nút duyệt "Xin nghỉ".
   - Modal phân ca nhanh: Có danh sách chip gợi ý 8 nhân viên có sẵn và 5 khung ca chuẩn để bấm chọn tự động điền form trong 3 giây.

3. Đồng bộ CSDL:
   - Gọi API PHP (`manage_shifts.php`) và Express (`/api/shifts`) để lưu trữ CSDL MySQL, hỗ trợ fallback local an toàn nếu mất mạng.

Hãy cung cấp mã nguồn TypeScript hoàn chỉnh cho phân hệ này.
```

---

### Prompt 3.3: Phân hệ Quản lý Kho Hàng & Lô Hàng HSD (Batches & Expiry)
```markdown
Bạn là Kỹ sư Quản trị Kho vận (Warehouse Management Expert). Hãy thiết kế 2 phân hệ Quản trị Kho hàng (`inventory`) và Quản lý Lô hàng & Hạn sử dụng (`batches`) trong `src/app/admin.tsx`:

1. Phân hệ Kho hàng (`inventory`):
   - Theo dõi SKU, tên sản phẩm, quy cách đóng gói, vị trí lưu kho (VD: "Kệ A1 - Tầng 2"), số lượng tồn kho thực tế, định mức cảnh báo tồn thấp (`minAlertQty`).
   - Cảnh báo badge màu: Còn hàng (Xanh lá), Sắp hết hàng (Vàng cam - khi tồn <= định mức), Hết hàng (Đỏ - khi tồn = 0).
   - Nút thao tác nhanh nhập thêm hàng vào kho (+10, +50) và điều chỉnh tồn kho.

2. Phân hệ Lô hàng & Hạn sử dụng (`batches`):
   - Quản lý mã lô (`LOT-2026-xxx`), ngày sản xuất (NSX), hạn sử dụng (HSD), số ngày còn lại đến khi hết hạn.
   - Phân loại trạng thái hạn dùng:
     - An toàn (`good`): Còn > 180 ngày.
     - Cần đẩy bán sớm (`warning`): Còn 60 - 180 ngày (tự động gợi ý tạo voucher giảm giá thanh lý).
     - Nguy cấp (`critical`): Còn < 60 ngày hoặc đã hết hạn (cảnh báo cấm bán để bảo vệ sức khỏe thú cưng).
   - Tính năng xuất danh sách lô hàng sắp hết hạn phục vụ kiểm kê thực tế.

Hãy viết code giao diện và logic quản lý cho 2 phân hệ này.
```

---

## NHÓM 4: PROMPT MỞ RỘNG TÍNH NĂNG NÂNG CAO (ADVANCED EXTENSIONS)

### Prompt 4.1: Tích hợp Chatbot Bác sĩ Thú y AI (Veterinary AI Assistant)
```markdown
Bạn là Chuyên gia Trí tuệ Nhân tạo Ứng dụng (Generative AI Specialist). Hãy thiết kế và tích hợp một Trợ lý Ảo Bác Sĩ Thú Y AI (PetCare AI Vet Assistant) trực tiếp vào ứng dụng PetCare Shop:

1. Kiến trúc Trợ lý AI:
   - Sử dụng mô hình ngôn ngữ lớn (Gemini 1.5 Flash / Claude 3.5 Sonnet / OpenAI GPT-4o-mini).
   - System Prompt chuyên sâu: Đóng vai trò Bác sĩ Thú y chuyên khoa Dinh dưỡng lâm sàng, giao tiếp ân cần, chuyên nghiệp, sử dụng tiếng Việt chuẩn y khoa nhưng dễ hiểu với chủ nuôi.
   - RAG (Retrieval-Augmented Generation): Cung cấp cho AI cơ sở dữ liệu về 30+ sản phẩm thức ăn PetCare (thành phần, calo, chỉ định, chống chỉ định) để gợi ý đúng sản phẩm có bán tại shop.

2. Giao diện Chatbot (Chat UI Component):
   - Nút bong bóng chat nổi ở góc dưới màn hình ("💬 Chat cùng Bác Sĩ AI").
   - Giao diện tin nhắn dạng bong bóng (User bubble & AI bubble) có hiệu ứng gõ chữ (Streaming response).
   - Các nút câu hỏi gợi ý nhanh: "Mèo con 2 tháng nên ăn gì?", "Bé bị tiêu chảy sau khi đổi thức ăn phải làm sao?", "Cách tính lượng calo hàng ngày cho chó Poodle?".
   - Thẻ sản phẩm nhúng trong khung chat: Khi AI gợi ý sản phẩm, hiển thị thẻ sản phẩm có ảnh, giá và nút "Thêm vào giỏ" ngay trong đoạn chat.

Hãy cung cấp mã nguồn component React Native và code xử lý API streaming.
```

---

### Prompt 4.2: Tích hợp Push Notifications nhắc lịch ăn & tiêm chủng
```markdown
Bạn là Kỹ sư Di động chuyên sâu về Hệ thống Thông báo (Notification Specialist). Hãy tích hợp thư viện `expo-notifications` vào PetCare Shop để tự động nhắc nhở người dùng:

1. Kịch bản thông báo tự động (Automated Scenarios):
   - Nhắc cữ ăn hàng ngày: Gửi thông báo đúng 07:30, 12:30, 19:00 ("🔔 Đã đến giờ ăn của bé Miu rồi! Cữ sáng: 35g hạt Royal Canin Fit32 nhé!").
   - Nhắc lịch tiêm chủng & tái khám: Gửi thông báo trước 3 ngày và trước 1 ngày đến hẹn tiêm phòng dại hoặc tẩy giun.
   - Cập nhật tiến độ đơn hàng: Khi Admin đổi trạng thái đơn sang "Đang giao hàng", bắn thông báo kèm tên tài xế và thời gian giao dự kiến.

2. Yêu cầu kỹ thuật:
   - Xin quyền thông báo (Permissions handling) thân thiện trên cả iOS và Android.
   - Lập lịch thông báo cục bộ định kỳ (`scheduleNotificationAsync` với `DailyTriggerInput`).
   - Xử lý tương tác khi người dùng bấm vào thông báo: Chuyển hướng chính xác tới màn hình Hồ sơ bé cưng (`/profile`) hoặc Chi tiết đơn hàng (`/orders`).

Hãy cung cấp code service thông báo chuẩn hóa viết bằng TypeScript.
```

---

## NHÓM 5: PROMPT KIỂM THỬ, BẢO MẬT & TỐI ƯU HIỆU NĂNG

### Prompt 5.1: Kiểm thử Tự động (Unit Test & Integration Test với Jest)
```markdown
Bạn là Chuyên gia Đảm bảo Chất lượng Phần mềm (QA/QC & Test Automation Engineer). Hãy viết bộ kiểm thử tự động toàn diện cho PetCare Shop sử dụng Jest và React Native Testing Library:

1. Kiểm thử Logic Nghiệp vụ (Unit Tests):
   - Test hàm tính tổng tiền giỏ hàng, áp dụng voucher `PETCARE10` (giảm 10%), `FREESHIP` (miễn phí ship với đơn > 300K).
   - Test thuật toán chấm điểm Pet Food Matcher: Đảm bảo sản phẩm có thành phần dị ứng luôn bị loại khỏi danh sách khuyến nghị.
   - Test hàm kiểm tra trạng thái lô hàng HSD (`good`, `warning`, `critical`).

2. Kiểm thử Giao diện & Tương tác (Integration Tests):
   - Test luồng thêm sản phẩm vào giỏ hàng: Bấm nút "Thêm vào giỏ" tại `detail.tsx` ➔ Badge giỏ hàng tăng số lượng ➔ Mở `cart.tsx` thấy sản phẩm xuất hiện.
   - Test quy trình Điểm danh Ca nhân viên tại Admin: Bấm "Check-in Điểm Danh" ➔ Trạng thái chuyển thành `checked_in` ➔ Ghi nhận đúng giờ hiện tại.

Hãy cung cấp file cấu hình `jest.config.js` và mã nguồn các test file `.test.ts`, `.test.tsx` hoàn chỉnh.
```

---

### Prompt 5.2: Kiểm toán Bảo mật Backend & API Security Audit
```markdown
Bạn là Chuyên gia An toàn Thông tin & Bảo mật Ứng dụng Web/Mobile (AppSec Engineer). Hãy tiến hành đánh giá bảo mật toàn diện cho mã nguồn Backend PHP (`petcare-api/`) và Node.js (`petcare-server/`) của dự án PetCare Shop:

1. Kiểm tra & Vá lỗi các lỗ hổng OWASP Top 10:
   - SQL Injection: Đảm bảo 100% câu lệnh truy vấn đều sử dụng Prepared Statements (`$conn->prepare()` trong PHP, parameterized queries trong Node.js), loại bỏ nối chuỗi SQL thô.
   - XSS (Cross-Site Scripting): Lọc và mã hóa các trường nhập liệu từ người dùng (tên khách hàng, nội dung đánh giá, ghi chú đơn hàng).
   - CSRF & CORS Security: Cấu hình CORS chặt chẽ, kiểm soát nguồn gốc `Origin`.
   - Rate Limiting & DoS Protection: Chống spam request tạo đơn hàng hoặc gửi feedback liên tục.

2. Cơ chế Xác thực & Phân quyền Quản trị:
   - Nâng cấp mật khẩu admin từ plain-text sang chuẩn mã hóa an toàn `bcrypt`.
   - Triển khai xác thực JWT (JSON Web Token) cho các API quản trị Admin, bảo vệ các endpoint nhạy cảm (xóa sản phẩm, sửa doanh thu, đổi phân ca).

Hãy phân tích các rủi ro hiện tại và cung cấp đoạn code đã được vá bảo mật chuẩn mực.
```

---

## NHÓM 6: PROMPT BÁO CÁO, THUYẾT TRÌNH & VẤN ĐÁP BẢO VỆ ĐỒ ÁN

### Prompt 6.1: Viết Báo cáo Bài tập lớn / Đồ án hoàn chỉnh theo chuẩn học thuật
```markdown
Bạn là một Giảng viên Hướng dẫn & Chuyên gia Học thuật Công nghệ Thông tin. Hãy soạn thảo Đề cương và Nội dung chi tiết Báo cáo Bài tập lớn (Báo cáo Đồ án môn học) cho đề tài:
"XÂY DỰNG ỨNG DỤNG DI ĐỘNG & WEB QUẢN LÝ THỨC ĂN THÚ CƯNG PETCARE SHOP TRÊN NỀN TẢNG REACT NATIVE VÀ EXPO"

Báo cáo cần có độ dài học thuật chuẩn mực (định dạng Markdown), chia thành 5 chương chính:
- CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & PHÂN TÍCH YÊU CẦU
  - Lý do chọn đề tài, khảo sát thị trường chăm sóc thú cưng tại Việt Nam.
  - Phân tích yêu cầu chức năng (Khách hàng & Quản trị viên 19 phân hệ) và phi chức năng (Responsive, Đa nền tảng, Tốc độ tải trang).
- CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ SỬ DỤNG
  - Giới thiệu React Native, kiến trúc Expo Router v54 (File-based routing).
  - So sánh giải pháp Backend kép: PHP XAMPP vs Node.js Express Connection Pool.
  - Hệ quản trị CSDL MySQL, chuẩn mã hóa ký tự tiếng Việt utf8mb4.
- CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC HỆ THỐNG & CƠ SỞ DỮ LIỆU
  - Sơ đồ kiến trúc tổng thể hệ thống (System Architecture).
  - Sơ đồ thực thể liên kết ERD (Entity Relationship Diagram) chi tiết 24 bảng.
  - Thiết kế luồng dữ liệu (Data Flow Diagram - DFD) và sơ đồ Use-Case.
- CHƯƠNG 4: HIỆN THỰC HÓA CÁC CHỨC NĂNG CHÍNH
  - Chi tiết cài đặt: Danh sách sản phẩm, Trang chi tiết 10 mục chuẩn thú y, AI Pet Food Matcher, Giỏ hàng & VietQR, Quản lý ca nhân viên admin.
  - Kèm ảnh chụp giao diện và trích đoạn mã nguồn tiêu biểu.
- CHƯƠNG 5: KẾT QUẢ ĐẠT ĐƯỢC, KẾT LUẬN & HƯỚNG PHÁT TRIỂN
  - Đánh giá mức độ hoàn thành so với yêu cầu đề bài (100% đạt yêu cầu xuất sắc).
  - Ưu điểm, hạn chế còn tồn tại và hướng nâng cấp tiếp theo (AI Vet Chatbot, thanh toán online).

Hãy viết báo cáo với văn phong khoa học, lập luận chặt chẽ và số liệu minh chứng thuyết phục.
```

---

### Prompt 6.2: Soạn thảo Slide Thuyết trình Powerpoint ấn tượng
```markdown
Bạn là một Chuyên gia Thuyết trình & Diễn giả Công nghệ. Hãy thiết kế kịch bản chi tiết cho bộ 15 Slide Thuyết Trình (Powerpoint / Canva Slide Outline) bảo vệ Bài tập lớn dự án "PetCare Shop":

Yêu cầu cho từng slide:
- Tiêu đề slide ngắn gọn, cuốn hút.
- Nội dung hiển thị trên slide (Bullet points súc tích, trực quan, không dùng đoạn văn dài).
- Gợi ý hình ảnh / biểu đồ / icon minh họa cho slide.
- Kịch bản lời thoại của người thuyết trình (Presenter Speech Script) nói trong khoảng 45 - 60 giây mỗi slide.

Danh sách 15 Slide bao gồm:
1. Slide 1: Giới thiệu đề tài, thành viên nhóm và giảng viên hướng dẫn.
2. Slide 2: Vấn đề thực tế (Nỗi đau của chủ nuôi khi chọn sai thức ăn thú cưng).
3. Slide 3: Giải pháp PetCare Shop & Sứ mệnh ứng dụng.
4. Slide 4: Kiến trúc công nghệ hiện đại (Expo SDK 54, TypeScript, MySQL 24 bảng).
5. Slide 5: Trải nghiệm Trang chủ & Danh mục sản phẩm trực quan.
6. Slide 6: Màn hình Chi tiết Sản phẩm đột phá với 10 mục chuẩn thú y AAFCO.
7. Slide 7: Tính năng thông minh AI Pet Food Matcher (Thuật toán gợi ý thức ăn).
8. Slide 8: Giỏ hàng, Voucher & Thanh toán chuyển khoản VietQR tự động.
9. Slide 9: Hồ sơ bé cưng, Sổ tiêm phòng điện tử & Theo dõi lịch ăn.
10. Slide 10: Tổng quan Hệ thống Quản trị Admin 19 phân hệ chuyên nghiệp.
11. Slide 11: Điểm nhấn phân hệ Admin Quản lý Phân Ca & Điểm Danh Nhân Viên.
12. Slide 12: Thiết kế Cơ sở Dữ liệu quan hệ vững chắc & Backend kép.
13. Slide 13: Demo Video / Live Demo các tính năng nổi bật.
14. Slide 14: Đánh giá kết quả & Điểm nổi bật vượt trội của đồ án.
15. Slide 15: Lời cảm ơn Hội đồng & Sẵn sàng giải đáp câu hỏi phản biện.

Hãy viết kịch bản chi tiết, tự tin và truyền cảm hứng cao.
```

---

### Prompt 6.3: Bộ 50 câu hỏi phản biện & câu trả lời xuất sắc trước Hội đồng chấm thi
```markdown
Bạn là một Trưởng ban Chấm thi Đồ án Tốt nghiệp / Bài tập lớn ngành Công nghệ Thông tin. Hãy biên soạn bộ "50 Câu Hỏi Phản Biện Khó Nhất & Hướng Dẫn Trả Lời Đạt Điểm Tuyệt Đối (10/10)" dành cho sinh viên bảo vệ đề tài PetCare Shop:

Phân loại 50 câu hỏi thành 5 nhóm chuyên đề:
1. Nhóm 1 - Kiến trúc & Công nghệ React Native / Expo (10 câu):
   - Tại sao chọn Expo Router thay vì React Navigation truyền thống?
   - Cơ chế hoạt động của React Native Web trong dự án này là gì?
   - Làm thế nào ứng dụng nhận diện IP LAN máy tính khi chạy trên điện thoại Expo Go?
   - Quản lý trạng thái bằng Context API có gặp vấn đề re-render không và cách khắc phục?
2. Nhóm 2 - Cơ sở dữ liệu & Backend APIs (10 câu):
   - Giải thích thiết kế khóa ngoại của bảng `orders`, `order_items` và `products`.
   - Tại sao lại dùng Connection Pool thay vì tạo kết nối đơn trong Node.js? Lỗi `PROTOCOL_CONNECTION_LOST` đã được giải quyết ra sao?
   - Khi có 1.000 người cùng đặt hàng một lúc, hệ thống xử lý vấn đề tồn kho (Race condition / Concurrency) như thế nào?
3. Nhóm 3 - Nghiệp vụ Thú y & Thuật toán Khuyến nghị (10 câu):
   - Thuật toán Pet Food Matcher tính điểm tương thích dựa trên những trọng số nào?
   - Tiêu chuẩn dinh dưỡng AAFCO trong màn hình chi tiết sản phẩm được hiện thực hóa ra sao?
   - Tại sao phải phân chia ca làm việc thành Ca đêm 24/7 đối với bệnh viện thú y?
4. Nhóm 4 - Bảo mật, Vận hành & Thanh toán (10 câu):
   - Cơ chế sinh mã QR thanh toán VietQR động hoạt động như thế nào? Có xác thực được giao dịch chuyển khoản tự động không?
   - Các biện pháp phòng chống SQL Injection và XSS trong mã nguồn PHP XAMPP?
5. Nhóm 5 - Hướng phát triển & Đánh giá cá nhân (10 câu):
   - Nếu triển khai thực tế trên Google Play và App Store, nhóm cần làm những thủ tục gì?
   - Đâu là tính năng nhóm tự hào nhất và thách thức kỹ thuật lớn nhất đã vượt qua trong bài tập lớn này?

Hãy cung cấp câu trả lời mẫu ngắn gọn, tự tin, đúng thuật ngữ chuyên môn và thuyết phục hoàn toàn các thầy cô trong Hội đồng.
```

---
*Tài liệu được khởi tạo và lưu trữ độc quyền cho dự án PetCare Shop (baitaplon) - 2026.*
