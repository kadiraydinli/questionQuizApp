import React, { Component } from "react";
import { StyleSheet, View, Image, StatusBar, Alert } from "react-native";
import { Button, Input } from 'react-native-elements';
import ioApi from "../socket";

let io = null;
global.pin;

export class EnterPin extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      pin: ''
    }
  }

  send() {
    try {
      io.emit('sendPin', this.state.pin);
    }
    catch (error) {
      Alert.alert('Error', error)
    }
  }

  componentDidMount() {
    try {
      io = ioApi('game');

      io.on('join', (data) => {
        if (data.status) {
          global.pin=this.state.pin;
          this.props.navigation.navigate('EnterUserName');
        }
        else
          Alert.alert("", "Pin bulunamadı");
      });
    }
    catch (error) {
      Alert.alert("Error", error)
    }
  }

  componentWillUnmount() {
    io.removeListener('join')
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <Image style={styles.logo} source={require('../assets/icon/logo-w.png')} resizeMode="center" />
        <View style={{ width: "75%" }}>
          <Input
            placeholder='Game PIN'
            onChangeText={(pin) => this.setState({pin})}
            value={this.state.pin}
            containerStyle={styles.input}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            keyboardType="numeric"
            inputStyle={{ textAlign: "center", fontSize: 20, fontFamily: "PoppinsMedium"}} />
          <Button
            onPress={() => this.send()}
            titleStyle={{ fontSize: 18, fontFamily: "PoppinsMedium" }}
            buttonStyle={styles.button}
            title="Enter" />
        </View>
        <View style={styles.bottomShape} />
        <View style={styles.topShape} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(155,58,219,1)",
    justifyContent: "center", alignItems: "center"
  },
  bottomShape: {
    top: "85.22%",
    left: -80,
    width: 262,
    height: 240,
    backgroundColor: "rgba(169,77,231,1)",
    position: "absolute",
    opacity: 0.95,
    transform: [{ rotate: "45deg" }],
    zIndex: -1
  },
  topShape: {
    top: -150,
    left: 280,
    width: 262,
    height: 240,
    backgroundColor: "rgba(168,75,230,1)",
    position: "absolute",
    opacity: 0.95,
    transform: [{ rotate: "-45deg" }],
    zIndex: -1
  },
  logo: {
    width: '30%',
    height: '30%',
    marginTop: -110
  },
  input: {
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 20,
    height: 70
  },
  button: {
    borderRadius: 5,
    marginBottom: 20,
    height: 45,
    backgroundColor: "#FFB200"
  },
});

export default EnterPin;
