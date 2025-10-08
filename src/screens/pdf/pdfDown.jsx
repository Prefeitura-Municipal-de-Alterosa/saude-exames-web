import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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
    
    const url = `http://localhost:3001/arexamesPesquisar?nome=${encodeURIComponent(paciente)}&exame=${encodeURIComponent(exame)}&finalizado=${encodeURIComponent(finalizado)}`;
    //const url = "http://localhost:3001/arexamesPesquisar?nome=Ana%20Oliveira&exame=Raio%E2%80%91X%20de%20t%C3%B3rax&finalizado=2025-10-07T13%3A28%3A49.119Z";
    // Faz a requisição GET
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resultados = await response.json();
    const textoResultados = JSON.stringify(resultados, null, 2);
    window.alert(textoResultados);

    if (!resultados || resultados.length === 0) {
      
      return;
    }

    // Pega o primeiro resultado (ou ajuste se quiser outro)
    const arquivoNome = resultados[0].id_pdf;
    window.alert(arquivoNome);
    const pdfUrl = `http://localhost:3001/arexames/arquivo/${arquivoNome}`;

    if (Platform.OS === "web") {
      window.open(pdfUrl, "_blank");
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
