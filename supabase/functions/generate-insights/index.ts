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

    // Gerar um número aleatório para variar os insights
    const randomSeed = Math.floor(Math.random() * 100);
    const focusType = randomSeed < 25 ? 'economia' : randomSeed < 50 ? 'alertas' : randomSeed < 75 ? 'padrões' : 'previsões';

    const prompt = `Você é um assistente financeiro inteligente e empático. Analise esses dados financeiros reais e gere insights VARIADOS e DINÂMICOS focando em: ${focusType}.

📊 DADOS FINANCEIROS ATUAIS:
Saldo atual: R$ ${currentBalance.toFixed(2)}
Receitas totais: R$ ${totalIncome.toFixed(2)} (${transactions.filter(t => t.type === 'income').length} transações)
Despesas totais: R$ ${totalExpenses.toFixed(2)} (${transactions.filter(t => t.type === 'expense').length} transações)

Gastos detalhados por categoria:
${Object.entries(categoryBreakdown).map(([cat, val]) => `- ${cat}: R$ ${(val as number).toFixed(2)} (${(((val as number)/totalExpenses)*100).toFixed(1)}%)`).join('\n')}

🎯 FOCO DESTA ANÁLISE: ${focusType.toUpperCase()}

TIPOS DE INSIGHTS para variar (use ${focusType} como prioridade):
1. ECONOMIA: "Você pode economizar R$X reduzindo Y em Z%"
2. ALERTAS: "⚠️ Gastos com X representam Y% do total, acima do recomendado"
3. PADRÕES: "✅ Parabéns! Você manteve gastos com X abaixo de R$Y"
4. PREVISÕES: "No ritmo atual, você terá R$X até o final do mês"
5. COMPARAÇÕES: "Gastos com X são 2x maiores que gastos com Y"
6. OPORTUNIDADES: "Redirecione R$X de Y para economia"

Retorne APENAS JSON válido (sem markdown):
{
  "healthScore": número 0-100 calculado como ((totalIncome - totalExpenses) / totalIncome * 100),
  "status": "excellent" (score >80) | "good" (60-80) | "warning" (40-60) | "danger" (<40),
  "insights": [
    "3-5 insights DIFERENTES usando dados reais",
    "Priorize tipo ${focusType} mas varie os outros",
    "Use números específicos das transações",
    "Seja empático e motivador"
  ],
  "categoryAnalysis": [
    {
      "category": "nome real da categoria dos dados",
      "percentage": porcentagem exata do total de despesas,
      "status": "safe" (<30% do total) | "attention" (30-50%) | "danger" (>50%)
    }
  ],
  "recommendations": [
    "2-4 ações PRÁTICAS E ESPECÍFICAS",
    "Exemplo: 'Reduza gastos com Alimentação em 15% (economizaria R$X/mês)'",
    "Seja direto e acionável"
  ]
}

IMPORTANTE: Varie os insights em CADA geração. Use os números REAIS. Seja específico e empático.`;

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
