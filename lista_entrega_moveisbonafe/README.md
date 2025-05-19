# Gerador de Lista de Entrega - Móveis Bonafé

Esta aplicação web converte arquivos Excel em documentos Word formatados para listas de entrega da Móveis Bonafé. 

## Funcionalidades

- Processamento de arquivos Excel (.xlsx)
- Extração de dados de pedidos e produtos
- Ordenação alfabética de produtos
- Geração de documento Word formatado
- Layout personalizado com duas colunas
- Formatação especial para a seção TOTAL
- Interface amigável e responsiva

## Como usar

1. Acesse a aplicação pelo link: [Gerador de Lista de Entrega](https://moveisbonafe.github.io/ListaEntregaMoveisBonafe/)
2. Clique no botão "Acessar Aplicativo"
3. Faça upload do arquivo Excel com os dados
4. Visualize a pré-formatação do documento
5. Clique em "Gerar Documento" para baixar o arquivo Word

## Requisitos do Excel

A aplicação espera um arquivo Excel com as seguintes características:
- Aba "LISTA POR PEDIDO" contendo os dados de clientes e seus produtos
- Aba "CARGA" contendo os dados para a seção TOTAL
- Colunas com os cabeçalhos: CE, MG, TB, IM

## Formatação do Documento

O documento Word gerado segue as seguintes regras:
- Produtos organizados por cliente
- Produtos ordenados alfabeticamente dentro de cada cliente
- Layout em duas colunas para melhor aproveitamento da página
- Seção TOTAL ao final com ordenação original dos produtos
- Formatação numérica específica (valores com três dígitos)

## Tecnologias utilizadas

- HTML5, CSS3 e JavaScript
- Biblioteca xlsx.js para processamento de Excel
- Biblioteca docx.js para geração de documentos Word
- FileSaver.js para download de arquivos
- Google Fonts para tipografia

## Desenvolvimento

Este projeto foi desenvolvido para funcionar diretamente no navegador, sem necessidade de servidor backend, permitindo sua hospedagem em serviços como GitHub Pages.

---

&copy; 2025 Móveis Bonafé. Todos os direitos reservados.