# 🐾 BÀI TẬP LỚN: PETCARE SHOP - ỨNG DỤNG QUẢN LÝ THỨC ĂN THÚ CƯNG

Ứng dụng di động và web đa nền tảng được xây dựng trên nền tảng **React Native**, **Expo SDK 57**, và **TypeScript**, đáp ứng đầy đủ và chuẩn xác các yêu cầu của đề tài Bài tập lớn.

---

## 🌟 Các Tính Năng Chính

### 1. Màn Hình Danh Sách Sản Phẩm (`/`)
- Hiển thị danh sách 5 sản phẩm thức ăn thú cưng với dữ liệu chuẩn.
- **Bố cục từng item theo đúng đặc tả yêu cầu**:
  - **Bên trái**: Ảnh sản phẩm rõ nét, bo góc tinh tế.
  - **Bên phải**:
    - **Dòng 1**: Tên sản phẩm **chữ đậm màu xanh**.
    - **Dòng tiếp theo**: Mô tả sản phẩm gọn gàng, súc tích.
    - **Dòng cuối**: Giá sản phẩm **chữ đỏ tô đậm**.
- Chạm vào sản phẩm để chuyển ngay sang màn hình **Chi tiết sản phẩm**.

### 2. Màn Hình Chi Tiết Sản Phẩm Đầy Đủ 10 Mục Chuẩn Thú Y (`/detail`)
Tuân thủ toàn diện **Bộ thông tin sản phẩm đầy đủ 10 mục**:
1. **Thông tin cơ bản**: Tên sản phẩm, thương hiệu, danh mục, mã sản phẩm (SKU), quy cách/khối lượng, giá gốc, giá KM, % giảm giá, số lượng tồn kho, trạng thái còn/hết hàng.
2. **Sản phẩm được làm từ gì?**: Thành phần chính, nguồn đạm (gà, cá, bò...), thành phần phụ, chất béo & Omega, vitamin, khoáng chất, taurine sáng mắt, chất bảo quản tự nhiên, cảnh báo dị ứng.
3. **Thành phần dinh dưỡng**: Bảng phân tích chi tiết Protein thô (thanh tiến trình trực quan), chất béo thô, chất xơ, độ ẩm, khoáng tro, carbohydrate, năng lượng Kcal/kg, taurine & tỷ lệ Canxi/Phốt pho chuẩn AAFCO.
4. **Phù hợp với bé nào**: Phân loại theo mèo con, trưởng thành, mèo già; môi trường sống (trong nhà, vận động nhiều, kiểm soát cân nặng, kén ăn), độ tuổi đề xuất & cân nặng phù hợp.
5. **Cần tránh với bé nào**: Cảnh báo dị ứng nguồn đạm (gà/cá/bò...), nhạy cảm tiêu hóa, hạn chế độ tuổi và khuyến cáo an toàn từ nhà sản xuất.
6. **Hướng dẫn cho ăn & Chuyển đổi**: Bảng khẩu phần theo cân nặng (g/ngày), số bữa/ngày, quy tắc vàng 7 ngày chuyển đổi thức ăn và lời khuyên bổ sung nước chống sỏi thận.
7. **Thông tin sản phẩm & Bảo quản**: Xuất xứ, nhà sản xuất, ngày sản xuất, hạn sử dụng, quy cách đóng gói (túi zip nhôm chống ẩm), điều kiện bảo quản và thời hạn dùng sau khi mở bao bì.
8. **Đánh giá & Phản hồi**: Điểm đánh giá sao trung bình, phân bổ tỷ lệ sao, đánh giá thực tế của khách hàng kèm avatar và phân loại hàng đã mua.
9. **Bộ sưu tập hình ảnh (Gallery trực quan)**: Ảnh bao bì, ảnh thức ăn thực tế (viên hạt/pate mọng nước), ảnh mặt sau bao bì, ảnh bảng thành phần dinh dưỡng, ảnh hướng dẫn sử dụng kèm bộ chọn thumbnail.
10. **Thông tin mua hàng & Ưu đãi**: Chọn khối lượng động với cập nhật giá realtime, bộ đếm số lượng, thêm vào giỏ, mua ngay, ước tính phí vận chuyển & freeship 300K, mã giảm giá PETCARE10 và tích lũy điểm thưởng PetXu.

### 3. Tính Năng Độc Đáo: “Tìm Thức Ăn Phù Hợp Cho Bé” (Pet Food Matcher)
- Cho phép khách hàng tìm nhanh thức ăn tối ưu theo 4 tiêu chí cốt lõi:
  - **Độ tuổi**: Mèo con / Mèo trưởng thành / Mèo già.
  - **Cân nặng**: 1–2kg / 2–4kg / 4–6kg / Trên 6kg.
  - **Mục tiêu chăm sóc**: Tăng cân / Kiểm soát cân nặng / Lông đẹp / Tiêu hóa / Mèo kén ăn.
  - **Thành phần cần tránh**: Gà / Cá / Bò / Trứng / Ngũ cốc gluten...
- Hệ thống tự động tính điểm tương thích (%), đưa ra cảnh báo dị ứng tức thời và lọc ra **Top 3 sản phẩm chuẩn nhất** kèm phân tích lý do thú y khuyên dùng.
- Tích hợp trực tiếp cả trong màn hình Chi tiết sản phẩm (`/detail`), Trang chủ (`/`), và Màn hình Tư vấn dinh dưỡng (`/advisor`).

### 4. Màn Hình Giỏ Hàng (`/cart`)
- Quản lý giỏ hàng dùng chung (`CartContext`).
- Tăng / giảm số lượng, xóa món, tính tạm tính và tổng thanh toán.
- Áp dụng mã khuyến mãi (`PETCARE10` giảm 10%, `FREESHIP`).
- Thanh toán linh hoạt (COD, Chuyển khoản, Ví điện tử) và tạo đơn hàng thực tế.

### 5. Màn Hình Theo Dõi Đơn Hàng (`/orders`)
- Lịch sử các đơn hàng đã đặt kèm mã đơn `#PET-xxxxxx`.
- Thanh tiến trình 4 giai đoạn: *Đã đặt* ➔ *Đóng gói* ➔ *Đang giao* ➔ *Đã nhận*.
- Thông tin shipper, biển số xe, thời gian dự kiến và nút mua lại tiện lợi.

### 6. Màn Hình Hồ Sơ Bé Cưng & Lịch Ăn (`/profile`)
- Quản lý thông tin các bé cưng trong gia đình (tên, giống loài, tuổi, cân nặng, món ăn yêu thích).
- Lịch trình các cữ ăn trong ngày kèm ô tích hoàn thành.

### 7. Thanh Điều Hướng Dưới Cùng (Bottom Navigation Bar)
- Cố định ở đáy màn hình (`bottom: 0`) trên cả Web và Mobile.
- Hiển thị đầy đủ 5 tab điều hướng với icon trực quan, nhãn tiếng Việt rõ ràng và huy hiệu số lượng giỏ hàng realtime.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: Expo SDK 57 (React Native 0.86, React 19)
- **Routing**: Expo Router v57 (File-based routing)
- **Ngôn ngữ**: TypeScript 100% Type-safe
- **Styling**: Vanilla React Native StyleSheet, HSL Dynamic Colors (Light/Dark mode)
- **Hình ảnh**: Expo Image (hỗ trợ cache & transition)
- **Icons**: Expo Symbols & Vector Graphics

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Khởi chạy trên Web:
```bash
npm run web
```
Ứng dụng sẽ mở tại địa chỉ: **`http://localhost:8081`**

### 3. Khởi chạy trên Mobile (Android / iOS):
```bash
npx expo start
```
Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại để trải nghiệm ứng dụng.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
baitaplon/
├── assets/                 # Hình ảnh, biểu tượng, splash screen
├── src/
│   ├── app/                # Các trang theo Expo Router
│   │   ├── _layout.tsx     # Root Layout, ThemeProvider, CartProvider
│   │   ├── index.tsx       # Màn hình Danh sách & Chi tiết sản phẩm
│   │   ├── advisor.tsx     # Màn hình Tư vấn dinh dưỡng
│   │   ├── cart.tsx        # Màn hình Giỏ hàng & Thanh toán
│   │   ├── orders.tsx      # Màn hình Quản lý & Theo dõi đơn hàng
│   │   └── profile.tsx     # Màn hình Hồ sơ bé cưng & Lịch ăn
│   ├── components/         # Các component dùng chung
│   │   ├── app-tabs.tsx    # Bottom Tab Bar cho Mobile
│   │   ├── app-tabs.web.tsx# Bottom Tab Bar cố định ở dưới cho Web
│   │   └── ...
│   ├── context/            # Quản lý State toàn cục
│   │   └── cart-context.tsx# Cart & Orders Context
│   └── constants/          # Bảng màu, typography, spacing
│       └── theme.ts
├── package.json
└── README.md
```
