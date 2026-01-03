
import { NextResponse } from 'next/server';

// No seu arquivo de rota (API Route)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const urls = [
      'http://localhost:5678/webhook-test/chat-vendas',
      'http://localhost:5678/webhook/chat-vendas'
    ];

    let lastRes = null;

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: body.message,
            sessionId: body.sessionId,
            slug: body.slug
          })
        });

        if (res.ok) {
          const data = await res.json();
          // Se conseguirmos o JSON do n8n, retornamos imediatamente
          return NextResponse.json(data);
        }
        lastRes = res;
      } catch (err) {
        console.error(`Falha na URL ${url}:`, err);
      }
    }

    // Se chegou aqui, as duas falharam. Retornamos um erro em formato JSON
    return NextResponse.json(
      { output: 'Não consegui conectar ao servidor n8n.' },
      { status: 502 } // O status fica aqui, como segundo argumento
    );

  } catch (error) {
    console.error('Erro na rota:', error);
    return NextResponse.json(
      { output: 'Erro interno no servidor.' },
      { status: 500 } // O status fica aqui também
    );
  }
}