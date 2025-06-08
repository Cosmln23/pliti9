# Test Make.com Webhooks Direct
Write-Host "=== TESTARE WEBHOOK-URI MAKE.COM ===" -ForegroundColor Green

# Test Email Webhook
Write-Host "`n📧 TESTING EMAIL WEBHOOK..." -ForegroundColor Yellow
$emailWebhook = "https://hook.eu2.make.com/4w78i9a1ckym4d0f2r6vg5pxbsqz3t7n"

$emailPayload = @{
    email = "test@example.com"
    accessCode = "PARA123456TEST"
    amount = 25
    phoneNumber = "+40712345678"
    expiresAt = "2025-01-20T06:00:00.000Z"
    liveUrl = "https://www.plipli9.com/live"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

try {
    $emailResponse = Invoke-RestMethod -Uri $emailWebhook -Method POST -Body $emailPayload -ContentType "application/json" -TimeoutSec 15
    Write-Host "✅ EMAIL WEBHOOK SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $emailResponse" -ForegroundColor Cyan
} catch {
    Write-Host "❌ EMAIL WEBHOOK FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Test WhatsApp Webhook
Write-Host "`n📱 TESTING WHATSAPP WEBHOOK..." -ForegroundColor Yellow
$whatsappWebhook = "https://hook.eu2.make.com/ida0ge74962m4ske2bw78ywj9szu54ie"

$whatsappPayload = @{
    phoneNumber = "+40712345678"
    message = "🎭 TEST PARANORMAL ACCESS! Codul tau: PARA123456TEST"
    accessCode = "PARA123456TEST"
} | ConvertTo-Json

try {
    $whatsappResponse = Invoke-RestMethod -Uri $whatsappWebhook -Method POST -Body $whatsappPayload -ContentType "application/json" -TimeoutSec 15
    Write-Host "✅ WHATSAPP WEBHOOK SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $whatsappResponse" -ForegroundColor Cyan
} catch {
    Write-Host "❌ WHATSAPP WEBHOOK FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 TESTARE COMPLETĂ!" -ForegroundColor Green
Write-Host "Verifică Make.com scenarios pentru execuții noi..." -ForegroundColor Cyan 