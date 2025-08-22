import { COLORS, FONT_SIZE } from "../../constants/theme"

export const styles = {

    container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",        // CENTRALIZA HORIZONTAL
    justifyContent: "center",    // CENTRALIZA VERTICAL (cuidado, pode cortar se tiver scroll)
    padding: 20,
  },
  containerBack: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  back: {
    width: 40,
    height: 40,
  },
  containerFoto: {
    width: 300,
    height: 150,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  foto: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  header: {
    width: "100%",
    alignItems: "center",  // centraliza texto dentro do headerTextos
    marginBottom: 20,
  },
  headerTextos: {
    alignItems: "center",
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cpf: {
    fontSize: 16,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 3,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  botaoPequeno: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  textoBotaoPequeno: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

}


 