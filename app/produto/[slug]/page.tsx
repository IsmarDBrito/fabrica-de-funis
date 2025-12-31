import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import ChatWidget from '@/components/ChatWidget'

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  // 1. Desembrulha os parâmetros da URL (obrigatório nas versões novas)
  const params = await props.params;
  const slug = params.slug;

  // 2. Busca os dados do produto no Supabase usando o slug
  const { data: product, error } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', slug)
    .single()

  // 3. Se o produto não existir no banco de dados, exibe a página 404
  if (error || !product) {
    notFound()
  }

  return (
    <div className="relative min-h-screen p-20 bg-white">
      {/* Área de Conteúdo do Produto */}
      <main className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900">{product.title}</h1>
        <p className="text-2xl mt-6 text-gray-600 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-12 p-6 bg-blue-50 border-l-8 border-blue-500 rounded-r-lg">
          <p className="text-blue-800 font-medium">
            Sessão ativa para o slug: <span className="underline font-bold">{slug}</span>
          </p>
        </div>
      </main>

      {/* 4. O Widget de Chat Inteligente (Fase 3 do Manual) */}
      {/* Passamos o slug para o chat saber sobre qual produto a IA deve falar */}
      <ChatWidget slug={slug} />
    </div>
  )
}