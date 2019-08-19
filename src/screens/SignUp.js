import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Alert, ToastAndroid } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from 'react-native-elements';
import ioApi from "../socket";

let io = null;

export class SignUp extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      username: '',
      name: '',
      surname: '',
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    io = ioApi('user');

    io.on('registerSuccessful', (data) => {
      ToastAndroid.show('You will be redirected in 1 second', ToastAndroid.SHORT);
    });

    io.on('registerError', (data) => {
      Alert.alert("Error", data.message);
    });
  }

  send() {
    io.emit('userRegister',  {
      firstname: this.state.name.trim(),
      lastname: this.state.surname.trim(),
      username: this.state.username.trim(),
      email: this.state.email.trim(),
      password: this.state.password,
      });

    this.setState({
      username: '',
      name: '',
      surname: '',
      email: '',
      password: ''
    })
  }
  
  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <Image style={styles.logo}  resizeMode="center"
          source={require('../assets/icon/logo-w.png')} />
        <View style={{ width: "90%" }}>
          <Input
            placeholder='Name'
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='user' size={24} color='#E4E4E4' /> } />
          <Input
            placeholder='Surname'
            onChangeText={(surname) => this.setState({surname})}
            value={this.state.surname}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='user' size={24} color='#E4E4E4' />} />
          <Input
            placeholder='Username'
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='user' size={24} color='#E4E4E4' />} />
          <Input
            placeholder='E-Mail'
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            keyboardType="email-address"
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='at' size={24} color='#E4E4E4' />} />
          <Input
            placeholder='Password'
            onChangeText={(password) => this.setState({ password})}
            value={this.state.password}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{borderBottomWidth:0}}
            inputStyle={styles.inputStyle}
            shake={true}
            secureTextEntry={true}
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='lock' size={24} color='#E4E4E4' /> } />
          <Button
            onPress={() => this.send()}
            titleStyle={{ fontSize: 18, fontFamily: "PoppinsMedium"}}
            buttonStyle={{ ...styles.input, backgroundColor: "#FFB200" }}
            title="Register"
          />
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.labelButton}>Sign In</Text>
          </TouchableOpacity>
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
    marginTop: -70
  },
  input: {
    borderRadius: 5,
    marginBottom: 20,
    height: 45
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

export default SignUp;
