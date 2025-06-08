Write-Host "=== TEST DIRECT TWILIO API ===" -ForegroundColor Yellow

# Twilio credentials (replace with real ones)
$accountSid = "ACyouraccountsidhere"
$authToken = "yourauthtoken"
$fromNumber = "+12567954236"  # Your Twilio number
$toNumber = "+40793608454"    # Your Romanian number

# Create basic auth header
$base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${accountSid}:${authToken}"))
$headers = @{
    "Authorization" = "Basic $base64"
    "Content-Type" = "application/x-www-form-urlencoded"
}

# Message body
$body = @{
    "From" = $fromNumber
    "To" = $toNumber
    "Body" = "TEST DIRECT TWILIO - Mesaj trimis direct prin API fara Make.com! Daca primesti asta, Make.com e problema!"
}

# Convert to URL encoded format
$bodyString = ($body.GetEnumerator() | ForEach-Object { "$($_.Key)=$([System.Web.HttpUtility]::UrlEncode($_.Value))" }) -join "&"

try {
    Write-Host "Trimit mesaj direct prin Twilio API..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$accountSid/Messages.json" -Method POST -Headers $headers -Body $bodyString
    
    Write-Host "✅ SUCCES! Mesaj trimis direct!" -ForegroundColor Green
    Write-Host "Message SID: $($response.sid)" -ForegroundColor Yellow
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "To: $($response.to)" -ForegroundColor White
    Write-Host "From: $($response.from)" -ForegroundColor White
    
} catch {
    Write-Host "❌ EROARE la trimitere directa:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Detailed error analysis
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Detalii eroare:" -ForegroundColor Yellow
        Write-Host $errorBody -ForegroundColor Red
    }
}

Write-Host "`n=== CONCLUZIE ===" -ForegroundColor Magenta
Write-Host "Daca merge direct dar nu prin Make.com = problema e la Make.com" -ForegroundColor White
Write-Host "Daca nu merge nici direct = problema e la Twilio account" -ForegroundColor White 