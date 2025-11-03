# 📊 Online Learning Integration Guide

## Tổng quan

Hệ thống đã được tích hợp **Online Learning** với Recommendation System (RS) để cải thiện chất lượng gợi ý theo thời gian thực dựa trên hành vi người dùng.

## 🎯 Các sự kiện được theo dõi

### 1. **View Event** (Xem/Đọc sách)
- **Khi nào**: Người dùng bắt đầu đọc sách
- **Nơi trigger**: `BookReader.jsx` - Khi EPUB được load thành công
- **Strength**: 1.0 (implicit signal)
- **Code**:
  ```javascript
  sendFeedback(user.id, bookId, 'view');
  ```

### 2. **Favorite Event** (Thêm yêu thích)
- **Khi nào**: Người dùng thêm sách vào danh sách yêu thích
- **Nơi trigger**: `BookDetail.jsx` - Khi click nút favorite
- **Strength**: 5.0 (strong positive signal)
- **Code**:
  ```javascript
  sendFeedback(user.id, bookId, 'favorite');
  ```

### 3. **Rate Event** (Đánh giá sách)
- **Khi nào**: Người dùng gửi đánh giá với rating 1-5 sao
- **Nơi trigger**: `BookDetail.jsx` - Khi submit review form
- **Strength**: 1.0 - 5.0 (explicit rating value)
- **Code**:
  ```javascript
  sendFeedback(user.id, bookId, 'rate', rating); // rating: 1-5
  ```

## 📁 File Structure

```
src/
├── utils/
│   └── feedbackHelper.js          # Helper utility cho feedback
├── services/
│   └── recommendationService.js   # API service layer
└── pages/
    ├── BookDetail.jsx             # Rating & Favorite feedback
    └── BookReader/
        └── BookReader.jsx         # View feedback
```

## 🔧 API Endpoints

### Backend RS API (http://localhost:8001/api/v1)

```javascript
POST /feedback
{
  "user_id": 123,
  "book_id": 456,
  "event": "view|favorite|rate",
  "rating_value": 1-5  // required for 'rate', optional for others
}

Response:
{
  "status": "recorded",
  "online_learning": true,
  "buffer_triggered_update": false,
  "buffer_status": {
    "enabled": true,
    "buffer_size": 45,
    "buffer_capacity": 100,
    "buffer_full": false
  }
}
```

### Online Learning Status
```javascript
GET /online-learning/status
Response:
{
  "enabled": true,
  "buffer_size": 45,
  "buffer_capacity": 100,
  "buffer_full": false,
  "note": "SBERT profiles will update incrementally"
}
```

## 💡 Usage Examples

### Trong component

```javascript
import { sendFeedback } from '../utils/feedbackHelper';

// View event
sendFeedback(userId, bookId, 'view');

// Favorite event
sendFeedback(userId, bookId, 'favorite');

// Rate event
sendFeedback(userId, bookId, 'rate', 4); // rating: 1-5
```

### Batch feedback (nếu cần)

```javascript
import { sendBatchFeedback } from '../utils/feedbackHelper';

const feedbacks = [
  { userId: 1, bookId: 101, event: 'view' },
  { userId: 1, bookId: 102, event: 'favorite' },
  { userId: 1, bookId: 103, event: 'rate', ratingValue: 5 }
];

const { success, failed } = await sendBatchFeedback(feedbacks);
console.log(`${success} succeeded, ${failed} failed`);
```

## ⚙️ Online Learning Configuration

### Bật/Tắt Online Learning

Vào trang **Admin > Hệ thống gợi ý > Tab "Online Learning"**:

1. **Enable/Disable**: Toggle switch
2. **Buffer Size**: 10-1000 (số lượng tương tác trước khi trigger update)
3. **Trigger Update**: Cập nhật khi buffer đầy
4. **Force Update Now**: Cập nhật ngay lập tức

### Buffer Management

- **Buffer Size**: Số lượng tương tác tích lũy trước khi trigger update tự động
- **Buffer Full**: Khi đạt capacity, tự động trigger incremental update
- **SBERT Only**: Chỉ SBERT user profiles được cập nhật incrementally
- **ALS Model**: Cần **Retrain Toàn Bộ** để cập nhật

## 📊 Logging & Debugging

### Console Logs

Feedback thành công:
```
📊 RS Feedback: ⭐ Rating | User: 123 | Book: 456 | Rating: 5
   └─ Online Learning: ✅ Active
   └─ Buffer: 45/100 🟢
```

Buffer đầy:
```
📊 RS Feedback: 👁️ View | User: 789 | Book: 101
   └─ Online Learning: ✅ Active
   └─ Buffer: 100/100 🔴 FULL
```

Lỗi (non-critical):
```
Failed to send feedback to RS (non-critical): Network Error
```

## 🔒 Error Handling

**feedbackHelper.js** xử lý lỗi gracefully:
- ✅ Không throw exception lên caller
- ✅ Log warnings thay vì errors
- ✅ Return boolean: `true` = success, `false` = failed
- ✅ Không làm gián đoạn main flow (rating, favorite, đọc sách)

```javascript
// Main flow không bị ảnh hưởng nếu RS down
await addFavorite(user.id, bookId);
sendFeedback(user.id, bookId, 'favorite'); // Fire and forget
message.success('Đã thêm vào yêu thích');
```

## 🚀 Best Practices

### 1. Fire and Forget
```javascript
// ✅ GOOD: Không await feedback (non-blocking)
sendFeedback(userId, bookId, 'view');

// ❌ BAD: Await feedback (blocking main flow)
await sendFeedback(userId, bookId, 'view');
```

### 2. Validate Inputs
```javascript
// ✅ GOOD: Check user authenticated before sending
if (user?.id && bookId) {
  sendFeedback(user.id, bookId, 'view');
}

// ❌ BAD: Send without validation
sendFeedback(user.id, bookId, 'view'); // user.id might be undefined
```

### 3. Use Correct Event Types
```javascript
// ✅ GOOD: Use appropriate event for action
sendFeedback(userId, bookId, 'rate', 5);    // For ratings
sendFeedback(userId, bookId, 'favorite');   // For favorites
sendFeedback(userId, bookId, 'view');       // For reading

// ❌ BAD: Wrong event type
sendFeedback(userId, bookId, 'like');       // Invalid event
```

## 📈 Monitoring

### Admin Dashboard

Vào **Admin > Hệ thống gợi ý** để xem:

1. **Buffer Status**: 
   - Current size / Capacity
   - Progress bar (đỏ khi đầy)
   
2. **Model Info**:
   - ALS: Users, Items, Matrix density
   - SBERT: Books, User profiles, Embedding dim
   
3. **Online Learning Controls**:
   - Enable/Disable
   - Buffer configuration
   - Trigger/Force update

### Browser Console

Check console logs để theo dõi feedback:
```javascript
// Filter logs
// Chrome DevTools > Console > Filter: "RS Feedback"
```

## 🔄 Workflow

```
User Action (View/Favorite/Rate)
    ↓
sendFeedback() helper
    ↓
POST /feedback to RS API
    ↓
RS adds to buffer
    ↓
Buffer full? 
    ├─ Yes → Auto trigger incremental update (SBERT only)
    └─ No  → Wait for more interactions
```

## ⚠️ Important Notes

1. **Online Learning chỉ cập nhật SBERT user profiles**, không cập nhật ALS model
2. Để cập nhật ALS model, cần **Retrain Toàn Bộ**
3. Feedback là **non-blocking** - không làm chậm UI
4. RS server phải chạy ở `http://localhost:8001`
5. Nếu RS down, feedback sẽ thất bại nhưng app vẫn hoạt động bình thường

## 🛠️ Troubleshooting

### Feedback không được gửi?

1. **Check RS server**: `http://localhost:8001/api/v1/health`
2. **Check console logs**: Tìm error messages
3. **Check user authenticated**: `user?.id` phải tồn tại
4. **Check bookId valid**: bookId phải là số hợp lệ

### Buffer không update?

1. **Check Online Learning enabled**: Admin > Online Learning tab > Toggle ON
2. **Check buffer size**: Có thể buffer chưa đầy
3. **Force update**: Dùng "Force Update Now" button

### Model không cải thiện?

1. **ALS model**: Cần **Retrain Toàn Bộ** (Online Learning không update ALS)
2. **SBERT model**: Đợi buffer đầy hoặc force update
3. **Thiếu dữ liệu**: Cần đủ số lượng tương tác mới

## 📚 References

- [Backend RS API](http://localhost:8001/docs) - FastAPI Swagger docs
- [Admin Dashboard](http://localhost:5173/admin/recommendation) - Frontend admin
- [recommendationService.js](src/services/recommendationService.js) - API service
- [feedbackHelper.js](src/utils/feedbackHelper.js) - Helper utility
