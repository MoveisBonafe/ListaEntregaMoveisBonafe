# Guia para Deploy no GitHub Pages

Este guia explica como implantar a aplicação Móveis Bonafé no GitHub Pages passo a passo.

## 1. Preparar os arquivos

Para preparar apenas os arquivos do frontend para deploy:

```bash
npm run build
```

Este comando irá gerar os arquivos estáticos na pasta `dist/public`.

## 2. Configurar o GitHub Pages

1. **Crie um repositório no GitHub**
   - Acesse [github.com](https://github.com) e faça login na sua conta
   - Clique no botão "+" no canto superior direito e selecione "New repository"
   - Nomeie o repositório como `moveis-bonafe-lista` 
   - Marque como "Public"
   - Clique em "Create repository"

2. **Upload dos arquivos**
   - Baixe todos os arquivos da pasta `dist/public` do seu projeto
   - No GitHub, acesse seu novo repositório
   - Clique no botão "Add file" e selecione "Upload files"
   - Faça upload de todos os arquivos baixados
   - Adicione um arquivo vazio chamado `.nojekyll` (importante para GitHub Pages)
   - Clique em "Commit changes"

3. **Configurar GitHub Pages**
   - No repositório, vá em "Settings" (aba)
   - No menu lateral esquerdo, clique em "Pages"
   - Na seção "Build and deployment", em "Source", selecione "Deploy from a branch"
   - Na seção "Branch", selecione "main" (ou outra branch onde você fez upload) e "/root"
   - Clique em "Save"

4. **Aguarde a implantação**
   - GitHub mostrará uma mensagem azul "Your site is being built"
   - Depois de alguns minutos, aparecerá uma mensagem verde "Your site is published at..."
   - Seu site estará disponível em `https://SEU_USUARIO.github.io/moveis-bonafe-lista/`

## Observações importantes

- Se você fizer alterações locais, precisará reconstruir e fazer upload novamente
- O GitHub Pages é ideal para sites estáticos como este
- Certifique-se de que todas as imagens e recursos estejam com caminhos relativos
- Se encontrar problemas de rotas, pode ser necessário ajustar configurações base do Vite

## Solução de problemas comuns

1. **Página em branco após deploy**
   - Verifique se o arquivo `.nojekyll` foi adicionado
   - Verifique os caminhos dos recursos no HTML e CSS

2. **Recursos não carregando**
   - Os caminhos devem ser relativos à raiz do site
   - Verifique se todos os arquivos foram enviados corretamente

3. **Problemas de roteamento**
   - O GitHub Pages trabalha melhor com sites de página única
   - Para rotas mais complexas, considere adicionar um arquivo 404.html