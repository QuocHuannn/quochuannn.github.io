# GitHub Pages Permission Fix Guide

## Vấn đề
Lỗi 403 Permission denied khi GitHub Actions cố gắng push lên nhánh gh-pages:
```
remote: Permission to QuocHuannn/MyPortfolio.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/QuocHuannn/MyPortfolio.git/': The requested URL returned error: 403
```

## Nguyên nhân
1. **Thiếu permissions trong workflow**: GITHUB_TOKEN cần quyền `contents: write`
2. **Cài đặt repository**: GitHub Actions có thể bị hạn chế quyền ghi
3. **GitHub Pages chưa được kích hoạt**: Repository cần được cấu hình để sử dụng GitHub Pages

## Giải pháp đã thực hiện

### 1. Đã thêm permissions vào workflow ✅
```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # Cần thiết để push lên gh-pages branch
```

### 2. Cấu hình peaceiris/actions-gh-pages@v3 ✅
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  if: github.ref == 'refs/heads/main'
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## Các bước cần kiểm tra trong Repository Settings

### Bước 1: Kiểm tra GitHub Actions Permissions
1. Vào repository trên GitHub
2. Chọn **Settings** tab
3. Trong sidebar trái, chọn **Actions** > **General**
4. Tìm section **Workflow permissions**
5. Đảm bảo chọn **Read and write permissions**
6. Tích vào **Allow GitHub Actions to create and approve pull requests**
7. Nhấn **Save**

### Bước 2: Kích hoạt GitHub Pages
1. Trong **Settings**, chọn **Pages** từ sidebar
2. Trong **Source**, chọn **Deploy from a branch**
3. Chọn branch **gh-pages** và folder **/ (root)**
4. Nhấn **Save**

### Bước 3: Kiểm tra Branch Protection Rules
1. Trong **Settings**, chọn **Branches**
2. Kiểm tra xem có branch protection rules nào cho **main** hoặc **gh-pages** không
3. Nếu có, đảm bảo GitHub Actions được phép bypass hoặc có quyền cần thiết

## Lưu ý quan trọng

- **GITHUB_TOKEN** là token tự động được tạo bởi GitHub Actions, không phải personal access token
- Token này có quyền hạn chế và cần được cấu hình permissions rõ ràng
- Với peaceiris/actions-gh-pages@v3, chỉ cần `contents: write` permission
- Lần deploy đầu tiên có thể cần chọn gh-pages branch manually trong Pages settings

## Kiểm tra sau khi cấu hình

1. Push code mới để trigger workflow
2. Kiểm tra Actions tab để xem workflow chạy thành công
3. Kiểm tra Pages settings để xem site đã được deploy
4. Truy cập URL GitHub Pages để xác nhận

## Tham khảo
- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [peaceiris/actions-gh-pages Documentation](https://github.com/peaceiris/actions-gh-pages)
- [GitHub Pages Configuration](https://docs.github.com/en/pages)