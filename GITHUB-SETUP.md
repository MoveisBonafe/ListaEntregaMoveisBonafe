# Setup do GitHub - ListaEntregaMoveisBonafe

## Comandos para fazer o primeiro commit

Execute estes comandos no terminal do Replit:

```bash
# 1. Adicionar todos os arquivos
git add .

# 2. Fazer o primeiro commit
git commit -m "Initial commit: Sistema gerador de documentos Móveis Bonafé

- Upload e processamento de Excel (abas LISTA POR PEDIDO e CARGA)
- Agrupamento automático de produtos duplicados com soma de valores
- Geração de Word com formatação específica (50 linhas/lado)
- Destaques especiais para produtos Agulha, Cadeira Alta e Kit Parafusos
- Seção TOTAL mantendo ordem da aba CARGA
- Configurado para deploy no Railway e GitHub Pages"

# 3. Configurar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/ListaEntregaMoveisBonafe.git

# 4. Fazer push para o GitHub
git push -u origin main
```

## Pré-requisitos

1. **Criar repositório no GitHub:**
   - Acesse github.com
   - Clique em "New repository"
   - Nome: `ListaEntregaMoveisBonafe`
   - Deixe vazio (sem README, .gitignore, license)
   - Clique em "Create repository"

2. **Configurar git (se necessário):**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@gmail.com"
```

## Estrutura do Projeto Pronta

✅ README.md completo
✅ .gitignore configurado
✅ railway.json para deploy Railway
✅ Dockerfile otimizado
✅ Documentação de deploy
✅ Código funcional com todas as features

## Próximos Passos Após Push

1. **Deploy Railway:** Conectar repositório GitHub ao Railway
2. **GitHub Pages:** Executar build específico se necessário
3. **Colaboração:** Adicionar colaboradores ao repositório

---

**Nota:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub nos comandos acima.