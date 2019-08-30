import React, { Component } from "react";
import { StyleSheet, View, Image, StatusBar, Alert, BackHandler, TouchableOpacity } from "react-native";
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ioApi from "../socket";

let io = null;

export class EnterUserName extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      nick: ''
    }
  }

  componentDidMount() {
    try {
      io = ioApi.connectionsRoom('game');
      /*io.on('gameStart', () => {
        this.setState({ nick: '' });
        Alert.alert("", "You're late for this test!");
        this.props.navigation.navigate('Home');
      });*/
      io.on('usernameErr', (data) => {
        Alert.alert("Error", data);
      });
      io.on('start', () => {
        this.setState({ nick: '' });
        this.props.navigation.navigate('Lobby', { pin: this.props.navigation.getParam('pin', 0), admin: false });
      })

      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }
    catch (error) {
      Alert.alert("Error", "EnterUserName componentDidMount\n" + JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener('gameStart');
      io.removeListener('start');
      io.removeListener('usernameErr');
    }
    catch (error) {
      Alert.alert("Error", "EnterUserName componentWillUnmount\n" + JSON.stringify(error));
    }
    this.backHandler.remove()
  }

  sendButton() {
    io.emit('sendUsername', this.state.nick);
  }

  hardwareBackPress = () => {
    Alert.alert("", "Are you sure you want to quit the quiz?", [
      { text: 'No' },
      { text: 'Yes', onPress: () => this.props.navigation.navigate('Home') }
    ]);
    return true;
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <TouchableOpacity style={styles.exitButton} onPress={() => this.hardwareBackPress()}>
          <Icon name="times" size={35} color="white" />
        </TouchableOpacity>
        <Image style={styles.logo} source={require('../assets/icon/logo-w.png')} resizeMode="center" />
        <View style={{ width: "75%" }}>
          <Input
            placeholder='User Name'
            onChangeText={(nick) => this.setState({ nick})}
            value={this.state.nick}
            containerStyle={styles.input}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ textAlign: "center", fontSize: 20, fontFamily: "PoppinsMedium"}} />
          <Button
            onPress={() => this.sendButton()}
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

export default EnterUserName;
