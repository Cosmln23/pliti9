Write-Host "=== GENERARE MANUAL COD PENTRU CLIENTUL DE IERI ===" -ForegroundColor Red

# Pentru cazul în care webhook-ul nu a funcționat
Write-Host "1. Îmi trebuie email-ul clientului care a plătit ieri" -ForegroundColor Yellow
Write-Host "2. Îmi trebuie numărul de telefon (dacă l-a băgat)" -ForegroundColor Yellow
Write-Host "3. Generez cod manual și trimit prin sistema existentă" -ForegroundColor Green

# Example usage (replace with real data)
$clientEmail = Read-Host "Email-ul clientului de ieri"
$clientPhone = Read-Host "Numărul de telefon (sau ENTER pentru none)"

if ($clientPhone -eq "") {
    $clientPhone = "+40793608454"  # fallback
}

# Generate access code
$timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds().ToString().Substring(7)
$random = -join ((65..90) + (97..122) | Get-Random -Count 4 | ForEach-Object {[char]$_})
$accessCode = "PARA$timestamp$random"

Write-Host "✅ Cod generat: $accessCode" -ForegroundColor Green

# Prepare manual payment data
$manualPayment = @{
    stripePaymentId = "manual_recovery_$(Get-Date -Format 'yyyyMMdd')"
    email = $clientEmail
    phoneNumber = $clientPhone
    amount = 25
    accessCode = $accessCode
    status = 'completed'
    expiresAt = (Get-Date).AddDays(1).AddHours(6).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    notificationsSent = $false
    isManualRecovery = $true
    note = "Manual recovery for payment made yesterday"
} | ConvertTo-Json

Write-Host "📧 Trimit email și WhatsApp cu codul..." -ForegroundColor Cyan

try {
    # Send through notification system
    $response = Invoke-RestMethod -Uri "https://www.plipli9.com/api/notifications/send-all" -Method POST -ContentType "application/json" -Body $manualPayment
    
    if ($response.success) {
        Write-Host "✅ COD TRIMIS CU SUCCES!" -ForegroundColor Green
        Write-Host "📧 Email: $($response.results.email.success)" -ForegroundColor Cyan
        Write-Host "📱 WhatsApp: $($response.results.whatsapp.success)" -ForegroundColor Cyan
        Write-Host "🔑 Cod: $accessCode" -ForegroundColor Yellow
        
        # Save to database
        try {
            $dbResponse = Invoke-RestMethod -Uri "https://www.plipli9.com/api/database/save-payment" -Method POST -ContentType "application/json" -Body $manualPayment
            Write-Host "💾 Salvat în database!" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ Eroare la salvare în DB: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Eroare la trimitere: $($response.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Eroare la trimitere notificări: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📝 Datele pentru trimitere manuală:" -ForegroundColor Yellow
    Write-Host "Email: $clientEmail" -ForegroundColor White
    Write-Host "Telefon: $clientPhone" -ForegroundColor White
    Write-Host "Cod: $accessCode" -ForegroundColor White
}

Write-Host "`n=== INSTRUCȚIUNI PENTRU CLIENT ===" -ForegroundColor Magenta
Write-Host "Trimite următorul mesaj clientului:" -ForegroundColor White
Write-Host "---" -ForegroundColor Gray
Write-Host "🎭 Bună! Îmi pare rău pentru întârzierea cu codul de acces." -ForegroundColor White
Write-Host "Codul tău pentru LIVE Paranormal este: $accessCode" -ForegroundColor Yellow
Write-Host "Intră pe https://www.plipli9.com/live și folosește acest cod." -ForegroundColor White
Write-Host "Codul este valabil până mâine dimineață la 6:00." -ForegroundColor White
Write-Host "Mulțumesc pentru răbdare! 👻" -ForegroundColor White
Write-Host "---" -ForegroundColor Gray 