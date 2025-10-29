/**
 * Template base para todos os e-mails do La Tazza
 * Mantém consistência visual com o site (cores, tipografia, layout)
 */

interface EmailTemplateProps {
  preheader: string;
  content: string;
  baseUrl?: string;
}

/**
 * Retorna URL base segura para links e assets
 */
function getBaseUrl(customUrl?: string): string {
  if (customUrl) return customUrl.replace(/\/$/, '');
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  return 'http://localhost:3000';
}

/**
 * Template HTML completo com header, footer e estilos do La Tazza
 */
export function buildEmailTemplate({
  preheader,
  content,
  baseUrl,
}: EmailTemplateProps): string {
  const siteUrl = getBaseUrl(baseUrl);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>La Tazza</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Preheader (texto oculto visível apenas em preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent; opacity: 0;">
    ${preheader}
  </div>

  <!-- Container principal -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Card principal -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header com logo e branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #906241 0%, #36251e 100%); padding: 32px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <td align="center">
                    <a href="${siteUrl}" style="text-decoration: none; display: inline-block;">
                      <img src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1761754841/la-tazza-logo-navbar_arrfql.png" 
                           alt="La Tazza" 
                           width="120" 
                           height="auto" 
                           style="display: block; margin: 0 auto; border: 0; outline: 0; text-decoration: none;" />
                    </a>
                  </td>
              </table>
            </td>
          </tr>

          <!-- Conteúdo principal (injetado) -->
          <tr>
            <td style="padding: 40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fdf0df; padding: 32px 40px; border-top: 1px solid #e8d4b8;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Links úteis -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
                      <tr>
                        <td style="padding: 0 12px;">
                          <a href="${siteUrl}/produtos" style="color: #906241; text-decoration: none; font-size: 14px; font-weight: 500;">
                            Produtos
                          </a>
                        </td>
                        <td style="padding: 0 12px; color: #906241;">|</td>
                        <td style="padding: 0 12px;">
                          <a href="${siteUrl}/cursos" style="color: #906241; text-decoration: none; font-size: 14px; font-weight: 500;">
                            Cursos
                          </a>
                        </td>
                        <td style="padding: 0 12px; color: #906241;">|</td>
                        <td style="padding: 0 12px;">
                          <a href="${siteUrl}/contato" style="color: #906241; text-decoration: none; font-size: 14px; font-weight: 500;">
                            Contato
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Texto de ajuda -->
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 13px; color: #36251e; line-height: 1.6;">
                      Precisa de ajuda? Entre em contato através do nosso 
                      <a href="${siteUrl}/contato" style="color: #906241; text-decoration: underline;">
                        suporte
                      </a>
                    </p>
                  </td>
                </tr>

                <!-- Copyright -->
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 12px; color: #906241; opacity: 0.8;">
                      © ${new Date().getFullYear()} La Tazza. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Texto secundário (fora do card) -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin-top: 20px;">
          <tr>
            <td align="center" style="padding: 0 20px;">
              <p style="margin: 0; font-size: 11px; color: #999; line-height: 1.5;">
                Este e-mail foi enviado para você pela La Tazza.<br>
                Se você não esperava receber esta mensagem, pode ignorá-la com segurança.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Constrói versão texto plano do e-mail (fallback)
 */
export function buildPlainTextEmail({
  greeting,
  mainText,
  footer,
}: {
  greeting: string;
  mainText: string;
  footer: string;
}): string {
  return `${greeting}\n\n${mainText}\n\n${footer}\n\nAtenciosamente,\nEquipe La Tazza\nCafé artesanal de excelência`;
}
