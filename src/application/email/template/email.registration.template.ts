export const getRegistrationEmailTemplate = ({
  username,
  verificationCode,
}: {
  username: string;
  verificationCode: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro - Código de Verificação</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px;">
    <tr>
      <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Bem-vindo!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; margin: 0;">Olá, <strong>${username}</strong>,</p>
        <p style="font-size: 16px; margin: 10px 0;">Seu código de verificação é:</p>
        <p style="font-size: 24px; color: #007bff; margin: 20px 0;"><strong>${verificationCode}</strong></p>
        <p style="font-size: 14px; color: #666666;">Este código é válido por 10 minutos.</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px; background-color: #f4f4f4;">
        <p style="font-size: 14px; color: #888888;">Se você não solicitou este código, por favor, ignore este e-mail.</p>
      </td>
    </tr>
  </table>
</body>
</html>

`;
