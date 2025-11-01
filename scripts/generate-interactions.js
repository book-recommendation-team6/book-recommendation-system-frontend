/**
 * Script sinh dữ liệu tương tác user-book cho hệ thống gợi ý
 * - Favorites: User yêu thích sách
 * - Ratings: User đánh giá sách (1-5 sao + comment)
 * - Reading History: Lịch sử đọc sách
 * 
 * Sử dụng: node scripts/generate-interactions.js
 */

import axios from 'axios';

const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api/v1',
  // Số lượng tương tác mỗi user (random trong khoảng)
  MIN_FAVORITES_PER_USER: 3,
  MAX_FAVORITES_PER_USER: 15,
  MIN_RATINGS_PER_USER: 5,
  MAX_RATINGS_PER_USER: 20,
  MIN_HISTORY_PER_USER: 10,
  MAX_HISTORY_PER_USER: 30,
};

// Mẫu comments cho rating (tiếng Việt thực tế)
const RATING_COMMENTS = {
  5: [
    'Sách rất hay! Tôi đã học được rất nhiều điều bổ ích.',
    'Tuyệt vời! Một trong những cuốn sách hay nhất tôi từng đọc.',
    'Nội dung sâu sắc, cách viết dễ hiểu. Rất đáng đọc!',
    'Cuốn sách này đã thay đổi cách nhìn của tôi về cuộc sống.',
    'Xuất sắc! Không thể đặt xuống được.',
    'Nội dung phong phú, lời văn hay. Recommend!',
    'Sách hay quá! Đọc xong muốn đọc lại.',
  ],
  4: [
    'Sách khá hay, có nhiều điểm thú vị.',
    'Nội dung tốt, nhưng có phần hơi dài dòng.',
    'Đáng đọc! Một số chương rất hay.',
    'Khá ổn, học được nhiều thứ.',
    'Hay nhưng chưa thực sự xuất sắc.',
    'Nội dung tốt, cách trình bày có thể cải thiện.',
  ],
  3: [
    'Bình thường, có thể đọc thử.',
    'Không quá hay nhưng cũng không tệ.',
    'Có vài điểm thú vị nhưng tổng thể chưa ấn tượng.',
    'Tạm được, phù hợp để giải trí.',
    'Nội dung ổn nhưng cách viết chưa hấp dẫn lắm.',
  ],
  2: [
    'Hơi nhàm chán, không như mong đợi.',
    'Nội dung không được hấp dẫn lắm.',
    'Có thể bỏ qua cuốn này.',
    'Không phù hợp với tôi.',
  ],
  1: [
    'Không hay, lãng phí thời gian.',
    'Nội dung quá nhạt nhẽo.',
    'Không recommend.',
  ],
};

// Progress levels cho reading history
const PROGRESS_LEVELS = [0.1, 0.25, 0.5, 0.75, 0.95, 1.0];

/**
 * Random number trong khoảng [min, max]
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random element từ array
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 */
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Lấy danh sách tất cả users từ backend
 */
async function getAllUsers(token) {
  try {
    const response = await axios.get(`${CONFIG.API_BASE_URL}/admin/users`, {
      params: { page: 0, size: 1000 },
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = response.data?.data?.content || response.data?.content || [];
    return users.filter(u => u.role !== 'ADMIN'); // Loại admin ra
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách users:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Lấy danh sách tất cả books từ backend
 */
async function getAllBooks() {
  try {
    const response = await axios.get(`${CONFIG.API_BASE_URL}/books`, {
      params: { page: 0, size: 1000 },
    });
    return response.data?.data?.content || response.data?.content || [];
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách books:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Thêm sách vào favorites
 */
async function addToFavorites(userToken, userId, bookId) {
  try {
    await axios.post(
      `${CONFIG.API_BASE_URL}/users/${userId}/favorites/${bookId}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return true;
  } catch (error) {
    // Bỏ qua lỗi trùng lặp
    if (error.response?.status === 409) return false;
    console.error(`   ⚠️  Lỗi add favorite: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Tạo rating cho sách
 */
async function createRating(userToken, userId, bookId, ratingValue, comment) {
  try {
    await axios.post(
      `${CONFIG.API_BASE_URL}/users/${userId}/books/${bookId}/ratings`,
      { value: ratingValue, comment },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return true;
  } catch (error) {
    console.error(`   ⚠️  Lỗi create rating: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Ghi lịch sử đọc sách
 */
async function recordHistory(userToken, userId, bookId, progress) {
  try {
    await axios.post(
      `${CONFIG.API_BASE_URL}/users/${userId}/books/${bookId}/history`,
      { progress },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return true;
  } catch (error) {
    console.error(`   ⚠️  Lỗi record history: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Đăng nhập user để lấy token
 */
async function loginUser(email, password = 'Duy2592004!?') {
  try {
    const response = await axios.post(`${CONFIG.API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    console.log('response', response);
    return response.data?.data?.jwt || response.data?.jwt;
  } catch (error) {
    console.error(`   ⚠️  Lỗi login user ${email}:`, error.response?.data?.message || error.message);
    console.error('   ❌ Đăng nhập thất bại', error);
    return null;
  }
}

/**
 * Sinh dữ liệu tương tác cho 1 user
 */
async function generateInteractionsForUser(user, allBooks, index, total) {
  console.log(`\n👤 [${index + 1}/${total}] User: ${user.fullName} (${user.email})`);
  
  // Login để lấy token
  const userToken = await loginUser(user.email);
  if (!userToken) {
    console.log('   ❌ Không thể login, bỏ qua user này');
    return { favorites: 0, ratings: 0, history: 0 };
  }
  
  const shuffledBooks = shuffle(allBooks);
  const stats = { favorites: 0, ratings: 0, history: 0 };
  
  // 1. Tạo Favorites
  const numFavorites = randomInt(CONFIG.MIN_FAVORITES_PER_USER, CONFIG.MAX_FAVORITES_PER_USER);
  const favoriteBooks = shuffledBooks.slice(0, numFavorites);
  
  console.log(`   💖 Tạo ${numFavorites} favorites...`);
  for (const book of favoriteBooks) {
    const success = await addToFavorites(userToken, user.id, book.id);
    if (success) stats.favorites++;
    await new Promise(r => setTimeout(r, 100)); // Delay 100ms
  }
  
  // 2. Tạo Ratings (có thể overlap với favorites)
  const numRatings = randomInt(CONFIG.MIN_RATINGS_PER_USER, CONFIG.MAX_RATINGS_PER_USER);
  const ratingBooks = shuffledBooks.slice(0, numRatings);
  
  console.log(`   ⭐ Tạo ${numRatings} ratings...`);
  for (const book of ratingBooks) {
    // Rating theo phân phối thực tế: 5 sao nhiều nhất, 1 sao ít nhất
    const rand = Math.random();
    let ratingValue;
    if (rand < 0.4) ratingValue = 5;      // 40% là 5 sao
    else if (rand < 0.7) ratingValue = 4; // 30% là 4 sao
    else if (rand < 0.85) ratingValue = 3; // 15% là 3 sao
    else if (rand < 0.95) ratingValue = 2; // 10% là 2 sao
    else ratingValue = 1;                  // 5% là 1 sao
    
    const comment = randomChoice(RATING_COMMENTS[ratingValue]);
    const success = await createRating(userToken, user.id, book.id, ratingValue, comment);
    if (success) stats.ratings++;
    await new Promise(r => setTimeout(r, 100));
  }
  
  // 3. Tạo Reading History (có thể overlap với ratings)
  const numHistory = randomInt(CONFIG.MIN_HISTORY_PER_USER, CONFIG.MAX_HISTORY_PER_USER);
  const historyBooks = shuffledBooks.slice(0, numHistory);
  
  console.log(`   📖 Tạo ${numHistory} reading history...`);
  for (const book of historyBooks) {
    const progress = randomChoice(PROGRESS_LEVELS);
    const success = await recordHistory(userToken, user.id, book.id, progress);
    if (success) stats.history++;
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`   ✅ Hoàn thành: ${stats.favorites} favorites, ${stats.ratings} ratings, ${stats.history} history`);
  return stats;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 BẮT ĐẦU SINH DỮ LIỆU TƯƠNG TÁC CHO HỆ THỐNG GỢI Ý\n');
  console.log('═'.repeat(60));
  
  // Lấy admin token từ args hoặc env
  const args = process.argv.slice(2);
  const tokenIndex = args.indexOf('--token');
  const adminToken = tokenIndex !== -1 ? args[tokenIndex + 1] : process.env.ADMIN_TOKEN;
  
  if (!adminToken) {
    console.error('❌ Vui lòng cung cấp admin token:');
    console.error('   node scripts/generate-interactions.js --token YOUR_ADMIN_TOKEN');
    console.error('   hoặc set ADMIN_TOKEN=YOUR_TOKEN');
    process.exit(1);
  }
  
  // 1. Lấy danh sách users và books
  console.log('📊 Đang tải dữ liệu...\n');
  const [users, books] = await Promise.all([
    getAllUsers(adminToken),
    getAllBooks(),
  ]);
  
  if (users.length === 0 || books.length === 0) {
    console.error('❌ Không có users hoặc books để tạo tương tác!');
    process.exit(1);
  }
  
  console.log(`👥 Tìm thấy ${users.length} users`);
  console.log(`📚 Tìm thấy ${books.length} books\n`);
  console.log('═'.repeat(60));
  
  // 2. Sinh tương tác cho từng user
  const totalStats = { favorites: 0, ratings: 0, history: 0 };
  
  for (let i = 0; i < users.length; i++) {
    const stats = await generateInteractionsForUser(users[i], books, i, users.length);
    totalStats.favorites += stats.favorites;
    totalStats.ratings += stats.ratings;
    totalStats.history += stats.history;
    
    // Delay giữa các user
    if (i < users.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // 3. Hiển thị kết quả
  console.log('\n' + '═'.repeat(60));
  console.log('📊 KẾT QUẢ TỔNG HỢP:');
  console.log('═'.repeat(60));
  console.log(`👥 Tổng số users: ${users.length}`);
  console.log(`📚 Tổng số books: ${books.length}`);
  console.log('');
  console.log('📈 DỮ LIỆU ĐÃ TẠO:');
  console.log(`   💖 Favorites: ${totalStats.favorites}`);
  console.log(`   ⭐ Ratings: ${totalStats.ratings}`);
  console.log(`   📖 Reading History: ${totalStats.history}`);
  console.log('');
  console.log('📊 TRUNG BÌNH MỖI USER:');
  console.log(`   💖 Favorites: ${(totalStats.favorites / users.length).toFixed(1)}`);
  console.log(`   ⭐ Ratings: ${(totalStats.ratings / users.length).toFixed(1)}`);
  console.log(`   📖 Reading History: ${(totalStats.history / users.length).toFixed(1)}`);
  console.log('═'.repeat(60));
  console.log('✅ HOÀN TẤT SINH DỮ LIỆU!\n');
  console.log('💡 Dữ liệu này có thể dùng để huấn luyện:');
  console.log('   - Collaborative Filtering (User-User, Item-Item)');
  console.log('   - Matrix Factorization (SVD, ALS)');
  console.log('   - Content-based Filtering');
  console.log('   - Hybrid Recommendation Systems');
}

// Chạy script
main().catch(error => {
  console.error('\n💥 Lỗi không xử lý được:', error);
  process.exit(1);
});
