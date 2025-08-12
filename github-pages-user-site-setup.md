# Hướng dẫn thiết lập GitHub Pages User Site

## Vấn đề hiện tại

Website không hiển thị tại `https://quochuannn.github.io/` vì đang sử dụng **Project Pages** thay vì **User Pages**.

## Sự khác biệt giữa User Pages và Project Pages

### 🏠 User Pages (Personal/Organization Pages)
- **URL**: `https://username.github.io/`
- **Repository name**: Phải là `username.github.io` (ví dụ: `quochuannn.github.io`)
- **Deploy branch**: `main` hoặc `master`
- **Mục đích**: Website chính của user/organization
- **Giới hạn**: Mỗi user chỉ có 1 user site

### 📁 Project Pages
- **URL**: `https://username.github.io/repository-name/`
- **Repository name**: Bất kỳ tên nào (ví dụ: `MyPortfolio`)
- **Deploy branch**: `gh-pages` hoặc `main` với GitHub Actions
- **Mục đích**: Website cho từng project cụ thể
- **Giới hạn**: Không giới hạn số lượng

## Tại sao hiện tại không hoạt động?

1. **Repository hiện tại**: `MyPortfolio` → Đây là Project Pages
2. **URL mong muốn**: `https://quochuannn.github.io/` → Cần User Pages
3. **Cấu hình hiện tại**: Deploy lên `gh-pages` branch của repository `MyPortfolio`
4. **Cấu hình cần thiết**: Deploy lên `main` branch của repository `quochuannn.github.io`

## Giải pháp: Tạo User Pages Repository

### Bước 1: Tạo repository mới

1. Truy cập [GitHub](https://github.com/new)
2. **Repository name**: `quochuannn.github.io` (chính xác tên này)
3. **Visibility**: Public (bắt buộc cho GitHub Pages miễn phí)
4. **Initialize**: Không check các option (để trống)
5. Click **Create repository**

### Bước 2: Cập nhật GitHub Actions Workflow

Tạo file `.github/workflows/deploy.yml` mới:

```yaml
name: Deploy to GitHub Pages User Site

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci --force --legacy-peer-deps
    
    - name: Build
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v4
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Bước 3: Cập nhật Vite Config

Trong `vite.config.ts`, đảm bảo base URL là `/`:

```typescript
export default defineConfig(({ mode }) => {
  return {
    base: '/', // Cho user pages
    // ... rest of config
  }
})
```

### Bước 4: Chuyển code sang repository mới

#### Option A: Clone và push (Khuyến nghị)

```bash
# 1. Clone repository mới
git clone https://github.com/quochuannn/quochuannn.github.io.git
cd quochuannn.github.io

# 2. Copy tất cả file từ MyPortfolio (trừ .git folder)
# Sao chép thủ công hoặc dùng lệnh:
cp -r ../MyPortfolio/* . 
cp -r ../MyPortfolio/.github .
cp ../MyPortfolio/.gitignore .

# 3. Add và commit
git add .
git commit -m "Initial commit: Portfolio website"

# 4. Push lên main branch
git push origin main
```

#### Option B: Change remote URL

```bash
# Trong folder MyPortfolio hiện tại
git remote set-url origin https://github.com/quochuannn/quochuannn.github.io.git
git branch -M main
git push -u origin main
```

### Bước 5: Cấu hình GitHub Pages

1. Vào repository `quochuannn.github.io`
2. **Settings** → **Pages**
3. **Source**: GitHub Actions
4. Workflow sẽ tự động chạy khi push code

### Bước 6: Kiểm tra deployment

1. Vào tab **Actions** để xem workflow chạy
2. Sau khi hoàn thành, truy cập `https://quochuannn.github.io/`
3. Website sẽ hiển thị trong vòng 5-10 phút

## Lưu ý quan trọng

- ✅ Repository name phải chính xác: `quochuannn.github.io`
- ✅ Deploy lên `main` branch, không phải `gh-pages`
- ✅ Base URL trong Vite config phải là `/`
- ✅ Repository phải là Public
- ✅ Sử dụng GitHub Actions để build và deploy

## Sau khi hoàn thành

- Repository `MyPortfolio` có thể xóa hoặc giữ lại cho mục đích khác
- Website sẽ có URL: `https://quochuannn.github.io/`
- Mọi thay đổi push lên `main` branch sẽ tự động deploy

---

**Tóm tắt**: Để có website tại `quochuannn.github.io`, bạn cần tạo repository mới tên `quochuannn.github.io` và deploy lên `main` branch thay vì sử dụng project pages.