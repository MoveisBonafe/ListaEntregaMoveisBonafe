# Instruções de Instalação - Móveis Bonafé

## Instalação no GitHub Pages

Para implementar este aplicativo no GitHub Pages:

1. Faça login na sua conta do GitHub
2. Acesse o repositório `ListaEntregaMoveisBonafe`
3. Faça upload de todos os arquivos da pasta `docs` para o repositório:
   - index.html
   - app.html
   - modelo.html
   - versao_final.html
   - .nojekyll (importante para o correto funcionamento)
   - README.md

4. Nas configurações do repositório, ative o GitHub Pages:
   - Vá para "Settings" > "Pages"
   - Em "Source", selecione "main" e "/docs"
   - Clique em "Save"

5. O GitHub Pages estará disponível em alguns minutos no endereço:
   `https://[seu-usuario].github.io/ListaEntregaMoveisBonafe/`

## Instalação Local

Para usar localmente:

1. Baixe todos os arquivos para uma pasta em seu computador
2. Abra qualquer um dos arquivos HTML em seu navegador
   - Recomendamos usar `versao_final.html` para a experiência mais completa

## Resolução de Problemas

### Problemas com o GitHub Pages
- Certifique-se de que o arquivo `.nojekyll` existe na raiz da pasta `docs`
- Verifique se as configurações do GitHub Pages estão apontando para a pasta `docs`
- Pode levar alguns minutos para que as alterações sejam publicadas

### Problemas com a Aplicação Local
- Certifique-se de que seu navegador permite JavaScript
- Tente usar outro navegador se encontrar problemas (Chrome, Firefox, Edge)
- Os arquivos Excel devem estar no formato .xlsx ou .xls

## Versões

- **versao_final.html**: Versão mais robusta e flexível, recomendada para uso geral
- **app.html**: Versão padrão, com interface completa
- **modelo.html**: Visualização do modelo de documento sem funcionalidade de processamento
- **index.html**: Página inicial do aplicativo