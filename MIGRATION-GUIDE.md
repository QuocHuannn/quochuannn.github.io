# 🚀 Hướng dẫn Migration sang GitHub Pages User Site

## 📋 Tóm tắt vấn đề

Website không hiển thị tại `https://quochuannn.github.io/` vì:
- Đang sử dụng **Project Pages** (`MyPortfolio` repository)
- Cần chuyển sang **User Pages** (`quochuannn.github.io` repository)

## 🎯 Giải pháp

### Option 1: Sử dụng Script Tự động (Khuyến nghị) ⚡

1. **Tạo repository mới trên GitHub:**
   - Truy cập: https://github.com/new
   - Repository name: `quochuannn.github.io` (chính xác tên này)
   - Visibility: Public
   - Không check Initialize options
   - Click "Create repository"

2. **Chạy script migration:**
   ```powershell
   # Trong PowerShell, tại folder Portfolio hiện tại
   .\migrate-to-user-pages.ps1
   ```

3. **Cấu hình GitHub Pages:**
   - Vào repository `quochuannn.github.io`
   - Settings → Pages → Source: **GitHub Actions**

4. **Kiểm tra deployment:**
   - Tab Actions để xem workflow
   - Sau 5-10 phút: https://quochuannn.github.io

### Option 2: Thực hiện thủ công 🔧

#### Bước 1: Tạo repository mới
- Repository name: `quochuannn.github.io`
- Public repository

#### Bước 2: Clone và copy code
```bash
# Clone repository mới
git clone https://github.com/quochuannn/quochuannn.github.io.git
cd quochuannn.github.io

# Copy tất cả file từ MyPortfolio
# (Thực hiện thủ công hoặc dùng lệnh copy)
```

#### Bước 3: Cập nhật workflow
- Copy nội dung từ `deploy-user-pages.yml` vào `.github/workflows/deploy.yml`

#### Bước 4: Kiểm tra Vite config
- Đảm bảo `vite.config.ts` có `base: '/'`

#### Bước 5: Push code
```bash
git add .
git commit -m "Initial commit: Portfolio for user pages"
git push origin main
```

## 📁 Files được tạo

| File | Mô tả |
|------|-------|
| `github-pages-user-site-setup.md` | Hướng dẫn chi tiết về sự khác biệt User vs Project Pages |
| `deploy-user-pages.yml` | GitHub Actions workflow cho User Pages |
| `migrate-to-user-pages.ps1` | Script PowerShell tự động migration |
| `MIGRATION-GUIDE.md` | File hướng dẫn này |

## ✅ Checklist sau khi migration

- [ ] Repository `quochuannn.github.io` đã được tạo
- [ ] Code đã được push lên main branch
- [ ] GitHub Actions workflow đã chạy thành công
- [ ] Settings → Pages → Source: GitHub Actions
- [ ] Website hiển thị tại https://quochuannn.github.io

## 🔍 Troubleshooting

### Website vẫn không hiển thị?
1. Kiểm tra tab **Actions** - workflow có lỗi không?
2. Kiểm tra **Settings → Pages** - Source đã đúng chưa?
3. Đợi 5-10 phút để DNS propagate
4. Clear browser cache và thử lại

### Workflow bị lỗi?
1. Kiểm tra `vite.config.ts` có `base: '/'`
2. Kiểm tra `package.json` có script `build`
3. Xem logs chi tiết trong tab Actions

### Repository name sai?
- Repository phải tên chính xác: `quochuannn.github.io`
- Không được có dấu gạch dưới hoặc ký tự đặc biệt

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trong GitHub Actions
2. Đảm bảo tất cả files đã được commit
3. Verify repository name và settings

---

**🎉 Sau khi hoàn thành, website sẽ có mặt tại: https://quochuannn.github.io**

*Lưu ý: Repository `MyPortfolio` cũ có thể xóa hoặc giữ lại cho mục đích khác.*