import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styles } from "./cardapio.style.js";
import icons from "../../constants/icons.js";
import api from "../../constants/api.js";

function Cardapio() {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    id_empresa,
    nome,
    cpf,
    endereco,
    telefone,
    data_nascimento,
  } = route.params;

  const [exames, setExames] = useState([]);
  const [cardapio, setCardapio] = useState({ categorias: [] });
  const [exameLista, setExameLista] = useState([]); // ← lista vinda da API /arexames
  const [exameSelecionado, setExameSelecionado] = useState(null);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataAdicao, setDataAdicao] = useState(null);

  useEffect(() => {
    LoadExames();
    LoadDestaque();
    LoadArexames();
  }, []);

  // 🔹 Carrega agendamentos
  async function LoadDestaque() {
    try {
      const response = await api.get("/agendamentos/" + id_empresa);
      const lista = response.data || [];
      console.log("lista paciente_ID", lista);
      setAgendamentos(lista);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Ocorreu um erro. Tente novamente mais tarde"
      );
    }
  }

  // 🔹 Carrega lista de exames disponíveis
  async function LoadExames() {
    try {
      const response = await api.get("/exames");
      if (response.data) {
        console.log("🧪 Exames carregados da API");
        const examesSincronizados = response.data;
        setExames(examesSincronizados);
      }
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao carregar exames.");
    }
  }

  // 🔹 Carrega exames anteriores do paciente
  async function LoadArexames() {
    try {
      const response = await api.get("/arexames");
      const lista = Array.isArray(response.data) ? response.data : [];

      if (!nome) {
        console.warn("⚠️ Variável 'nome' não definida, retornando lista vazia.");
        setExameLista([]);
        return;
      }

      const listaFiltrada = lista.filter(
        (item) => item.id_pacientecpf?.trim() === nome.trim()
      );

      console.log("✅ Resultado da API (Arexames):", listaFiltrada);
      setExameLista(listaFiltrada);
    } catch (error) {
      console.error("❌ Erro ao carregar exames:", error);
      Alert.alert(
        "Erro ao carregar exames",
        error.response?.data?.error ||
          "Não foi possível carregar a lista de exames. Tente novamente."
      );
    }
  }

  // 🔹 Adiciona paciente à fila
  async function AddicionarFila() {
    if (!exameSelecionado || !protocoloSelecionado) {
      Alert.alert("Atenção", "Por favor, selecione o exame e o protocolo.");
      return;
    }

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString();
    setDataAdicao(dataFormatada);

    const payload = {
      paciente_id: id_empresa,
      exame_id: exameSelecionado,
      protocolo_id: protocoloSelecionado,
      data_inicio: dataFormatada,
      status: "AGUARDANDO",
    };

    try {
      const response = await api.post("/agendamentos", payload);
      api.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      Alert.alert("Sucesso", "Paciente agendado com sucesso!");
      navigation.navigate("home");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao agendar paciente.";
      Alert.alert("Erro", msg);
    }
  }

  // 🔹 Seleciona exame
  function selecionarExame(exame) {
    setExameSelecionado(exame.id);
    Alert.alert("Exame selecionado", exame.nome);
  }

  // 🔹 Seleciona protocolo
  function selecionarProtocolo(valor) {
    setProtocoloSelecionado(valor);
    Alert.alert("Protocolo selecionado", `Nível: ${valor}`);
  }

  // 🔹 Abre modal com dados do exame
  function abrirModalData(agendamento) {
    Alert.alert(
      "Exame",
      `Exame: ${agendamento.id_exame}\n` +
        `Paciente: ${agendamento.id_pacientecpf}\n` +
        `Finalizado: ${
          agendamento.finalizado
            ? new Date(agendamento.finalizado).toLocaleString("pt-BR")
            : "Não finalizado"
        }`
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>

      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.containerBack}
        onPress={() => navigation.goBack()}
      >
        <Image source={icons.back2} style={styles.back} />
      </TouchableOpacity>

      {/* Lista de Exames Anteriores */}
      <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          📋 Exames Anteriores
        </Text>

        {Array.isArray(exameLista) && exameLista.length > 0 ? (
          exameLista.map((arexames, index) => (
            <View key={arexames.id || index}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E0F7FA",
                  padding: 16,
                  marginBottom: 14,
                  borderRadius: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() => abrirModalData(arexames)}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Exame:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {arexames.id_exame || "Exame não informado"}
                  </Text>
                </Text>

                <Text style={{ marginTop: 4 }}>
                  Paciente: {arexames.id_pacientecpf || "Não informado"}
                </Text>

                <Text style={{ marginTop: 4 }}>
                  Data de Finalização:{" "}
                  {arexames.finalizado
                    ? new Date(arexames.finalizado).toLocaleString("pt-BR")
                    : "Não finalizado"}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("pdfDown", {
                      paciente: arexames.id_pacientecpf,
                      exame: arexames.id_exame,
                      finalizado: arexames.finalizado,
                      pdf: arexames.id_pdf,
                    })
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0288D1",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={icons.back3}
                    style={{ width: 20, height: 20, tintColor: "#fff" }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      marginLeft: 6,
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    Ver PDF
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: "italic", color: "#7f8c8d" }}>
            Nenhum exame encontrado.
          </Text>
        )}
      </View>

      {/* Dados do paciente */}
      <View style={[styles.header, { marginTop: 20, padding: 15 }]}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          👤 Dados do Paciente
        </Text>
        <View style={styles.headerTextos}>
          <Text style={styles.info}>
            Nome: {nome}{"\n"}
            CPF: {cpf}{"\n"}
            Endereço: {endereco}{"\n"}
            Telefone: {telefone}{"\n"}
            Nascimento: {data_nascimento}{"\n"}
            Paciente ID: {id_empresa}
          </Text>

          {exameSelecionado && (
            <Text style={[styles.info, { color: "#2980b9" }]}>
              Exame Selecionado: {exameSelecionado}
            </Text>
          )}
          {protocoloSelecionado && (
            <Text style={[styles.info, { color: "#27ae60" }]}>
              Protocolo: {protocoloSelecionado}
            </Text>
          )}
          {dataAdicao && (
            <Text style={[styles.info, { color: "#8e44ad" }]}>
              Data de Agendamento: {new Date(dataAdicao).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      {/* Lista de exames disponíveis */}
      <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          🧪 Exames Disponíveis
        </Text>

        {exames.map((exame) => (
          <TouchableOpacity
            key={exame.id}
            style={{
              backgroundColor: "#3498db",
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginVertical: 6,
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={() => selecionarExame(exame)}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {exame.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Protocolo de Manchester */}
      <View style={{ marginTop: 30, paddingHorizontal: 15, alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          🏥 Protocolo de Manchester
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { cor: "Vermelho", valor: 4, corHex: "#e74c3c" },
            { cor: "Amarelo", valor: 3, corHex: "#f1c40f", texto: "#000" },
            { cor: "Verde", valor: 2, corHex: "#2ecc71" },
            { cor: "Azul", valor: 1, corHex: "#3498db" },
          ].map((item) => (
            <TouchableOpacity
              key={item.cor}
              style={{
                backgroundColor: item.corHex,
                padding: 12,
                borderRadius: 10,
                margin: 6,
                minWidth: 110,
                alignItems: "center",
              }}
              onPress={() => selecionarProtocolo(item.valor)}
            >
              <Text style={{ color: item.texto || "#fff", fontWeight: "bold" }}>
                {item.cor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão Adicionar */}
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Button title="➕ Adicionar Paciente" onPress={AddicionarFila} />
      </View>
    </ScrollView>
  );
}

export default Cardapio;
