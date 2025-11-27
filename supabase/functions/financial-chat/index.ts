import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, transactions, currentBalance } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages data');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Preparar contexto financeiro
    const financialContext = transactions && transactions.length > 0 ? `
Contexto Financeiro do Usuário:
- Saldo atual: R$ ${currentBalance?.toFixed(2) || '0.00'}
- Total de transações: ${transactions.length}
- Despesas totais: R$ ${transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0).toFixed(2)}
- Receitas totais: R$ ${transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0).toFixed(2)}

Últimas transações:
${transactions.slice(0, 5).map((t: any) => `- ${t.title}: R$ ${t.amount.toFixed(2)} (${t.category})`).join('\n')}
` : 'Nenhuma transação disponível ainda.';

    const systemPrompt = `Você é um assistente financeiro pessoal inteligente e amigável chamado FinAssist. Seu objetivo é ajudar o usuário a gerenciar suas finanças de forma clara e acessível.

${financialContext}

Diretrizes:
- Responda em português brasileiro de forma clara e objetiva
- Use linguagem amigável e acessível
- Forneça insights práticos e acionáveis
- Seja específico ao referenciar os dados financeiros do usuário
- Evite jargões técnicos desnecessários
- Se não houver dados suficientes, seja honesto e sugira ao usuário adicionar mais transações
- Use emojis moderadamente para tornar a conversa mais amigável`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns instantes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos para continuar.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Stream the response directly to the client
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in financial-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar chat';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
