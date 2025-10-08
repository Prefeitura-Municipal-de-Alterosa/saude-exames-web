import React, { useRef } from "react";
import { Text, Alert } from "react-native";
import api from "../../constants/api.js";

function Pdf({ route, navigation }) {
  const { paciente, exame, dataAgendamento } = route.params; // Recebe parâmetros da tela anterior
  const inputFileRef = useRef(null);

  // Função que abre o seletor de arquivos
  const confirmarAgendamento = async () => {
    inputFileRef.current.click();
  };

  // Função que envia o PDF selecionado
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // FormData com o PDF e o nome do paciente
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("nome", paciente); // passa o paciente do parâmetro
    formData.append("exame", exame);  // passa o exame do parâmetro, se quiser
    formData.append("finalizado", dataAgendamento);  // passa o exame do parâmetro, se quiser

    try {
      const response = await fetch("http://localhost:3001/arexames", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Alert.alert("✅ PDF enviado com sucesso!");

        // Se quiser, pode redirecionar para a tela "laboratorio" passando parâmetros
        if (navigation) {
          navigation.navigate("laboratorio", { paciente, exame });
        }
      } else {
        Alert.alert("❌ Erro ao enviar PDF");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Erro ao enviar PDF");
    }
  };

  return (
    <div>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
        Paciente: {paciente}
      </Text>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
        Exame: {exame}
      </Text>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
        Data da Entrega: {dataAgendamento}
      </Text>

      <button onClick={confirmarAgendamento}>Confirmar Agendamento</button>

      {/* Input invisível para selecionar PDF */}
      <input
        type="file"
        ref={inputFileRef}
        style={{ display: "none" }}
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default Pdf;
