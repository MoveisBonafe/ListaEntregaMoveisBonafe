// Script simplificado para gerar build do frontend para GitHub Pages
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// Função para executar comandos
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Executando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

// Função principal
async function buildForGitHub() {
  try {
    // Criar diretório de build se não existir
    const buildDir = path.resolve('./github-pages');
    try {
      await fs.mkdir(buildDir, { recursive: true });
    } catch (err) {
      console.log('Diretório já existe ou erro ao criar:', err);
    }

    // Configuração básica para GitHub Pages
    console.log('Criando arquivos básicos para GitHub Pages...');
    
    // Criar index.html
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Móveis Bonafé - Lista de Entrega</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    
    header {
      padding: 1.5rem 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-bottom: 1px solid #f0f0f0;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .header-content {
      text-align: center;
    }
    
    .logo {
      font-weight: bold;
      text-transform: uppercase;
      background: linear-gradient(to right, #000, #ffc107);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 2rem;
      letter-spacing: -0.5px;
    }
    
    .divider {
      height: 2px;
      width: 100px;
      background-color: #ffc107;
      margin: 0.5rem auto 0.25rem;
    }
    
    .tagline {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 500;
      color: #000;
    }
    
    main {
      padding: 2rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 2rem;
      width: 100%;
      max-width: 600px;
      text-align: center;
    }
    
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .btn {
      display: inline-block;
      background-color: #ffc107;
      color: #000;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      background-color: #ffb300;
      transform: translateY(-2px);
    }
    
    footer {
      text-align: center;
      padding: 1.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="header-content">
        <h1 class="logo">Móveis Bonafé</h1>
        <div class="divider"></div>
        <span class="tagline">Lista de Entrega</span>
      </div>
    </div>
  </header>
  
  <main>
    <div class="container">
      <div class="card">
        <h1>Gerador de Lista de Entrega</h1>
        <p>Este aplicativo converte arquivos Excel em documentos Word formatados para listas de entrega, com ordenação alfabética de produtos e formatação especial para as colunas.</p>
        <a href="https://github.com/SEU_USUARIO/moveis-bonafe-lista" class="btn">Ver no GitHub</a>
      </div>
    </div>
  </main>
  
  <footer>
    <div class="container">
      &copy; 2025 Móveis Bonafé. Todos os direitos reservados.
    </div>
  </footer>
</body>
</html>`;

    await fs.writeFile(path.join(buildDir, 'index.html'), htmlContent);
    
    // Criar arquivo .nojekyll para GitHub Pages
    await fs.writeFile(path.join(buildDir, '.nojekyll'), '');
    
    console.log('✅ Arquivos gerados com sucesso na pasta github-pages');
    console.log('\nPara fazer o deploy no GitHub Pages:');
    console.log('1. Baixe a pasta github-pages');
    console.log('2. Crie um repositório no GitHub chamado moveis-bonafe-lista');
    console.log('3. Faça upload dos arquivos para a branch gh-pages');
    console.log('4. Configure o GitHub Pages nas configurações do repositório');
  } catch (error) {
    console.error('Erro durante o build:', error);
  }
}

buildForGitHub();