import React, { Component } from "react";
import { StyleSheet, View, Image, StatusBar, Alert, TouchableOpacity } from "react-native";
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ioApi from "../socket";

let io = null;
global.pin;

export class EnterPin extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.hardwareBackPress = this.hardwareBackPress.bind(this);
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
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);

      io = ioApi('game');
      io.on('join', (data) => {
        if (data.status) {
          this.props.navigation.navigate('EnterUserName', { pin: this.state.pin });
        }
        else
          Alert.alert("", "PIN not found!");
      });
    }
    catch (error) {
      Alert.alert("Error", error)
    }
  }

  componentWillUnmount() {
    BackHandler.removeListener('hardwareBackPress', this.hardwareBackPress)
    io.removeListener('join')
  }

  hardwareBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <TouchableOpacity style={styles.exitButton} onPress={() => this.props.navigation.goBack()}>
          <Icon name="times" size={35} color="white" />
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center"
  },
  exitButton: {
    top: "-25%",
    left: "-40%"
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
