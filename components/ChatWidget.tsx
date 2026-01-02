'use client'
import { useState } from 'react'

export default function ChatWidget({ slug }: { slug: string }) {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
  const [input, setInput] = useState('')

  async function sendMessage() {
  if (!input) return
  
  // 1. Recupera o Session ID do navegador (o crachá do cliente)
  let sessionId = localStorage.getItem('chat_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    localStorage.setItem('chat_session_id', sessionId)
  }

  const userMsg = { role: 'user', content: input }
  setMessages(prev => [...prev, userMsg])
  
  // 2. Envia para a API com o crachá (sessionId) e o mapa (slug)
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: input, 
      slug, 
      sessionId // Crucial para o Simple Memory no n8n
    })
  })
  
  const data = await res.json()
  
  // 3. Ajuste para capturar o campo 'output' ou 'reply' vindo do n8n
  const aiReply = data.output || data.reply || 'Processando...'
  setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
  setInput('')
}

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white border border-gray-300 shadow-2xl rounded-lg overflow-hidden z-50">
      {/* Cabeçalho */}
      <div className="bg-blue-600 p-3 text-white font-bold">
        Atendimento Inteligente
      </div>

      {/* Área das Mensagens */}
      <div className="h-64 overflow-y-auto p-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg text-black ${m.role === 'user' ? 'bg-blue-200' : 'bg-white border border-gray-200'}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      
      <div className="p-2 border-t border-gray-200 flex bg-white">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua dúvida..."
        />
        <button 
          onClick={sendMessage} 
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded transition-colors"
        >
          Ok
        </button>
      </div>
    </div>
  )
}