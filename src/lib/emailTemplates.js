
export function generateEmailTemplate({ title, message, code, footerText }) {
  const year = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f5;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .message {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .code-container {
      background-color: #f3f4f6;
      border: 2px dashed #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 0 auto 30px;
      display: inline-block;
    }
    .code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 700;
      color: #4f46e5;
      letter-spacing: 4px;
      margin: 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
    }
    .highlight {
      color: #7c3aed;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      <div class="message">
        ${message}
      </div>
      
      ${code ? `
      <div class="code-container">
        <div class="code">${code}</div>
      </div>
      <p style="font-size: 14px; color: #6b7280; margin-top: 0;">This code will expire in 10 minutes.</p>
      ` : ''}
      
    </div>
    <div class="footer">
      <p>${footerText || "Thank you for using our platform."}</p>
      <p>&copy; ${year} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
