Entendido. O conteúdo abaixo está limpo, sem ícones, pronto para ser colado no seu arquivo README.md.

Markdown

# Fábrica de Funis - IA Sales Agent

Este projeto é um sistema automatizado de vendas que utiliza Next.js no frontend para interação com o usuário e n8n como motor de automação e inteligência artificial.

## Como Funciona
1. Frontend: Um chat interativo construído em Next.js.
2. Backend (API): Rota Next.js que encaminha mensagens para o n8n.
3. Automação (n8n): 
   - Recebe dados via Webhook.
   - Processa a inteligência com AI Agent (OpenAI).
   - Registra cada interação em tempo real no Google Sheets.
   - Retorna a resposta da IA para o chat.

## Tecnologias Utilizadas
- Next.js
- n8n (Automação de Fluxo)
- OpenAI GPT-4o-mini (Inteligência do Vendedor)
- Google Sheets API (Banco de Dados de Leads)

## Estrutura do Repositório
- /app: Código fonte do chat e rotas de API.
- /n8n-workflow: Contém o arquivo .json para importar o fluxo de automação.

## Configuração
1. Exporte seu workflow do n8n e salve na pasta /n8n-workflow.
2. Configure as variáveis de ambiente no arquivo .env (não incluso no repositório por segurança).
3. Certifique-se de que o n8n está rodando localmente na porta 5678.

---
Desenvolvido com foco em entender e resolver o desafio da automação de vendas.