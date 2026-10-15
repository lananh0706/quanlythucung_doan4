-- ====================================================================
-- PETCARE SYSTEM - CHUẨN HÓA CƠ SỞ DỮ LIỆU TOÀN DIỆN (DATABASE SCHEMA & SEED DATA)
-- Tên cơ sở dữ liệu: petcare_db
-- Hệ quản trị CSDL: MySQL 5.7+ / MariaDB 10.3+ (XAMPP / phpMyAdmin)
-- Bộ mã ký tự: utf8mb4 / utf8mb4_unicode_ci (Hỗ trợ 100% tiếng Việt có dấu & biểu tượng emoji)
-- Đồng bộ 100% với Giao diện (Shop, Chi tiết, Giỏ hàng, Đơn hàng, Hồ sơ, Tư vấn, Blog, Quản trị 18 phân hệ)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `petcare_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `petcare_db`;

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ====================================================================
-- 1. BẢNG TÀI KHOẢN QUẢN TRỊ VIÊN (admins)
-- Khớp phân hệ: Quản trị tài khoản & phân quyền (admin.tsx)
-- ====================================================================
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL DEFAULT 'Quản Trị Viên',
  `email` VARCHAR(100) NOT NULL DEFAULT 'admin@petcare.vn',
  `role` VARCHAR(50) NOT NULL DEFAULT 'Quản trị viên tối cao',
  `status` ENUM('active', 'locked') NOT NULL DEFAULT 'active',
  `last_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`id`, `username`, `password`, `full_name`, `email`, `role`, `status`, `last_login`) VALUES
(1, 'admin', '123', 'Quản trị viên PetCare', 'admin@petcare.vn', 'Quản trị viên tối cao', 'active', '2026-10-11 08:30:00'),
(2, 'quanlykho', '123', 'Trần Văn Kho', 'kho@petcare.vn', 'Quản lý kho hàng', 'active', '2026-10-10 14:15:00'),
(3, 'bacsithuy', '123', 'BS. CKI Nguyễn Minh Tuấn', 'tuan.bsty@petcare.vn', 'Bác sĩ thú y trực ca', 'active', '2026-10-11 09:00:00'),
(4, 'cskh', '123', 'Lê Thu Thảo', 'thao.cskh@petcare.vn', 'CSKH & Bán hàng', 'active', '2026-10-11 10:20:00');

-- ====================================================================
-- 2. BẢNG DANH MỤC SẢN PHẨM (categories)
-- Khớp phân hệ: Menu danh mục trang chủ, bộ lọc và quản lý danh mục admin
-- ====================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(20) NOT NULL DEFAULT '🥣',
  `description` TEXT DEFAULT NULL,
  `product_count` INT(11) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `slug`, `name`, `icon`, `description`, `product_count`, `status`) VALUES
(1, 'hat', 'Thức ăn hạt khô', '🥣', 'Hạt dinh dưỡng cân bằng AAFCO ngừa sỏi thận & búi lông', 14, 'active'),
(2, 'pate', 'Pate & Thức ăn ướt', '🥫', 'Sốt & pate mọng nước cấp ẩm tự nhiên cho chó mèo lười uống nước', 9, 'active'),
(3, 'xuong', 'Snack & Xương gặm', '🦴', 'Bánh thưởng & xương gặm sạch mảng bám vôi răng, thơm miệng', 7, 'active'),
(4, 'caocap', 'Dòng cao cấp Grain-Free', '🥩', 'Đạm động vật tươi thuần khiết 100%, không độn ngũ cốc bắp ngô', 5, 'active'),
(5, 'vesinh', 'Cát vệ sinh & Khử mùi', '🚽', 'Cát đậu nành, bentonite vón siêu tốc & khử trùng an toàn', 6, 'active'),
(6, 'yte', 'Dinh dưỡng & Y tế thú cưng', '💊', 'Gel dinh dưỡng, men vi sinh, thuốc trị ve rận và vitamin cao cấp', 4, 'active');

-- ====================================================================
-- 3. BẢNG THƯƠNG HIỆU PHÂN PHỐI (brands)
-- Khớp phân hệ: Quản lý thương hiệu đối tác (admin.tsx)
-- ====================================================================
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `country` VARCHAR(50) NOT NULL,
  `flag` VARCHAR(20) NOT NULL DEFAULT '🇻🇳',
  `description` TEXT DEFAULT NULL,
  `product_count` INT(11) NOT NULL DEFAULT 0,
  `is_official` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('active', 'paused') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`id`, `name`, `country`, `flag`, `description`, `product_count`, `is_official`, `status`) VALUES
(1, 'Royal Canin', 'Pháp', '🇫🇷', 'Thương hiệu tiên phong giải pháp dinh dưỡng cho chó mèo từ 1968', 12, 1, 'active'),
(2, 'Inaba Ciao', 'Nhật Bản', '🇯🇵', 'Tập đoàn bánh thưởng & snack kem dinh dưỡng số 1 Nhật Bản', 8, 1, 'active'),
(3, 'Whiskas', 'Mỹ', '🇺🇸', 'Dinh dưỡng hoàn hảo thơm ngon dành riêng cho mèo cưng', 6, 1, 'active'),
(4, 'Pedigree', 'Mỹ', '🇺🇸', 'Thương hiệu thức ăn chăm sóc toàn diện cho chó mọi lứa tuổi', 7, 1, 'active'),
(5, 'Orijen', 'Canada', '🇨🇦', 'Thức ăn sinh học phù hợp tự nhiên với 85% thịt cá nguyên chất', 5, 1, 'active'),
(6, 'Minino', 'Pháp', '🇫🇷', 'Dinh dưỡng tiêu chuẩn quốc tế từ công ty Neovia Pháp', 4, 1, 'active'),
(7, 'Nourse', 'Mỹ', '🇺🇸', 'Dược mỹ phẩm & gel dinh dưỡng thú y hàng đầu thế giới', 5, 1, 'active'),
(8, 'MoonCat', 'Việt Nam', '🇻🇳', 'Cát vệ sinh than hoạt tính khử mùi và kháng khuẩn siêu tốc', 3, 1, 'active'),
(9, 'Cature Tofu', 'Hàn Quốc', '🇰🇷', 'Sản phẩm cát đậu nành hữu cơ xả bồn cầu cao cấp', 4, 1, 'active');

-- ====================================================================
-- 4. BẢNG SẢN PHẨM TOÀN DIỆN (products)
-- Khớp 100% với: index.tsx, detail.tsx, cart.tsx, admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(100) NOT NULL DEFAULT 'PetCare Food',
  `brand_id` INT(11) DEFAULT NULL,
  `category_slug` VARCHAR(50) NOT NULL DEFAULT 'hat',
  `category` VARCHAR(100) NOT NULL DEFAULT 'Thức ăn khô / Hạt',
  `category_id` INT(11) DEFAULT NULL,
  `price` INT(11) NOT NULL,
  `original_price` INT(11) NOT NULL,
  `discount_percent` INT(11) NOT NULL DEFAULT 0,
  `stock` INT(11) NOT NULL DEFAULT 100,
  `sold_count` INT(11) NOT NULL DEFAULT 0,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `review_count` INT(11) NOT NULL DEFAULT 0,
  `image` MEDIUMTEXT NOT NULL,
  `gallery_images` MEDIUMTEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `product_type` ENUM('food', 'litter', 'accessory') NOT NULL DEFAULT 'food',
  `scents` TEXT DEFAULT NULL,
  `weight_options` TEXT DEFAULT NULL,
  `protein_sources` VARCHAR(255) DEFAULT 'Thịt gà, Cá hồi, Trứng gà tươi',
  `target_pet` VARCHAR(100) DEFAULT 'Mèo mọi lứa tuổi',
  `crude_protein` VARCHAR(50) DEFAULT '32%',
  `crude_fat` VARCHAR(50) DEFAULT '15%',
  `crude_fiber` VARCHAR(50) DEFAULT '4.5%',
  `calories_kcal` VARCHAR(50) DEFAULT '3850 kcal/kg',
  `in_stock` TINYINT(1) NOT NULL DEFAULT 1,
  `is_newly_launched` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cat_slug` (`category_slug`),
  KEY `idx_brand` (`brand`),
  KEY `idx_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `sku`, `name`, `brand`, `brand_id`, `category_slug`, `category`, `category_id`, `price`, `original_price`, `discount_percent`, `stock`, `sold_count`, `rating`, `review_count`, `image`, `gallery_images`, `description`, `product_type`, `scents`, `weight_options`, `protein_sources`, `target_pet`, `crude_protein`, `crude_fat`, `crude_fiber`, `calories_kcal`, `in_stock`, `is_newly_launched`, `status`) VALUES
(1, 'RC-FIT32-VN', 'Hạt Royal Canin Fit 32 Cho Mèo Trưởng Thành (Bao 2kg)', 'Royal Canin', 1, 'hat', 'Thức ăn khô / Hạt', 1, 250000, 295000, 15, 142, 1420, 4.9, 320, 'http://localhost/petcare-api/uploads/royal_canin_fit32.png', 
 '[\"http://localhost/petcare-api/uploads/royal_canin_fit32.png\",\"http://localhost/petcare-api/uploads/royal_canin_bag.webp\",\"http://localhost/petcare-api/uploads/royal_canin_detail_sizes.jpg\",\"http://localhost/petcare-api/uploads/royal_canin_genuine.jpg\",\"http://localhost/petcare-api/uploads/royal_canin_lineup.jpg\"]',
 'Thức ăn hạt dinh dưỡng cao cấp của Pháp, công thức cân bằng 52 dưỡng chất giúp mèo trưởng thành duy trì cân nặng lý tưởng, ngăn ngừa búi lông và bảo vệ đường tiết niệu.',
 'food', NULL, 
 '[{\"weight\":\"400g\",\"price\":75000,\"originalPrice\":88000},{\"weight\":\"2.0 kg\",\"price\":250000,\"originalPrice\":295000},{\"weight\":\"4.0 kg\",\"price\":480000,\"originalPrice\":560000}]',
 'Protein gia cầm sấy khô, gạo, lúa mì, mỡ động vật', 'Mèo trưởng thành 1 - 7 tuổi', '32%', '15%', '4.6%', '3860 kcal/kg', 1, 0, 'active'),

(2, 'WHISK-CAT-01', 'Pate Whiskas Vị Cá Biển Tươi Cho Mèo (Gói 85g)', 'Whiskas', 3, 'pate', 'Pate & Thức ăn ướt', 2, 35000, 42000, 17, 250, 2800, 4.8, 410, 'http://localhost/petcare-api/uploads/whiskas_ocean_fish.png',
 '[\"http://localhost/petcare-api/uploads/whiskas_ocean_fish.png\",\"http://localhost/petcare-api/uploads/whiskas_pouch.webp\",\"http://localhost/petcare-api/uploads/whiskas_back.webp\",\"http://localhost/petcare-api/uploads/whiskas_can.webp\",\"http://localhost/petcare-api/uploads/whiskas_flavors.webp\"]',
 'Pate dạng thạch sốt vị cá biển thơm ngon ngậy, giàu đạm và omega giúp da lông bóng mượt, cấp nước tự nhiên cho mèo lười uống nước.',
 'food', NULL,
 '[{\"weight\":\"Gói 85g\",\"price\":35000,\"originalPrice\":42000},{\"weight\":\"Lốc 12 gói\",\"price\":390000,\"originalPrice\":450000}]',
 'Cá ngừ đại dương, cá hồi tươi, khoáng chất vi lượng', 'Mèo mọi lứa tuổi (> 3 tháng)', '9.0%', '5.0%', '1.0%', '85 kcal/gói', 1, 0, 'active'),

(3, 'MIN-PLUS-01', 'Hạt Minino Plus Vị Cá Ngừ Tự Nhiên (Bao 1.5kg)', 'Minino', 6, 'hat', 'Thức ăn khô / Hạt', 1, 120000, 145000, 17, 95, 980, 4.9, 145, 'http://localhost/petcare-api/uploads/minino_plus.png',
 '[\"http://localhost/petcare-api/uploads/minino_plus.png\",\"http://localhost/petcare-api/uploads/minino_bag_1300g.webp\",\"http://localhost/petcare-api/uploads/minino_tuna_flavor.jpg\",\"http://localhost/petcare-api/uploads/minino_front.webp\"]',
 'Bổ sung Taurine cho mắt mèo tinh anh, chiết xuất sắn Yucca giúp giảm đáng kể mùi hôi chất thải và hỗ trợ tiêu hóa êm dịu.',
 'food', NULL,
 '[{\"weight\":\"Bao 1.5kg\",\"price\":120000,\"originalPrice\":145000},{\"weight\":\"Bao 7.0kg\",\"price\":520000,\"originalPrice\":610000}]',
 'Bột thịt cá ngừ tươi, bắp non, mỡ gia cầm tinh chế', 'Mèo trưởng thành', '30%', '12%', '5.0%', '3600 kcal/kg', 1, 0, 'active'),

(4, 'PED-DENT-01', 'Xương Gặm Sạch Răng Khử Mùi Hôi Pedigree DentaStix', 'Pedigree', 4, 'xuong', 'Snack & Xương gặm', 3, 45000, 55000, 18, 180, 3100, 5.0, 520, 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500',
 '[\"https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800\"]',
 'Thiết kế rãnh chữ X độc quyền giúp tiếp cận sâu chân răng, giảm tới 80% cao răng tích tụ và bổ sung Canxi cho hàm cún chắc khỏe.',
 'food', NULL,
 '[{\"weight\":\"Túi 112g (7 que)\",\"price\":45000,\"originalPrice\":55000},{\"weight\":\"Túi lớn 340g\",\"price\":115000,\"originalPrice\":135000}]',
 'Bột ngũ cốc, kẽm sulfat, chất xơ tự nhiên', 'Chó từ 6 tháng tuổi trở lên', '8.0%', '1.0%', '5.0%', '280 kcal/100g', 1, 0, 'active'),

(5, 'ORIJ-KITT-01', 'Hạt Orijen Cat & Kitten Cao Cấp 40% Đạm Động Vật (Bao 1.8kg)', 'Orijen', 5, 'caocap', 'Dòng cao cấp Grain-Free', 4, 480000, 540000, 11, 45, 620, 5.0, 188, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
 '[\"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800\"]',
 '85% thịt cá biển tươi đánh bắt tự nhiên, hoàn toàn không ngũ cốc gluten độn bắp ngô, đáp ứng hoàn hảo bản năng ăn thịt của mèo.',
 'food', NULL,
 '[{\"weight\":\"1.8 kg\",\"price\":480000,\"originalPrice\":540000},{\"weight\":\"5.4 kg\",\"price\":1350000,\"originalPrice\":1490000}]',
 'Gà thả vườn, gà tây tươi, trứng cá hồi hoang dã', 'Mèo con & Mèo trưởng thành', '40%', '20%', '3.0%', '4160 kcal/kg', 1, 0, 'active'),

(6, 'CIAO-CHURU-01', 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp', 'Inaba Ciao', 2, 'xuong', 'Snack & Xương gặm', 3, 38000, 48000, 21, 320, 4200, 4.9, 610, 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500',
 '[\"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800\"]',
 'Sốt kem thưởng thơm ngon béo ngậy số 1 Nhật Bản, bổ sung Collagen nuôi dưỡng lông mượt và tinh chất trà xanh khử mùi hôi miệng.',
 'food', NULL,
 '[{\"weight\":\"Gói 4 thanh (56g)\",\"price\":38000,\"originalPrice\":48000},{\"weight\":\"Túi 20 thanh\",\"price\":175000,\"originalPrice\":210000}]',
 'Ức gà tươi phi lê, sò điệp tươi, chiết xuất trà xanh', 'Mèo mọi lứa tuổi', '7.0%', '0.2%', '0.1%', '7.0 kcal/thanh', 1, 0, 'active'),

(7, 'NOURSE-21', 'Gel Dinh Dưỡng Nourse 21 Bổ Sung Vitamin Cho Chó Mèo (Tuýp 120g)', 'Nourse', 7, 'caocap', 'Dinh dưỡng & Y tế thú cưng', 6, 185000, 220000, 16, 65, 1100, 5.0, 240, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500',
 '[\"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800\"]',
 'Cung cấp năng lượng tức thì và 18 loại acid amin thiết yếu cho thú cưng ốm dậy, sau phẫu thuật hoặc biếng ăn suy dinh dưỡng.',
 'food', NULL,
 '[{\"weight\":\"Tuýp 120g\",\"price\":185000,\"originalPrice\":220000}]',
 'Dầu mầm lúa mì, vitamin A, D3, E, B-Complex, Taurine', 'Chó mèo mọi lứa tuổi suy nhược', '3.5%', '18%', '1.0%', '450 kcal/100g', 1, 0, 'active'),

(8, 'MOON-CAT-01', '(1 tải 6 bao) Cát Nhật đen MoonCat 9L chính hãng Khử Mùi Vón Cục', 'MoonCat', 8, 'vesinh', 'Cát vệ sinh & Khử mùi', 5, 434000, 510000, 15, 80, 150, 5.0, 85, 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500',
 '[\"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800\"]',
 'Cát vệ sinh MoonCat siêu khử mùi với hạt carbon than hoạt tính, vón cục nhanh cứng chắc sau 3s, không bụi 99.5% bảo vệ hô hấp.',
 'litter', '[\"Hương Cafe\",\"Hương Táo\",\"Hương Chanh\",\"Trà Xanh\"]',
 '[{\"weight\":\"1 Bao 9L\",\"price\":75000,\"originalPrice\":90000},{\"weight\":\"1 Tải 6 bao\",\"price\":434000,\"originalPrice\":510000}]',
 'Bentonite khoáng thiên nhiên + Hạt carbon khử khuẩn', 'Mèo mọi lứa tuổi', '0%', '0%', '0%', '0 kcal', 1, 1, 'active'),

(9, 'CAT-TOFU-01', 'Cát Vệ Sinh Đậu Nành Cature Tofu Khử Mùi (Túi 6L)', 'Cature Tofu', 9, 'vesinh', 'Cát vệ sinh & Khử mùi', 5, 115000, 135000, 15, 110, 1350, 4.9, 310, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
 '[\"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800\"]',
 'Cát đậu nành hữu cơ 100% tự nhiên tan nhanh xả trực tiếp vào bồn cầu, an toàn tuyệt đối nếu thú cưng lỡ nuốt phải.',
 'litter', '[\"Hương Sữa\",\"Hương Trà Xanh\"]',
 '[{\"weight\":\"Túi 6L (2.4kg)\",\"price\":115000,\"originalPrice\":135000},{\"weight\":\"Thùng 4 túi\",\"price\":440000,\"originalPrice\":520000}]',
 'Bã đậu nành hữu cơ, tinh bột ngô tự nhiên', 'Mèo cưng trong nhà', '0%', '0%', '0%', '0 kcal', 1, 0, 'active'),

(10, 'PATE-PED-01', 'Pate Cho Chó Pedigree Lon Vị Thịt Bò & Rau Củ (Lon 400g)', 'Pedigree', 4, 'pate', 'Pate & Thức ăn ướt', 2, 28000, 35000, 20, 150, 2200, 4.8, 380, 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500',
 '[\"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800\"]',
 'Hương vị thịt bò hảo hạng kết hợp cà rốt và đậu hà lan tươi ngon ngậy, kích thích vị giác bé cún ăn khỏe và hấp thu tốt.',
 'food', NULL,
 '[{\"weight\":\"Lon 400g\",\"price\":28000,\"originalPrice\":35000},{\"weight\":\"Thùng 24 lon\",\"price\":640000,\"originalPrice\":780000}]',
 'Thịt bò tươi xay, cà rốt, khoáng chất vi lượng', 'Chó mọi lứa tuổi', '8.0%', '4.0%', '1.5%', '320 kcal/lon', 1, 0, 'active'),

(19, 'PET-19-408', 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà Truyền Thống', 'Inaba Ciao', 2, 'xuong', 'Snack & Xương gặm', 3, 16800, 20160, 15, 140, 1520, 4.9, 384, 'http://localhost/petcare-api/uploads/ciao_churu.png',
 '[\"http://localhost/petcare-api/uploads/ciao_churu.png\",\"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800\",\"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800\"]',
 'Dạng kem lỏng thơm ngậy, bổ sung trà xanh ngăn ngừa mùi hôi phân và nước tiểu. Thưởng thức tuyệt vời cho bé cưng.',
 'food', NULL,
 '[{\"weight\":\"400g\",\"price\":16800,\"originalPrice\":20160},{\"weight\":\"1.5kg\",\"price\":42000,\"originalPrice\":50400},{\"weight\":\"3.5kg\",\"price\":88200,\"originalPrice\":105840}]',
 'Thịt ức gà tươi luộc, chiết xuất sò điệp, vitamin E', 'Mèo mọi giống loài', '7.0%', '0.2%', '0.1%', '7.0 kcal/thanh', 1, 0, 'active');

-- ====================================================================
-- 5. BẢNG PHÂN LOẠI KHỐI LƯỢNG / QUY CÁCH (product_weight_options)
-- Hỗ trợ truy vấn chi tiết quy cách đóng gói cho giỏ hàng & đặt hàng
-- ====================================================================
DROP TABLE IF EXISTS `product_weight_options`;
CREATE TABLE `product_weight_options` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) NOT NULL,
  `weight` VARCHAR(50) NOT NULL,
  `price` INT(11) NOT NULL,
  `original_price` INT(11) NOT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_prod_opt` (`product_id`),
  CONSTRAINT `fk_prod_opt_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_weight_options` (`product_id`, `weight`, `price`, `original_price`, `is_default`) VALUES
(1, '400g', 75000, 88000, 0),
(1, '2.0 kg', 250000, 295000, 1),
(1, '4.0 kg', 480000, 560000, 0),
(2, 'Gói 85g', 35000, 42000, 1),
(2, 'Lốc 12 gói', 390000, 450000, 0),
(3, 'Bao 1.5kg', 120000, 145000, 1),
(4, 'Túi 112g (7 que)', 45000, 55000, 1),
(5, 'Bao 1.8 kg', 480000, 540000, 1),
(6, 'Gói 4 thanh (56g)', 38000, 48000, 1),
(7, 'Tuýp 120g', 185000, 220000, 1),
(8, '1 Tải 6 bao 9L', 434000, 510000, 1),
(9, 'Túi 6L (2.4kg)', 115000, 135000, 1),
(10, 'Lon 400g', 28000, 35000, 1),
(19, '400g', 16800, 20160, 1),
(19, '1.5kg', 42000, 50400, 0),
(19, '3.5kg', 88200, 105840, 0);

-- ====================================================================
-- 6. BẢNG KHÁCH HÀNG & THÀNH VIÊN (customers)
-- Khớp phân hệ: Tài khoản khách hàng, Đăng nhập/Đăng ký, Khách hàng trong Admin & Context
-- ====================================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL DEFAULT '123456',
  `membership_rank` ENUM('Thành Viên Đồng', 'Bạc', 'Vàng', 'Kim Cương') NOT NULL DEFAULT 'Bạc',
  `pet_xu` INT(11) NOT NULL DEFAULT 0,
  `total_spent` INT(11) NOT NULL DEFAULT 0,
  `orders_count` INT(11) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  `join_date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customers` (`id`, `customer_code`, `name`, `email`, `phone`, `password`, `membership_rank`, `pet_xu`, `total_spent`, `orders_count`, `status`, `join_date`) VALUES
(1, 'cus-1', 'Nguyễn Văn Minh', 'minh.nguyen@gmail.com', '0982.112.233', '123456', 'Vàng', 285, 2850000, 7, 'active', '2026-01-12'),
(2, 'cus-2', 'Lê Hoàng Yến', 'hoangyen.design@gmail.com', '0977.221.144', '123456', 'Kim Cương', 412, 4120000, 11, 'active', '2026-02-05'),
(3, 'cus-3', 'Trần Thu Trang', 'thutrang.tran@vnu.edu.vn', '0912.889.900', '123456', 'Bạc', 125, 1250000, 4, 'active', '2026-03-20'),
(4, 'cus-4', 'Phạm Quốc Bảo', 'baopq@hotmail.com', '0933.112.233', '123456', 'Thành Viên Đồng', 45, 450000, 1, 'blocked', '2026-05-10'),
(5, 'cus-5', 'Vũ Ngọc Mai', 'ngocmai@petcare.vn', '0909.887.766', '123456', 'Vàng', 360, 3600000, 9, 'active', '2026-05-15');

-- ====================================================================
-- 7. BẢNG HỒ SƠ THÚ CƯNG CỦA KHÁCH HÀNG (pets)
-- Khớp phân hệ: customer-pet-context.tsx, profile.tsx, advisor.tsx
-- ====================================================================
DROP TABLE IF EXISTS `pets`;
CREATE TABLE `pets` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL,
  `customer_code` VARCHAR(50) NOT NULL DEFAULT 'cus-1',
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('dog', 'cat') NOT NULL DEFAULT 'cat',
  `breed` VARCHAR(100) NOT NULL,
  `age` VARCHAR(50) NOT NULL DEFAULT '1 tuổi',
  `weight` VARCHAR(50) NOT NULL DEFAULT '4.0 kg',
  `favorite_food` VARCHAR(255) DEFAULT 'Hạt Royal Canin Fit 32 & Pate cá ngừ',
  `avatar` MEDIUMTEXT NOT NULL,
  `medical_history` TEXT DEFAULT NULL,
  `allergies` VARCHAR(255) DEFAULT 'Không',
  `nutrition_plan` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pet_customer` (`customer_id`),
  CONSTRAINT `fk_pet_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pets` (`id`, `customer_id`, `customer_code`, `name`, `type`, `breed`, `age`, `weight`, `favorite_food`, `avatar`, `medical_history`, `allergies`, `nutrition_plan`) VALUES
(1, 1, 'cus-1', 'Bé Lu', 'dog', 'Corgi Pembroke', '1.5 tuổi', '11.5 kg', 'SmartHeart bò nướng & Pate thịt bò', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', 'Cột sống dài cần kiểm soát cân nặng, tránh để béo phì.', 'Không', 'SmartHeart bò nướng (160g/ngày) + Canxi hữu cơ'),
(2, 1, 'cus-1', 'Bé Kem', 'dog', 'Poodle Nâu Xoăn', '2 tuổi', '4.2 kg', 'Hạt dinh dưỡng & Bánh thưởng ức gà', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', 'Đường ruột nhạy cảm với tinh bột lạnh.', 'Sữa tươi có đường', 'Hạt Ganador cừu + Gel dinh dưỡng Nourse 21'),
(3, 2, 'cus-2', 'Miu Miu', 'cat', 'Mèo Anh Lông Ngắn', '2 tuổi', '4.2 kg', 'Royal Canin Fit 32 & Pate cá ngừ', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', 'Đã triệt sản. Nhạy cảm với cá biển không tươi.', 'Cá biển không tươi', 'Royal Canin Fit 32 (55g/ngày) + Pate Whiskas cá biển'),
(4, 3, 'cus-3', 'Bánh Bao', 'cat', 'Mèo Ba Tư Trắng Tuyết', '3 tuổi', '4.8 kg', 'Pate Me-O cá hồi & Bánh thưởng sữa dê', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80', 'Lông dài dày dễ bị búi lông trong ruột.', 'Không', 'Hạt Minino Plus + Sốt kem Ciao Churu vị gà');

-- ====================================================================
-- 8. BẢNG SỔ TIÊM CHỦNG THÚ CƯNG (pet_vaccinations)
-- Khớp phân hệ: profile.tsx, server.js (/api/pets/:id/vaccines)
-- ====================================================================
DROP TABLE IF EXISTS `pet_vaccinations`;
CREATE TABLE `pet_vaccinations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pet_id` INT(11) NOT NULL,
  `vaccine_name` VARCHAR(255) NOT NULL,
  `injection_date` DATE NOT NULL,
  `next_due_date` DATE DEFAULT NULL,
  `vet_name` VARCHAR(100) NOT NULL DEFAULT 'BS. PetCare',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vac_pet` (`pet_id`),
  CONSTRAINT `fk_vac_pet` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pet_vaccinations` (`id`, `pet_id`, `vaccine_name`, `injection_date`, `next_due_date`, `vet_name`, `notes`) VALUES
(1, 1, 'Vaccine 7 bệnh cho Chó (Vanguard Plus 5/L)', '2025-12-05', '2026-12-05', 'BS. Lê Hải Yến', 'Bé ăn ngủ tốt, không sốt sau tiêm.'),
(2, 1, 'Phòng Bệnh Dại Rabisin', '2026-01-10', '2027-01-10', 'BS. CKI Nguyễn Minh Tuấn', 'Đã cấp chứng nhận tiêm dại điện tử.'),
(3, 3, 'Vaccine 4 bệnh cho Mèo (Felocell 4)', '2026-01-15', '2027-01-15', 'BS. Trần Thu Hà', 'Phòng ngừa Giảm bạch cầu và Viêm mũi khí quản.'),
(4, 3, 'Tẩy giun định kỳ Drontal Cat', '2026-08-20', '2026-11-20', 'BS. Trần Thu Hà', 'Uống 1/2 viên, hệ tiêu hóa ổn định.');

-- ====================================================================
-- 9. BẢNG LỊCH ĂN UỐNG HÀNG NGÀY (pet_meal_schedules)
-- Khớp phân hệ: Quản lý lịch cho ăn trong profile.tsx
-- ====================================================================
DROP TABLE IF EXISTS `pet_meal_schedules`;
CREATE TABLE `pet_meal_schedules` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pet_id` INT(11) NOT NULL,
  `meal_time` TIME NOT NULL,
  `meal_name` VARCHAR(50) NOT NULL,
  `portion` VARCHAR(100) NOT NULL,
  `food_name` VARCHAR(255) NOT NULL,
  `is_done` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_meal_pet` (`pet_id`),
  CONSTRAINT `fk_meal_pet` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pet_meal_schedules` (`id`, `pet_id`, `meal_time`, `meal_name`, `portion`, `food_name`, `is_done`) VALUES
(1, 3, '07:30:00', 'Bữa sáng', '40g hạt khô', 'Royal Canin Fit 32 + Bát nước lọc sạch', 1),
(2, 3, '12:00:00', 'Bữa trưa', '1/2 túi (42g)', 'Pate cao cấp Whiskas cá ngừ tươi', 1),
(3, 3, '19:00:00', 'Bữa tối', '45g hạt + 1 thanh kem', 'Hạt dinh dưỡng + Bánh thưởng Ciao Churu vị gà', 0),
(4, 1, '08:00:00', 'Bữa sáng', '80g hạt dinh dưỡng', 'SmartHeart vị bò nướng', 1),
(5, 1, '18:30:00', 'Bữa tối', '80g hạt + 1/2 lon pate', 'Pate Pedigree thịt bò rau củ', 0);

-- ====================================================================
-- 10. BẢNG ĐỘI NGŨ BÁC SĨ THÚ Y (doctors)
-- Khớp phân hệ: server.js (/api/doctors), advisor.tsx, admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `specialty` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `experience` VARCHAR(50) NOT NULL DEFAULT '5 năm kinh nghiệm',
  `shift` VARCHAR(100) NOT NULL DEFAULT 'Cả ngày (08:00 - 17:30)',
  `working_days` VARCHAR(100) NOT NULL DEFAULT 'Thứ 2 - Thứ 6',
  `avatar` VARCHAR(500) NOT NULL,
  `status` ENUM('available', 'busy', 'off') NOT NULL DEFAULT 'available',
  `assigned_appointments_count` INT(11) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `doctors` (`id`, `name`, `title`, `specialty`, `phone`, `email`, `experience`, `shift`, `working_days`, `avatar`, `status`, `assigned_appointments_count`) VALUES
(1, 'BS. CKI Nguyễn Minh Tuấn', 'Trưởng khoa Dinh dưỡng & Nội khoa', 'Dinh dưỡng & Tiêu hóa thú cưng', '0918.234.567', 'tuan.nguyen@petcare.vn', '8 năm kinh nghiệm', 'Cả ngày (08:00 - 17:30)', 'Thứ 2 - Thứ 6', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300', 'available', 4),
(2, 'ThS. BS Trần Thu Hà', 'Chuyên khoa Da liễu & Lông móng', 'Trị nấm da, rụng lông & Dị ứng đạm', '0932.889.911', 'ha.tran@petcare.vn', '6 năm kinh nghiệm', 'Ca sáng (08:00 - 12:00)', 'Thứ 3 - Chủ nhật', 'https://images.unsplash.com/photo-1594824813524-8742b66236b2?w=300', 'available', 3),
(3, 'BS. Lê Hải Yến', 'Chuyên gia Ngoại khoa & Sản nhi', 'Phẫu thuật mô mềm & Thú sơ sinh', '0976.554.321', 'yen.le@petcare.vn', '7 năm kinh nghiệm', 'Ca chiều (13:30 - 17:30)', 'Thứ 2 - Thứ 7', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300', 'busy', 5);

-- ====================================================================
-- 11. BẢNG LỊCH HẸN & TƯ VẤN THÚ Y (appointments)
-- Khớp phân hệ: modal Đặt lịch index.tsx, advisor.tsx, admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `pet_id` INT(11) DEFAULT NULL,
  `pet_name` VARCHAR(100) NOT NULL,
  `pet_type` VARCHAR(100) NOT NULL,
  `doctor_id` INT(11) DEFAULT NULL,
  `doctor` VARCHAR(100) NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_time` TIME NOT NULL,
  `issue` TEXT NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_app_cust` (`customer_id`),
  KEY `idx_app_doc` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `appointments` (`id`, `customer_id`, `customer_name`, `customer_phone`, `pet_id`, `pet_name`, `pet_type`, `doctor_id`, `doctor`, `appointment_date`, `appointment_time`, `issue`, `status`) VALUES
(1, 2, 'Lê Hoàng Yến', '0977.221.144', 3, 'Miu Miu', 'Mèo Anh Lông Ngắn', 1, 'BS. CKI Nguyễn Minh Tuấn', '2026-10-12', '09:30:00', 'Tư vấn chế độ ăn giảm rụng lông và ngừa búi lông sau triệt sản', 'confirmed'),
(2, 1, 'Nguyễn Văn Minh', '0982.112.233', 1, 'Bé Lu', 'Corgi Pembroke', 2, 'ThS. BS Trần Thu Hà', '2026-10-12', '14:00:00', 'Tư vấn bổ sung canxi và dinh dưỡng xương khớp cho cún chân ngắn', 'pending'),
(3, 5, 'Vũ Ngọc Mai', '0909.887.766', 2, 'Bơ (Poodle)', 'Poodle Nâu Xoăn', 3, 'BS. Lê Hải Yến', '2026-10-13', '16:15:00', 'Kiểm tra cân nặng, đường ruột & tư vấn đổi loại hạt ăn dặm', 'confirmed');

-- ====================================================================
-- 12. BẢNG TÀI XẾ & GIAO HÀNG (shippers)
-- Khớp phân hệ: Vận chuyển trong admin.tsx & shipper info trong orders.tsx
-- ====================================================================
DROP TABLE IF EXISTS `shippers`;
CREATE TABLE `shippers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `license_plate` VARCHAR(30) NOT NULL,
  `service_type` VARCHAR(50) NOT NULL DEFAULT 'Hỏa tốc 2h',
  `active_orders` INT(11) NOT NULL DEFAULT 0,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  `status` ENUM('delivering', 'idle', 'off') NOT NULL DEFAULT 'idle',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shippers` (`id`, `name`, `phone`, `license_plate`, `service_type`, `active_orders`, `rating`, `status`) VALUES
(1, 'Nguyễn Văn Minh (Shipper)', '0982.345.678', '29-X1 482.19', 'Hỏa tốc 2h', 3, 4.9, 'delivering'),
(2, 'Trần Quốc Huy', '0977.889.900', '29-E2 918.23', 'Giao tiêu chuẩn', 1, 4.8, 'idle'),
(3, 'Lê Tuấn Tú', '0912.443.322', '29-D1 556.77', 'Hỏa tốc 2h', 0, 5.0, 'off');

-- ====================================================================
-- 13. BẢNG ĐƠN HÀNG (orders)
-- Khớp 100% với: cart.tsx (checkout), orders.tsx (lịch sử), admin.tsx (quản lý đơn)
-- ====================================================================
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT(11) DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `customer_address` TEXT NOT NULL,
  `customer_note` TEXT DEFAULT NULL,
  `shipping_method` ENUM('standard', 'express') NOT NULL DEFAULT 'standard',
  `shipping_fee` INT(11) NOT NULL DEFAULT 0,
  `voucher_code` VARCHAR(50) DEFAULT NULL,
  `discount_amount` INT(11) NOT NULL DEFAULT 0,
  `total_amount` INT(11) NOT NULL,
  `payment_method` ENUM('COD', 'VietQR', 'MoMo', 'BANK') NOT NULL DEFAULT 'COD',
  `payment_status` ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `status` ENUM('pending', 'processing', 'packing', 'shipping', 'delivering', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'processing',
  `shipper_id` INT(11) DEFAULT NULL,
  `items_json` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ord_code` (`order_code`),
  KEY `idx_ord_cust` (`customer_id`),
  KEY `idx_ord_stat` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`id`, `order_code`, `customer_id`, `customer_name`, `customer_phone`, `customer_address`, `customer_note`, `shipping_method`, `shipping_fee`, `voucher_code`, `discount_amount`, `total_amount`, `payment_method`, `payment_status`, `status`, `shipper_id`, `items_json`, `created_at`) VALUES
(1, 'PET-829142', 1, 'Nguyễn Văn Minh', '0982.112.233', '123 Đường Cầu Giấy, Quan Hoa, Hà Nội', 'Gọi trước khi tới 10 phút nhé shop', 'express', 45000, 'PETCARE10', 35000, 378000, 'COD', 'unpaid', 'delivering', 1, 
 '[{\"id\":1,\"name\":\"Thức Ăn Hạt Cho Mèo Royal Canin Fit 32 (2kg)\",\"quantity\":1,\"price\":350000,\"image\":\"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500\"}]', '2026-10-11 08:30:00'),

(2, 'PET-719304', 1, 'Trần Văn Minh', '0912.348.899', '45 Lê Lợi, Bến Nghé, Quận 1, TP.HCM', 'Giao giờ hành chính giúp em', 'standard', 0, 'FREESHIP', 25000, 145000, 'VietQR', 'paid', 'completed', 2,
 '[{\"id\":3,\"name\":\"Hạt Dinh Dưỡng Cho Mèo Whiskas Vị Cá Biển (1.2kg)\",\"quantity\":1,\"price\":145000,\"image\":\"https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500\"}]', '2026-10-10 14:15:00'),

(3, 'PET-638291', 2, 'Lê Hoàng Yến', '0977.221.144', '88 Trần Hưng Đạo, Hải Châu, Đà Nẵng', 'Hàng dễ vỡ xin nhẹ tay', 'standard', 25000, '', 0, 520000, 'COD', 'unpaid', 'processing', NULL,
 '[{\"id\":10,\"name\":\"Pate Cho Chó Pedigree Lon Vị Thịt Bò (Lon 400g)\",\"quantity\":4,\"price\":28000,\"image\":\"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500\"},{\"id\":8,\"name\":\"Cát Nhật đen MoonCat 9L\",\"quantity\":1,\"price\":408000,\"image\":\"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500\"}]', '2026-10-11 11:00:00'),

(4, 'PET-203115', 3, 'Phạm Thị Lan Anh', '0911.112.233', 'An Thanh - TP. Hải Dương', '', 'standard', 25000, 'PETCARE10', 25000, 582000, 'COD', 'unpaid', 'completed', 1,
 '[{\"id\":1,\"name\":\"Thức Ăn Hạt Cho Mèo Royal Canin Fit 32\",\"quantity\":2,\"price\":250000,\"image\":\"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500\"},{\"id\":6,\"name\":\"Bánh Thưởng Cho Mèo Ciao Churu\",\"quantity\":2,\"price\":41000,\"image\":\"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500\"}]', '2026-10-09 10:05:54'),

(5, 'PET-904123', 5, 'Hoàng Nhật Nam', '0988.776.655', 'Số 18 Lê Duẩn, Hoàn Kiếm, Hà Nội', 'Giao buổi chiều sau 14h', 'express', 45000, 'PETVIP50', 50000, 475000, 'VietQR', 'paid', 'processing', NULL,
 '[{\"id\":5,\"name\":\"Hạt Orijen Cat & Kitten Cao Cấp\",\"quantity\":1,\"price\":480000,\"image\":\"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500\"}]', '2026-10-11 13:20:00');

-- ====================================================================
-- 14. BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG (order_items)
-- Khớp phân hệ: get_admin_orders.php, orders.tsx
-- ====================================================================
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `product_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_image` VARCHAR(500) DEFAULT NULL,
  `packaging` VARCHAR(50) DEFAULT 'Gói tiêu chuẩn',
  `price` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL,
  `total_price` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_item_order` (`order_id`),
  KEY `idx_item_prod` (`product_id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `packaging`, `price`, `quantity`, `total_price`) VALUES
(1, 1, 1, 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'Bao 2.0kg', 350000, 1, 350000),
(2, 2, 3, 'Hạt Dinh Dưỡng Minino Plus Vị Cá Ngừ', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 'Bao 1.5kg', 145000, 1, 145000),
(3, 3, 10, 'Pate Cho Chó Pedigree Lon Vị Thịt Bò', 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500', 'Lon 400g', 28000, 4, 112000),
(4, 3, 8, 'Cát Nhật đen MoonCat 9L chính hãng', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500', 'Bao 9L', 408000, 1, 408000),
(5, 4, 1, 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'Bao 2.0kg', 250000, 2, 500000),
(6, 4, 6, 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp', 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500', 'Gói 4 thanh', 41000, 2, 82000),
(7, 5, 5, 'Hạt Orijen Cat & Kitten 85% Đạm Thịt Cá Tươi', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'Bao 1.8kg', 480000, 1, 480000);

-- ====================================================================
-- 15. BẢNG GIAO DỊCH THANH TOÁN (payments)
-- Khớp phân hệ: Quản lý thanh toán trong admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `txn_code` VARCHAR(50) NOT NULL UNIQUE,
  `order_id` INT(11) DEFAULT NULL,
  `order_code` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `amount` INT(11) NOT NULL,
  `payment_method` ENUM('COD', 'VietQR', 'MoMo', 'BANK') NOT NULL DEFAULT 'COD',
  `status` ENUM('success', 'pending', 'refunded') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pay_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payments` (`id`, `txn_code`, `order_id`, `order_code`, `customer_name`, `amount`, `payment_method`, `status`, `created_at`) VALUES
(1, 'TXN-902184', 2, 'PET-719304', 'Trần Văn Minh', 145000, 'VietQR', 'success', '2026-10-10 14:16:30'),
(2, 'TXN-839120', 1, 'PET-829142', 'Nguyễn Văn Minh', 378000, 'COD', 'pending', '2026-10-11 08:31:00'),
(3, 'TXN-748291', 5, 'PET-904123', 'Hoàng Nhật Nam', 475000, 'VietQR', 'success', '2026-10-11 13:21:15');

-- ====================================================================
-- 16. BẢNG MÃ GIẢM GIÁ / VOUCHER (vouchers)
-- Khớp phân hệ: cart.tsx, detail.tsx, admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NOT NULL,
  `discount_type` ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
  `discount_value` INT(11) NOT NULL DEFAULT 10,
  `min_order` INT(11) NOT NULL DEFAULT 0,
  `max_discount` INT(11) NOT NULL DEFAULT 50000,
  `expiry_date` DATE DEFAULT NULL,
  `used_count` INT(11) NOT NULL DEFAULT 0,
  `max_count` INT(11) NOT NULL DEFAULT 100,
  `status` ENUM('active', 'paused', 'expired') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `vouchers` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order`, `max_discount`, `expiry_date`, `used_count`, `max_count`, `status`) VALUES
(1, 'PETCARE10', 'Giảm 10% tổng đơn hàng (Tối đa 50.000₫)', 'percent', 10, 150000, 50000, '2026-12-31', 142, 500, 'active'),
(2, 'FREESHIP', 'Miễn phí giao hàng cho đơn từ 300.000₫', 'fixed', 25000, 300000, 25000, '2026-12-31', 389, 1000, 'active'),
(3, 'PETVIP50', 'Giảm ngay 50.000₫ cho đơn hàng từ 200.000₫', 'fixed', 50000, 200000, 50000, '2026-11-30', 88, 200, 'active'),
(4, 'BOSS50K', 'Giảm trực tiếp 50.000₫ cho hóa đơn từ 499.000₫', 'fixed', 50000, 499000, 50000, '2026-10-31', 45, 100, 'active'),
(5, 'VIPMEMBER', 'Ưu đãi đặc quyền giảm 15% cho thành viên VIP PetCare', 'percent', 15, 600000, 100000, '2026-12-31', 95, 300, 'active');

-- ====================================================================
-- 17. BẢNG BÀI VIẾT & CẨM NANG THÚ CƯNG (blogs)
-- Khớp 100% với: blog.tsx, get_admin_extra.php, admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Dinh dưỡng',
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `author` VARCHAR(100) NOT NULL DEFAULT 'BS. Nguyễn Minh Tuấn',
  `author_role` VARCHAR(150) NOT NULL DEFAULT 'Bác sĩ Thú y ĐH Nông Lâm',
  `read_time` VARCHAR(50) NOT NULL DEFAULT '4 phút đọc',
  `views` INT(11) NOT NULL DEFAULT 1,
  `likes` INT(11) NOT NULL DEFAULT 100,
  `image` VARCHAR(500) NOT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blogs` (`id`, `title`, `category`, `summary`, `content`, `author`, `author_role`, `read_time`, `views`, `likes`, `image`, `status`) VALUES
(1, '10 Dấu hiệu nhận biết thú cưng thiếu hụt dinh dưỡng và cách bổ sung kịp thời', 'Dinh dưỡng', 
 'Bộ lông xơ xác, sút cân hoặc lười vận động là những tín hiệu báo động cần được bổ sung vi chất và dinh dưỡng chất lượng cao.',
 'Dinh dưỡng đóng vai trò cốt lõi trong sức khỏe của thú cưng. Khi cơ thể thiếu hụt vi khoáng, các dấu hiệu sẽ nhanh chóng biểu hiện qua da lông và hành vi thường ngày.\n\n1. Lông rụng nhiều, mất độ bóng mượt tự nhiên: Đây là dấu hiệu của việc thiếu hụt Omega 3, Omega 6 và Kẽm. Bạn nên bổ sung dầu cá hồi hoặc thức ăn hạt chuyên dụng.\n\n2. Sụt cân hoặc giảm cơ: Lượng protein trong khẩu phần ăn không đủ để đáp ứng nhu cầu phát triển thể trạng.\n\n3. Răng ố vàng, hôi miệng: Thú cưng cần được ăn hạt khô kích thước phù hợp để hỗ trợ cọ sát làm sạch mảng bám răng.\n\nLời khuyên từ chuyên gia: Hãy lựa chọn các dòng thức ăn có nguồn gốc rõ ràng, giàu đạm động vật và không chứa chất bảo quản nhân tạo.',
 'BS. CKI Nguyễn Minh Tuấn', 'Trưởng khoa Dinh dưỡng & Nội khoa PetCare', '4 phút đọc', 1840, 184, 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800', 'published'),

(2, 'Lịch tiêm phòng và tẩy giun định kỳ chuẩn thú y cho chó mèo 2026', 'Sức khỏe',
 'Bảo vệ thú cưng khỏi các bệnh truyền nhiễm nguy hiểm như Care, Parvo, Dại và Giảm bạch cầu bằng phác đồ tiêm chủng khoa học.',
 'Tiêm chủng là biện pháp phòng bệnh chủ động và kinh tế nhất để bảo vệ mạng sống cho thú cưng ngay từ những tháng đầu đời.\n\n• Đối với chó: Mũi 1 lúc 6-8 tuần tuổi (5 bệnh), Mũi 2 sau 3-4 tuần (7 bệnh), Mũi 3 nhắc lại và Tiêm dại từ 3 tháng tuổi.\n\n• Đối với mèo: Mũi 1 lúc 8 tuần tuổi (4 bệnh gồm Giảm bạch cầu, Viêm mũi, Calicivirus), Mũi 2 sau 4 tuần, sau đó tiêm dại.\n\n• Lịch tẩy giun: Mỗi tháng 1 lần cho đến 6 tháng tuổi, sau đó duy trì định kỳ 3 tháng/lần suốt đời.',
 'ThS. BS Trần Thu Hà', 'Viện Nghiên cứu Chăn nuôi Thú y', '5 phút đọc', 2450, 246, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800', 'published'),

(3, 'Bí quyết giúp cún mèo có bộ lông bóng mượt, giảm rụng lông tới 80%', 'Mẹo chăm sóc',
 'Chải lông đúng cách mỗi ngày, tắm đúng tần suất và chọn đúng sữa tắm dưỡng ẩm là chìa khóa sở hữu bộ lông bồng bềnh.',
 'Hiện tượng rụng lông ở chó mèo là hoàn toàn tự nhiên khi thay lông mùa, nhưng nếu rụng quá mức tạo thành từng mảng thì sen cần chú ý.\n\n1. Chọn đúng sữa tắm chuyên dụng: Tuyệt đối không dùng sữa tắm của người vì độ pH của da chó mèo khác biệt hoàn toàn (pH ~ 7.0 so với người ~ 5.5).\n\n2. Chải lông hàng ngày: Sử dụng lược chải gỡ rối hoặc lược lấy lông chết 5-10 phút mỗi ngày giúp kích thích lưu thông máu.\n\n3. Bổ sung dầu cá hồi và Pate chất lượng cao: Cung cấp EPA và DHA giúp nang lông chắc khỏe từ sâu bên trong.',
 'Groomer Lê Hoàng', 'Chuyên gia Chăm sóc Thú cưng PetCare', '3 phút đọc', 1290, 312, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800', 'published'),

(4, 'Phương pháp huấn luyện đi vệ sinh đúng chỗ chỉ sau 7 ngày kiên trì', 'Huấn luyện',
 'Phương pháp huấn luyện bằng khen thưởng tích cực (Positive Reinforcement) giúp thú cưng hiểu lệnh nhanh chóng mà không gây sợ hãi.',
 'Dạy thú cưng đi vệ sinh đúng chỗ là thử thách đầu tiên nhưng quan trọng nhất của mọi người nuôi.\n\nBước 1: Cố định vị trí khay cát hoặc tấm lót vệ sinh. Đặt ở nơi yên tĩnh, dễ tiếp cận nhưng cách xa bát ăn và nước uống.\n\nBước 2: Bắt đúng thời điểm vàng. Thông thường chó mèo sẽ muốn đi vệ sinh sau khi ngủ dậy, sau khi ăn khoảng 15-20 phút, hoặc sau khi chạy nhảy.\n\nBước 3: Khen thưởng ngay lập tức. Khi thú cưng đi đúng chỗ, hãy khen ngợi bằng giọng vui vẻ và thưởng ngay một mẩu bánh thưởng snack.',
 'HLV. Đỗ Quốc Bảo', 'Huấn luyện viên Chó Chuyên nghiệp', '4 phút đọc', 980, 198, 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800', 'published');

-- ====================================================================
-- 18. BẢNG ĐÁNH GIÁ SẢN PHẨM (reviews)
-- Khớp phân hệ: detail.tsx, admin.tsx, server.js
-- ====================================================================
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `customer_id` INT(11) DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_avatar` VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  `rating` INT(11) NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `weight_bought` VARCHAR(50) DEFAULT 'Gói tiêu chuẩn',
  `verified_purchase` TINYINT(1) NOT NULL DEFAULT 1,
  `likes` INT(11) NOT NULL DEFAULT 0,
  `status` ENUM('approved', 'pending', 'hidden') NOT NULL DEFAULT 'approved',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rev_prod` (`product_id`),
  KEY `idx_rev_cust` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` (`id`, `product_id`, `product_name`, `customer_id`, `customer_name`, `rating`, `comment`, `weight_bought`, `verified_purchase`, `likes`, `status`, `created_at`) VALUES
(1, 1, 'Hạt Royal Canin Fit 32 Cho Mèo Trưởng Thành (Bao 2kg)', 2, 'Lê Hoàng Yến', 5, 'Mèo nhà mình ăn Fit 32 từ bé, trộm vía lông mượt như nhung, không hề bị rụng lông hay sỏi thận. Đóng gói rất kỹ càng!', 'Bao 2.0 kg', 1, 14, 'approved', '2026-10-02 09:15:00'),
(2, 6, 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp', 1, 'Nguyễn Văn Minh', 5, 'Bé Miu nhà mình nghiện Churu này lắm, chỉ cần nghe tiếng xé gói là chạy bổ lại ngay. Rất thơm và sạch miệng!', 'Gói 4 thanh (56g)', 1, 28, 'approved', '2026-10-03 14:30:00'),
(3, 8, '(1 tải 6 bao) Cát Nhật đen MoonCat 9L chính hãng Khử Mùi Vón Cục', 3, 'Trần Thu Trang', 5, 'Cát hút mùi cực tốt, vón cục cứng ngắc không bị vỡ vụn khi xúc, ít bụi hơn hẳn các loại trước đây mình dùng.', '1 Tải 6 bao', 1, 9, 'approved', '2026-10-05 16:45:00'),
(4, 10, 'Pate Cho Chó Pedigree Lon Vị Thịt Bò & Rau Củ (Lon 400g)', 1, 'Nguyễn Văn Minh', 5, 'Pate thơm nức mũi, trộn cùng hạt cún ăn sạch sành sanh không chừa một hạt nào.', 'Lon 400g', 1, 12, 'approved', '2026-10-08 11:20:00');

-- ====================================================================
-- 19. BẢNG QUẢN LÝ KHO & ĐỊNH MỨC TỒN (inventory)
-- Khớp phân hệ: Quản lý kho hàng trong admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `product_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `packaging` VARCHAR(50) NOT NULL DEFAULT 'Gói tiêu chuẩn',
  `stock_qty` INT(11) NOT NULL DEFAULT 0,
  `min_alert_qty` INT(11) NOT NULL DEFAULT 10,
  `location` VARCHAR(100) NOT NULL DEFAULT 'Kệ A1',
  `status` ENUM('in_stock', 'low_stock', 'out_of_stock') NOT NULL DEFAULT 'in_stock',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `inventory` (`id`, `sku`, `product_id`, `product_name`, `category`, `packaging`, `stock_qty`, `min_alert_qty`, `location`, `status`) VALUES
(1, 'RC-FIT32-VN', 1, 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32', 'Thức ăn khô / Hạt', 'Bao 2.0kg', 142, 20, 'Kho A - Kệ 01', 'in_stock'),
(2, 'PET-19-408', 19, 'Bánh Thưởng Cho Mèo Ciao Churu Vị Gà', 'Snack / Bánh thưởng', 'Túi 4 thanh', 140, 30, 'Kho B - Kệ 03', 'in_stock'),
(3, 'PATE-PED-01', 10, 'Pate Cho Chó Pedigree Vị Thịt Bò', 'Pate & Thức ăn ướt', 'Lon 400g', 85, 15, 'Kho A - Kệ 02', 'in_stock'),
(4, 'CAT-TOFU-01', 9, 'Cát Vệ Sinh Đậu Nành Cature Tofu', 'Cát & Chăm sóc', 'Túi 6L', 12, 25, 'Kho C - Kệ 01', 'low_stock');

-- ====================================================================
-- 20. BẢNG LÔ HÀNG NHẬP & HẠN DÙNG (batches)
-- Khớp phân hệ: Quản lý lô hàng & hạn dùng trong admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `batches`;
CREATE TABLE `batches` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `batch_code` VARCHAR(50) NOT NULL UNIQUE,
  `product_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `mfg_date` DATE NOT NULL,
  `exp_date` DATE NOT NULL,
  `days_remaining` INT(11) NOT NULL,
  `package_type` VARCHAR(50) NOT NULL DEFAULT 'Bao tiêu chuẩn',
  `status` ENUM('good', 'warning', 'critical') NOT NULL DEFAULT 'good',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `batches` (`id`, `batch_code`, `product_id`, `product_name`, `mfg_date`, `exp_date`, `days_remaining`, `package_type`, `status`) VALUES
(1, 'LOT-2026-0891', 1, 'Thức Ăn Hạt Cho Mèo Royal Canin Fit 32', '2026-01-15', '2028-01-15', 645, 'Bao 2kg', 'good'),
(2, 'LOT-2026-0342', 6, 'Bánh Thưởng Ciao Churu Vị Gà', '2026-02-20', '2027-08-20', 500, 'Gói 4 thanh', 'good'),
(3, 'LOT-2025-1109', 2, 'Pate Whiskas Vị Cá Biển Tươi Cho Mèo', '2025-11-10', '2026-11-10', 30, 'Gói 85g', 'warning');

-- ====================================================================
-- 21. BẢNG NHÀ CUNG CẤP (suppliers)
-- Khớp phân hệ: Quản lý nhà cung cấp trong admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `brands_supplied` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `warehouse_city` VARCHAR(100) NOT NULL DEFAULT 'Hà Nội',
  `contract_until` VARCHAR(50) NOT NULL DEFAULT '2027',
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `suppliers` (`id`, `name`, `code`, `brands_supplied`, `contact_person`, `phone`, `email`, `warehouse_city`, `contract_until`, `rating`) VALUES
(1, 'Công Ty Cổ Phần PetFood Việt Nam', 'NCC-PF01', 'Royal Canin, Whiskas, Pedigree', 'Trần Đình Trọng', '024.3891.2233', 'contact@petfood.vn', 'Hà Nội', '31/12/2027', 4.9),
(2, 'Inaba Trading Japan - Chi Nhánh VN', 'NCC-INB', 'Inaba Ciao, Churu', 'Yamamoto Kenji', '028.7300.9988', 'vietnam@inaba.co.jp', 'TP. Hồ Chí Minh', '15/08/2028', 5.0);

-- ====================================================================
-- 22. BẢNG BANNER QUẢNG CÁO & KHUYẾN MÃI (banners)
-- Khớp phân hệ: Quản lý banner trong admin.tsx
-- ====================================================================
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `badge` VARCHAR(50) NOT NULL DEFAULT 'SIÊU KHUYẾN MÃI',
  `title` VARCHAR(255) NOT NULL,
  `highlight` VARCHAR(100) NOT NULL DEFAULT 'TIẾT KIỆM TỚI 30%',
  `subtitle` VARCHAR(255) NOT NULL,
  `cta_text` VARCHAR(50) NOT NULL DEFAULT 'Khám phá ngay',
  `image` MEDIUMTEXT NOT NULL,
  `theme_color` VARCHAR(20) NOT NULL DEFAULT '#0284C7',
  `order_num` INT(11) NOT NULL DEFAULT 1,
  `status` ENUM('active', 'paused') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `banners` (`id`, `badge`, `title`, `highlight`, `subtitle`, `cta_text`, `image`, `theme_color`, `order_num`, `status`) VALUES
(1, 'DINH DƯỠNG THÚ CƯNG 2026', 'Thực Đơn Vàng Cho Chó Mèo', 'TIẾT KIỆM TỚI 25%', 'Thức ăn hạt, pate mọng nước & bánh thưởng chính hãng bảo vệ hệ tiêu hóa', 'Mua ngay', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000', '#0284C7', 1, 'active'),
(2, 'TƯ VẤN THÚ Y TRỰC TUYẾN', 'Bác Sĩ Dinh Dưỡng Đồng Hành', 'MIỄN PHÍ TƯ VẤN', 'Đặt lịch hẹn thăm khám và nhận phác đồ dinh dưỡng cá nhân hóa cho bé yêu', 'Đặt lịch ngay', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000', '#059669', 2, 'active');

-- ====================================================================
-- 23. BẢNG PHẢN HỒI & TƯ VẤN KHÁCH HÀNG (feedbacks)
-- Khớp phân hệ: modal Đặt lịch tư vấn nhanh ở Home & Quản lý góp ý admin
-- ====================================================================
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `pet_name` VARCHAR(100) DEFAULT NULL,
  `type` ENUM('Yêu cầu tư vấn ăn uống', 'Góp ý dịch vụ', 'Hỗ trợ đổi trả') NOT NULL DEFAULT 'Yêu cầu tư vấn ăn uống',
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'contacting', 'resolved') NOT NULL DEFAULT 'new',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `feedbacks` (`id`, `customer_name`, `phone`, `pet_name`, `type`, `message`, `status`) VALUES
(1, 'Đỗ Thùy Linh', '0912.445.566', 'Bé Bông', 'Yêu cầu tư vấn ăn uống', 'Mèo nhà em bị tiêu chảy sau khi đổi hạt, nhờ bác sĩ tư vấn men tiêu hóa gấp.', 'new'),
-- ====================================================================
-- 24. BẢNG PHÂN CA NHÂN VIÊN & LỊCH LÀM VIỆC (employee_shifts)
-- Khớp phân hệ: Quản lý ca nhân viên (admin.tsx)
-- ====================================================================
DROP TABLE IF EXISTS `employee_shifts`;
CREATE TABLE `employee_shifts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` VARCHAR(50) NOT NULL DEFAULT 'NV-001',
  `employee_name` VARCHAR(100) NOT NULL,
  `employee_phone` VARCHAR(20) DEFAULT '',
  `employee_role` VARCHAR(50) NOT NULL DEFAULT 'Tư vấn bán hàng',
  `shift_name` VARCHAR(100) NOT NULL DEFAULT 'Ca Sáng (07:30 - 12:00)',
  `shift_type` VARCHAR(20) NOT NULL DEFAULT 'morning',
  `shift_date` DATE NOT NULL,
  `start_time` VARCHAR(20) NOT NULL DEFAULT '07:30',
  `end_time` VARCHAR(20) NOT NULL DEFAULT '12:00',
  `branch` VARCHAR(100) NOT NULL DEFAULT 'Cơ sở chính Ba Đình',
  `status` ENUM('scheduled', 'checked_in', 'completed', 'absent', 'leave') NOT NULL DEFAULT 'scheduled',
  `check_in_time` VARCHAR(20) DEFAULT NULL,
  `check_out_time` VARCHAR(20) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `employee_shifts` (`id`, `employee_id`, `employee_name`, `employee_phone`, `employee_role`, `shift_name`, `shift_type`, `shift_date`, `start_time`, `end_time`, `branch`, `status`, `check_in_time`, `check_out_time`, `note`) VALUES
(1, 'NV-001', 'Lê Thu Thảo', '0912 345 678', 'Tư vấn bán hàng', 'Ca Sáng (07:30 - 12:00)', 'morning', CURDATE(), '07:30', '12:00', 'Cơ sở chính Ba Đình', 'checked_in', '07:25', NULL, 'Trực quầy thu ngân & tư vấn thức ăn mèo'),
(2, 'BS-002', 'BS. CKI Nguyễn Minh Tuấn', '0903 888 999', 'Bác sĩ thú y trực ca', 'Ca Sáng (08:00 - 12:00)', 'morning', CURDATE(), '08:00', '12:00', 'Phòng khám PetCare Ba Đình', 'checked_in', '07:55', NULL, 'Khám lâm sàng & tiêm phòng dại 3 ca hẹn'),
(3, 'NV-003', 'Trần Văn Kho', '0988 123 456', 'Quản lý kho hàng', 'Ca Hành chính (08:00 - 17:00)', 'fulltime', CURDATE(), '08:00', '17:00', 'Kho tổng Cầu Giấy', 'checked_in', '07:50', NULL, 'Kiểm kê lô thức ăn Royal Canin & Minino mới nhập'),
(4, 'NV-004', 'Hoàng Mỹ Duyên', '0977 456 789', 'Kỹ thuật viên Spa/Grooming', 'Ca Chiều (12:00 - 17:30)', 'afternoon', CURDATE(), '12:00', '17:30', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Lịch tắm dưỡng lông cho 4 bé Poodle & Corgi'),
(5, 'NV-005', 'Phạm Quốc Bảo', '0934 567 890', 'Thu ngân & CSKH', 'Ca Chiều (12:00 - 17:30)', 'afternoon', CURDATE(), '12:00', '17:30', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Bàn giao ca với Thảo, kiểm đếm tiền két'),
(6, 'BS-003', 'BS. Trần Thị Mai', '0918 654 321', 'Bác sĩ thú y trực ca', 'Ca Chiều (13:30 - 18:00)', 'afternoon', CURDATE(), '13:30', '18:00', 'Phòng khám PetCare Cầu Giấy', 'scheduled', NULL, NULL, 'Siêu âm & xét nghiệm máu bé mèo Miu'),
(7, 'NV-006', 'Đỗ Minh Khang', '0945 112 233', 'Tư vấn bán hàng', 'Ca Tối (17:30 - 22:00)', 'evening', CURDATE(), '17:30', '22:00', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Hỗ trợ khách mua đồ giờ tan tầm & kiểm kê quầy'),
(8, 'BS-004', 'BS. Đặng Hữu Tài', '0909 334 455', 'Bác sĩ cấp cứu 24/7', 'Ca Đêm 24/7 (22:00 - 07:30)', 'night', CURDATE(), '22:00', '07:30', 'Cấp cứu 24/7 Ba Đình', 'scheduled', NULL, NULL, 'Trực cấp cứu ban đêm và theo dõi thú cưng nội trú');

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- HOÀN TẤT KHỞI TẠO CƠ SỞ DỮ LIỆU PETCARE_DB!
-- Tổng cộng: 24 Bảng, Khóa ngoại toàn vẹn, Dữ liệu mẫu chuẩn 100% Giao diện
-- ====================================================================

