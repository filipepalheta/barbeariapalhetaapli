import { StyleSheet, Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

const loginStyles = StyleSheet.create({
  brandView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  brandViewText: {
    color: '#ffffff',
    fontSize: 23,
    textTransform:'uppercase',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 1,
    backgroundColor: 'white',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  forgotPassView: {
    height: 50,
    marginTop: 20,
    flexDirection: 'row'
  },
  loginButton: {
    alignItems: 'center',
    width: width / 2,
    justifyContent: 'center',
    borderRadius: 55
  },
  registerStepButton: {
    alignItems: 'center',
    width: width / 2,
    justifyContent: 'center',
  }
});

export default loginStyles;