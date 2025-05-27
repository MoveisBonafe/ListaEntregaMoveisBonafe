# Deploy no Railway - Gerador de Documentos Móveis Bonafé

## Passos para Deploy

### 1. Preparação do Projeto
✅ Arquivos de configuração criados:
- `railway.json` - Configuração específica do Railway
- `Dockerfile` - Container otimizado para produção
- `.dockerignore` - Exclusão de arquivos desnecessários
- Servidor configurado para usar PORT do Railway

### 2. Deploy no Railway

1. **Acesse [Railway.app](https://railway.app)**
2. **Faça login ou crie uma conta**
3. **Clique em "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Conecte seu repositório GitHub** (você precisa primeiro fazer push do código para o GitHub)
6. **Selecione este repositório**
7. **Railway detectará automaticamente o Dockerfile e fará o deploy**

### 3. Configuração Pós-Deploy

Após o deploy, a aplicação estará disponível em uma URL fornecida pelo Railway (ex: `https://seu-app.railway.app`).

### 4. Variáveis de Ambiente (se necessário)

Se você precisar de variáveis de ambiente específicas:
1. No painel do Railway, vá em **Variables**
2. Adicione as variáveis necessárias
3. Faça redeploy se necessário

## Características do Deploy

- ✅ **Build automático** com Dockerfile otimizado
- ✅ **Porta dinâmica** configurada para Railway
- ✅ **Restart automático** em caso de falha
- ✅ **Health check** configurado
- ✅ **Logs** disponíveis no painel Railway

## Comandos Importantes

```bash
# Para testar o build localmente
npm run build
npm start

# Para verificar se está funcionando
curl http://localhost:5000
```

## Estrutura do Projeto para Produção

- Frontend: Build estático servido pelo Express
- Backend: API Express.js
- Upload de arquivos: Processamento em memória
- Geração de documentos: Client-side com download direto