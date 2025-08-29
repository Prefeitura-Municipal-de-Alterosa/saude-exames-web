import axios from "axios";
import link from "./link.json"; // caminho relativo ao api.js


async function getExames() {
  try {
    const response = await axios.get("http://localhost:3001/linkurl/");
    
    // Print no console
    console.log("📄 Resultado do GET /linkurl:", response.data);

    // Alerta no navegador formatado
    window.alert(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Erro ao buscar exames:", error);
    window.alert("Erro ao buscar exames.");
  }
}

async function atualizarLinkJson() {
  try {
    // Faz o GET no backend
    const response = await axios.get("http://localhost:3001/linkurl/");

    // Supondo que a API retorne um array de objetos [{ id: 1, url: "..." }, ...]
    const dados = response.data;

    // Procura o item com id = 1
    const linkId1 = dados.find(item => item.id === 1);

    if (!linkId1) {
      console.error("❌ Nenhum link com id=1 encontrado.");
      return;
    }

    // Monta o conteúdo do link.json
    const novoLink = { url: linkId1.url };

    // Salva no arquivo link.json
    fs.writeFileSync("./link.json", JSON.stringify(novoLink, null, 2));

    console.log("✅ link.json atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar link.json:", error);
  }
}

// Executa a função
atualizarLinkJson();
getExames();
const api = axios.create({
  baseURL: link.url,
  timeout: 10000
});

export default api;
