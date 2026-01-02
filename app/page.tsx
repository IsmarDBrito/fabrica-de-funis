'use client' // Importante para usar localStorage e interatividade

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

  // 1. Lógica do Session ID: Roda assim que o cliente abre a página
  useEffect(() => {
    let id = localStorage.getItem('chat_session_id');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('chat_session_id', id);
    }
    setSessionId(id);
  }, []);

  // 2. Função para enviar mensagem para o n8n via sua API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          sessionId: sessionId // Enviando o ID para o n8n separar a memória
        }),
      });

      const data = await response.json();
      // Assume que o n8n retorna { output: "resposta" }
      setMessages(prev => [...prev, { role: 'assistant', content: data.output || "Erro na resposta" }]);
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex h-[80vh] w-full max-w-3xl flex-col items-center justify-between rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        
        {/* Header com Logo */}
        <div className="w-full p-6 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-800">
          <Image className="dark:invert" src="/next.svg" alt="Next.js" width={80} height={16} />
          <span className="text-xs text-zinc-400 font-mono">ID: {sessionId.substring(0, 15)}...</span>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 w-full overflow-y-auto p-6 flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-center text-zinc-500 mt-10">Olá Ismar! Pergunte algo para a sua IA.</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-zinc-200 dark:bg-zinc-700 self-start'}`}>
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input de Texto */}
        <div className="w-full p-4 border-t flex gap-2">
          <input 
            className="flex-1 p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={sendMessage} className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-lg font-medium">
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}