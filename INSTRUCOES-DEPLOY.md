# Instruções Detalhadas para Deploy no GitHub Pages

## 1. Preparação

Os arquivos para deploy já foram gerados na pasta `docs`. Esta pasta contém:
- `index.html` - A página principal
- `.nojekyll` - Arquivo necessário para o GitHub Pages

## 2. Download dos Arquivos

Primeiro, você precisa baixar os arquivos da pasta `docs`:

1. No Replit, navegue até a pasta `docs`
2. Clique com o botão direito em cada arquivo e selecione "Download"
   - Baixe o arquivo `index.html`
   - Baixe o arquivo `.nojekyll` (este é um arquivo vazio, mas importante)

## 3. Criar Repositório no GitHub

1. Acesse [https://github.com/new](https://github.com/new)
2. Digite o nome do repositório: `moveis-bonafe-lista`
3. Adicione uma descrição opcional: "Aplicativo de geração de lista de entrega para Móveis Bonafé"
4. Deixe o repositório como "Public"
5. Clique em "Create repository"

## 4. Upload dos Arquivos

Existem duas maneiras de fazer upload dos arquivos:

### Opção 1: Upload via Navegador
1. No seu novo repositório, clique no botão "Add file" e selecione "Upload files"
2. Arraste os arquivos baixados (index.html e .nojekyll) para a área de upload
3. Adicione uma mensagem de commit: "Deploy inicial do site Móveis Bonafé"
4. Clique em "Commit changes"

### Opção 2: Clone e Push (para usuários avançados)
```bash
git clone https://github.com/SEU_USUARIO/moveis-bonafe-lista.git
cd moveis-bonafe-lista
# Copie os arquivos baixados para esta pasta
git add .
git commit -m "Deploy inicial do site Móveis Bonafé"
git push origin main
```

## 5. Configuração do GitHub Pages

### Opção 1: Usando a raiz do repositório
1. No seu repositório, clique na aba "Settings"
2. No menu lateral esquerdo, clique em "Pages"
3. Na seção "Source", selecione "Deploy from a branch"
4. Na seção "Branch", selecione "main" (ou "master") e "/root", depois clique em "Save"
5. Aguarde alguns minutos até que o GitHub processe seu site

### Opção 2: Usando a pasta /docs (Recomendado)
1. Crie uma pasta chamada "docs" no seu repositório
2. Mova os arquivos index.html e .nojekyll para dentro desta pasta
3. Faça o commit dessa alteração
4. No seu repositório, clique na aba "Settings"
5. No menu lateral esquerdo, clique em "Pages"
6. Na seção "Source", selecione "Deploy from a branch"
7. Na seção "Branch", selecione "main" (ou "master") e "/docs", depois clique em "Save"
8. Aguarde alguns minutos até que o GitHub processe seu site

## 6. Verificação

1. Após alguns minutos, volte à página "Settings > Pages"
2. Você verá uma mensagem: "Your site is published at https://SEU_USUARIO.github.io/moveis-bonafe-lista/"
3. Clique neste link para verificar se seu site está funcionando corretamente

## 7. Resolução de Problemas Comuns

Se o seu site mostrar erro 404:
1. Verifique se os arquivos foram carregados corretamente no repositório
2. Certifique-se de que o arquivo `.nojekyll` existe no repositório
3. Verifique se você ativou o GitHub Pages nas configurações
4. Às vezes o GitHub Pages leva até 10 minutos para propagar as mudanças

## 8. Atualização Futura

Para atualizar seu site no futuro:
1. Faça as alterações nos arquivos localmente
2. Repita o processo de upload
3. O GitHub Pages se atualizará automaticamente em alguns minutos

## 9. Personalização Adicional (Opcional)

Depois que seu site estiver funcionando, você pode adicionar:
- Um domínio personalizado nas configurações do GitHub Pages
- Arquivos CSS e JavaScript separados para melhor organização
- Imagens e outros recursos em uma pasta separada