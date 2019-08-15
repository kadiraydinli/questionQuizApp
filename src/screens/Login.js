import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from 'react-native-elements';
import ioApi from "../socket";

let io = null;

export class Login extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      token: ''
    }
  }

  async _setTokenStorage(token) {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      Alert.alert("Error", error)
    }
  }

  componentDidMount() {
    io = ioApi('user');

    io.on('succLogin', (token) => {
      this._setTokenStorage(token);
      this.props.navigation.navigate('Home');
    });

    io.on('loginErr', (data) => {
      Alert.alert("Error", data.message)
    });
  }
  
  componentWillUnmount() {
    io.removeListener('succLogin')
    io.removeListener('loginErr')
  }

  loginButton() {
    io.emit('userLogin', { email: this.state.email, password: this.state.password });
    //{email:this.state.email, password: this.state.password}
  }
  
  render() {
    return (
      <View style={styles.root}>
      <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <Image style={styles.logo} resizeMode="center" source={require('../assets/icon/logo-w.png')} />
        <View style={{ width: "90%" }}>
          <Input
            placeholder='E-Mail'
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            keyboardType="email-address"
            leftIconContainerStyle={styles.inputIcon}
            labelStyle={{color: "red"}}
            leftIcon={<Icon name='user' size={24} color='#E4E4E4' /> } />
          <Input
            placeholder='Password'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            shake={true} secureTextEntry={true} 
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='lock' size={24} color='#E4E4E4' /> } />
          <Button
            onPress={() => this.loginButton()}
            titleStyle={{ fontSize: 18, fontFamily: "PoppinsMedium" }}
            buttonStyle={{ ...styles.input, backgroundColor: "#FFB200" }}
            title="Login"
          />
          <View style={styles.labelView}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={styles.labelButton}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPass')}>
              <Text style={styles.labelButton}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(168,75,230,1)',
    position: 'absolute',
    opacity: 0.95,
    transform: [{ rotate: '-45deg' }],
    zIndex: -1
  },
  logo: {
    width: '30%',
    height: '30%',
    marginTop: -110
  },
  labelView: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  input: {
    borderRadius: 5,
    marginBottom: 20,
    height: 45,
  },
  inputStyle: {
    fontFamily: "PoppinsMedium",
    top: "1%"
  },
  inputIcon: {
    marginLeft: 1,
    marginRight: 5
  },
  labelButton: {
    textAlign: 'center',
    color: '#ffff',
    fontSize: 15,
    fontFamily: "PoppinsMedium"
  }
});

export default Login;
