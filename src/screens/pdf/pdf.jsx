import React, { useRef } from "react";
import api from "../../constants/api.js";

function pdf() {
  const inputFileRef = useRef(null);

  const confirmarAgendamento = async () => {
    // ... lógica de atualização do agendamento
    // Ao final, dispara o input para selecionar PDF
    inputFileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // enviar PDF
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("nome", "Nome do Paciente");

    try {
      const response = await fetch(api, {
        method: "POST",
        body: formData,
      });
      alert("✅ PDF enviado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao enviar PDF");
    }
  };

  return (
    <div>
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