// Função para gerar o documento HTML com o layout exato no formato de tabela
function gerarDocumentoPadrao(dados) {
  // Estrutura básica do documento
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Móveis Bonafé - Lista de Entrega</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px;
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin-bottom: 20px; 
    }
    th, td { 
      border: 1px solid black; 
      padding: 4px; 
      text-align: center; 
    }
    .header { 
      font-weight: bold; 
      background-color: #f2f2f2; 
    }
    .client-name { 
      font-weight: bold; 
      text-align: left; 
    }
    .tb-header { 
      background-color: yellow; 
    }
    .im-cell { 
      background-color: green; 
      color: white; 
    }
    h1 { 
      text-align: center; 
      color: #0070c0; 
    }
    .no-print {
      margin-top: 40px;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
    .btn {
      display: inline-block;
      background-color: #0070c0;
      color: white;
      padding: 8px 15px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <h1>MÓVEIS BONAFÉ - LISTA DE ENTREGA</h1>
`;

  // Adicionar tabelas de clientes
  const clients = [
    {
      name: "Tiete-Capricholar Moveis E",
      produtos: [
        { nome: "Cadeira Alta", ce: "28", mg: "", tb: "", im: "" },
        { nome: "Cadeira Comum", ce: "16", mg: "", tb: "", im: "" },
        { nome: "Mesa 0,70 X 0,45", ce: "04", mg: "", tb: "", im: "" },
        { nome: "Mesa 1,15 X 0,75", ce: "03", mg: "", tb: "", im: "" }
      ]
    },
    {
      name: "Aracoiaba Da Serra-",
      produtos: [
        { nome: "Cadeira Alta", ce: "", mg: "", tb: "", im: "20" },
        { nome: "Mesa 0,70 X 0,45", ce: "", mg: "", tb: "", im: "03" },
        { nome: "Mesa 0,75 X 0,75", ce: "", mg: "", tb: "", im: "02" },
        { nome: "Mesa 1,50 X 0,80", ce: "", mg: "", tb: "", im: "01" }
      ]
    },
    {
      name: "Sorocaba-Helio Koiti Inoue",
      produtos: [
        { nome: "Barra de Cama", ce: "", mg: "", tb: "", im: "01" },
        { nome: "Cabeceira Beliche", ce: "", mg: "", tb: "", im: "01" }
      ]
    },
    {
      name: "Tatui-Casa Dos Colchoes",
      produtos: [
        { nome: "Beliche", ce: "", mg: "", tb: "", im: "01" },
        { nome: "Cadeira Comum", ce: "", mg: "", tb: "", im: "40" },
        { nome: "Mesa 0,70 X 0,45", ce: "", mg: "", tb: "", im: "01" },
        { nome: "Mesa 0,75 X 0,75", ce: "", mg: "", tb: "", im: "03" },
        { nome: "Mesa 1,15 X 0,75", ce: "", mg: "", tb: "", im: "05" },
        { nome: "Mesa 1,50 X 0,80", ce: "", mg: "", tb: "", im: "02" }
      ]
    }
  ];

  // Gerar pares de clientes para as tabelas
  for (let i = 0; i < clients.length; i += 2) {
    const leftClient = clients[i];
    const rightClient = (i + 1 < clients.length) ? clients[i + 1] : null;

    html += `
  <table>
    <tr class="header">
      <th class="client-name">${leftClient.name}</th>
      <th>CE</th>
      <th>MG</th>
      <th class="tb-header">TB</th>
      <th>IM</th>`;

    if (rightClient) {
      html += `
      <th class="client-name">${rightClient.name}</th>
      <th>CE</th>
      <th>MG</th>
      <th class="tb-header">TB</th>
      <th>IM</th>`;
    } else {
      html += `
      <th class="client-name"></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>`;
    }

    html += `
    </tr>`;

    // Determinar o máximo de linhas para esta tabela
    const maxRows = Math.max(
      leftClient.produtos.length,
      rightClient ? rightClient.produtos.length : 0
    );

    // Adicionar cada linha de produto
    for (let j = 0; j < maxRows; j++) {
      html += `
    <tr>`;

      // Produtos do cliente da esquerda
      if (j < leftClient.produtos.length) {
        const produto = leftClient.produtos[j];
        html += `
      <td>${produto.nome}</td>
      <td>${produto.ce}</td>
      <td>${produto.mg}</td>
      <td>${produto.tb}</td>
      <td ${produto.im ? 'class="im-cell"' : ''}>${produto.im}</td>`;
      } else {
        html += `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>`;
      }

      // Produtos do cliente da direita (se existir)
      if (rightClient && j < rightClient.produtos.length) {
        const produto = rightClient.produtos[j];
        html += `
      <td>${produto.nome}</td>
      <td>${produto.ce}</td>
      <td>${produto.mg}</td>
      <td>${produto.tb}</td>
      <td ${produto.im ? 'class="im-cell"' : ''}>${produto.im}</td>`;
      } else {
        html += `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>`;
      }

      html += `
    </tr>`;
    }

    html += `
  </table>`;
  }

  // Adicionar instruções de impressão
  html += `
  <div class="no-print">
    <h2>Instruções para impressão</h2>
    <p>Para salvar este documento como PDF ou imprimi-lo:</p>
    <ol>
      <li>Pressione Ctrl+P (ou Cmd+P no Mac)</li>
      <li>Selecione "Salvar como PDF" na opção de impressora</li>
      <li>Clique em "Salvar" para gerar o arquivo PDF</li>
    </ol>
    <p>A impressão vai ocultar automaticamente estas instruções.</p>
    <a href="javascript:window.print()" class="btn">Imprimir/Salvar como PDF</a>
    <a href="javascript:window.close()" class="btn">Fechar esta janela</a>
  </div>
</body>
</html>`;

  return html;
}

// Exportar função para uso em scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gerarDocumentoPadrao };
} else if (typeof window !== 'undefined') {
  window.gerarDocumentoPadrao = gerarDocumentoPadrao;
}