import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import api from "../../constants/api.js";

function Pdf({ route, navigation }) {
  const { paciente, exame, finalizado } = route.params;
  const inputFileRef = useRef(null);

  const abrirOuBaixarPDF = async () => {
    try {
      // const paciente = "Ana Oliveira";
      // const exame = "Raio‑X de tórax";
      // const finalizado = "2025-10-07T13:28:49.119Z";

      // Monta a URL com query params  http://localhost:3001/arexamesPesquisar?nome=Ana%20Oliveira&exame=Raio%E2%80%91X%20de%20t%C3%B3rax&finalizado=2025-10-07T13%3A28%3A49.119Z
      // Resultado   
      // "id": 38,
      // "id_pacientecpf": "Ana Oliveira",
      // "id_pdf": "1759843743351-697498109.pdf",
      // "id_exame": "Raio‑X de tórax",
      // "finalizado": "2025-10-07T13:28:49.119Z"
      //window.alert(`resultado obitidop na passagem de paramnetros :\n${paciente+"|"+exame+"|"+finalizado}`);
      const urlFist = `/arexamesPesquisar?nome=${encodeURIComponent(paciente)}&exame=${encodeURIComponent(exame)}&finalizado=${encodeURIComponent(finalizado)}`;
      //const urlFist = "/arexamesPesquisar?nome=Adriana%20Teixeira&exame=Hemograma%20completo&finalizado=2025-10-09T11%3A36%3A33.965Z";
      
      const response = await api.get(urlFist);
      const resultados = response.data;
      console.log("Resultado da API:", resultados);

      // Verifica se retornou dados válidos
      if (!Array.isArray(resultados) || resultados.length === 0) {
        console.warn("Nenhum resultado encontrado na resposta da API.");
        window.alert("Nenhum resultado encontrado.");
        return;
      }

      // Exibe os resultados de forma organizada no console (para depuração)
      console.table(resultados);

      // Monta um texto legível para o alerta (limitando o tamanho)
      const textoResultados = JSON.stringify(resultados.slice(0, 3), null, 2);
     // window.alert(`Resultados obtidos:\n${textoResultados}`);

      // Pega o primeiro resultado e valida se possui o campo id_pdf
      const primeiroResultado = resultados[0];
      const arquivoNome = primeiroResultado?.id_pdf;

      if (!arquivoNome) {
        console.error("Campo 'id_pdf' não encontrado no primeiro resultado.");
        window.alert("Erro: o campo 'id_pdf' não foi retornado pela API.");
        return;
      }

      const pdfUrl = `${api.defaults.baseURL}/arexames/arquivo/${arquivoNome}`;

      if (Platform.OS === "web") {
        window.location.href = pdfUrl;
      } else {
        const fileUri = FileSystem.documentDirectory + arquivoNome;
        const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Download concluído", "Arquivo salvo em: " + uri);

        }
      }
      if (navigation) {
            navigation.navigate("home");
          }
    } catch (error) {
      console.error("Erro ao abrir/baixar PDF:", error);
      Alert.alert("Erro", "Não foi possível abrir o PDF");
      if (navigation) {
        navigation.navigate("home");
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Paciente: {paciente}</Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Exame: {exame}</Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Finalizado: {finalizado}</Text>

      <TouchableOpacity
        onPress={abrirOuBaixarPDF}
        style={{
          backgroundColor: "#1E90FF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>📄 Baixar Exame</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Pdf;
