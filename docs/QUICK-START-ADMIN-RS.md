# 🚀 Quick Start - Admin Recommendation System

## ⚡ TL;DR

1. **Đăng nhập Admin** → Vào `/admin/recommendation`
2. **Xem Model Info** → Check metrics & status
3. **Retrain Model** (nếu cần) → Click "Retrain Model" → Đợi 2-5 phút
4. **Done!** Model mới đã sẵn sàng

---

## 📦 Prerequisites

### Backend RS phải đang chạy:

```bash
# Terminal 1: Start RS backend
cd recommendation-system
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend phải đang chạy:

```bash
# Terminal 2: Start frontend
cd book-recommendation-frontend
npm run dev
```

### Database phải có dữ liệu:

```sql
-- Kiểm tra nhanh
SELECT COUNT(*) FROM users;      -- Cần >= 10
SELECT COUNT(*) FROM books;      -- Cần >= 50
SELECT COUNT(*) FROM favorites;  -- Cần >= 30
SELECT COUNT(*) FROM ratings;    -- Cần >= 50
SELECT COUNT(*) FROM reading_history; -- Cần >= 100
```

---

## 🎯 Quick Actions

### ✅ Xem Model Info

```
URL: http://localhost:3000/admin/recommendation
```

Metrics hiển thị:
- **Hybrid Alpha**: 0.70 (70% CF + 30% Content)
- **CF Users**: 15 users
- **Content Books**: 255 books
- **Matrix Density**: 0.15%

### 🔄 Retrain Model

**Khi nào?**
- Có ≥100 tương tác mới
- Thêm ≥50 sách mới
- Định kỳ mỗi tuần

**Cách làm:**
```
1. Click "Retrain Model"
2. Confirm popup
3. Đợi 2-5 phút
4. ✅ Done!
```

**Theo dõi:**
- Status: "Đang retrain..."
- Progress bar màu xanh
- Auto refresh mỗi 3s

---

## 🔍 Health Check

### Test API trực tiếp:

```bash
# Health
curl http://localhost:8001/api/v1/health

# Model Info
curl http://localhost:8001/api/v1/model/info

# Trigger Retrain (POST)
curl -X POST http://localhost:8001/api/v1/retrain
```

---

## 🐛 Common Issues

### Issue: "Model chưa được load"

**Fix:**
```bash
# Train lần đầu
cd recommendation-system
python scripts/train.py

# Hoặc click "Retrain Model" trong UI
```

### Issue: API connection error

**Fix:**
```bash
# Check RS backend
curl http://localhost:8001/api/v1/health

# Restart nếu cần
cd recommendation-system
python -m uvicorn src.main:app --port 8001 --reload
```

### Issue: Retrain failed

**Fix:**
```bash
# Check logs
tail -f recommendation-system/logs/app.log

# Check database có đủ dữ liệu
psql -U postgres -d bookdb -c "SELECT COUNT(*) FROM favorites;"
```

---

## 📊 Understanding Metrics

### Hybrid Alpha (0.0 - 1.0)
- **0.7**: 70% dựa trên hành vi user, 30% dựa trên nội dung sách
- **Higher**: Ưu tiên CF → Better cho personalization
- **Lower**: Ưu tiên Content → Better cho cold start

### Matrix Density
- **0.1-1%**: Bình thường (sparse matrix)
- **< 0.05%**: Cần thêm dữ liệu tương tác
- **> 2%**: Tuyệt vời! Nhiều tương tác

### CF Users vs Content Books
- **CF Users**: Số users đã có ≥1 tương tác
- **Content Books**: Tất cả sách trong DB (kể cả chưa ai đọc)

---

## 🎨 Screenshots

### Dashboard Overview:
```
┌─────────────────────────────────────────────────────┐
│  🤖 Recommendation System Management                │
│  ────────────────────────────────────────────────   │
│  [✓ Hoạt động bình thường]     [🔄 Retrain Model]   │
├─────────────────────────────────────────────────────┤
│  Hybrid Alpha    Status        CF Users   Content   │
│     0.70         Loaded          15         255     │
├─────────────────────────────────────────────────────┤
│  📊 Collaborative Filtering Model                   │
│  Users: 15  │  Items: 255  │  Matrix: 387 (0.15%)  │
├─────────────────────────────────────────────────────┤
│  📚 Content-Based Model                             │
│  Books: 255  │  Features: 1024                      │
└─────────────────────────────────────────────────────┘
```

### During Retrain:
```
┌─────────────────────────────────────────────────────┐
│  ℹ️ Model đang được retrain                         │
│  [██████████░░░░░░] 60% - Huấn luyện CF model...    │
│  Tự động cập nhật mỗi 3 giây                        │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Notes

**⚠️ PRODUCTION:**
- Add JWT authentication cho `/retrain` endpoint
- Add rate limiting (max 1 retrain/hour)
- Log tất cả retrain actions
- Alert admin khi retrain fail

**Current (Development):**
- Endpoint `/retrain` public (không có auth)
- Không có rate limiting
- Phù hợp cho development/testing

---

## 📝 API Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check & retrain status |
| `/model/info` | GET | Model details (CF + Content) |
| `/retrain` | POST | Trigger model retraining |
| `/recommendations` | GET | Get recommendations for user |
| `/similar` | GET | Get similar books |

---

## 🚦 Workflow

```mermaid
graph LR
    A[Login Admin] --> B[/admin/recommendation]
    B --> C{Model loaded?}
    C -->|No| D[Retrain]
    C -->|Yes| E[View Info]
    E --> F{Need update?}
    F -->|Yes| D
    F -->|No| G[Monitor]
    D --> H[Wait 2-5 min]
    H --> E
```

---

## 📚 More Info

Xem full documentation: [`docs/ADMIN-RECOMMENDATION.md`](./ADMIN-RECOMMENDATION.md)

---

**Happy Recommending! 🎯**
