import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // 1. URL do seu Webhook (Verifique se é 'fabrica-de-funis' ou 'chat-vendas')
   const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/chat-vendas'

    // 2. Envia os dados incluindo o sessionId para o n8n separar a memória
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: body.message,
        sessionId: body.sessionId, // ADICIONADO: O n8n precisa disso para o Simple Memory
        slug: body.slug // Mantido caso você use para rastrear a página
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao falar com o n8n')
    }

    const data = await response.json()
    
    // 3. Devolve a resposta (Ajustado para 'output' que é o padrão do AI Agent)
    return NextResponse.json({ 
      output: data.output || data.reply || 'Estou processando sua dúvida...' 
    })

  } catch (error) {
    console.error('Erro na rota de chat:', error)
    return NextResponse.json(
      { output: 'Ops, tive um problema técnico. Tente novamente em instantes.' },
      { status: 500 }
    )
  }
}