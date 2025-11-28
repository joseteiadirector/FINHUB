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

    // Gerar diferentes tipos de análise para variar os insights
    const analysisTypes = [
      { key: 'economia_oportunidades', title: 'OPORTUNIDADES DE ECONOMIA', subtitle: 'Onde você pode economizar mais' },
      { key: 'alertas_gastos', title: 'ALERTAS DE GASTOS', subtitle: 'Atenção aos gastos elevados' },
      { key: 'metas_sugeridas', title: 'METAS FINANCEIRAS', subtitle: 'Objetivos para você alcançar' },
      { key: 'comparacao_categorias', title: 'COMPARAÇÃO DE CATEGORIAS', subtitle: 'Entenda seus padrões de gasto' },
      { key: 'habitos_positivos', title: 'CONQUISTAS FINANCEIRAS', subtitle: 'Reconhecendo seus acertos' },
      { key: 'previsao_mensal', title: 'PREVISÃO FINANCEIRA', subtitle: 'Projeção para os próximos dias' },
      { key: 'dicas_categoria', title: 'DICAS INTELIGENTES', subtitle: 'Sugestões personalizadas para você' }
    ];
    const randomIndex = Math.floor(Math.random() * analysisTypes.length);
    const selectedAnalysis = analysisTypes[randomIndex];

    const prompt = `Você é um assistente financeiro criativo e empático. Analise os dados e gere uma análise DIFERENTE focada em: ${selectedAnalysis.key}.

📊 DADOS:
Saldo: R$ ${currentBalance.toFixed(2)}
Receitas: R$ ${totalIncome.toFixed(2)} 
Despesas: R$ ${totalExpenses.toFixed(2)}
Categorias: ${Object.entries(categoryBreakdown).map(([cat, val]) => `${cat}: R$ ${(val as number).toFixed(2)}`).join(', ')}

🎯 TIPO DE ANÁLISE: ${selectedAnalysis.key}
📌 TÍTULO: ${selectedAnalysis.title}

GERE INSIGHTS BASEADOS NO TIPO:

1. economia_oportunidades: "Você economizaria R$X fazendo Y" ou "Reduzindo Z em 10% = R$X/mês"
2. alertas_gastos: "⚠️ Atenção! Categoria X está Y% acima do ideal" ou "🚨 Gastos com Z ultrapassaram R$X"
3. metas_sugeridas: "Meta: Reduzir X para R$Y até fim do mês" ou "Objetivo: Economizar R$X em 30 dias"
4. comparacao_categorias: "Gastos com X são 2x maiores que Y" ou "Z custa R$X mais que W por mês"
5. habitos_positivos: "✅ Ótimo! Você gastou Y% menos em X este mês" ou "🎉 Parabéns! Economizou R$X"
6. previsao_mensal: "No ritmo atual: R$X disponível em 30 dias" ou "Projeção: -R$X até fim do mês"
7. dicas_categoria: "Dica para X: use Y para economizar Z%" ou "Em X, troque W por V = -R$Z"

Retorne APENAS JSON válido:
{
  "analysisType": "${selectedAnalysis.key}",
  "analysisTitle": "${selectedAnalysis.title}",
  "analysisSubtitle": "${selectedAnalysis.subtitle}",
  "healthScore": número 0-100 variado,
  "status": varie entre "excellent" | "good" | "warning" | "danger",
  "insights": [
    "3-5 insights CRIATIVOS do tipo ${selectedAnalysis.key}",
    "Use emojis e linguagem motivadora",
    "Seja específico com valores reais"
  ],
  "categoryAnalysis": [
    {"category": "categoria real", "percentage": valor real, "status": "safe|attention|danger"}
  ],
  "recommendations": [
    "2-4 ações PRÁTICAS tipo ${selectedAnalysis.key}",
    "Seja criativo e varie entre tipos"
  ]
}

IMPORTANTE: VARIE COMPLETAMENTE os insights baseado no tipo ${selectedAnalysis.key}. Seja criativo!`;

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
