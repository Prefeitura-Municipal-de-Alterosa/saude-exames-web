import axios from "axios";

let api = null;

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
      window.alert("❌ Nenhum link com id=1 encontrado.");
      return null;
    }

    console.log("✅ link.json atualizado com sucesso!", linkId1.url);
    return linkId1.url;

  } catch (error) {
    console.error("❌ Erro ao atualizar link.json:", error);
    window.alert("❌ Erro ao atualizar link.json.");
    return null;
  }
}

// Inicializa api dinamicamente
(async () => {
  const link = await atualizarLinkJson();
  if (link) {
    console.log("🔗 URL obtida:", link);
    api = axios.create({
      baseURL: "https://billy-reflection-oxygen-linking.trycloudflare.com",
      timeout: 10000
    });
  }
})();

export default api;
