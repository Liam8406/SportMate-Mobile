import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  logo: {
    width: 500,
    height: 290,
    resizeMode: "contain",
    marginTop: -50,
    marginBottom: -100,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2F64C7",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#ECECEC",
    borderRadius: 30,
    marginBottom: 18,
    paddingHorizontal: 25,
    fontSize: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  button: {
    width: "100%",
    height: 65,
    backgroundColor: "#2F64C7",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  bottomContainer: {
    flexDirection: "row",
    marginTop: 20,
  },

  bottomText: {
    fontSize: 18,
  },

  link: {
    color: "#2F64C7",
    fontSize: 18,
    marginLeft: 5,
  },
  message: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
});