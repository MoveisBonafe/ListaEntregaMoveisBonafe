// Script para preparar o build para deploy manual no GitHub Pages
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Função para executar o build do frontend apenas
async function buildFrontendOnly() {
  console.log('Construindo apenas a parte frontend...');
  try {
    // Criar pasta para o build
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
    }
    
    if (!fs.existsSync('./dist/github-pages')) {
      fs.mkdirSync('./dist/github-pages', { recursive: true });
    }
    
    // Executar o build
    await execAsync('npx vite build --outDir dist/github-pages --emptyOutDir');
    
    // Criar arquivo index.html se não existir
    if (!fs.existsSync('./dist/github-pages/index.html')) {
      console.error('Arquivo index.html não foi gerado durante o build.');
      return false;
    }
    
    // Criar arquivo vazio .nojekyll para GitHub Pages
    fs.writeFileSync('./dist/github-pages/.nojekyll', '');
    
    console.log('✅ Build do frontend concluído com sucesso!');
    console.log('Os arquivos para deploy estão na pasta: ./dist/github-pages');
    console.log('\nInstruções para deploy manual:');
    console.log('1. Faça o download da pasta dist/github-pages');
    console.log('2. Crie um repositório no GitHub chamado moveis-bonafe-lista');
    console.log('3. No seu repositório, vá em Settings > Pages');
    console.log('4. Em Branch, selecione gh-pages e clique em Save');
    console.log('5. Faça upload dos arquivos para a branch gh-pages');
    console.log('6. Seu site estará disponível em: https://SEU_USUARIO.github.io/moveis-bonafe-lista/');
    
    return true;
  } catch (error) {
    console.error('Erro ao construir o frontend:', error);
    return false;
  }
}

// Iniciar o processo de build
buildFrontendOnly();