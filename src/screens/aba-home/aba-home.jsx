import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Alert,
  Image,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./aba-home.style.js";
import icons from "../../constants/icons.js";
import api from "../../constants/api.js";

import TextBox from "../../components/textbox/textbox.jsx";
import Categorias from "../../components/categorias/categorias.jsx";
import Banners from "../../components/banners/banners.jsx";

import { CartContext } from "../../contexts/cart.js";

function AbaHome(props) {
  const { itens } = useContext(CartContext);

  const [qtdItem, setQtdItem] = useState(0);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanner] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    LoadBanner();
    LoadDestaque();
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      setQtdItem(itens.length > 0 ? itens.length : 0);
    }, [itens])
  );

  // Carrega banners
  async function LoadBanner() {
    try {
      setBanner([
        {
          id_banner: 2,
          icone: "https://i.pinimg.com/736x/6b/57/99/6b57998cffef62419fa4e63c8730c5b2.jpg",
          id_empresa: 12,
          ordem: 81,
          nome: "Novo Paciente",
          link: "add-Paciente",
        },
        {
          id_banner: 1,
          icone: "https://smetal.org.br/wp-content/uploads/2024/04/internasaudeOMS.png",
          id_empresa: 10,
          nome: "Agendar Coleta",
          ordem: 1,
          link: "marca",
        },
        {
          id_banner: 3,
          icone: "https://i.pinimg.com/1200x/64/e6/0c/64e60cbf33462a83bc6a118a6cc9e2f1.jpg",
          id_empresa: 4,
          nome: "Coleta para Laboratório",
          ordem: 3,
          link: "recolher",
        },
        {
          id_banner: 4,
          icone: "https://i.pinimg.com/736x/6a/fa/17/6afa17c7e388b0401da3c9b457b870a2.jpg",
          id_empresa: 4,
          nome: "Receber do Laboratório",
          ordem: 4,
          link: "laboratorio",
        },
        {
          id_banner: 5,
          icone: "https://i.pinimg.com/736x/23/0c/10/230c10f7d089f6f39f62c6e558178fdb.jpg",
          id_empresa: 5,
          nome: "Entregar Resultados",
          ordem: 5,
          link: "finalizado",
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Ocorreu um erro ao carregar banners.");
    }
  }

  // Carrega pacientes/destaques
  async function LoadDestaque(termo) {
    try {
      let response;
      if (termo) {
        response = await api.post("/pacientes/id", { nome: termo });
      } else {
        response = await api.get("/pacientes");
      }

      if (response.data && typeof response.data === "object") {
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        setRestaurantes(dataArray);
        
      } else {
        setRestaurantes([]);
        Alert.alert("Erro", "Resposta inválida da API. Verifique o servidor.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.error || "Ocorreu um erro ao carregar pacientes.");
    }
  }

  // Favoritos
  async function RemoveFavorito(id) {
    try {
      const response = await api.delete(`/empresas/${id}/favoritos`);
      if (response.data) LoadDestaque();
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Falha ao remover favorito.");
    }
  }

  async function AddFavorito(id) {
    try {
      const response = await api.post(`/empresas/${id}/favoritos`);
      if (response.data) LoadDestaque();
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Falha ao adicionar favorito.");
    }
  }

  // Navega para telas
  function SearchCategoria(id) {
    props.navigation.navigate("busca", { id_categoria: id });
  }

  function SearchBanner(id) {
    const bannerSelecionado = banners.find(b => b.id_banner === id);
    if (bannerSelecionado) {
      props.navigation.navigate(bannerSelecionado.link, { id_categoria: id });
    } else {
      Alert.alert("Erro", "Banner não encontrado.");
    }
  }

  function OpenCardapio(restaurante) {
    props.navigation.navigate("cardapio", {
      nome: restaurante.nome || "-",
      cpf: restaurante.cpf || "-",
      id_empresa: restaurante.id || "-",
      endereco: restaurante.endereco || "-",
      telefone: restaurante.telefone || "-",
      data_nascimento: restaurante.data_nascimento || "-",
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Image source={icons.logo} style={styles.logo} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.busca}>
          <TextBox
            placeholder="Digite o Nome do Paciente ?"
            onChangeText={texto => setBusca(texto)}
            value={busca}
            returnKeyType="search"
            onSubmit={() => LoadDestaque(busca)}
          />
        </View>

        <Categorias dados={categorias} onClick={SearchCategoria} />
        <Banners dados={banners} onClick={SearchBanner} />

        <View>
          <Text style={styles.destaques}>Destaques</Text>
        </View>

        {restaurantes.length === 0 && (
          <Text style={{ margin: 10 }}>Nenhum paciente encontrado.</Text>
        )}

        {restaurantes.map((restaurante, index) => (
          <TouchableOpacity
            key={index}
            style={{ marginBottom: 10, padding: 8, backgroundColor: '#ADD8E6', borderRadius: 8 }}
            onPress={() => OpenCardapio(restaurante)}
          >
            <Text>Nome: {restaurante.nome || "-"}</Text>
            <Text>Endereço: {restaurante.endereco || "-"}</Text>
            <Text>Telefone: {restaurante.telefone || "-"}</Text>
            <Text>Data Nascimento: {restaurante.data_nascimento || "-"}</Text>
            <Text>CPF: {restaurante.cpf || "-"}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AbaHome;
