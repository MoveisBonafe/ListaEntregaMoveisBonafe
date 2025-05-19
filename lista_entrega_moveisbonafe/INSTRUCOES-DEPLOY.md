# Instruções para Deploy no GitHub Pages

## Para o novo repositório: ListaEntregaMoveisBonafe

### Passos para o Deploy:

1. **Clone o repositório criado**:
   ```
   git clone https://github.com/MoveisBonafe/ListaEntregaMoveisBonafe.git
   cd ListaEntregaMoveisBonafe
   ```

2. **Adicione todos os arquivos desta pasta**:
   - index.html
   - app.html
   - 404.html
   - .nojekyll (arquivo vazio para desabilitar processamento Jekyll)

3. **Faça o commit e push**:
   ```
   git add .
   git commit -m "Primeira versão da aplicação"
   git push origin main
   ```

4. **Configure o GitHub Pages**:
   - Acesse as configurações do repositório no GitHub
   - Vá para a seção "Pages" nas configurações
   - Na fonte (Source), selecione "Deploy from a branch"
   - Selecione a branch "main"
   - Selecione a pasta "/" (root)
   - Clique em "Save"

5. **Verifique a URL**:
   - Após alguns minutos, o site estará disponível em:
   - https://moveisbonafe.github.io/ListaEntregaMoveisBonafe/

## Dicas Adicionais:

1. **Verifique se não há configuração de domínio personalizado**:
   - Na seção "Custom domain" das configurações do GitHub Pages
   - Este campo deve estar vazio

2. **Certifique-se de que o arquivo .nojekyll existe**:
   - Este arquivo é importante para o GitHub Pages não processar seu site com Jekyll
   - Deve ser um arquivo vazio na raiz do repositório

3. **Limpe o cache do navegador**:
   - Se ainda enfrentar problemas de redirecionamento, tente:
   - Pressionar Ctrl+Shift+Delete e limpar o cache
   - Ou use o modo de navegação anônima para testar

4. **Aplicação 100% cliente-side**:
   - Esta aplicação funciona totalmente no lado do cliente
   - Não precisa de servidor ou banco de dados
   - Perfeita para hospedagem no GitHub Pages