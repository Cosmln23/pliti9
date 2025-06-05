# 🎮 Twitch OAuth Token - Ghid Rapid

## Pasul 1: Creează aplicația Twitch
1. Du-te la: https://dev.twitch.tv/console/apps
2. Click "Register Your Application"
3. Completează:
   - **Name**: `plipli9-chat-bot`
   - **OAuth Redirect URLs**: `http://localhost:3000`
   - **Category**: `Chat Bot`
4. Click "Create"

## Pasul 2: Obține Client ID
1. După ce ai creat app-ul, click pe el
2. Copiază **Client ID** (îl vei folosi)

## Pasul 3: Generează OAuth Token
1. Du-te la: https://twitchtokengenerator.com/
2. Selectează **Bot Chat Token**
3. Click "Generate Token"
4. Login cu contul tău Twitch
5. Copiază **Access Token** (începe cu `oauth:`)

## Pasul 4: Testează token-ul
Du-te la: https://twitchtokengenerator.com/quick/chatbot
Pune token-ul și vezi dacă funcționează.

## ⚠️ IMPORTANT:
- **Nu împărtăși token-ul cu nimeni!**
- **Token-ul îți dă acces la contul Twitch!**
- **Păstrează-l secret!**

## 🎯 După ce ai token-ul:
Trimite-mi:
1. **Username-ul tău Twitch**
2. **Channel-ul unde vrei să apară mesajele**
3. **Confirmă că ai token-ul** (nu mi-l trimite încă!) 