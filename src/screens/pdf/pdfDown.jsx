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
      // Monta a URL de pesquisa
      const urlFist = `/arexamesPesquisar?nome=${encodeURIComponent(
        paciente
      )}&exame=${encodeURIComponent(exame)}&finalizado=${encodeURIComponent(
        finalizado
      )}`;

      // Busca o PDF correspondente
      const pesquisaResponse = await api.get(urlFist);
      const resultados = pesquisaResponse.data;
      console.log("Resultado da API:", resultados);

      if (!Array.isArray(resultados) || resultados.length === 0) {
        window.alert("Nenhum resultado encontrado.");
        return;
      }

      const primeiroResultado = resultados[0];
      const arquivoNome = primeiroResultado?.id_pdf;

      if (!arquivoNome) {
        window.alert("Erro: o campo 'id_pdf' não foi retornado pela API.");
        return;
      }

      // Agora monta a URL completa do PDF
      const pdfUrl = `${api.defaults.baseURL}/arexames/arquivo/${arquivoNome}`;

      if (Platform.OS === "web") {
        // Faz o download no navegador com token já configurado no Axios
        const fileResponse = await api.get(`/arexames/arquivo/${arquivoNome}`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(fileResponse.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = arquivoNome;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Baixa o arquivo no celular (Android/iOS)
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
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Paciente: {paciente}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Exame: {exame}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Finalizado: {finalizado}
      </Text>

      <TouchableOpacity
        onPress={abrirOuBaixarPDF}
        style={{
          backgroundColor: "#1E90FF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          📄 Baixar Exame
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Pdf;
