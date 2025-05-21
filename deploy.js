// Script para deploy no GitHub Pages
import { publish } from 'gh-pages';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do deploy
publish(
  'dist/public', // pasta que será publicada
  {
    branch: 'gh-pages',
    repo: 'https://github.com/SEU_USUARIO/moveis-bonafe-lista.git', // Substitua pelo seu repositório
    user: {
      name: 'Moveis Bonafe',
      email: 'seu-email@example.com' // Substitua pelo seu email
    },
    dotfiles: true,
    message: 'Deploy: [timestamp]',
    silent: false
  },
  (err) => {
    if (err) {
      console.error('Erro durante o deploy:', err);
      return;
    }
    console.log('Deploy concluído com sucesso!');
  }
);