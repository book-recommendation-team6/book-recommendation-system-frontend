# 📊 Script Sinh Dữ Liệu Tương Tác User-Book

## Mục đích
Tạo dữ liệu tương tác giữa users **ĐÃ CÓ SẴN** và books để huấn luyện hệ thống gợi ý (Recommendation System).

## Dữ liệu được sinh

### 1. **Favorites** (Yêu thích)
- Mỗi user: 3-15 sách yêu thích (random)
- API: `POST /users/{userId}/favorites/{bookId}`

### 2. **Ratings** (Đánh giá)
- Mỗi user: 5-20 đánh giá (random)
- Rating: 1-5 sao với phân phối thực tế:
  - 5 sao: 40%
  - 4 sao: 30%
  - 3 sao: 15%
  - 2 sao: 10%
  - 1 sao: 5%
- Kèm comment tiếng Việt tự nhiên
- API: `POST /users/{userId}/books/{bookId}/ratings`

### 3. **Reading History** (Lịch sử đọc)
- Mỗi user: 10-30 lịch sử đọc (random)
- Progress: 10%, 25%, 50%, 75%, 95%, 100%
- API: `POST /users/{userId}/books/{bookId}/history`

## Yêu cầu

### 1. Backend phải đang chạy
```bash
# Kiểm tra backend
curl http://localhost:8080/api/v1/books
```

### 2. Đã có dữ liệu users và books
- **Users**: Script sẽ tự động lấy TẤT CẢ users hiện có trong database (trừ admin)
- **Books**: Ít nhất 50 books

### 3. Users phải có password giống nhau
Script sử dụng password mặc định: `password123`

Nếu users có password khác, sửa trong script:
```javascript
async function loginUser(email, password = 'YOUR_PASSWORD_HERE') {
```

## Cách sử dụng

### Bước 1: Lấy admin token
```bash
# Đăng nhập vào http://localhost:3000 với tài khoản admin
# Mở DevTools > Application > localStorage > copy giá trị của key "token"
```

### Bước 2: Chạy script
```bash
node scripts/generate-interactions.js --token YOUR_ADMIN_TOKEN
```

Hoặc với environment variable:
```powershell
# PowerShell
$env:ADMIN_TOKEN="YOUR_ADMIN_TOKEN"
node scripts/generate-interactions.js
```

```bash
# Bash
export ADMIN_TOKEN="YOUR_ADMIN_TOKEN"
node scripts/generate-interactions.js
```

## Kết quả mẫu

```
🚀 BẮT ĐẦU SINH DỮ LIỆU TƯƠNG TÁC CHO HỆ THỐNG GỢI Ý

============================================================
📊 Đang tải dữ liệu...

👥 Tìm thấy 25 users
📚 Tìm thấy 255 books

============================================================

👤 [1/25] User: Nguyễn Văn A (user1@gmail.com)
   💖 Tạo 8 favorites...
   ⭐ Tạo 12 ratings...
   📖 Tạo 15 reading history...
   ✅ Hoàn thành: 8 favorites, 12 ratings, 15 history

👤 [2/25] User: Trần Thị B (user2@gmail.com)
   ...

============================================================
📊 KẾT QUẢ TỔNG HỢP:
============================================================
👥 Tổng số users: 25
📚 Tổng số books: 255

📈 DỮ LIỆU ĐÃ TẠO:
   💖 Favorites: 225
   ⭐ Ratings: 350
   📖 Reading History: 500

📊 TRUNG BÌNH MỖI USER:
   💖 Favorites: 9.0
   ⭐ Ratings: 14.0
   📖 Reading History: 20.0
============================================================
✅ HOÀN TẤT SINH DỮ LIỆU!

💡 Dữ liệu này có thể dùng để huấn luyện:
   - Collaborative Filtering (User-User, Item-Item)
   - Matrix Factorization (SVD, ALS)
   - Content-based Filtering
   - Hybrid Recommendation Systems
```

## Lưu ý

### 1. Thời gian chạy
- Với 25 users x 255 books: ~10-15 phút
- Script có delay để tránh quá tải server

### 2. Tránh trùng lặp
- Script sẽ bỏ qua nếu đã tồn tại (HTTP 409)
- An toàn để chạy nhiều lần

### 3. Tùy chỉnh số lượng
Sửa trong `CONFIG`:
```javascript
const CONFIG = {
  MIN_FAVORITES_PER_USER: 3,   // Tối thiểu
  MAX_FAVORITES_PER_USER: 15,  // Tối đa
  MIN_RATINGS_PER_USER: 5,
  MAX_RATINGS_PER_USER: 20,
  MIN_HISTORY_PER_USER: 10,
  MAX_HISTORY_PER_USER: 30,
};
```

### 4. Phân phối dữ liệu
- **Realistic**: Dữ liệu theo phân phối thực tế
- **Diverse**: Mỗi user có sở thích khác nhau
- **Natural**: Comments tự nhiên bằng tiếng Việt

## Troubleshooting

### Lỗi: "Không thể login user"
- Kiểm tra password của users trong database
- Sửa hàm `loginUser()` với password đúng

### Lỗi: "Không có users hoặc books"
- Chạy script upload books trước
- Tạo users qua registration

### Lỗi: Connection timeout
- Tăng delay giữa các request
- Kiểm tra backend có đang chạy không

## Export dữ liệu để huấn luyện

Sau khi sinh xong, bạn có thể export dữ liệu:

```sql
-- Export Ratings
SELECT user_id, book_id, rating_value, comment, created_at 
FROM ratings 
ORDER BY created_at;

-- Export Favorites
SELECT user_id, book_id, added_at 
FROM favorites 
ORDER BY added_at;

-- Export Reading History
SELECT user_id, book_id, progress, last_read_at 
FROM reading_history 
ORDER BY last_read_at;
```

## Sử dụng cho ML/AI

Dữ liệu này phù hợp cho:

1. **Collaborative Filtering**
   - User-based: Tìm users tương tự
   - Item-based: Tìm sách tương tự

2. **Matrix Factorization**
   - SVD (Singular Value Decomposition)
   - ALS (Alternating Least Squares)

3. **Content-based**
   - Dựa trên thể loại, tác giả
   - TF-IDF trên description

4. **Hybrid Models**
   - Kết hợp nhiều phương pháp
   - Deep Learning (Neural Collaborative Filtering)
