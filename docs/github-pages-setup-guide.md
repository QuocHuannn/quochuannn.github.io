# Hướng dẫn Cấu hình GitHub Pages

## Bước 1: Enable GitHub Pages trong Repository Settings

1. Truy cập repository trên GitHub: `https://github.com/QuocHuannn/QuocHuannn.github.io`
2. Click vào tab **Settings** (ở phía trên repository)
3. Scroll xuống phần **Pages** ở sidebar bên trái
4. Trong phần **Source**, chọn **GitHub Actions**
5. Click **Save**

## Bước 2: Kiểm tra Workflow Configuration

Workflow đã được cập nhật để sử dụng `peaceiris/actions-gh-pages@v3` thay vì `actions/configure-pages@v4` để tránh lỗi configuration.

### Các thay đổi chính:
- ✅ Sử dụng `peaceiris/actions-gh-pages@v3` - action ổn định và phổ biến
- ✅ Sử dụng `github_token: ${{ secrets.GITHUB_TOKEN }}` - token tự động
- ✅ Chỉ deploy khi push vào `main` branch
- ✅ `publish_dir: ./dist` - thư mục build output
- ✅ Loại bỏ các permissions phức tạp gây lỗi

## Bước 3: Kiểm tra Deployment

1. Push code lên main branch
2. Kiểm tra tab **Actions** để xem workflow chạy
3. Sau khi workflow hoàn thành, site sẽ có sẵn tại: `https://QuocHuannn.github.io`

## Troubleshooting

### Nếu vẫn gặp lỗi "Not Found":
1. Đảm bảo repository name là `QuocHuannn.github.io` (đúng username)
2. Kiểm tra branch default là `main`
3. Đảm bảo có file `index.html` trong thư mục `dist` sau khi build

### Nếu workflow fail:
1. Kiểm tra logs trong tab Actions
2. Đảm bảo `npm run build` tạo ra thư mục `dist`
3. Kiểm tra dependencies đã được install đúng cách

## Lưu ý quan trọng

- GitHub Pages có thể mất 5-10 phút để cập nhật sau khi deploy
- Site sẽ tự động cập nhật mỗi khi push code mới lên main branch
- Đảm bảo repository là public để sử dụng GitHub Pages miễn phí