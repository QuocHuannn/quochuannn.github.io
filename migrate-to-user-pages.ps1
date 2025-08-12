# Script PowerShell de migrate sang GitHub Pages User Site
# Chay script nay sau khi da tao repository quochuannn.github.io tren GitHub

Write-Host "=== GitHub Pages User Site Migration Script ===" -ForegroundColor Green
Write-Host ""

# Kiem tra Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git khong duoc cai dat. Vui long cai dat Git truoc." -ForegroundColor Red
    exit 1
}

# Kiem tra repository hien tai
$currentRepo = git remote get-url origin 2>$null
if ($currentRepo -match "MyPortfolio") {
    Write-Host "Dang o repository MyPortfolio" -ForegroundColor Green
} else {
    Write-Host "Khong phai repository MyPortfolio. Vui long chay script trong folder MyPortfolio." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Cac buoc se thuc hien:" -ForegroundColor Cyan
Write-Host "1. Backup repository hien tai"
Write-Host "2. Thay doi remote URL sang quochuannn.github.io"
Write-Host "3. Cap nhat workflow file"
Write-Host "4. Push len repository moi"
Write-Host ""

$confirm = Read-Host "Ban co muon tiep tuc? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Huy bo migration." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Bat dau migration..." -ForegroundColor Yellow

try {
    # Buoc 1: Backup
    Write-Host "Tao backup..." -ForegroundColor Blue
    $backupPath = "../MyPortfolio-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -Path "." -Destination $backupPath -Recurse -Force
    Write-Host "Backup tao tai: $backupPath" -ForegroundColor Green
    
    # Buoc 2: Thay doi remote URL
    Write-Host "Thay doi remote URL..." -ForegroundColor Blue
    git remote set-url origin https://github.com/quochuannn/quochuannn.github.io.git
    Write-Host "Remote URL da duoc cap nhat" -ForegroundColor Green
    
    # Buoc 3: Cap nhat workflow
    Write-Host "Cap nhat GitHub Actions workflow..." -ForegroundColor Blue
    
    # Tao thu muc .github/workflows neu chua co
    if (-not (Test-Path ".github/workflows")) {
        New-Item -ItemType Directory -Path ".github/workflows" -Force | Out-Null
    }
    
    # Copy workflow moi
    if (Test-Path "deploy-user-pages.yml") {
        Copy-Item "deploy-user-pages.yml" ".github/workflows/deploy.yml" -Force
        Write-Host "Workflow da duoc cap nhat" -ForegroundColor Green
    } else {
        Write-Host "File deploy-user-pages.yml khong tim thay" -ForegroundColor Yellow
    }
    
    # Buoc 4: Cap nhat vite.config.ts
    Write-Host "Cap nhat Vite config..." -ForegroundColor Blue
    $viteConfigContent = Get-Content "vite.config.ts" -Raw
    $newViteConfig = $viteConfigContent -replace 'base: "/MyPortfolio/"', 'base: "/"'
    $newViteConfig = $newViteConfig -replace "base: '/MyPortfolio/'", "base: '/'"
    Set-Content "vite.config.ts" $newViteConfig
    Write-Host "Vite config da duoc cap nhat" -ForegroundColor Green
    
    # Buoc 5: Commit va push
    Write-Host "Commit va push changes..." -ForegroundColor Blue
    
    # Doi ten branch thanh main neu can
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        git branch -M main
        Write-Host "Branch da duoc doi ten thanh 'main'" -ForegroundColor Green
    }
    
    # Add va commit
    git add .
    git commit -m "Migrate to GitHub Pages User Site - Update workflow for user pages deployment - Set base URL to '/' for root domain - Configure for quochuannn.github.io deployment"
    
    # Push
    git push -u origin main --force
    
    Write-Host "" 
    Write-Host "Migration hoan thanh thanh cong!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Cac buoc tiep theo:" -ForegroundColor Cyan
    Write-Host "1. Vao https://github.com/quochuannn/quochuannn.github.io"
    Write-Host "2. Kiem tra tab Actions de xem workflow chay"
    Write-Host "3. Vao Settings > Pages > Source: GitHub Actions"
    Write-Host "4. Doi 5-10 phut va truy cap https://quochuannn.github.io"
    Write-Host ""
    Write-Host "Backup duoc luu tai: $backupPath" -ForegroundColor Yellow
    
} catch {
    Write-Host "Loi trong qua trinh migration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Ban co the khoi phuc tu backup neu can." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Chuc mung! Portfolio cua ban se som co mat tai https://quochuannn.github.io" -ForegroundColor Green