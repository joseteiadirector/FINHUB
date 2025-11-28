import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralEmailRequest {
  recipientEmail: string;
  recipientName: string;
  referralLink: string;
  senderName: string;
  isBronzeAchievement?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, referralLink, senderName, isBronzeAchievement }: ReferralEmailRequest = await req.json();

    console.log("Sending referral email to:", recipientEmail);

    // Template para email de conquista Bronze
    const bronzeEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #FFA500;
              font-size: 32px;
              margin: 0;
              font-weight: bold;
            }
            .badge {
              text-align: center;
              font-size: 80px;
              margin: 20px 0;
            }
            .content {
              margin-bottom: 30px;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 15px;
            }
            .achievement-box {
              background: linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%);
              color: white;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              margin: 20px 0;
            }
            .achievement-box h2 {
              margin: 10px 0;
              font-size: 24px;
            }
            .share-link {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              word-break: break-all;
            }
            .footer {
              text-align: center;
              color: #888;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 FinHub</h1>
            </div>
            <div class="badge">🥉</div>
            <div class="achievement-box">
              <h2>PARABÉNS, ${recipientName}!</h2>
              <p style="margin: 0; font-size: 18px;">Você desbloqueou o Emblema Bronze!</p>
            </div>
            <div class="content">
              <p>Esta é sua primeira conquista no programa de indicações do FinHub!</p>
              <p><strong>Compartilhe seu link mágico</strong> com amigos e familiares para desbloquear mais emblemas e conquistas exclusivas:</p>
              
              <div class="share-link">
                <strong>Seu Link de Indicação:</strong><br>
                <code style="font-size: 14px;">${referralLink}</code>
              </div>

              <p style="text-align: center; margin-top: 30px;">
                <strong>🏆 Próximos Níveis:</strong><br>
                🥈 Prata - 6 indicações<br>
                🥇 Ouro - 16 indicações<br>
                💎 Platina - 31 indicações<br>
                💠 Diamante - 51 indicações
              </p>
            </div>
            <div class="footer">
              <p>Continue compartilhando e alcance novos níveis!</p>
              <p>© 2024 FinHub - Hub Financeiro Completo</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Template para email de indicação normal
    const referralEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #FFA500;
              font-size: 32px;
              margin: 0;
              font-weight: bold;
            }
            .content {
              margin-bottom: 30px;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 15px;
            }
            .cta-button {
              display: inline-block;
              background-color: #FFA500;
              color: white;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
            }
            .benefits {
              background-color: #FFF9E6;
              border-left: 4px solid #FFA500;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .benefits ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .benefits li {
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              color: #888;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 FinHub</h1>
            </div>
            <div class="content">
              <p>Olá ${recipientName || 'amigo(a)'}!</p>
              <p><strong>${senderName}</strong> convidou você para experimentar o <strong>FinHub</strong> - o hub financeiro completo que une controle de gastos, extrato inteligente e múltiplos serviços financeiros em um só lugar!</p>
              
              <div class="benefits">
                <h3 style="margin-top: 0; color: #FFA500;">✨ Ao se cadastrar, você terá acesso a:</h3>
                <ul>
                  <li>💰 Controle de gastos em tempo real</li>
                  <li>🤖 Categorização automática com IA</li>
                  <li>📊 Insights personalizados de suas finanças</li>
                  <li>💳 PIX, pagamentos e recargas</li>
                  <li>🎁 Cashback em compras</li>
                  <li>🏆 Sistema de emblemas e conquistas</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${referralLink}" class="cta-button">
                  Criar minha conta grátis
                </a>
              </div>

              <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
                Ou copie e cole este link no seu navegador:<br>
                <code style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 3px; font-size: 12px; word-break: break-all;">${referralLink}</code>
              </p>
            </div>
            <div class="footer">
              <p>Esta mensagem foi enviada porque ${senderName} achou que você ia gostar do FinHub.</p>
              <p>© 2024 FinHub - Hub Financeiro Completo</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailHtml = isBronzeAchievement ? bronzeEmailHtml : referralEmailHtml;
    const emailSubject = isBronzeAchievement 
      ? `🥉 Parabéns! Você desbloqueou o Emblema Bronze no FinHub!`
      : `${senderName} convidou você para o FinHub!`;

    // Usar a API do Resend diretamente via fetch
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FinHub <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const responseData = await emailResponse.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending referral email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
