# Como Remover o Domínio Personalizado no GitHub Pages

Pelo que estou vendo, o GitHub Pages está configurado para redirecionar para um domínio personalizado `moveis-bonafe.com.br`, mas este domínio não está configurado corretamente. Vamos resolver isso:

## Passos para Remover o Domínio Personalizado

1. Acesse o repositório no GitHub: https://github.com/MoveisBonaFe/GeradorListaEntregaMoveisBonafe

2. Clique na aba "Settings" (Configurações) no topo do repositório

3. No menu lateral esquerdo, role para baixo e clique em "Pages" (na seção "Code and automation")

4. Na seção "Custom domain", você verá o campo preenchido com `moveis-bonafe.com.br` 

5. **Remova completamente o texto deste campo** (deixe-o vazio)

6. Clique no botão "Save" (Salvar)

7. Aguarde alguns minutos para que as alterações sejam aplicadas

8. Acesse novamente a URL: https://moveisbonafe.github.io/GeradorListaEntregaMoveisBonafe/

## Verificação

Se tudo for configurado corretamente, a URL https://moveisbonafe.github.io/GeradorListaEntregaMoveisBonafe/ deve carregar corretamente o aplicativo sem redirecionar para nenhum domínio personalizado.

## Caso Ainda Tenha Problemas

Se após remover o domínio personalizado ainda houver problemas, pode ser necessário:

1. Verificar se existe um arquivo CNAME no repositório (na raiz ou pasta /docs) e removê-lo
2. Forçar uma nova implantação fazendo um commit pequeno no repositório
3. Esperar até 24 horas para que as alterações de DNS se propaguem completamente