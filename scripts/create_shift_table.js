const mysql = require('../petcare-server/node_modules/mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'petcare_db',
  charset: 'utf8mb4'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connect error:', err);
    process.exit(1);
  }

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS \`employee_shifts\` (
      \`id\` INT(11) NOT NULL AUTO_INCREMENT,
      \`employee_id\` VARCHAR(50) NOT NULL DEFAULT 'NV-001',
      \`employee_name\` VARCHAR(100) NOT NULL,
      \`employee_phone\` VARCHAR(20) DEFAULT '',
      \`employee_role\` VARCHAR(50) NOT NULL DEFAULT 'Tư vấn bán hàng',
      \`shift_name\` VARCHAR(100) NOT NULL DEFAULT 'Ca Sáng (07:30 - 12:00)',
      \`shift_type\` VARCHAR(20) NOT NULL DEFAULT 'morning',
      \`shift_date\` DATE NOT NULL,
      \`start_time\` VARCHAR(20) NOT NULL DEFAULT '07:30',
      \`end_time\` VARCHAR(20) NOT NULL DEFAULT '12:00',
      \`branch\` VARCHAR(100) NOT NULL DEFAULT 'Cơ sở chính Ba Đình',
      \`status\` ENUM('scheduled', 'checked_in', 'completed', 'absent', 'leave') NOT NULL DEFAULT 'scheduled',
      \`check_in_time\` VARCHAR(20) DEFAULT NULL,
      \`check_out_time\` VARCHAR(20) DEFAULT NULL,
      \`note\` TEXT DEFAULT NULL,
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  db.query(createTableSql, (err1) => {
    if (err1) {
      console.error('Create table error:', err1);
      db.end();
      return;
    }
    console.log('✅ Bảng employee_shifts đã được tạo hoặc đã tồn tại!');

    // Check count
    db.query('SELECT COUNT(*) as cnt FROM employee_shifts', (err2, results) => {
      if (!err2 && results[0].cnt === 0) {
        const seedSql = `
          INSERT INTO \`employee_shifts\` (\`employee_id\`, \`employee_name\`, \`employee_phone\`, \`employee_role\`, \`shift_name\`, \`shift_type\`, \`shift_date\`, \`start_time\`, \`end_time\`, \`branch\`, \`status\`, \`check_in_time\`, \`check_out_time\`, \`note\`) VALUES
          ('NV-001', 'Lê Thu Thảo', '0912 345 678', 'Tư vấn bán hàng', 'Ca Sáng (07:30 - 12:00)', 'morning', CURDATE(), '07:30', '12:00', 'Cơ sở chính Ba Đình', 'checked_in', '07:25', NULL, 'Trực quầy thu ngân & tư vấn thức ăn mèo'),
          ('BS-002', 'BS. CKI Nguyễn Minh Tuấn', '0903 888 999', 'Bác sĩ thú y trực ca', 'Ca Sáng (08:00 - 12:00)', 'morning', CURDATE(), '08:00', '12:00', 'Phòng khám PetCare Ba Đình', 'checked_in', '07:55', NULL, 'Khám lâm sàng & tiêm phòng dại 3 ca hẹn'),
          ('NV-003', 'Trần Văn Kho', '0988 123 456', 'Quản lý kho hàng', 'Ca Hành chính (08:00 - 17:00)', 'fulltime', CURDATE(), '08:00', '17:00', 'Kho tổng Cầu Giấy', 'checked_in', '07:50', NULL, 'Kiểm kê lô thức ăn Royal Canin & Minino mới nhập'),
          ('NV-004', 'Hoàng Mỹ Duyên', '0977 456 789', 'Kỹ thuật viên Spa/Grooming', 'Ca Chiều (12:00 - 17:30)', 'afternoon', CURDATE(), '12:00', '17:30', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Lịch tắm dưỡng lông cho 4 bé Poodle & Corgi'),
          ('NV-005', 'Phạm Quốc Bảo', '0934 567 890', 'Thu ngân & CSKH', 'Ca Chiều (12:00 - 17:30)', 'afternoon', CURDATE(), '12:00', '17:30', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Bàn giao ca với Thảo, kiểm đếm tiền két'),
          ('BS-003', 'BS. Trần Thị Mai', '0918 654 321', 'Bác sĩ thú y trực ca', 'Ca Chiều (13:30 - 18:00)', 'afternoon', CURDATE(), '13:30', '18:00', 'Phòng khám PetCare Cầu Giấy', 'scheduled', NULL, NULL, 'Siêu âm & xét nghiệm máu bé mèo Miu'),
          ('NV-006', 'Đỗ Minh Khang', '0945 112 233', 'Tư vấn bán hàng', 'Ca Tối (17:30 - 22:00)', 'evening', CURDATE(), '17:30', '22:00', 'Cơ sở chính Ba Đình', 'scheduled', NULL, NULL, 'Hỗ trợ khách mua đồ giờ tan tầm & kiểm kê quầy'),
          ('BS-004', 'BS. Đặng Hữu Tài', '0909 334 455', 'Bác sĩ cấp cứu 24/7', 'Ca Đêm 24/7 (22:00 - 07:30)', 'night', CURDATE(), '22:00', '07:30', 'Cấp cứu 24/7 Ba Đình', 'scheduled', NULL, NULL, 'Trực cấp cứu ban đêm và theo dõi thú cưng nội trú');
        `;
        db.query(seedSql, (err3) => {
          if (err3) console.error('Seed error:', err3);
          else console.log('✅ Đã nạp 8 ca làm việc mẫu ban đầu!');
          db.end();
        });
      } else {
        console.log(`Bảng đã có ${results ? results[0].cnt : 0} bản ghi.`);
        db.end();
      }
    });
  });
});
