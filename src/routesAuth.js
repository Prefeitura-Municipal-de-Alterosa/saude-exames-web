import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from "./screens/principal/principal.jsx";
import Cardapio from "./screens/cardapio/cardapio.jsx"
import Busca from "./screens/busca/busca.jsx";
import DetalheProduto from "./screens/detalhe-produto/detalhe-produto.jsx";
import marcaExame from "./screens/marca-exame/marca.jsx";
import recolherExame from "./screens/recolher-exame/recolher.jsx";
import laboratorioExame from "./screens/laboratorio-exame/laboratorio.jsx";
import pdf from "./screens/pdf/pdf.jsx";
import pdfDown from "./screens/pdf/pdfDown.jsx";
import finalizadoExame from "./screens/laboratorio-finalizado/exame-finalizado.jsx";
import addPaciente from "./screens/paciente/addPaciente.jsx";
import DetalhePedido from "./screens/detalhe-pedido/detalhe-pedido.jsx";
import Checkout from "./screens/checkout/checkout.jsx";
import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "./constants/theme.js";

const Stack = createNativeStackNavigator();

function RoutesAuth() {
    return <NavigationContainer>

        <Stack.Navigator>

            <Stack.Screen name="principal" component={Principal} options={{
                headerShown: false
            }} />

            <Stack.Screen name="busca" component={Busca} options={{
                title: "Resultados da busca",
                headerTitleAlign: "center",
                headerTintColor: COLORS.dark_gray,
                headerShadowVisible: false,
                headerBackTitle: "Voltar"
            }} />

            <Stack.Screen name="checkout" component={Checkout} options={{
                headerShadowVisible: false,
                title: "Meu Pedido",
                headerTitleAlign: "center",
                animation: "slide_from_bottom",
                headerBackTitle: "Voltar"
            }} />

            <Stack.Screen name="detalhe-pedido" component={DetalhePedido} options={{
                headerShadowVisible: false,
                title: "Detalhes do Pedido",
                headerTitleAlign: "center",
                animation: "slide_from_bottom",
                headerBackTitle: "Voltar"
            }} />

            <Stack.Screen name="detalhe-produto" component={DetalheProduto} options={{
                headerShown: false
            }} />

            {/* <Stack.Screen name="add-cliente" component={addcliente} options={{
                headerShown: false
            }} /> */}

            <Stack.Screen name="add-Paciente" component={addPaciente} options={{
                headerShown: false
            }} />

            <Stack.Screen name="marca" component={marcaExame} options={{
                headerShown: false
            }} />
         
            <Stack.Screen name="recolher" component={recolherExame} options={{
                headerShown: false
            }} />

            <Stack.Screen name="laboratorio" component={laboratorioExame} options={{
                headerShown: false
            }} />

            <Stack.Screen name="finalizado" component={finalizadoExame} options={{
                headerShown: false
            }} />

            <Stack.Screen name="cardapio" component={Cardapio} options={{
                headerShown: false
            }} />

            <Stack.Screen name="pdf" component={pdf} options={{
                headerShown: false
            }} />
            <Stack.Screen name="pdfDown" component={pdfDown} options={{
                headerShown: false
            }} />


        </Stack.Navigator>

    </NavigationContainer>
}

export default RoutesAuth;