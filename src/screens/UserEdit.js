import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from 'react-native-elements';
import PhotoUpload from 'react-native-photo-upload';
import ioApi from "../socket";

let io = null;

export class UserEdit extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      userImage: '',
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  async componentDidMount() {
    try {
      io = ioApi('user');
      io = ioApi('profile', await AsyncStorage.getItem('token'));

      io.emit('getProfileEditInfo');

      io.on('setProfileEditInfo', (data) => {
        this.setState({
          userImage: data.img,
          name: data.firstname,
          surname: data.lastname,
          username: data.username,
          email: data.email,
          //password: data.password
        });
      });

      io.on('message', (data) => {
        Alert.alert(data.message);
      });
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener('setProfileEditInfo');
      io.removeListener('message');
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  send() {
    try {
      io.emit('profilUpdate', {
        firstname: this.state.name.trim(),
        lastname: this.state.surname.trim(),
        username: this.state.username.trim(),
        email: this.state.email.trim(),
        password: this.state.password,
        //newPassword: this.state.confirmPassword.trim() != '' ? (this.state.confirmPassword) : (typeof undefined)
        //this.state.confirmPassword
      });
      //alert(this.state.confirmPassword.trim() != '' ? (this.state.confirmPassword) : (typeof undefined))
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }
  
  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userImage}>
          <PhotoUpload onPhotoSelect={avatar => {
            if (avatar) {
              this.setState({ isImageSelected: true })
            }
          }}>
            <Image style={{
              paddingVertical: 30, ...styles.userImage
            }}
              source={require('../assets/images/a.png')}
              resizeMode='cover' />
          </PhotoUpload>
        </View>
        <View style={{ width: "85%", marginTop: 100, top: -70 }}>
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
            shake={true} secureTextEntry={true}  
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='lock' size={24} color='#E4E4E4' /> } />
          <Input
            placeholder='Confirm Password'
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
            value={this.state.confirmPassword}
            containerStyle={{ ...styles.input, backgroundColor: 'white' }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            shake={true} secureTextEntry={true}
            leftIconContainerStyle={styles.inputIcon}
            leftIcon={<Icon name='lock' size={24} color='#E4E4E4' />} />
          <Button
            onPress={() => this.send()}
            titleStyle={{ fontSize: 18, fontFamily: "PoppinsMedium"}}
            buttonStyle={{ ...styles.input, backgroundColor: "#FFB200", marginBottom: 0 }}
            title="Update"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between"
  },
  text: {
    fontSize: 17,
    fontFamily: "PoppinsMedium"
  },
  userImage: {
    borderWidth: 1,
    width: 135,
    height: 135,
    borderRadius: 200 / 2
  },
  input: {
    borderRadius: 5,
    marginBottom: 20,
    height: 45,
    elevation: 3,
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

export default UserEdit;
