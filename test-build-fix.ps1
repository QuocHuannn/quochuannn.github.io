# Script test build fix cho Rollup issue
# Mo phong cac buoc trong GitHub Actions de test local

Write-Host "Testing build fix for Rollup issue..." -ForegroundColor Yellow

# Buoc 1: Backup current state
Write-Host "Backing up current package-lock.json..." -ForegroundColor Blue
if (Test-Path "package-lock.json") {
    Copy-Item "package-lock.json" "package-lock.json.backup"
}

# Buoc 2: Clean dependencies nhu trong GitHub Actions
Write-Host "Cleaning npm cache and dependencies..." -ForegroundColor Blue
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
}
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}
npm cache clean --force

# Buoc 3: Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install --force --legacy-peer-deps

# Buoc 4: Test build
Write-Host "Testing build process..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Fix works correctly." -ForegroundColor Green
    
    # Kiem tra dist folder
    if (Test-Path "dist") {
        $distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
        Write-Host "Dist folder contains $($distFiles.Count) files" -ForegroundColor Green
    }
    
    # Cleanup backup
    if (Test-Path "package-lock.json.backup") {
        Remove-Item "package-lock.json.backup"
    }
    
    Write-Host "Test completed successfully! Ready to push to GitHub." -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Commit changes: git add . && git commit -m 'Fix Rollup build issue in GitHub Actions'" -ForegroundColor White
    Write-Host "   2. Push to trigger workflow: git push origin main" -ForegroundColor White
    Write-Host "   3. Monitor GitHub Actions at: https://github.com/quochuannn/quochuannn.github.io/actions" -ForegroundColor White
} else {
    Write-Host "Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    
    # Restore backup neu co
    if (Test-Path "package-lock.json.backup") {
        Write-Host "Restoring backup..." -ForegroundColor Yellow
        Copy-Item "package-lock.json.backup" "package-lock.json"
        Remove-Item "package-lock.json.backup"
    }
    exit 1
}