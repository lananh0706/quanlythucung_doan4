import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { BlogIcon, SearchIcon, CloseIcon, SparklesIcon } from '@/components/icons';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string[];
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  likes: number;
  image: string;
}

const CATEGORIES = ['Tất cả', 'Dinh dưỡng', 'Sức khỏe', 'Mẹo chăm sóc', 'Huấn luyện'];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    category: 'Dinh dưỡng',
    title: '10 Dấu hiệu nhận biết thú cưng thiếu hụt dinh dưỡng và cách bổ sung kịp thời',
    summary: 'Bộ lông xơ xác, sút cân hoặc lười vận động là những tín hiệu báo động cần được bổ sung vi chất và dinh dưỡng chất lượng cao.',
    content: [
      'Dinh dưỡng đóng vai trò cốt lõi trong sức khỏe của thú cưng. Khi cơ thể thiếu hụt vi khoáng, các dấu hiệu sẽ nhanh chóng biểu hiện qua da lông và hành vi thường ngày.',
      '1. Lông rụng nhiều, mất độ bóng mượt tự nhiên: Đây là dấu hiệu của việc thiếu hụt Omega 3, Omega 6 và Kẽm. Bạn nên bổ sung dầu cá hồi hoặc thức ăn hạt chuyên dụng.',
      '2. Sụt cân hoặc giảm cơ: Lượng protein trong khẩu phần ăn không đủ để đáp ứng nhu cầu phát triển thể trạng.',
      '3. Răng ố vàng, hôi miệng: Thú cưng cần được ăn hạt khô kích thước phù hợp để hỗ trợ cọ sát làm sạch mảng bám răng.',
      'Lời khuyên từ chuyên gia: Hãy lựa chọn các dòng thức ăn có nguồn gốc rõ ràng, giàu đạm động vật và không chứa chất bảo quản nhân tạo.',
    ],
    author: 'BS. Nguyễn Minh Tuấn',
    authorRole: 'Bác sĩ Thú y ĐH Nông Lâm',
    readTime: '4 phút đọc',
    date: '10/09/2026',
    likes: 184,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-2',
    category: 'Sức khỏe',
    title: 'Lịch tiêm phòng và tẩy giun định kỳ chuẩn thú y cho chó mèo 2026',
    summary: 'Bảo vệ thú cưng khỏi các bệnh truyền nhiễm nguy hiểm như Care, Parvo, Dại và Giảm bạch cầu bằng phác đồ tiêm chủng khoa học.',
    content: [
      'Tiêm chủng là biện pháp phòng bệnh chủ động và kinh tế nhất để bảo vệ mạng sống cho thú cưng ngay từ những tháng đầu đời.',
      '• Đối với chó: Mũi 1 lúc 6-8 tuần tuổi (5 bệnh), Mũi 2 sau 3-4 tuần (7 bệnh), Mũi 3 nhắc lại và Tiêm dại từ 3 tháng tuổi.',
      '• Đối với mèo: Mũi 1 lúc 8 tuần tuổi (4 bệnh gồm Giảm bạch cầu, Viêm mũi, Calicivirus), Mũi 2 sau 4 tuần, sau đó tiêm dại.',
      '• Lịch tẩy giun: Mỗi tháng 1 lần cho đến 6 tháng tuổi, sau đó duy trì định kỳ 3 tháng/lần suốt đời.',
    ],
    author: 'BS. Trần Thu Hà',
    authorRole: 'Viện Nghiên cứu Chăn nuôi Thú y',
    readTime: '5 phút đọc',
    date: '08/09/2026',
    likes: 246,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-3',
    category: 'Mẹo chăm sóc',
    title: 'Bí quyết giúp cún mèo có bộ lông bóng mượt, giảm rụng lông tới 80%',
    summary: 'Chải lông đúng cách mỗi ngày, tắm đúng tần suất và chọn đúng sữa tắm dưỡng ẩm là chìa khóa sở hữu bộ lông bồng bềnh.',
    content: [
      'Hiện tượng rụng lông ở chó mèo là hoàn toàn tự nhiên khi thay lông mùa, nhưng nếu rụng quá mức tạo thành từng mảng thì sen cần chú ý.',
      '1. Chọn đúng sữa tắm chuyên dụng: Tuyệt đối không dùng sữa tắm của người vì độ pH của da chó mèo khác biệt hoàn toàn (pH ~ 7.0 so với người ~ 5.5).',
      '2. Chải lông hàng ngày: Sử dụng lược chải gỡ rối hoặc lược lấy lông chết 5-10 phút mỗi ngày giúp kích thích lưu thông máu.',
      '3. Bổ sung dầu cá hồi và Pate chất lượng cao: Cung cấp EPA và DHA giúp nang lông chắc khỏe từ sâu bên trong.',
    ],
    author: 'Groomer Lê Hoàng',
    authorRole: 'Chuyên gia Chăm sóc Thú cưng PetCare',
    readTime: '3 phút đọc',
    date: '05/09/2026',
    likes: 312,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-4',
    category: 'Huấn luyện',
    title: 'Phương pháp huấn luyện đi vệ sinh đúng chỗ chỉ sau 7 ngày kiên trì',
    summary: 'Phương pháp huấn luyện bằng khen thưởng tích cực (Positive Reinforcement) giúp thú cưng hiểu lệnh nhanh chóng mà không gây sợ hãi.',
    content: [
      'Dạy thú cưng đi vệ sinh đúng chỗ là thử thách đầu tiên nhưng quan trọng nhất của mọi người nuôi.',
      'Bước 1: Cố định vị trí khay cát hoặc tấm lót vệ sinh. Đặt ở nơi yên tĩnh, dễ tiếp cận nhưng cách xa bát ăn và nước uống.',
      'Bước 2: Bắt đúng thời điểm vàng. Thông thường chó mèo sẽ muốn đi vệ sinh sau khi ngủ dậy, sau khi ăn khoảng 15-20 phút, hoặc sau khi chạy nhảy.',
      'Bước 3: Khen thưởng ngay lập tức. Khi thú cưng đi đúng chỗ, hãy khen ngợi bằng giọng vui vẻ và thưởng ngay một mẩu bánh thưởng snack.',
    ],
    author: 'HLV. Đỗ Quốc Bảo',
    authorRole: 'Huấn luyện viên Chó Chuyên nghiệp',
    readTime: '4 phút đọc',
    date: '01/09/2026',
    likes: 198,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
  },
];

import { BASE_URL } from '@/services/api';
const API_EXTRA = `${BASE_URL}/get_admin_extra.php`;

export default function BlogScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  React.useEffect(() => {
    fetch(API_EXTRA)
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData?.data?.blogs) && resData.data.blogs.length > 0) {
          const mapped: BlogPost[] = resData.data.blogs.map((b: any, idx: number) => ({
            id: `blog-${b.id}`,
            category: b.category || 'Dinh dưỡng',
            title: b.title,
            summary: `${b.title} - Chuyên đề tư vấn chăm sóc sức khỏe và dinh dưỡng chuẩn thú y.`,
            content: [
              `Bài viết được biên soạn bởi ${b.author || 'Bác sĩ PetCare'}.`,
              'Cung cấp những kiến thức thực tiễn và lời khuyên y khoa chuẩn xác nhất cho thú cưng của bạn.',
              'Hãy theo dõi các hướng dẫn chi tiết để bé yêu luôn khỏe mạnh và tràn đầy năng lượng mỗi ngày.'
            ],
            author: b.author || 'BS. Chuyên khoa',
            authorRole: 'Bác sĩ Thú y PetCare',
            readTime: '3 phút đọc',
            date: b.date || 'Gần đây',
            likes: 120 + (idx * 35),
            image: BLOG_POSTS[idx % BLOG_POSTS.length]?.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchCat = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerIconCircle}>
            <BlogIcon size={20} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.headerTitle}>PetCare Journal</Text>
            <Text style={styles.headerSubtitle}>Tạp chí kiến thức dinh dưỡng & y học thú y</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 16 }}>
            {/* TÌM KIẾM */}
            <View style={styles.searchBar}>
              <SearchIcon size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm chuyên đề, dinh dưỡng, bệnh học..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <CloseIcon size={14} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* DANH MỤC */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* BANNER NỔI BẬT */}
            <TouchableOpacity
              style={styles.featuredBanner}
              activeOpacity={0.92}
              onPress={() => setSelectedPost(BLOG_POSTS[0])}
            >
              <Image
                source={{ uri: BLOG_POSTS[0].image }}
                style={styles.featuredImage}
                contentFit="cover"
              />
              <View style={styles.featuredOverlay} />
              <View style={styles.featuredContent}>
                <View style={styles.featuredTag}>
                  <Text style={styles.featuredTagText}>CHUYÊN ĐỀ NỔI BẬT</Text>
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {BLOG_POSTS[0].title}
                </Text>
                <Text style={styles.featuredDesc} numberOfLines={2}>
                  {BLOG_POSTS[0].summary}
                </Text>
                <View style={styles.featuredMeta}>
                  <Text style={styles.featuredAuthor}>{BLOG_POSTS[0].author}</Text>
                  <Text style={styles.featuredReadTime}>{BLOG_POSTS[0].readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionHeading}>Bài Viết Mới Xuất Bản</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postCard}
            activeOpacity={0.88}
            onPress={() => setSelectedPost(item)}
          >
            <Image source={{ uri: item.image }} style={styles.postImage} contentFit="cover" />

            <View style={styles.postInfo}>
              <View>
                <View style={styles.postTopRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.postDate}>{item.date}</Text>
                </View>

                <Text style={styles.postTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.postSummary} numberOfLines={2}>
                  {item.summary}
                </Text>
              </View>

              <View style={styles.postBottomRow}>
                <Text style={styles.postAuthorText}>{item.author}</Text>
                <TouchableOpacity
                  style={styles.likeBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                >
                  <Text style={[styles.likeCount, likedPosts[item.id] && { color: '#E11D48', fontWeight: '800' }]}>
                    {likedPosts[item.id] ? 'Đã lưu' : 'Lưu bài'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* MODAL CHI TIẾT */}
      <Modal
        visible={!!selectedPost}
        animationType="slide"
        onRequestClose={() => setSelectedPost(null)}
      >
        {selectedPost && (
          <SafeAreaView style={styles.articleModalContainer}>
            <View style={styles.articleModalHeader}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setSelectedPost(null)}
              >
                <Text style={styles.backBtnText}>← Quay lại</Text>
              </TouchableOpacity>
              <Text style={styles.articleHeaderCategory}>{selectedPost.category}</Text>
              <View style={{ width: 60 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.articleContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={{ uri: selectedPost.image }}
                style={styles.articleHeroImage}
                contentFit="cover"
              />

              <View style={styles.articleBody}>
                <View style={styles.articleBadgeRow}>
                  <Text style={styles.articleBadge}>{selectedPost.category}</Text>
                  <Text style={styles.articleDot}>•</Text>
                  <Text style={styles.articleReadTime}>{selectedPost.readTime}</Text>
                </View>

                <Text style={styles.articleTitle}>{selectedPost.title}</Text>

                <View style={styles.authorCard}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorAvatarText}>
                      {selectedPost.author.charAt(selectedPost.author.lastIndexOf(' ') + 1)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{selectedPost.author}</Text>
                    <Text style={styles.authorRole}>{selectedPost.authorRole}</Text>
                  </View>
                </View>

                {selectedPost.content.map((paragraph, idx) => (
                  <Text key={idx} style={styles.articleParagraph}>
                    {paragraph}
                  </Text>
                ))}

                <View style={styles.tipBox}>
                  <Text style={styles.tipTitle}>Ghi chú y khoa thú y:</Text>
                  <Text style={styles.tipText}>
                    Luôn theo dõi thể trạng và hành vi tiêu hóa hàng ngày của thú cưng. Nếu phát hiện các dấu hiệu bất thường kéo dài trên 48h, hãy liên hệ ngay với phòng khám thú y gần nhất.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeArticleBtn}
                  onPress={() => setSelectedPost(null)}
                >
                  <Text style={styles.closeArticleBtnText}>Đóng bài viết</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  categoryScroll: {
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  categoryChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  featuredBanner: {
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#0F172A',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  featuredImage: {
    ...(StyleSheet.absoluteFill as any),
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  featuredContent: {
    position: 'relative',
    zIndex: 2,
    padding: 20,
    justifyContent: 'flex-end',
    height: '100%',
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  featuredTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
    marginBottom: 4,
  },
  featuredDesc: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredAuthor: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  featuredReadTime: {
    color: '#94A3B8',
    fontSize: 11,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  postImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#E0F2FE',
  },
  postInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  postTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700',
  },
  postDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    lineHeight: 19,
  },
  postSummary: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 3,
  },
  postBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E0F2FE',
  },
  postAuthorText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  likeBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  likeCount: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  articleModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  articleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  backBtn: {
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  articleHeaderCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  articleContentContainer: {
    paddingBottom: 40,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  articleHeroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E0F2FE',
  },
  articleBody: {
    padding: 24,
  },
  articleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  articleBadge: {
    backgroundColor: '#0EA5E9',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  articleDot: {
    color: '#94A3B8',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#64748B',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 30,
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 20,
    gap: 12,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  authorRole: {
    fontSize: 11,
    color: '#64748B',
  },
  articleParagraph: {
    fontSize: 15,
    lineHeight: 25,
    color: '#334155',
    marginBottom: 16,
  },
  tipBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginVertical: 18,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  closeArticleBtn: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeArticleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
