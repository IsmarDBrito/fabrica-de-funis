import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // URL do seu Webhook local do n8n (Copiada da aba Test URL)
    const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/chat-vendas'

    // Envia os dados (mensagem e slug) para o n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: body.message,
        slug: body.slug
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao falar com o n8n')
    }

    const data = await response.json()
    
    // Devolve a resposta da IA para o ChatWidget
    return NextResponse.json({ 
      reply: data.reply || 'Estou processando sua dúvida...' 
    })

  } catch (error) {
    console.error('Erro na rota de chat:', error)
    return NextResponse.json(
      { reply: 'Ops, tive um problema técnico. Tente novamente em instantes.' },
      { status: 500 }
    )
  }
}