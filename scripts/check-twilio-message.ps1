Write-Host "=== VERIFIC MESAJUL BLOCAT ===" -ForegroundColor Red

# Twilio credentials
$accountSid = "ACyouraccountsidhere"  # Replace with real
$authToken = "yourauthtoken"          # Replace with real
$messageSid = "SM07b2b5f7a86472a30607ee36d6806053"  # The stuck message

# Create auth header
$base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${accountSid}:${authToken}"))
$headers = @{
    "Authorization" = "Basic $base64"
}

try {
    Write-Host "Verific status mesaj: $messageSid" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$accountSid/Messages/$messageSid.json" -Method GET -Headers $headers
    
    Write-Host "📱 STATUS MESAJ:" -ForegroundColor Yellow
    Write-Host "   SID: $($response.sid)" -ForegroundColor White
    Write-Host "   Status: $($response.status)" -ForegroundColor $(if($response.status -eq 'delivered') {'Green'} elseif($response.status -eq 'failed') {'Red'} else {'Yellow'})
    Write-Host "   To: $($response.to)" -ForegroundColor White
    Write-Host "   From: $($response.from)" -ForegroundColor White
    Write-Host "   Created: $($response.date_created)" -ForegroundColor White
    Write-Host "   Updated: $($response.date_updated)" -ForegroundColor White
    Write-Host "   Price: $($response.price) $($response.price_unit)" -ForegroundColor Green
    
    if ($response.error_code) {
        Write-Host "❌ ERROR CODE: $($response.error_code)" -ForegroundColor Red
        Write-Host "❌ ERROR MSG: $($response.error_message)" -ForegroundColor Red
    }
    
    # Status explanations
    Write-Host "`n📊 EXPLICAȚIE STATUS:" -ForegroundColor Magenta
    switch ($response.status) {
        "queued" { Write-Host "   🟡 QUEUED = Twilio încă procesează (PROBLEMA!)" -ForegroundColor Yellow }
        "sent" { Write-Host "   🟢 SENT = Trimis către operator, așteaptă confirmare" -ForegroundColor Green }
        "delivered" { Write-Host "   ✅ DELIVERED = Primit pe telefon cu succes!" -ForegroundColor Green }
        "failed" { Write-Host "   ❌ FAILED = Eroare la trimitere!" -ForegroundColor Red }
        "undelivered" { Write-Host "   🔴 UNDELIVERED = Operatorul a respins mesajul!" -ForegroundColor Red }
        default { Write-Host "   ❓ Status necunoscut: $($response.status)" -ForegroundColor Red }
    }
    
} catch {
    Write-Host "❌ EROARE la verificare:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 