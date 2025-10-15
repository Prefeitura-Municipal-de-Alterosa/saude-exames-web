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

function Cardapio(props) {
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
  const [exameSelecionado, setExameSelecionado] = useState(null);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataAdicao, setDataAdicao] = useState(null);

  useEffect(() => {
    LoadExames();
    LoadDestaque();
  }, []);

  async function LoadDestaque() {
    try {
      const response = await api.get("/agendamentos/" + id_empresa);
      const lista = response.data || [];

      // pega apenas os aguardando

      console.log("lista paciente_ID", lista);

      setAgendamentos(lista);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
        "Ocorreu um erro. Tente novamente mais tarde"
      );
    }
  }

  async function LoadExames() {
    try {

      const response = await api.get("/exames");
      if (response.data) {
        console.log("############################### Iniciando Load #####################################");
        const examesSincronizados = [];
        response.data.forEach(exame => {
          examesSincronizados[exame.id] = exame;
        });

        setExames(examesSincronizados);
        console.table(exames);
      }

    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao carregar exames."
      );
    }
  }

  async function AddicionarFila() {
    if (!exameSelecionado || !protocoloSelecionado) {
      Alert.alert("Atenção", "Por favor, selecione o exame e o protocolo.");
      return;
    }

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString(); // formato ISO para API
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
      window.alert("Sucesso", "Paciente agendado com sucesso!");

      if (navigation) {
        navigation.navigate("home");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao agendar paciente.";
      window.alert("Erro", msg);
    }
  }

  function selecionarExame(exame) {
    setExameSelecionado(exame.id);
    window.alert("Exame selecionado", exame.nome);
  }

  function selecionarProtocolo(valor) {
    setProtocoloSelecionado(valor);
    window.alert("Protocolo selecionado", `Nível: ${valor}`);
  }

  function abrirModalData(agendamento) {
    Alert.alert(
      "Agendamento",
      `Status: ${agendamento.status}\nData Início: ${agendamento.data_inicio}\nData Agendamento: ${agendamento.data_agendado}`
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

      {/* Imagem do paciente / cardápio */}
      {cardapio.foto && (
        <View style={styles.containerFoto}>
          <Image
            source={{ uri: cardapio.foto }}
            style={styles.foto}
            resizeMode="cover"
          />
        </View>
      )}


      {/* Lista de agendamentos */}
      <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>

          📋 Exames Anteriores
        </Text>

        {agendamentos?.length > 0 ? (
          agendamentos.map((agendamento) => (
            <View key={agendamento.id}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#ADD8E6",
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => abrirModalData(agendamento)}
              >
                <Text style={{ fontWeight: "bold" }}>
                  Status: <Text style={{ fontWeight: "normal" }}>{agendamento.status}</Text>
                </Text>
                <Text>
                  Exame: {exames[5]?.nome || "Exame não encontrado"}
                </Text>
                <Text>
                  Data Início: {new Date(agendamento.data_inicio).toLocaleDateString()}
                </Text>
                <Text>
                  Data Agendamento: {agendamento.data_agendado}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("pdfDown", {
                      paciente: nome,
                      exame: exames[agendamento.exame_id]?.nome || "Exame não encontrado",
                      finalizado: agendamento.data_agendado
                    })
                  }
                >
                  <Image source={icons.back3} style={styles.back} />
                </TouchableOpacity>
              </TouchableOpacity>

            </View>




          ))
        ) : (
          <Text style={{ fontStyle: "italic", color: "#7f8c8d" }}>
            Nenhum agendamento encontrado.
          </Text>
        )}
      </View>

      {/* Dados do paciente */}
      <View style={[styles.header, { marginTop: 20, padding: 15 }]}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          👤 Dados do Paciente
        </Text>
        <View style={styles.headerTextos}>
          <Text style={styles.info}>Nome: {nome}
            CPF: {cpf}
            Endereço: {endereco}
            Telefone: {telefone}
            Nascimento: {data_nascimento}
            Paciente ID: {id_empresa}</Text>

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

      {/* Lista de exames */}
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
