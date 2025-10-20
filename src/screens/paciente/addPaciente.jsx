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

function AddPaciente({ props, navigation }) {
  const [nome, setNome] = useState("");
  const [exame, setExame] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Estado para loading
  const [loading2, setLoading2] = useState(false); // ✅ Estado para loading

  const validarCampos = () => {
    if (!nome || !endereco || !telefone || !dataNascimento || !cpf) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    return true;
  };
  const validarCampos2 = () => {
    if (!exame) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    return true;
  };

  const salvarPaciente = async () => {
    if (!validarCampos()) {
      window.alert("Todos Campos sao Necessario")
      return;
    }

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
  const salvarExame = async () => {
    if (!validarCampos2()) {
      window.alert("Compo Exame neecessario")
      return;
    }

    try {
      setLoading2(true);

      const response = await api.post("/exames", {
        nome: exame,

      });

      setLoading2(false);

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
                value={dataNascimento}
                keyboardType="numeric"
                onChangeText={(text) => {
                  // Remove tudo que não for número
                  let cleaned = text.replace(/\D/g, "");

                  // Aplica a máscara manualmente
                  if (cleaned.length <= 2) {
                    setDataNascimento(cleaned);
                  } else if (cleaned.length <= 4) {
                    setDataNascimento(cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2"));
                  } else {
                    setDataNascimento(cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3"));
                  }
                }}
                placeholder="DD/MM/AAAA"
              />
            </View>


            <View style={styles.form}>
              <TextBox
                label="CPF"
                value={cpf}
                keyboardType="numeric"
                maxLength={14} // impede que digite mais que o necessário
                placeholder="000.000.000-00"
                onChangeText={(text) => {
                  // Remove tudo que não for número
                  let cleaned = text.replace(/\D/g, "");

                  // Aplica a máscara de CPF
                  if (cleaned.length <= 3) {
                    setCpf(cleaned);
                  } else if (cleaned.length <= 6) {
                    setCpf(cleaned.replace(/(\d{3})(\d{1,3})/, "$1.$2"));
                  } else if (cleaned.length <= 9) {
                    setCpf(cleaned.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3"));
                  } else {
                    setCpf(cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4"));
                  }
                }}
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
          <View style={styles.formGroup}>
            <View style={styles.form}>
              <TextBox
                label="Nome do Exame"
                onChangeText={setExame}
                value={exame}
              />
            </View>


            <View style={styles.form}>
              <Button
                texto={loading2 ? "Salvando..." : "Salvar"}
                onPress={salvarExame}
                disabled={loading2}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddPaciente;
