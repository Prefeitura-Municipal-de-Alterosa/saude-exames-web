import React, { useRef } from "react";
import api from "../../constants/api.js";

function Pdf({ route, navigation }) {
  // Parâmetros vindos da tela anterior
  const { paciente, exame, dataAgendamento, cpf } = route?.params || {};

  const inputFileRef = useRef(null);

  // Abre o seletor de arquivo
  const confirmarAgendamento = () => {
    inputFileRef.current.click();
  };

  // Envia o arquivo selecionado
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("nome", paciente);
    formData.append("exame", exame);
    formData.append("finalizado", dataAgendamento);
    formData.append("cpf", cpf);

    try {
      const response = await api.post("/arexames", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        window.alert("✅ PDF enviado com sucesso!");

        if (navigation) {
          navigation.navigate("laboratorio", { paciente, exame });
        }
      } else {
        console.error("Erro ao enviar PDF:", response);
        window.alert("❌ Erro ao enviar PDF. Verifique o servidor.");
      }
    } catch (err) {
      console.error("Erro ao enviar o arquivo:", err);
      window.alert("❌ Ocorreu um erro ao enviar o PDF. Verifique a conexão.");
    }
  };


  return (
    <div style={{ padding: 20, backgroundColor: "#222", color: "#fff" }}>
      <p><strong>Paciente:</strong> {paciente}</p>
      <p><strong>Exame:</strong> {exame}</p>
      <p><strong>Data da Entrega:</strong> {dataAgendamento}</p>

      <button onClick={confirmarAgendamento}>Selecionar PDF</button>

      {/* input invisível */}
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
