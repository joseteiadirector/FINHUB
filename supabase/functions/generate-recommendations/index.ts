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
    console.log("[RECOMMENDATIONS] Starting generation");
    
    const { transactions, currentBalance } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      throw new Error('Invalid transactions data');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Preparar dados
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    const prompt = `Você é um consultor financeiro pessoal. Analise os dados e gere exatamente 3 recomendações práticas e acionáveis:

Dados:
- Saldo: R$ ${currentBalance.toFixed(2)}
- Despesas totais: R$ ${totalExpenses.toFixed(2)}
- Receitas totais: R$ ${totalIncome.toFixed(2)}
- Taxa de economia: ${savingsRate.toFixed(1)}%
- Gastos por categoria: ${JSON.stringify(categoryBreakdown)}
- Total de transações: ${transactions.length}

Gere 3 recomendações seguindo EXATAMENTE este formato JSON:
{
  "recommendations": [
    {
      "title": "Título curto (máx 6 palavras)",
      "description": "Descrição específica com números reais dos dados (máx 25 palavras)",
      "impact": "high/medium/low",
      "action": "Ação específica (máx 4 palavras)"
    }
  ]
}

Regras:
- Use dados REAIS dos gastos do usuário
- Seja específico com números e percentuais
- Ações devem ser PRÁTICAS e ACIONÁVEIS
- Priorize economia e melhores hábitos financeiros
- Responda APENAS o JSON, sem texto adicional`;

    console.log("[RECOMMENDATIONS] Calling Lovable AI");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor financeiro que retorna apenas JSON válido com recomendações práticas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (response.status === 429) {
      console.error("[RECOMMENDATIONS] Rate limit exceeded");
      return new Response(
        JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em breve.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      console.error("[RECOMMENDATIONS] Payment required");
      return new Response(
        JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos para continuar.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[RECOMMENDATIONS] AI error:', response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    console.log("[RECOMMENDATIONS] Raw AI response:", content);

    // Limpar markdown se existir
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(content);
    
    console.log("[RECOMMENDATIONS] Success:", parsed);

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';
    console.error('[RECOMMENDATIONS] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
