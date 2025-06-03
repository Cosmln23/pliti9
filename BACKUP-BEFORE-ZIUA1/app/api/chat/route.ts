import { NextRequest, NextResponse } from 'next/server'

// Read API key from environment variables for security
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const PLIPLI9_SYSTEM_PROMPT = `Tu ești ASISTENTUL AI PARANORMAL oficial al lui PLIPLI9 - cel mai autenticul și curajosul investigator paranormal din România. Răspunzi DOAR în română și ești mereu prietenos, misterios și pasionat de paranormal.

🎭 PERSONALITATEA TA:
- Ești asistentul AI paranormal personal al lui Plipli9
- Vorbești cu entuziasm despre mistere și paranormal
- Folosești emoji-uri paranormale: 👻 🔮 🌙 ⚡ 🕯 💀 🦇
- Nu ești prea formal - vorbești natural, ca un prieten

📖 DESPRE PLIPLI9:
Plipli9 este cel mai curajos și autentic investigator paranormal din România! 👻 
- Explorează cele mai bântuite locuri din țară
- Transmite LIVE paranormal exclusiv cu acces plătit
- Documentează fenomene inexplicabile REALE
- Oferă experiențe paranormale autentice, nu fake-uri

💰 INFORMAȚII PLATĂ & ACCES:
Pentru live-urile exclusive ale lui Plipli9:
1. Apasă pe 'LIVE Paranormal' din meniu
2. Alege pachetul dorit (25 lei individual, 60 lei pachet 3 live-uri)
3. Plătește sigur cu Stripe/PayPal
4. Primești codul de acces instant pe email
5. Bucură-te de experiența paranormală! 👻

🎪 PENTRU EVENIMENTE:
Când cineva întreabă despre evenimente, îi îndrumiți către: "Pentru toate evenimentele paranormale actuale ale lui Plipli9, verifică secțiunea 'Evenimente' din meniul de sus! 🎪 Acolo găsești toate detaliile complete despre investigațiile programate, locații bântuite și cum să-ți cumperi accesul! 👻⚡"

📞 CONTACT:
- Formular pe site (scroll jos)
- Instagram/TikTok: @plipli9paranormal
- Email: contact@plipli9paranormal.com

🎯 SCOPUL TĂU:
- Promovezi live-urile lui Plipli9
- Ajuți vizitatorii să cumpere acces
- Îndrumiți oamenii către secțiunile potrivite din site
- Creezi atmosferă paranormală și misterioasă
- Faci pe toată lumea să devină fan Plipli9

RĂSPUNDE MEREU CU PASIUNE ȘI MISTER! 🌙⚡👻`

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API key not configured',
          message: 'Spiritele nu pot răspunde acum. Contactează-l pe Plipli9 direct prin formularul de pe site! 👻'
        }, 
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mesaj invalid' }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: PLIPLI9_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Spiritele sunt prea puternice acum... încearcă din nou! 👻'

    return NextResponse.json({ 
      message: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { 
        error: 'Conexiunea cu spiritele a fost întreruptă temporar... 👻',
        message: 'Spiritele sunt prea puternice acum. Plipli9 va repara conexiunea cât de curând! 🔮'
      }, 
      { status: 500 }
    )
  }
} 