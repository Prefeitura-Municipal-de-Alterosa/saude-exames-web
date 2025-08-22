import { Image, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { styles } from "./banners.style.js";

function Banners(props) {
    return <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
                props.dados.map((banner, index) => {
                    return <View key={index} style={styles.banner}>
                        <TouchableOpacity
                            onPress={() => props.onClick(banner.id_banner)}
                            style={styles.botao}
                        >
                            <Text style={styles.texto}>{banner.nome}</Text>
                            <Image style={styles.icone} source={{ uri: banner.icone }} />
                        </TouchableOpacity>
                    </View>
                })
            }
        </ScrollView>
    </View>
}

export default Banners;