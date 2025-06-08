$body = @{
    streamId = "plipli9-paranormal-live"
    username = "PLIPLI9"
    message = "👻 Salut! Test din PowerShell - sistemul merge perfect!"
    isStreamer = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat/send" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ MESAJ TRIMIS CU SUCCES!" -ForegroundColor Green
    Write-Host "📱 Mesajul tau apare acum in chat si pe Twitch!" -ForegroundColor Cyan
} catch {
    Write-Host "❌ EROARE:" $_.Exception.Message -ForegroundColor Red
} 