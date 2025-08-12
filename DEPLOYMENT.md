# Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Cấu hình Repository

1. Đảm bảo repository có tên `QuocHuannn.github.io` (user site) hoặc tên khác (project site)
2. Push code lên GitHub repository

## Bước 2: Cấu hình GitHub Pages

1. Vào **Settings** của repository
2. Chọn **Pages** trong sidebar
3. Trong **Source**, chọn **GitHub Actions**
4. Workflow sẽ tự động chạy khi có commit mới vào branch `main`

## Bước 3: Kiểm tra Deployment

1. Vào tab **Actions** để xem quá trình build và deploy
2. Sau khi deploy thành công, website sẽ có sẵn tại:
   - User site: `https://QuocHuannn.github.io`
   - Project site: `https://QuocHuannn.github.io/repository-name`

## Workflow Features

- ✅ Tự động build React app với Vite
- ✅ Tối ưu hóa production build
- ✅ Deploy lên GitHub Pages
- ✅ Chạy khi có push/PR vào branch main
- ✅ Sử dụng Node.js 22 và npm cache

## Troubleshooting

### Nếu deployment fail:
1. Kiểm tra logs trong tab Actions
2. Đảm bảo `npm run build` chạy thành công locally
3. Kiểm tra permissions trong Settings > Actions > General

### Nếu website không load:
1. Kiểm tra base URL trong `vite.config.ts`
2. Đảm bảo GitHub Pages được enable
3. Chờ vài phút để DNS propagate

## Commands để test locally:

```bash
# Build production
npm run build

# Preview production build
npm run preview

# Test deployment workflow
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```