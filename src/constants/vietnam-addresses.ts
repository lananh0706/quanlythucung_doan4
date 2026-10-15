// ============================================================
// DỮ LIỆU ĐỊA GIỚI HÀNH CHÍNH VIỆT NAM VÀ QUỐC TẾ
// Hỗ trợ chọn Tỉnh/Thành phố -> Quận/Huyện -> Phường/Xã
// ============================================================

export interface WardItem {
  id: string;
  name: string;
}

export interface DistrictItem {
  id: string;
  name: string;
  wards: WardItem[];
}

export interface ProvinceItem {
  id: string;
  name: string;
  districts: DistrictItem[];
}

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
}

// 1. DANH SÁCH QUỐC GIA NƯỚC NGOÀI
export const INTERNATIONAL_COUNTRIES: CountryItem[] = [
  { code: 'US', name: 'Hoa Kỳ (United States)', flag: '🇺🇸' },
  { code: 'JP', name: 'Nhật Bản (Japan)', flag: '🇯🇵' },
  { code: 'KR', name: 'Hàn Quốc (South Korea)', flag: '🇰🇷' },
  { code: 'AU', name: 'Úc (Australia)', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'Vương quốc Anh (United Kingdom)', flag: '🇬🇧' },
  { code: 'FR', name: 'Pháp (France)', flag: '🇫🇷' },
  { code: 'DE', name: 'Đức (Germany)', flag: '🇩🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'TW', name: 'Đài Loan (Taiwan)', flag: '🇹🇼' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thái Lan (Thailand)', flag: '🇹🇭' },
  { code: 'CN', name: 'Trung Quốc (China)', flag: '🇨🇳' },
  { code: 'OTHER', name: 'Quốc gia khác (Other Country)', flag: '🌐' },
];

// 2. DANH SÁCH TỈNH THÀNH - QUẬN HUYỆN - PHƯỜNG XÃ VIỆT NAM
export const VIETNAM_PROVINCES: ProvinceItem[] = [
  // HÀ NỘI
  {
    id: 'HN',
    name: 'Hà Nội',
    districts: [
      {
        id: 'HN_CG',
        name: 'Quận Cầu Giấy',
        wards: [
          { id: 'HN_CG_DVH', name: 'Phường Dịch Vọng Hậu' },
          { id: 'HN_CG_DV', name: 'Phường Dịch Vọng' },
          { id: 'HN_CG_MD', name: 'Phường Mai Dịch' },
          { id: 'HN_CG_ND', name: 'Phường Nghĩa Đô' },
          { id: 'HN_CG_NT', name: 'Phường Nghĩa Tân' },
          { id: 'HN_CG_QH', name: 'Phường Quan Hoa' },
          { id: 'HN_CG_TH', name: 'Phường Trung Hòa' },
          { id: 'HN_CG_YH', name: 'Phường Yên Hòa' },
        ],
      },
      {
        id: 'HN_DD',
        name: 'Quận Đống Đa',
        wards: [
          { id: 'HN_DD_LH', name: 'Phường Láng Hạ' },
          { id: 'HN_DD_LT', name: 'Phường Láng Thượng' },
          { id: 'HN_DD_OCD', name: 'Phường Ô Chợ Dừa' },
          { id: 'HN_DD_CL', name: 'Phường Cát Linh' },
          { id: 'HN_DD_HB', name: 'Phường Hàng Bột' },
          { id: 'HN_DD_KT', name: 'Phường Khâm Thiên' },
          { id: 'HN_DD_PM', name: 'Phường Phương Mai' },
          { id: 'HN_DD_QT', name: 'Phường Quang Trung' },
          { id: 'HN_DD_TL', name: 'Phường Trung Liệt' },
          { id: 'HN_DD_TT', name: 'Phường Trung Tự' },
        ],
      },
      {
        id: 'HN_BD',
        name: 'Quận Ba Đình',
        wards: [
          { id: 'HN_BD_GV', name: 'Phường Giảng Võ' },
          { id: 'HN_BD_KM', name: 'Phường Kim Mã' },
          { id: 'HN_BD_LG', name: 'Phường Liễu Giai' },
          { id: 'HN_BD_NH', name: 'Phường Ngọc Hà' },
          { id: 'HN_BD_NK', name: 'Phường Ngọc Khánh' },
          { id: 'HN_BD_DC', name: 'Phường Đội Cấn' },
          { id: 'HN_BD_DB', name: 'Phường Điện Biên' },
          { id: 'HN_BD_TC', name: 'Phường Thành Công' },
          { id: 'HN_BD_TB', name: 'Phường Trúc Bạch' },
        ],
      },
      {
        id: 'HN_HK',
        name: 'Quận Hoàn Kiếm',
        wards: [
          { id: 'HN_HK_HB', name: 'Phường Hàng Bạc' },
          { id: 'HN_HK_HBA', name: 'Phường Hàng Bài' },
          { id: 'HN_HK_HBO', name: 'Phường Hàng Bồ' },
          { id: 'HN_HK_HBG', name: 'Phường Hàng Bông' },
          { id: 'HN_HK_HD', name: 'Phường Hàng Đào' },
          { id: 'HN_HK_HG', name: 'Phường Hàng Gai' },
          { id: 'HN_HK_TT', name: 'Phường Tràng Tiền' },
          { id: 'HN_HK_CD', name: 'Phường Cửa Đông' },
          { id: 'HN_HK_CN', name: 'Phường Cửa Nam' },
          { id: 'HN_HK_DX', name: 'Phường Đồng Xuân' },
        ],
      },
      {
        id: 'HN_HBT',
        name: 'Quận Hai Bà Trưng',
        wards: [
          { id: 'HN_HBT_BK', name: 'Phường Bách Khoa' },
          { id: 'HN_HBT_BM', name: 'Phường Bạch Mai' },
          { id: 'HN_HBT_DT', name: 'Phường Đồng Tâm' },
          { id: 'HN_HBT_MK', name: 'Phường Minh Khai' },
          { id: 'HN_HBT_TN', name: 'Phường Thanh Nhàn' },
          { id: 'HN_HBT_VT', name: 'Phường Vĩnh Tuy' },
          { id: 'HN_HBT_LDH', name: 'Phường Lê Đại Hành' },
          { id: 'HN_HBT_QL', name: 'Phường Quỳnh Lôi' },
        ],
      },
      {
        id: 'HN_TX',
        name: 'Quận Thanh Xuân',
        wards: [
          { id: 'HN_TX_NC', name: 'Phường Nhân Chính' },
          { id: 'HN_TX_KM', name: 'Phường Khương Mai' },
          { id: 'HN_TX_KT', name: 'Phường Khương Trung' },
          { id: 'HN_TX_KD', name: 'Phường Khương Đình' },
          { id: 'HN_TX_PL', name: 'Phường Phương Liệt' },
          { id: 'HN_TX_TXB', name: 'Phường Thanh Xuân Bắc' },
          { id: 'HN_TX_TXN', name: 'Phường Thanh Xuân Nam' },
          { id: 'HN_TX_TXT', name: 'Phường Thanh Xuân Trung' },
          { id: 'HN_TX_TD', name: 'Phường Thượng Đình' },
        ],
      },
      {
        id: 'HN_HM',
        name: 'Quận Hoàng Mai',
        wards: [
          { id: 'HN_HM_DK', name: 'Phường Đại Kim' },
          { id: 'HN_HM_DC', name: 'Phường Định Công' },
          { id: 'HN_HM_GB', name: 'Phường Giáp Bát' },
          { id: 'HN_HM_HL', name: 'Phường Hoàng Liệt' },
          { id: 'HN_HM_MD', name: 'Phường Mai Động' },
          { id: 'HN_HM_TM', name: 'Phường Tân Mai' },
          { id: 'HN_HM_TL', name: 'Phường Thịnh Liệt' },
          { id: 'HN_HM_YS', name: 'Phường Yên Sở' },
          { id: 'HN_HM_VH', name: 'Phường Vĩnh Hưng' },
        ],
      },
      {
        id: 'HN_NTL',
        name: 'Quận Nam Từ Liêm',
        wards: [
          { id: 'HN_NTL_MD1', name: 'Phường Mỹ Đình 1' },
          { id: 'HN_NTL_MD2', name: 'Phường Mỹ Đình 2' },
          { id: 'HN_NTL_MT', name: 'Phường Mễ Trì' },
          { id: 'HN_NTL_CD', name: 'Phường Cầu Diễn' },
          { id: 'HN_NTL_PD', name: 'Phường Phú Đô' },
          { id: 'HN_NTL_TM', name: 'Phường Tây Mỗ' },
          { id: 'HN_NTL_DM', name: 'Phường Đại Mỗ' },
          { id: 'HN_NTL_TV', name: 'Phường Trung Văn' },
          { id: 'HN_NTL_XP', name: 'Phường Xuân Phương' },
        ],
      },
      {
        id: 'HN_BTL',
        name: 'Quận Bắc Từ Liêm',
        wards: [
          { id: 'HN_BTL_XD', name: 'Phường Xuân Đỉnh' },
          { id: 'HN_BTL_XT', name: 'Phường Xuân Tảo' },
          { id: 'HN_BTL_CN1', name: 'Phường Cổ Nhuế 1' },
          { id: 'HN_BTL_CN2', name: 'Phường Cổ Nhuế 2' },
          { id: 'HN_BTL_PD', name: 'Phường Phú Diễn' },
          { id: 'HN_BTL_PHD', name: 'Phường Phúc Diễn' },
          { id: 'HN_BTL_DN', name: 'Phường Đông Ngạc' },
          { id: 'HN_BTL_DT', name: 'Phường Đức Thắng' },
        ],
      },
      {
        id: 'HN_HD',
        name: 'Quận Hà Đông',
        wards: [
          { id: 'HN_HD_ML', name: 'Phường Mộ Lao' },
          { id: 'HN_HD_VQ', name: 'Phường Văn Quán' },
          { id: 'HN_HD_VP', name: 'Phường Vạn Phúc' },
          { id: 'HN_HD_LK', name: 'Phường La Khê' },
          { id: 'HN_HD_PL', name: 'Phường Phúc La' },
          { id: 'HN_HD_KH', name: 'Phường Kiến Hưng' },
          { id: 'HN_HD_PHL', name: 'Phường Phú La' },
          { id: 'HN_HD_DN', name: 'Phường Dương Nội' },
          { id: 'HN_HD_YN', name: 'Phường Yên Nghĩa' },
        ],
      },
      {
        id: 'HN_DA',
        name: 'Huyện Đông Anh',
        wards: [
          { id: 'HN_DA_TT', name: 'Thị trấn Đông Anh' },
          { id: 'HN_DA_CL', name: 'Xã Cổ Loa' },
          { id: 'HN_DA_KC', name: 'Xã Kim Chung' },
          { id: 'HN_DA_KN', name: 'Xã Kim Nỗ' },
          { id: 'HN_DA_HB', name: 'Xã Hải Bối' },
          { id: 'HN_DA_VN', name: 'Xã Vĩnh Ngọc' },
          { id: 'HN_DA_TD', name: 'Xã Tiên Dương' },
          { id: 'HN_DA_UN', name: 'Xã Uy Nỗ' },
        ],
      },
      {
        id: 'HN_GL',
        name: 'Huyện Gia Lâm',
        wards: [
          { id: 'HN_GL_TQ', name: 'Thị trấn Trâu Quỳ' },
          { id: 'HN_GL_YV', name: 'Thị trấn Yên Viên' },
          { id: 'HN_GL_BT', name: 'Xã Bát Tràng' },
          { id: 'HN_GL_CB', name: 'Xã Cổ Bi' },
          { id: 'HN_GL_DT', name: 'Xã Đa Tốn' },
          { id: 'HN_GL_DX', name: 'Xã Đặng Xá' },
          { id: 'HN_GL_KK', name: 'Xã Kiêu Kỵ' },
          { id: 'HN_GL_NH', name: 'Xã Ninh Hiệp' },
        ],
      },
      {
        id: 'HN_HD2',
        name: 'Huyện Hoài Đức',
        wards: [
          { id: 'HN_HD2_TT', name: 'Thị trấn Trạm Trôi' },
          { id: 'HN_HD2_AK', name: 'Xã An Khánh' },
          { id: 'HN_HD2_AT', name: 'Xã An Thượng' },
          { id: 'HN_HD2_DT', name: 'Xã Di Trạch' },
          { id: 'HN_HD2_KC', name: 'Xã Kim Chung' },
          { id: 'HN_HD2_LP', name: 'Xã La Phù' },
          { id: 'HN_HD2_LY', name: 'Xã Lại Yên' },
          { id: 'HN_HD2_VC', name: 'Xã Vân Canh' },
        ],
      },
      {
        id: 'HN_TT',
        name: 'Huyện Thanh Trì',
        wards: [
          { id: 'HN_TT_VD', name: 'Thị trấn Văn Điển' },
          { id: 'HN_TT_TH', name: 'Xã Tả Thanh Oai' },
          { id: 'HN_TT_TH2', name: 'Xã Tam Hiệp' },
          { id: 'HN_TT_TT', name: 'Xã Tân Triều' },
          { id: 'HN_TT_TL', name: 'Xã Thanh Liệt' },
          { id: 'HN_TT_TU', name: 'Xã Tứ Hiệp' },
          { id: 'HN_TT_NH', name: 'Xã Ngọc Hồi' },
          { id: 'HN_TT_VQ', name: 'Xã Vĩnh Quỳnh' },
        ],
      },
    ],
  },

  // TP. HỒ CHÍ MINH
  {
    id: 'HCM',
    name: 'TP. Hồ Chí Minh',
    districts: [
      {
        id: 'HCM_Q1',
        name: 'Quận 1',
        wards: [
          { id: 'HCM_Q1_BN', name: 'Phường Bến Nghé' },
          { id: 'HCM_Q1_BT', name: 'Phường Bến Thành' },
          { id: 'HCM_Q1_DK', name: 'Phường Đa Kao' },
          { id: 'HCM_Q1_TD', name: 'Phường Tân Định' },
          { id: 'HCM_Q1_PNL', name: 'Phường Phạm Ngũ Lão' },
          { id: 'HCM_Q1_NTB', name: 'Phường Nguyễn Thái Bình' },
          { id: 'HCM_Q1_NCT', name: 'Phường Nguyễn Cư Trinh' },
          { id: 'HCM_Q1_CG', name: 'Phường Cô Giang' },
          { id: 'HCM_Q1_CK', name: 'Phường Cầu Kho' },
        ],
      },
      {
        id: 'HCM_TD',
        name: 'TP. Thủ Đức',
        wards: [
          { id: 'HCM_TD_TD', name: 'Phường Thảo Điền' },
          { id: 'HCM_TD_AP', name: 'Phường An Phú' },
          { id: 'HCM_TD_AK', name: 'Phường An Khánh' },
          { id: 'HCM_TD_TML', name: 'Phường Thạnh Mỹ Lợi' },
          { id: 'HCM_TD_BTD', name: 'Phường Bình Trưng Đông' },
          { id: 'HCM_TD_BTT', name: 'Phường Bình Trưng Tây' },
          { id: 'HCM_TD_HBC', name: 'Phường Hiệp Bình Chánh' },
          { id: 'HCM_TD_HBP', name: 'Phường Hiệp Bình Phước' },
          { id: 'HCM_TD_LC', name: 'Phường Linh Chiểu' },
          { id: 'HCM_TD_LT', name: 'Phường Linh Trung' },
          { id: 'HCM_TD_LX', name: 'Phường Linh Xuân' },
          { id: 'HCM_TD_HP', name: 'Phường Hiệp Phú' },
          { id: 'HCM_TD_PLB', name: 'Phường Phước Long B' },
          { id: 'HCM_TD_TNPA', name: 'Phường Tăng Nhơn Phú A' },
        ],
      },
      {
        id: 'HCM_Q3',
        name: 'Quận 3',
        wards: [
          { id: 'HCM_Q3_VTS', name: 'Phường Võ Thị Sáu' },
          { id: 'HCM_Q3_P1', name: 'Phường 1' },
          { id: 'HCM_Q3_P2', name: 'Phường 2' },
          { id: 'HCM_Q3_P3', name: 'Phường 3' },
          { id: 'HCM_Q3_P4', name: 'Phường 4' },
          { id: 'HCM_Q3_P5', name: 'Phường 5' },
          { id: 'HCM_Q3_P9', name: 'Phường 9' },
          { id: 'HCM_Q3_P11', name: 'Phường 11' },
          { id: 'HCM_Q3_P14', name: 'Phường 14' },
        ],
      },
      {
        id: 'HCM_Q7',
        name: 'Quận 7',
        wards: [
          { id: 'HCM_Q7_TP', name: 'Phường Tân Phong (Phú Mỹ Hưng)' },
          { id: 'HCM_Q7_PM', name: 'Phường Phú Mỹ' },
          { id: 'HCM_Q7_TTD', name: 'Phường Tân Thuận Đông' },
          { id: 'HCM_Q7_TTT', name: 'Phường Tân Thuận Tây' },
          { id: 'HCM_Q7_TK', name: 'Phường Tân Kiểng' },
          { id: 'HCM_Q7_TH', name: 'Phường Tân Hưng' },
          { id: 'HCM_Q7_TQ', name: 'Phường Tân Quy' },
          { id: 'HCM_Q7_PT', name: 'Phường Phú Thuận' },
        ],
      },
      {
        id: 'HCM_BT',
        name: 'Quận Bình Thạnh',
        wards: [
          { id: 'HCM_BT_P19', name: 'Phường 19' },
          { id: 'HCM_BT_P21', name: 'Phường 21' },
          { id: 'HCM_BT_P22', name: 'Phường 22' },
          { id: 'HCM_BT_P25', name: 'Phường 25' },
          { id: 'HCM_BT_P26', name: 'Phường 26' },
          { id: 'HCM_BT_P27', name: 'Phường 27' },
          { id: 'HCM_BT_P28', name: 'Phường 28' },
        ],
      },
      {
        id: 'HCM_TB',
        name: 'Quận Tân Bình',
        wards: [
          { id: 'HCM_TB_P2', name: 'Phường 2 (Sân bay Tân Sơn Nhất)' },
          { id: 'HCM_TB_P4', name: 'Phường 4' },
          { id: 'HCM_TB_P12', name: 'Phường 12' },
          { id: 'HCM_TB_P13', name: 'Phường 13' },
          { id: 'HCM_TB_P15', name: 'Phường 15' },
        ],
      },
      {
        id: 'HCM_GV',
        name: 'Quận Gò Vấp',
        wards: [
          { id: 'HCM_GV_P1', name: 'Phường 1' },
          { id: 'HCM_GV_P3', name: 'Phường 3' },
          { id: 'HCM_GV_P5', name: 'Phường 5' },
          { id: 'HCM_GV_P7', name: 'Phường 7' },
          { id: 'HCM_GV_P10', name: 'Phường 10' },
          { id: 'HCM_GV_P11', name: 'Phường 11' },
        ],
      },
      {
        id: 'HCM_BC',
        name: 'Huyện Bình Chánh',
        wards: [
          { id: 'HCM_BC_TT', name: 'Thị trấn Tân Túc' },
          { id: 'HCM_BC_BH', name: 'Xã Bình Hưng' },
          { id: 'HCM_BC_PP', name: 'Xã Phong Phú' },
          { id: 'HCM_BC_VLA', name: 'Xã Vĩnh Lộc A' },
          { id: 'HCM_BC_VLB', name: 'Xã Vĩnh Lộc B' },
        ],
      },
    ],
  },

  // ĐÀ NẴNG
  {
    id: 'DN',
    name: 'Đà Nẵng',
    districts: [
      {
        id: 'DN_HC',
        name: 'Quận Hải Châu',
        wards: [
          { id: 'DN_HC_1', name: 'Phường Hải Châu 1' },
          { id: 'DN_HC_2', name: 'Phường Hải Châu 2' },
          { id: 'DN_HC_TT', name: 'Phường Thạch Thang' },
          { id: 'DN_HC_TB', name: 'Phường Thanh Bình' },
          { id: 'DN_HC_TP', name: 'Phường Thuận Phước' },
          { id: 'DN_HC_HCB', name: 'Phường Hòa Cường Bắc' },
          { id: 'DN_HC_HCN', name: 'Phường Hòa Cường Nam' },
        ],
      },
      {
        id: 'DN_ST',
        name: 'Quận Sơn Trà',
        wards: [
          { id: 'DN_ST_AHB', name: 'Phường An Hải Bắc' },
          { id: 'DN_ST_AHD', name: 'Phường An Hải Đông' },
          { id: 'DN_ST_PM', name: 'Phường Phước Mỹ' },
          { id: 'DN_ST_MT', name: 'Phường Mân Thái' },
          { id: 'DN_ST_TQ', name: 'Phường Thọ Quang' },
        ],
      },
      {
        id: 'DN_NHS',
        name: 'Quận Ngũ Hành Sơn',
        wards: [
          { id: 'DN_NHS_MA', name: 'Phường Mỹ An' },
          { id: 'DN_NHS_KM', name: 'Phường Khuê Mỹ' },
          { id: 'DN_NHS_HH', name: 'Phường Hòa Hải' },
          { id: 'DN_NHS_HQ', name: 'Phường Hòa Quý' },
        ],
      },
      {
        id: 'DN_TK',
        name: 'Quận Thanh Khê',
        wards: [
          { id: 'DN_TK_CG', name: 'Phường Chính Gián' },
          { id: 'DN_TK_VT', name: 'Phường Vĩnh Trung' },
          { id: 'DN_TK_TC', name: 'Phường Tân Chính' },
          { id: 'DN_TK_TKD', name: 'Phường Thanh Khê Đông' },
          { id: 'DN_TK_TKT', name: 'Phường Thanh Khê Tây' },
        ],
      },
      {
        id: 'DN_CL',
        name: 'Quận Cẩm Lệ',
        wards: [
          { id: 'DN_CL_KT', name: 'Phường Khuê Trung' },
          { id: 'DN_CL_HX', name: 'Phường Hòa Xuân' },
          { id: 'DN_CL_HTD', name: 'Phường Hòa Thọ Đông' },
          { id: 'DN_CL_HA', name: 'Phường Hòa An' },
        ],
      },
    ],
  },

  // HẢI PHÒNG
  {
    id: 'HP',
    name: 'Hải Phòng',
    districts: [
      {
        id: 'HP_HB',
        name: 'Quận Hồng Bàng',
        wards: [
          { id: 'HP_HB_HQ', name: 'Phường Hoàng Văn Thụ' },
          { id: 'HP_HB_MQ', name: 'Phường Minh Khai' },
          { id: 'HP_HB_PT', name: 'Phường Phan Bội Châu' },
          { id: 'HP_HB_TN', name: 'Phường Thượng Lý' },
          { id: 'HP_HB_HL', name: 'Phường Hạ Lý' },
        ],
      },
      {
        id: 'HP_LC',
        name: 'Quận Lê Chân',
        wards: [
          { id: 'HP_LC_AC', name: 'Phường An Châu' },
          { id: 'HP_LC_AD', name: 'Phường An Dương' },
          { id: 'HP_LC_CH', name: 'Phường Cát Dài' },
          { id: 'HP_LC_DL', name: 'Phường Dư Hàng Kênh' },
          { id: 'HP_LC_VC', name: 'Phường Vĩnh Niệm' },
        ],
      },
      {
        id: 'HP_NQ',
        name: 'Quận Ngô Quyền',
        wards: [
          { id: 'HP_NQ_CL', name: 'Phường Cầu Đất' },
          { id: 'HP_NQ_LV', name: 'Phường Lạc Viên' },
          { id: 'HP_NQ_MD', name: 'Phường Máy Chai' },
          { id: 'HP_NQ_LT', name: 'Phường Lương Khánh Thiện' },
        ],
      },
      {
        id: 'HP_TN',
        name: 'Huyện Thủy Nguyên',
        wards: [
          { id: 'HP_TN_ND', name: 'Thị trấn Núi Đèo' },
          { id: 'HP_TN_MN', name: 'Thị trấn Minh Đức' },
          { id: 'HP_TN_AL', name: 'Xã An Lư' },
          { id: 'HP_TN_HL', name: 'Xã Hoa Động' },
          { id: 'HP_TN_TB', name: 'Xã Thủy Đường' },
        ],
      },
    ],
  },

  // CẦN THƠ
  {
    id: 'CT',
    name: 'Cần Thơ',
    districts: [
      {
        id: 'CT_NK',
        name: 'Quận Ninh Kiều',
        wards: [
          { id: 'CT_NK_TB', name: 'Phường Tân An' },
          { id: 'CT_NK_AP', name: 'Phường An Phú' },
          { id: 'CT_NK_AK', name: 'Phường An Khánh' },
          { id: 'CT_NK_AH', name: 'Phường An Hòa' },
          { id: 'CT_NK_XB', name: 'Phường Xuân Khánh' },
          { id: 'CT_NK_CL', name: 'Phường Cái Khế' },
        ],
      },
      {
        id: 'CT_CR',
        name: 'Quận Cái Răng',
        wards: [
          { id: 'CT_CR_LD', name: 'Phường Lê Bình' },
          { id: 'CT_CR_HT', name: 'Phường Hưng Thạnh' },
          { id: 'CT_CR_HP', name: 'Phường Hưng Phú' },
          { id: 'CT_CR_PT', name: 'Phường Phú Thứ' },
        ],
      },
    ],
  },

  // BÌNH DƯƠNG
  {
    id: 'BD',
    name: 'Bình Dương',
    districts: [
      {
        id: 'BD_TDM',
        name: 'TP. Thủ Dầu Một',
        wards: [
          { id: 'BD_TDM_PC', name: 'Phường Phú Cường' },
          { id: 'BD_TDM_PH', name: 'Phường Phú Hòa' },
          { id: 'BD_TDM_PL', name: 'Phường Phú Lợi' },
          { id: 'BD_TDM_HP', name: 'Phường Hiệp Thành' },
          { id: 'BD_TDM_DA', name: 'Phường Định Hòa' },
        ],
      },
      {
        id: 'BD_TA',
        name: 'TP. Thuận An',
        wards: [
          { id: 'BD_TA_LT', name: 'Phường Lái Thiêu' },
          { id: 'BD_TA_AP', name: 'Phường An Phú' },
          { id: 'BD_TA_TH', name: 'Phường Thuận Giao' },
          { id: 'BD_TA_BD', name: 'Phường Bình Đang' },
          { id: 'BD_TA_VH', name: 'Phường Vĩnh Phú' },
        ],
      },
      {
        id: 'BD_DA',
        name: 'TP. Dĩ An',
        wards: [
          { id: 'BD_DA_DA', name: 'Phường Dĩ An' },
          { id: 'BD_DA_AT', name: 'Phường An Bình' },
          { id: 'BD_DA_TH', name: 'Phường Tân Đông Hiệp' },
          { id: 'BD_DA_BT', name: 'Phường Bình Thắng' },
        ],
      },
    ],
  },

  // ĐỒNG NAI
  {
    id: 'DNA',
    name: 'Đồng Nai',
    districts: [
      {
        id: 'DNA_BH',
        name: 'TP. Biên Hòa',
        wards: [
          { id: 'DNA_BH_TB', name: 'Phường Trung Dũng' },
          { id: 'DNA_BH_QH', name: 'Phường Quyết Thắng' },
          { id: 'DNA_BH_TN', name: 'Phường Thống Nhất' },
          { id: 'DNA_BH_TA', name: 'Phường Tân Mai' },
          { id: 'DNA_BH_TP', name: 'Phường Tân Phong' },
          { id: 'DNA_BH_HB', name: 'Phường Hố Nai' },
          { id: 'DNA_BH_LA', name: 'Phường Long Bình' },
        ],
      },
      {
        id: 'DNA_LT',
        name: 'Huyện Long Thành',
        wards: [
          { id: 'DNA_LT_TT', name: 'Thị trấn Long Thành' },
          { id: 'DNA_LT_AP', name: 'Xã An Phước' },
          { id: 'DNA_LT_BT', name: 'Xã Bình Sơn' },
          { id: 'DNA_LT_LP', name: 'Xã Lộc An' },
        ],
      },
    ],
  },

  // QUẢNG NINH
  {
    id: 'QN',
    name: 'Quảng Ninh',
    districts: [
      {
        id: 'QN_HL',
        name: 'TP. Hạ Long',
        wards: [
          { id: 'QN_HL_BC', name: 'Phường Bãi Cháy' },
          { id: 'QN_HL_HC', name: 'Phường Hòn Gai' },
          { id: 'QN_HL_HD', name: 'Phường Hồng Gai' },
          { id: 'QN_HL_HH', name: 'Phường Hồng Hải' },
          { id: 'QN_HL_CP', name: 'Phường Cao Thắng' },
        ],
      },
      {
        id: 'QN_CP',
        name: 'TP. Cẩm Phả',
        wards: [
          { id: 'QN_CP_CT', name: 'Phường Cẩm Trung' },
          { id: 'QN_CP_CTH', name: 'Phường Cẩm Thành' },
          { id: 'QN_CP_CP', name: 'Phường Cửa Ông' },
        ],
      },
    ],
  },

  // THỪA THIÊN HUẾ
  {
    id: 'TTH',
    name: 'Thừa Thiên Huế',
    districts: [
      {
        id: 'TTH_HUE',
        name: 'TP. Huế',
        wards: [
          { id: 'TTH_HUE_PN', name: 'Phường Phú Nhuận' },
          { id: 'TTH_HUE_PH', name: 'Phường Phú Hội' },
          { id: 'TTH_HUE_VH', name: 'Phường Vĩnh Ninh' },
          { id: 'TTH_HUE_TH', name: 'Phường Thuận Thành' },
          { id: 'TTH_HUE_TL', name: 'Phường Thuận Lộc' },
        ],
      },
    ],
  },

  // NGHỆ AN
  {
    id: 'NA',
    name: 'Nghệ An',
    districts: [
      {
        id: 'NA_VINH',
        name: 'TP. Vinh',
        wards: [
          { id: 'NA_VINH_QT', name: 'Phường Quang Trung' },
          { id: 'NA_VINH_LP', name: 'Phường Lê Lợi' },
          { id: 'NA_VINH_TC', name: 'Phường Trường Thi' },
          { id: 'NA_VINH_HT', name: 'Phường Hưng Dũng' },
          { id: 'NA_VINH_HB', name: 'Phường Hưng Bình' },
          { id: 'NA_VINH_DT', name: 'Phường Đội Cung' },
        ],
      },
      {
        id: 'NA_DC',
        name: 'Huyện Diễn Châu',
        wards: [
          { id: 'NA_DC_TT', name: 'Thị trấn Diễn Châu' },
          { id: 'NA_DC_DK', name: 'Xã Diễn Kỷ' },
          { id: 'NA_DC_DH', name: 'Xã Diễn Hồng' },
          { id: 'NA_DC_DY', name: 'Xã Diễn Yên' },
          { id: 'NA_DC_DN', name: 'Xã Diễn Ngọc' },
        ],
      },
      {
        id: 'NA_NL',
        name: 'Huyện Nghi Lộc',
        wards: [
          { id: 'NA_NL_QX', name: 'Thị trấn Quán Hành' },
          { id: 'NA_NL_NT', name: 'Xã Nghi Trung' },
          { id: 'NA_NL_NT2', name: 'Xã Nghi Thạch' },
          { id: 'NA_NL_NX', name: 'Xã Nghi Xuân' },
        ],
      },
    ],
  },

  // THANH HÓA
  {
    id: 'TH',
    name: 'Thanh Hóa',
    districts: [
      {
        id: 'TH_TP',
        name: 'TP. Thanh Hóa',
        wards: [
          { id: 'TH_TP_DB', name: 'Phường Điện Biên' },
          { id: 'TH_TP_LH', name: 'Phường Lam Sơn' },
          { id: 'TH_TP_BS', name: 'Phường Ba Đình' },
          { id: 'TH_TP_NC', name: 'Phường Ngọc Trạo' },
          { id: 'TH_TP_DC', name: 'Phường Đông Cương' },
        ],
      },
      {
        id: 'TH_SS',
        name: 'TP. Sầm Sơn',
        wards: [
          { id: 'TH_SS_BC', name: 'Phường Bắc Sơn' },
          { id: 'TH_SS_TS', name: 'Phường Trường Sơn' },
          { id: 'TH_SS_TC', name: 'Phường Trung Sơn' },
          { id: 'TH_SS_QL', name: 'Phường Quảng Lập' },
        ],
      },
    ],
  },

  // NAM ĐỊNH
  {
    id: 'ND',
    name: 'Nam Định',
    districts: [
      {
        id: 'ND_TP',
        name: 'TP. Nam Định',
        wards: [
          { id: 'ND_TP_VM', name: 'Phường Vị Xuyên' },
          { id: 'ND_TP_TH', name: 'Phường Trần Hưng Đạo' },
          { id: 'ND_TP_QT', name: 'Phường Quang Trung' },
          { id: 'ND_TP_NH', name: 'Phường Năng Tĩnh' },
          { id: 'ND_TP_LC', name: 'Phường Lộc Vượng' },
        ],
      },
      {
        id: 'ND_HH',
        name: 'Huyện Hải Hậu',
        wards: [
          { id: 'ND_HH_Y', name: 'Thị trấn Yên Định' },
          { id: 'ND_HH_C', name: 'Thị trấn Cồn' },
          { id: 'ND_HH_TH', name: 'Thị trấn Thịnh Long' },
          { id: 'ND_HH_HA', name: 'Xã Hải Anh' },
          { id: 'ND_HH_HP', name: 'Xã Hải Phú' },
        ],
      },
    ],
  },

  // THÁI BÌNH
  {
    id: 'TB',
    name: 'Thái Bình',
    districts: [
      {
        id: 'TB_TP',
        name: 'TP. Thái Bình',
        wards: [
          { id: 'TB_TP_LC', name: 'Phường Lê Hồng Phong' },
          { id: 'TB_TP_BC', name: 'Phường Bồ Xuyên' },
          { id: 'TB_TP_DL', name: 'Phường Đề Thám' },
          { id: 'TB_TP_KT', name: 'Phường Kỳ Bá' },
          { id: 'TB_TP_TH', name: 'Phường Trần Hưng Đạo' },
        ],
      },
    ],
  },

  // BẮC NINH
  {
    id: 'BN',
    name: 'Bắc Ninh',
    districts: [
      {
        id: 'BN_TP',
        name: 'TP. Bắc Ninh',
        wards: [
          { id: 'BN_TP_SP', name: 'Phường Suối Hoa' },
          { id: 'BN_TP_TC', name: 'Phường Tiền An' },
          { id: 'BN_TP_NC', name: 'Phường Ninh Xá' },
          { id: 'BN_TP_DH', name: 'Phường Đại Phúc' },
          { id: 'BN_TP_VD', name: 'Phường Vệ An' },
        ],
      },
      {
        id: 'BN_TS',
        name: 'TP. Từ Sơn',
        wards: [
          { id: 'BN_TS_DN', name: 'Phường Đông Ngàn' },
          { id: 'BN_TS_DD', name: 'Phường Đình Bảng' },
          { id: 'BN_TS_TB', name: 'Phường Tân Hồng' },
          { id: 'BN_TS_TG', name: 'Phường Trang Hạ' },
        ],
      },
    ],
  },

  // LÂM ĐỒNG
  {
    id: 'LD',
    name: 'Lâm Đồng',
    districts: [
      {
        id: 'LD_DL',
        name: 'TP. Đà Lạt',
        wards: [
          { id: 'LD_DL_P1', name: 'Phường 1' },
          { id: 'LD_DL_P2', name: 'Phường 2' },
          { id: 'LD_DL_P3', name: 'Phường 3' },
          { id: 'LD_DL_P8', name: 'Phường 8' },
          { id: 'LD_DL_P10', name: 'Phường 10' },
        ],
      },
      {
        id: 'LD_BL',
        name: 'TP. Bảo Lộc',
        wards: [
          { id: 'LD_BL_P1', name: 'Phường 1' },
          { id: 'LD_BL_P2', name: 'Phường 2' },
          { id: 'LD_BL_BL', name: 'Phường B’Lao' },
          { id: 'LD_BL_LT', name: 'Phường Lộc Tiến' },
        ],
      },
    ],
  },

  // KHÁNH HÒA
  {
    id: 'KH',
    name: 'Khánh Hòa',
    districts: [
      {
        id: 'KH_NT',
        name: 'TP. Nha Trang',
        wards: [
          { id: 'KH_NT_LC', name: 'Phường Lộc Thọ' },
          { id: 'KH_NT_TC', name: 'Phường Tân Lập' },
          { id: 'KH_NT_PH', name: 'Phường Phước Hải' },
          { id: 'KH_NT_PT', name: 'Phường Phước Tiến' },
          { id: 'KH_NT_VP', name: 'Phường Vĩnh Phước' },
        ],
      },
    ],
  },

  // BÀ RỊA - VŨNG TÀU
  {
    id: 'BRVT',
    name: 'Bà Rịa - Vũng Tàu',
    districts: [
      {
        id: 'BRVT_VT',
        name: 'TP. Vũng Tàu',
        wards: [
          { id: 'BRVT_VT_P1', name: 'Phường 1' },
          { id: 'BRVT_VT_P2', name: 'Phường 2' },
          { id: 'BRVT_VT_P3', name: 'Phường 3' },
          { id: 'BRVT_VT_P7', name: 'Phường 7' },
          { id: 'BRVT_VT_PT', name: 'Phường Thắng Tam' },
        ],
      },
    ],
  },

  // KIÊN GIANG
  {
    id: 'KG',
    name: 'Kiên Giang',
    districts: [
      {
        id: 'KG_PQ',
        name: 'TP. Phú Quốc',
        wards: [
          { id: 'KG_PQ_DD', name: 'Phường Dương Đông' },
          { id: 'KG_PQ_AT', name: 'Phường An Thới' },
          { id: 'KG_PQ_CT', name: 'Xã Cửa Tùng' },
          { id: 'KG_PQ_CD', name: 'Xã Cửa Dương' },
          { id: 'KG_PQ_GD', name: 'Xã Gành Dầu' },
        ],
      },
      {
        id: 'KG_RG',
        name: 'TP. Rạch Giá',
        wards: [
          { id: 'KG_RG_VL', name: 'Phường Vĩnh Lạc' },
          { id: 'KG_RG_VB', name: 'Phường Vĩnh Bảo' },
          { id: 'KG_RG_VT', name: 'Phường Vĩnh Thanh' },
        ],
      },
    ],
  },

  // TỈNH THÀNH KHÁC
  {
    id: 'OTHER_VN',
    name: 'Tỉnh/Thành phố khác ở Việt Nam',
    districts: [
      {
        id: 'OTHER_DIST',
        name: 'Quận / Huyện / Thị xã trung tâm',
        wards: [
          { id: 'OTHER_WARD_1', name: 'Phường / Xã trung tâm' },
          { id: 'OTHER_WARD_2', name: 'Phường / Xã khác' },
        ],
      },
    ],
  },
];
