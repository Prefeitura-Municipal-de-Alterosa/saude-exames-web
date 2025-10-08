import React, { useRef } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import api from "../../constants/api.js";

function pdf() {

   const {
    paciente,
    exame,
  } = route.params;
  const inputFileRef = useRef(null);

  const confirmarAgendamento = async () => {
    // ... lógica de atualização do agendamento
    // Ao final, dispara o input para selecionar PDF
    inputFileRef.current.click();
  };

  const handleFileChange = async (e) => {
    console.log("API" + api); 
    const file = e.target.files[0];
    if (!file) return;

    // enviar PDF
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("nome", "Nome do Paciente");

    try {
      const response = await fetch("http://localhost:3001/arexames", {
        method: "POST",
        body: formData,
      });
      alert("✅ PDF enviado com sucesso! 2" + api);
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao enviar PDF");
    }
  };

  return (
    <div>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    {paciente}
      </Text>
      <button onClick={confirmarAgendamento}>Confirmar Agendamento</button>

      {/* Input invisível no JSX */}
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
export default pdf;