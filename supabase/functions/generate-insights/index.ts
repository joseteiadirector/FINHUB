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
    const { transactions, currentBalance } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      throw new Error('Invalid transactions data');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Preparar dados para análise
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

    const prompt = `Você é um assistente financeiro pessoal especializado. Analise os seguintes dados financeiros e gere uma análise completa em JSON:

Dados:
- Saldo atual: R$ ${currentBalance.toFixed(2)}
- Total de despesas: R$ ${totalExpenses.toFixed(2)}
- Total de receitas: R$ ${totalIncome.toFixed(2)}
- Número de transações: ${transactions.length}
- Gastos por categoria: ${JSON.stringify(categoryBreakdown)}

Retorne APENAS um JSON válido seguindo EXATAMENTE esta estrutura:
{
  "healthScore": número de 0-100 (quanto maior melhor a saúde financeira),
  "status": "excellent" | "good" | "warning" | "danger",
  "insights": [
    "Insight 1 (1-2 frases)",
    "Insight 2 (1-2 frases)",
    "Insight 3 (1-2 frases)"
  ],
  "categoryAnalysis": [
    {
      "category": "nome da categoria que mais gasta",
      "percentage": número 0-100,
      "status": "safe" | "attention" | "danger"
    }
  ],
  "recommendations": [
    "Recomendação prática 1",
    "Recomendação prática 2"
  ]
}

Critérios de healthScore:
- 80-100: excellent (economizando bem, gastos controlados)
- 60-79: good (situação equilibrada)
- 40-59: warning (precisa atenção)
- 0-39: danger (situação preocupante)

Seja específico com os números reais do usuário.`;

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
              content: 'Você é um consultor financeiro que retorna APENAS JSON válido com análise financeira detalhada.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Raw AI response:', content);
    
    // Limpar markdown se existir
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const insights = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
