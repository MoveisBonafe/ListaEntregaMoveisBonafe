// Este script sincroniza as configurações do wordGenerator.ts com os arquivos de deploy
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para ler o arquivo de origem
function readSourceFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

// Função para atualizar o arquivo de destino com as configurações corretas
function updateDeployFile() {
  // Lendo o arquivo de origem para extrair as configurações
  const sourceCode = readSourceFile('client/src/lib/wordGenerator.ts');
  
  // Extraindo as configurações de altura da linha e número máximo de linhas
  const rowHeightMatch = sourceCode.match(/const rowHeight = (\d+);.*\/\/ Exatamente 0\.5cm/);
  const maxRowsPerSideMatch = sourceCode.match(/const maxRowsPerSide = (\d+);.*\/\/ Número máximo de linhas/);
  
  if (!rowHeightMatch || !maxRowsPerSideMatch) {
    console.error('Não foi possível encontrar as configurações necessárias no arquivo fonte.');
    process.exit(1);
  }
  
  const rowHeight = rowHeightMatch[1];
  const maxRowsPerSide = maxRowsPerSideMatch[1];
  
  console.log(`Configurações encontradas: altura da linha = ${rowHeight}, máximo de linhas = ${maxRowsPerSide}`);
  
  // Lendo o arquivo de deploy
  const deployFilePath = path.join(__dirname, 'github_deploy/app.html');
  let deployFileContent = fs.readFileSync(deployFilePath, 'utf8');
  
  // Atualizando o número máximo de linhas por página
  deployFileContent = deployFileContent.replace(
    /(maxLinesPerPage: )(\d+)/g,
    `$1${maxRowsPerSide}`
  );
  
  // Adicionando comentário sobre a altura da linha em twips
  let updatedContent = deployFileContent;
  
  // Adicionando uma linha no início da função createTableRow ou similar para definir a altura
  updatedContent = updatedContent.replace(
    /(function createTableCell\([^)]+\) {)/,
    `$1\n      // Altura da linha em twips (1 cm = 567 twips, então 0.5cm = 284 twips aproximadamente)`
  );
  
  // Adicionando uma referência à altura da linha nos objetos TableRow
  updatedContent = updatedContent.replace(
    /(new TableRow\({)/g,
    `$1\n          height: {\n            value: ${rowHeight},\n            rule: "exact"\n          },`
  );
  
  // Salvando as alterações
  fs.writeFileSync(deployFilePath, updatedContent);
  
  console.log(`Arquivo de deploy atualizado com sucesso: ${deployFilePath}`);
}

// Executar a atualização
updateDeployFile();