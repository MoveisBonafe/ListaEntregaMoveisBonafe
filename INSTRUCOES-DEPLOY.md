# Instruções de Deploy no GitHub Pages

## Problema de Redirecionamento

Se o GitHub Pages está redirecionando para um domínio personalizado inexistente (como moveis-bonafe.com.br), siga estas etapas:

1. Acesse as configurações do repositório no GitHub
2. Vá para a seção "Pages" nas configurações
3. Em "Custom domain", remova qualquer domínio personalizado que estiver configurado
4. Salve as alterações
5. Aguarde alguns minutos para que a configuração seja atualizada

## Arquivos para Deploy

Para garantir que o aplicativo funcione corretamente no GitHub Pages com a URL `https://moveisbonafe.github.io/GeradorListaEntregaMoveisBonafe/`, siga estas instruções:

### Método 1: Usar a pasta docs/

1. Certifique-se de que existem os seguintes arquivos na pasta `docs/`:
   - `index.html` - Página inicial
   - `app.html` - Aplicativo principal
   - `.nojekyll` - Arquivo vazio para desativar o processamento Jekyll

2. Nas configurações do GitHub Pages, selecione a opção "Deploy from a branch"
3. Selecione a branch "main" (ou master)
4. Selecione a pasta "/docs"
5. Clique em "Save"

### Método 2: Usar a branch gh-pages

1. Copie os arquivos da pasta `github_deploy/` para a raiz de uma nova branch chamada `gh-pages`:
   - `index.html`
   - `app.html`
   - `.nojekyll` (arquivo vazio)

2. Nas configurações do GitHub Pages, selecione a opção "Deploy from a branch"
3. Selecione a branch "gh-pages"
4. Selecione a pasta "/" (root)
5. Clique em "Save"

### Método 3: Usar arquivos diretamente na raiz

Se você preferir manter tudo na branch principal:

1. Copie os arquivos da pasta `github_deploy/` para a raiz da branch principal:
   - `index.html`
   - `app.html`
   - `.nojekyll` (arquivo vazio)

2. Nas configurações do GitHub Pages, selecione a opção "Deploy from a branch"
3. Selecione a branch "main" (ou master)
4. Selecione a pasta "/" (root)
5. Clique em "Save"

## Verificação

Após a configuração, acesse `https://moveisbonafe.github.io/GeradorListaEntregaMoveisBonafe/` para verificar se o redirecionamento foi corrigido e o aplicativo está funcionando corretamente.

## Limpeza (Opcional)

Depois que o aplicativo estiver funcionando corretamente, você pode remover arquivos desnecessários do repositório, como:
- Arquivos duplicados nas pastas `docs/` ou `github-pages/`
- Arquivos de configuração não utilizados