// import React, { useRef } from "react";

// function Marcar() {
//   const inputFileRef = useRef(null);

//   const confirmarAgendamento = async () => {
//     // ... lógica de atualização do agendamento
//     // Ao final, dispara o input para selecionar PDF
//     inputFileRef.current.click();
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // enviar PDF
//     const formData = new FormData();
//     formData.append("arquivo", file);
//     formData.append("nome", "Nome do Paciente");

//     try {
//       const response = await fetch("http://localhost:3001/arexames", {
//         method: "POST",
//         body: formData,
//       });
//       alert("✅ PDF enviado com sucesso!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Erro ao enviar PDF");
//     }
//   };

//   return (
//     <div>
//       <button onClick={confirmarAgendamento}>Confirmar Agendamento</button>

//       {/* Input invisível no JSX */}
//       <input
//         type="file"
//         ref={inputFileRef}
//         style={{ display: "none" }}
//         accept="application/pdf"
//         onChange={handleFileChange}
//       />
//     </div>
//   );
// }




import React, { useEffect, useState,useRef } from "react";

import {
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  Modal,
  Button as RNButton,
} from "react-native";

import icons from "../../constants/icons.js";
import { styles } from "./laboratorio.style.js";

import Button from "../../components/button/button.jsx";
import TextBox from "../../components/textbox/textbox.jsx";
import Header from "../../components/header/header.jsx";
import api from "../../constants/api.js";

function Marcar(props) {
  const inputFileRef = useRef(null);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [agendamentoAtual, setAgendamentoAtual] = useState(null);

  useEffect(() => {
    LoadDestaque();
  }, []);

  // Função para abrir modal e selecionar data
  const abrirModalData = (agendamento) => {
    setAgendamentoAtual(agendamento);
    setDataSelecionada(agendamento.data_inicio || "");
    setModalVisible(true);
  };

  const confirmarAgendamento = async () => {
    const agendamento = agendamentoAtual;
    const dataExame = dataSelecionada;

    if (!dataExame) {
      window.alert("Operação cancelada. Nenhuma data informada.");
      setModalVisible(false);
      return;
    }

    const nomePaciente = agendamento.nome_paciente || "o paciente";
    const confirmar = window.confirm(
      `Deseja realmente adicionar este Resultado?\n\nPaciente: ${nomePaciente}\nData do exame: ${dataExame}`
    );

    if (!confirmar) {
      window.alert("Operação cancelada.");
      setModalVisible(false);
      return;
    }

    try {
      const dataAtual = new Date();
      const dataFormatada = dataAtual.toISOString();

      const payload = {
        paciente_id: agendamento.paciente_id,
        exame_id: agendamento.exame_id,
        protocolo_id: agendamento.protocolo_id,
        data_inicio: dataExame,
        data_agendado: dataFormatada,
        status: "FINALIZADO",
      };

      const response = await api.put("/agendamentos/" + agendamento.id, payload);

      if (response.data?.token) {
        api.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      }

      window.alert(
        `✅ Resultado Realizada Com sucesso !\n\nPaciente: ${nomePaciente}\nData do exame: ${dataExame}`
      );
      LoadDestaque();
    } catch (error) {
      if (error.response?.data?.error) {
        window.alert(error.response.data.error);
      } else {
        window.alert("Ocorreu um erro. Tente novamente mais tarde.");
      }
    } finally {
      setModalVisible(false);
    }
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
      const response = await fetch("http://localhost:3001/arexames", {
        method: "POST",
        body: formData,
      });
      alert("✅ PDF enviado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao enviar PDF");
    }
  };
  /////////////////////////////////////////////////////////////////// INICIO funcao add pdf /////////////////////////////////////////

  
   /////////////////////////////////////////////////////////////////// FIM  funcao add pdf /////////////////////////////////////////

  async function LoadDestaque(termo) {

    try {
      const response = await api.get("/agendamentos");
      const lista = response.data || [];
      const aguardando = lista.filter((item) => item.status === "LABORATORIO");

      const responseExame = await api.get("/exames");
      const exames = responseExame.data || [];

      const responsePaciente = await api.get("/pacientes");
      const pacientes = responsePaciente.data || [];

      const aguardandoComNome = aguardando.map((item) => {
        const exameEncontrado = exames.find((e) => e.id === item.exame_id);
        const pacienteEncontrado = pacientes.find((p) => p.id === item.paciente_id);

        return {
          ...item,
          nome_exame: exameEncontrado ? exameEncontrado.nome : "Exame não encontrado",
          nome_paciente: pacienteEncontrado ? pacienteEncontrado.nome : "Paciente não encontrado",
        };
      });

      const aguardandoFiltrado = termo
        ? aguardandoComNome.filter((item) =>
            item.nome_paciente.toLowerCase().includes(termo.toLowerCase())
          )
        : aguardandoComNome;

      setAgendamentos(aguardandoFiltrado);
    } catch (error) {
      window.alert(error.response?.data?.error || "Ocorreu um erro. Tente novamente mais tarde");
    }
  }

  const validarCampos = () => {
    if (!nome || !endereco || !telefone || !dataNascimento || !cpf) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    return true;
  };

  const salvarPaciente = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);

      const response = await api.post("/pacientes", {
        nome,
        endereco,
        telefone,
        data_nascimento: dataNascimento,
        cpf,
      });

      setLoading(false);

      if (response.data) {
        window.alert("Sucesso", "Paciente cadastrado com sucesso!");
        LoadDestaque();
      }
    } catch (error) {
      setLoading(false);
      window.alert("Erro", error.response?.data?.error || "Erro ao salvar.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Header texto="Resultado ao Laboratório" />

          <View style={styles.containerBack}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image source={icons.back2} style={styles.back} />
            </TouchableOpacity>
          </View>

          <View style={styles.busca}>
            <TextBox
              placeholder="Digite o Nome do Paciente ?"
              onChangeText={(texto) => setBusca(texto)}
              value={busca}
              returnKeyType="search"
              onSubmit={LoadDestaque}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
              Resultado Aguardando:
            </Text>

            {agendamentos?.length > 0 ? (
              agendamentos.map((agendamento) => (
                <TouchableOpacity
                  key={agendamento.id}
                  style={{
                    backgroundColor: "#ADD8E6",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => abrirModalData(agendamento)}
                >
                  <Text>Paciente: {agendamento.nome_paciente}</Text>
                  <Text>Exame: {agendamento.nome_exame}</Text>
                  <Text>Protocolo: {agendamento.protocolo_id}</Text>
                  <Text>Status: {agendamento.status}</Text>
                  <Text>Data Início: {agendamento.data_inicio}</Text>
                  <div>
                <button >Confirmar Agendamento</button>

                {/* Input invisível no JSX */}
                <input         type="file"
                  ref={inputFileRef}
                  style={{ display: "none" }}
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ fontStyle: "italic" }}>
                Nenhum Resultado "aguardando".
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Modal para seleção de data */}
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: 300,
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Escolha a data Resultado Exame</Text>
              <input
                type="date"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                style={{ marginBottom: 20 }}
              />
              <RNButton title="Confirmar" onPress={confirmarAgendamento} />
              <RNButton
                title="Cancelar"
                color="red"
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
    
  );
}

export default Marcar;
