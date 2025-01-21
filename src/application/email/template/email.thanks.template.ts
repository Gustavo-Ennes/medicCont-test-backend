export const getThanksEmailTemplate = (username: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agradecimento pela Confirmação</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px;">
    <tr>
      <td align="center" style="background-color: #28a745; padding: 20px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Obrigado por confirmar!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; margin: 0;">Olá, <strong>${username}</strong>,</p>
        <p style="font-size: 16px; margin: 10px 0;">A autenticação de dois fatores foi configurada com sucesso.</p>
        <p style="font-size: 14px; color: #666666; margin-top: 20px;">
          Se você encontrar algum problema, entre em contato com nosso suporte.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px; background-color: #f4f4f4;">
        <p style="font-size: 14px; color: #888888;">Obrigado por confiar em nossos serviços!</p>
      </td>
    </tr>
  </table>
</body>
</html>

`;
