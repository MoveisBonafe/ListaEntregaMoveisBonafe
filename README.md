# Lista de Entrega - Móveis Bonafé

Sistema especializado para transformar planilhas Excel em documentos Word formatados para listas de entrega da Móveis Bonafé.

## 🚀 Funcionalidades

- **Upload de Excel**: Processa arquivos das abas "LISTA POR PEDIDO" e "CARGA"
- **Agrupamento Inteligente**: Produtos duplicados são automaticamente agrupados com valores somados
- **Formatação Específica**: 50 linhas por lado, margens precisas (2,0cm superior/inferior, 2,5cm lateral)
- **Destaques Especiais**: Produtos "Agulha", "Cadeira Alta Estofada" e "Kit Parafusos" destacados
- **Seção TOTAL**: Gerada da aba CARGA mantendo ordem original
- **Download Automático**: Documento Word gerado instantaneamente

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Processamento**: xlsx (Excel) + docx (Word)
- **UI**: shadcn/ui + Radix UI

## 📋 Como Usar

1. Acesse a aplicação
2. Faça upload do arquivo Excel com as abas:
   - "LISTA POR PEDIDO" (dados principais)
   - "CARGA" (seção total)
3. Aguarde o processamento
4. Baixe o documento Word formatado

## 🏗️ Estrutura dos Dados

### Aba "LISTA POR PEDIDO"
- Coluna A: Nome do cliente
- Coluna B: Nome do produto
- Colunas C-F: Valores (CE, MG, TB, IM)

### Aba "CARGA"
- Coluna A: Nome do produto
- Colunas B-E: Valores totais (CE, MG, TB, IM)

## 🚀 Deploy

### Replit
- Clone este repositório
- Execute `npm install`
- Execute `npm run dev`

### Railway
- Faça push para GitHub
- Conecte ao Railway
- Deploy automático com Dockerfile

### GitHub Pages
- Execute `npm run build-github`
- Deploy nos GitHub Pages

## 📄 Licença

MIT License - Desenvolvido para Móveis Bonafé