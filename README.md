# Móveis Bonafé - Sistema de Lista de Entrega

Aplicação web para transformar planilhas Excel em documentos Word formatados para listas de entrega da Móveis Bonafé.

## Sobre o Projeto

Esta aplicação foi desenvolvida para facilitar a geração de documentos de lista de entrega a partir de dados de planilhas Excel. O sistema processa os dados dos clientes e produtos, organiza-os em blocos e gera um documento Word formatado seguindo padrões específicos de layout e formatação.

## Funcionalidades

- Upload de arquivos Excel (.xlsx)
- Processamento automático de dados da aba "LISTA POR PEDIDO" e "CARGA"
- Ordenação alfabética de produtos dentro de cada bloco de cliente
- Formatação especial para colunas (destaque em amarelo para colunas TB, destaque em verde para colunas IM)
- Seção TOTAL após todos os blocos de clientes
- Download do documento Word formatado

## Instruções para deploy no GitHub Pages

Para fazer o deploy da aplicação no GitHub Pages, siga estes passos:

1. Execute o script para gerar os arquivos do build:
   ```
   node deploy-to-github.js
   ```

2. Faça o download da pasta `dist/github-pages` que será gerada

3. No GitHub:
   - Crie um novo repositório chamado `moveis-bonafe-lista`
   - Vá em Settings > Pages
   - Configure para usar a branch `gh-pages`
   - Faça upload dos arquivos baixados para esta branch

4. Seu site estará disponível em: `https://SEU_USUARIO.github.io/moveis-bonafe-lista/`

## Desenvolvimento

Para executar o projeto em ambiente de desenvolvimento:

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Tecnologias Utilizadas

- TypeScript
- React
- Tailwind CSS
- Biblioteca DOCX para geração de documentos Word
- XLSX para processamento de planilhas Excel

## Licença

MIT# GeradorListaEntregaMoveisBonafe
