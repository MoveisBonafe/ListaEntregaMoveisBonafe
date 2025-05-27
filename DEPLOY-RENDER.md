# Deploy no Render - Lista Entrega Móveis Bonafé

## Passos para Deploy no Render

### 1. Preparação Concluída ✅
- `render.yaml` criado com configurações otimizadas
- Dockerfile já configurado 
- Projeto pronto para deploy

### 2. Deploy no Render

1. **Acesse [render.com](https://render.com)**
2. **Faça login ou crie uma conta gratuita**
3. **Clique em "New +" → "Web Service"**
4. **Conecte seu repositório GitHub:**
   - Autorize o Render a acessar seus repositórios
   - Selecione `ListaEntregaMoveisBonafe`
5. **Configure o deploy:**
   - **Name:** `lista-entrega-moveis-bonafe`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (gratuito)
6. **Clique em "Create Web Service"**

### 3. Vantagens do Render

✅ **URL automática** - Render gera automaticamente uma URL pública
✅ **Deploy gratuito** - Plan free suficiente para o projeto
✅ **SSL automático** - HTTPS configurado automaticamente
✅ **Logs em tempo real** - Fácil acompanhamento do deploy
✅ **Auto-restart** - Reinicia automaticamente em caso de falha

### 4. URL Esperada

Sua aplicação ficará disponível em:
`https://lista-entrega-moveis-bonafe.onrender.com`

### 5. Primeira Configuração

Após o deploy:
1. **URL aparece automaticamente** no painel do Render
2. **Deploy demora ~5-10 minutos** na primeira vez
3. **Aplicação fica dormindo** após 15min sem uso (plan free)
4. **Acorda automaticamente** quando alguém acessa

## Funcionalidades Disponíveis

Sua ferramenta estará online com:
- Upload de Excel (abas LISTA POR PEDIDO e CARGA)
- Agrupamento automático de produtos duplicados
- Geração de Word com formatação específica
- Seção TOTAL na ordem da aba CARGA
- Download automático do documento

## Próximos Passos

1. Fazer commit das configurações do Render
2. Conectar repositório GitHub ao Render
3. Deploy automático
4. Testar funcionalidades online!