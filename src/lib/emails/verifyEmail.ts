import { Resend } from 'resend';
import { buildEmailTemplate, buildPlainTextEmail } from './templates/base';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

type SendVerificationProps = {
  to: string;
  token: string;
  name?: string | null;
  expiresInMinutes?: number;
};

function safeBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  return 'http://localhost:3000';
}

/**
 * Constrói o conteúdo interno (HTML) do e-mail de verificação
 */
function buildVerificationContent({
  name,
  verifyUrl,
  expiresInMinutes,
}: {
  name?: string | null;
  verifyUrl: string;
  expiresInMinutes: number;
}): string {
  const greeting = name ? `Olá <strong>${name}</strong>!` : 'Olá!';

  return `

    <!-- Título -->
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 700; color: #36251e; text-align: center; line-height: 1.3;">
      Verifique seu e-mail
    </h2>

    <!-- Mensagem principal -->
    <p style="margin: 0 0 24px; font-size: 16px; color: #36251e; line-height: 1.7; text-align: center;">
      ${greeting}
    </p>

    <p style="margin: 0 0 32px; font-size: 15px; color: #5a4a42; line-height: 1.7;">
      Obrigado por se cadastrar na <strong>La Tazza</strong>! Para ativar sua conta e ter acesso completo à nossa plataforma de cafés artesanais, clique no botão abaixo para verificar seu endereço de e-mail:
    </p>

    <!-- Botão de ação principal -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
      <tr>
        <td align="center">
          <a href="${verifyUrl}" 
             role="button" 
             aria-label="Verificar meu e-mail"
             style="display: inline-block; background: linear-gradient(135deg, #906241 0%, #715038 100%); color: #fdf0df; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(144, 98, 65, 0.3); transition: all 0.3s;">
            ✓ Verificar Meu E-mail
          </a>
        </td>
      </tr>
    </table>

    <!-- Informações de segurança -->
    <div style="background-color: #fdf0df; border-left: 4px solid #906241; padding: 20px; margin: 32px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #36251e; line-height: 1.6;">
        <strong>⏱️ Atenção:</strong> Este link expira em <strong>${expiresInMinutes} minutos</strong>.
      </p>
      <p style="margin: 0; font-size: 13px; color: #5a4a42; line-height: 1.6;">
        Se você não criou uma conta na La Tazza, pode ignorar este e-mail com segurança.
      </p>
    </div>

    <!-- Link alternativo -->
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8d4b8;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #5a4a42;">
        Se o botão não funcionar, copie e cole este link no seu navegador:
      </p>
      <p style="margin: 0; font-size: 12px; word-break: break-all; color: #906241; background-color: #f9f4ed; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace;">
        ${verifyUrl}
      </p>
    </div>
  `;
}

/**
 * Envia um e-mail de verificação para o usuário usando Resend.
 * - Usa RESEND_API_KEY via process.env
 * - Constrói link com NEXT_PUBLIC_SITE_URL ou localhost fallback
 */
export async function sendVerificationEmail({
  to,
  token,
  name = null,
  expiresInMinutes = 60,
}: SendVerificationProps) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não definido no ambiente');
  }

  const base = safeBaseUrl();
  const verifyUrl = `${base}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const subject = 'Verifique seu e-mail — La Tazza';
  const preheader = `Ative sua conta na La Tazza em apenas 1 clique — link expira em ${expiresInMinutes} minutos.`;

  // Constrói o conteúdo interno
  const content = buildVerificationContent({
    name,
    verifyUrl,
    expiresInMinutes,
  });

  // Usa o template base para envolver o conteúdo
  const html = buildEmailTemplate({ preheader, content, baseUrl: base });

  // Versão texto plano
  const greeting = name ? `Olá ${name}!` : 'Olá!';
  const text = buildPlainTextEmail({
    greeting,
    mainText: `Obrigado por se cadastrar na La Tazza!\n\nPara ativar sua conta, acesse o link abaixo:\n${verifyUrl}\n\nO link expira em ${expiresInMinutes} minutos.\nSe você não criou uma conta, pode ignorar este e-mail.`,
    footer: 'Se tiver dúvidas, entre em contato através do nosso suporte.',
  });

  return resend.emails.send({
    from: 'La Tazza <no-reply@marcospilgrim.com.br>',
    to,
    subject,
    html,
    text,
  });
}

export default sendVerificationEmail;
