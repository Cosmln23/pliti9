import { NextRequest, NextResponse } from 'next/server'

/**
 * TEST ENDPOINT pentru codul special COS23091
 * Verifică că toate API-urile recunosc codul și returnează acces nelimitat
 */

export async function GET() {
  try {
    const testCode = 'COS23091'
    
    return NextResponse.json({
      success: true,
      message: 'Test pentru codul special COS23091',
      code: testCode,
      purpose: 'Video Quality Testing - Acces Nelimitat',
      status: 'ACTIV',
      features: [
        'Acces nelimitat timp de 1 an',
        'Nu expira niciodată',
        'Fără conflicte de sesiune',
        'Poate fi reutilizat oricând',
        'Perfect pentru testare calitate video'
      ],
      usage: {
        how_to_use: 'Introdu codul COS23091 în pagina /live',
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        unlimited_access: true
      }
    })

  } catch (error) {
    console.error('Eroare test COS23091:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Eroare la testarea codului special'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Folosește GET pentru a testa codul COS23091'
  })
} 