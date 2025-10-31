/**
 * Script tự động upload sách từ sachvui.json lên backend
 * Sử dụng: node scripts/upload-books.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api/v1', // Thay đổi nếu cần
  BOOKS_JSON: path.join(__dirname, '../src/books_final.json'),
  EPUB_DIR: path.join(__dirname, '../src/epub'),
  PDF_DIR: path.join(__dirname, '../src/pdf'),
  IMAGE_DIR: path.join(__dirname, '../src/image'),
  // Token admin - lấy từ localStorage sau khi đăng nhập
  // Hoặc để null và nhập thủ công khi chạy script
  ADMIN_TOKEN: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpZCI6MTMsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTc2MTkyNDY4OCwiZXhwIjoxNzYxOTMxODg4LCJqdGkiOiJiNWQ1YWYwYi0wMmI5LTQ3N2QtYjVkYy01YmY5YTI5ZWYxNmYifQ.nz_g5UiQJ67JfdBOLpPCUURUgfLSAnr1Z28F5nlwN54",
};

// Đọc token từ command line argument hoặc environment variable
const token = process.env.ADMIN_TOKEN || CONFIG.ADMIN_TOKEN;

if (!token) {
  console.error('❌ Vui lòng cung cấp token admin:');
  console.error('   node scripts/upload-books.js --token YOUR_TOKEN');
  console.error('   hoặc set ADMIN_TOKEN=YOUR_TOKEN');
  process.exit(1);
}

// Đọc token từ args
const args = process.argv.slice(2);
const tokenIndex = args.indexOf('--token');
const adminToken = tokenIndex !== -1 ? args[tokenIndex + 1] : token;

// Tạo axios instance với auth
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  },
});

/**
 * Đọc file JSON
 */
function readBooksData() {
  try {
    const data = fs.readFileSync(CONFIG.BOOKS_JSON, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Không thể đọc file sachvui.json:', error.message);
    process.exit(1);
  }
}

/**
 * Tìm file trong thư mục dựa trên tên sách (title)
 */
function findFileByTitle(dir, bookTitle, extension) {
  if (!bookTitle || !fs.existsSync(dir)) {
    return null;
  }
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fileExt = path.extname(file);
      const fileNameWithoutExt = path.basename(file, fileExt);
      
      // So sánh tên file với title (normalize Unicode cho tiếng Việt)
      if (fileNameWithoutExt.normalize('NFC') === bookTitle.normalize('NFC')) {
        if (!extension || fileExt === extension) {
          return path.join(dir, file);
        }
      }
    }
  } catch (error) {
    console.error(`   ⚠️  Lỗi khi tìm file: ${error.message}`);
  }
  
  return null;
}

/**
 * Tìm ảnh bìa sách dựa trên title
 */
function findCoverImage(bookTitle) {
  if (!bookTitle || !fs.existsSync(CONFIG.IMAGE_DIR)) {
    return null;
  }
  
  // Thử các extension ảnh phổ biến
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  for (const ext of imageExtensions) {
    const imagePath = findFileByTitle(CONFIG.IMAGE_DIR, bookTitle, ext);
    if (imagePath) {
      return imagePath;
    }
  }
  
  return null;
}

/**
 * Upload một cuốn sách lên backend
 */
async function uploadBook(bookData, index, total) {
  const { title, author, publisher, category, description } = bookData;
  
  console.log(`\n📚 [${index + 1}/${total}] Đang upload: ${title}`);
  
  try {
    // Tìm file EPUB và PDF theo title
    const epubPath = findFileByTitle(CONFIG.EPUB_DIR, title, '.epub');
    const pdfPath = findFileByTitle(CONFIG.PDF_DIR, title, '.pdf');
    
    if (!epubPath && !pdfPath) {
      console.warn(`   ⚠️  Không tìm thấy file EPUB hoặc PDF. Bỏ qua.`);
      return { success: false, reason: 'No files found' };
    }
    
    // Tìm ảnh bìa theo title
    const coverImagePath = findCoverImage(title);
    if (!coverImagePath) {
      console.warn(`   ⚠️  Không tìm thấy ảnh bìa. Bỏ qua.`);
      return { success: false, reason: 'No cover image found' };
    }
    
    console.log(`   🖼️  Cover: ${path.basename(coverImagePath)}`);
    
    // Tạo FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    
    // Parse author - có thể có nhiều tác giả cách nhau bằng dấu phẩy
    const authors = author.split(',').map(a => a.trim()).filter(Boolean);
    authors.forEach(authorName => {
      formData.append('authorNames', authorName);
    });
    
    formData.append('publisher', publisher || '');
    // Genre - cần map category sang genreId
    const genreMap = {
      'Chưa phân loại': 2,
      'Công nghệ thông tin': 3,
      'Khoa học': 4,
      'Kinh dị': 5,
      'Kỹ năng sống': 6,
      'Lịch sử': 7,
      'Thiếu nhi': 8,
      'Tiểu thuyết': 9,
      'Trinh thám': 10,
      'Tài chính': 11,
      'Tâm Lý': 12,
      'Tâm linh': 13,
      // Thêm mapping khác nếu cần
    };
    const genreId = genreMap[category] || 1;
    formData.append('genreIds', genreId);
    formData.append("publicationYear", '2023'); // Năm xuất bản mặc định
    // Upload ảnh bìa (field name: 'cover' theo AdminAddbook.jsx)
    formData.append('cover', fs.createReadStream(coverImagePath), {
      filename: path.basename(coverImagePath),
      contentType: `image/${path.extname(coverImagePath).slice(1)}`,
    });
    
    // Upload EPUB file nếu có (field name: 'epubFile')
    if (epubPath) {
      console.log(`   📄 EPUB: ${path.basename(epubPath)}`);
      formData.append('epubFile', fs.createReadStream(epubPath), {
        filename: path.basename(epubPath),
        contentType: 'application/epub+zip',
      });
    }
    
    // Upload PDF file nếu có (field name: 'pdfFile')
    if (pdfPath) {
      console.log(`   📄 PDF: ${path.basename(pdfPath)}`);
      formData.append('pdfFile', fs.createReadStream(pdfPath), {
        filename: path.basename(pdfPath),
        contentType: 'application/pdf',
      });
    }
    
    // Gửi request
    const response = await api.post('/admin/books/create', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    console.log(`   ✅ Upload thành công! ID: ${response.data?.id || 'N/A'}`);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error(`   ❌ Lỗi: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Bắt đầu upload sách tự động...\n');
  
  // Đọc dữ liệu
  const books = readBooksData();
  console.log(`📖 Tìm thấy ${books.length} cuốn sách trong sachvui.json\n`);
  
  // Thống kê
  const stats = {
    total: books.length,
    success: 0,
    failed: 0,
    skipped: 0,
  };
  
  // Upload từng sách
  for (let i = 0; i < books.length; i++) {
    const result = await uploadBook(books[i], i, books.length);
    
    if (result.success) {
      stats.success++;
    } else if (result.reason === 'No files found') {
      stats.skipped++;
    } else {
      stats.failed++;
    }
    
    // Delay 1s giữa các request để tránh quá tải
    if (i < books.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Hiển thị kết quả
  console.log('\n' + '='.repeat(50));
  console.log('📊 KẾT QUẢ:');
  console.log(`   Tổng số: ${stats.total}`);
  console.log(`   ✅ Thành công: ${stats.success}`);
  console.log(`   ❌ Thất bại: ${stats.failed}`);
  console.log(`   ⚠️  Bỏ qua: ${stats.skipped}`);
  console.log('='.repeat(50));
}

// Chạy script
main().catch(error => {
  console.error('\n💥 Lỗi không xử lý được:', error);
  process.exit(1);
});
