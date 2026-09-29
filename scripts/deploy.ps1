# ==============================================================================
# SmartFood Rescue AI - Firebase Deployment Script
# ==============================================================================

Write-Host "🚀 SmartFood Rescue AI - Deployment Wizard" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor DarkGray

# 1. Check Firebase CLI Authentication
Write-Host "`n[1/3] Verifying Firebase CLI authentication..." -ForegroundColor Yellow
$loginCheck = npx --no-install firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Firebase is not logged in. Launching browser login..." -ForegroundColor Yellow
    npx firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login was cancelled or failed. Please run 'npm run login' manually." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase CLI authenticated successfully." -ForegroundColor Green

# 2. Build Production Bundle
Write-Host "`n[2/3] Building production assets (Vite + TypeScript)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please inspect the errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Production bundle built successfully in ./dist" -ForegroundColor Green

# 3. Deploy to Firebase Hosting & Firestore Rules
Write-Host "`n[3/3] Deploying to Firebase Hosting (smartfood-rescue-ai-25f38)..." -ForegroundColor Yellow
npx firebase deploy --only hosting,firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "🌐 Live URL: https://smartfood-rescue-ai-25f38.web.app" -ForegroundColor Cyan
    Write-Host "🌐 Fallback: https://smartfood-rescue-ai.web.app" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Full deployment encountered an issue. Trying Hosting only..." -ForegroundColor Yellow
    npx firebase deploy --only hosting
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 HOSTING DEPLOYMENT COMPLETE!" -ForegroundColor Green
        Write-Host "🌐 Live URL: https://smartfood-rescue-ai-25f38.web.app" -ForegroundColor Cyan
    }
}
