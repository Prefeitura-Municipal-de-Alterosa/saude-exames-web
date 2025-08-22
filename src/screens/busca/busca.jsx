import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import api from "../../constants/api.js";
import { styles } from "./busca.style.js";

function Busca(props) {
    const nome = props.route.params.busca; // Corrigido para pegar 'nome'
    const [pacientes, setPacientes] = useState([]);

    async function LoadSearch() {
        try {
            
            const response = await api.get(`/pacientes/id`, {
                params: {
                    nome: "oliveira"
                }
            });

            if (response.data && response.data.length > 0) {
                setPacientes(response.data);
            } else {
                Alert.alert("Paciente não encontrado.");
            }
        } catch (error) {
            if (error.response?.data?.error) {
                Alert.alert("Erro:", error.response.data.error);
            } else {
                console.error("Erro ao buscar paciente:", error);
                Alert.alert("Ocorreu um erro. Tente novamente mais tarde.");
            }
        }
    }

    useEffect(() => {
        LoadSearch();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={pacientes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.nomePaciente}>{item.nome}</Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
                )}
            />
        </View>
    );
}

export default Busca;
