import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import icons from "../../constants/icons.js";
import { styles } from "./addPaciente.style.js";
import Button from "../../components/button/button.jsx";
import Header from "../../components/header/header.jsx";
import TextBox from "../../components/textbox/textbox.jsx";
import api from "../../constants/api.js"; // ✅ Import da API

function AddPaciente(props) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Estado para loading

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
        Alert.alert("Sucesso", "Paciente cadastrado com sucesso!");
        if (navigation) {
          navigation.navigate("home");
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.data?.error) {
        Alert.alert("Erro", error.response.data.error);
      } else {
        Alert.alert("Erro", "Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >


      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Header texto="Cadastrar Paciente" />
          <View style={styles.containerBack}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image source={icons.back2} style={styles.back} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.form}>
              <TextBox
                label="Nome Completo"
                onChangeText={setNome}
                value={nome}
              />
            </View>

            <View style={styles.form}>
              <TextBox
                label="Endereço"
                onChangeText={setEndereco}
                value={endereco}
              />
            </View>

            <View style={styles.form}>
              <TextBox
                label="Telefone"
                onChangeText={setTelefone}
                value={telefone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.form}>
              <TextBox
                label="Data de Nascimento"
                onChangeText={setDataNascimento}
                value={dataNascimento}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.form}>
              <TextBox
                label="CPF"
                onChangeText={setCpf}
                value={cpf}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.form}>
              <Button
                texto={loading ? "Salvando..." : "Salvar"}
                onPress={salvarPaciente}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddPaciente;
