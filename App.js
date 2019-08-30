import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { StyleSheet, View, Image, Text, StatusBar } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import * as Screens from './src/screens';

export class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this.interval = 0;
    this.i = 0;
    this.interval = setInterval(() => {
      if(this.i == 1) {
        this.control();
        clearInterval(this.interval);
      }
      this.i = this.i + 1;
    }, 750);
  }
  
  async control() {
    const token = await AsyncStorage.getItem("token");
    this.props.navigation.navigate(token ? 'App' : 'Auth');
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <View style={styles.mainView}>
          <Image style={styles.logo} resizeMode="center" source={require('./src/assets/icon/logo-w.png')} />
          <Text style={styles.text}>Question Quiz</Text>
        </View>
        <View style={styles.bottomShape} />
        <View style={styles.topShape} />
      </View>
    )};
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(155,58,219,1)",
    justifyContent: "center",
    alignItems: "center"
  },
  mainView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: '60%',
    height: '60%'
  },
  text: {
    fontSize: 40,
    color: "white",
    fontFamily: "PoppinsLight"
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
  }
});

export default class App extends React.Component {
  render() {
    return (<AppContainer />);
  }
}

const AppStack = createStackNavigator({
  Home: { screen: Screens.Home },
  EnterPin: { screen: Screens.EnterPin },
  EnterUserName: { screen: Screens.EnterUserName },
  Lobby: { screen: Screens.Lobby },
  Description: { screen: Screens.Description },
  Play: { screen: Screens.Play },
  Scoreboard: { screen: Screens.Scoreboard },
  Profile: { screen: Screens.Profile },
  UserEdit: { screen: Screens.UserEdit },
  Quiz: { screen: Screens.Quiz },
  Question: { screen: Screens.Question },
  Discover: { screen: Screens.Discover }
});

const AuthStack = createStackNavigator({ 
  Login: { screen: Screens.Login },
  SignUp: { screen: Screens.SignUp },
  ForgotPass: { screen: Screens.ForgotPass }
 });

const AppContainer = createAppContainer(createSwitchNavigator({ 
  AuthLoading: AuthLoading,
  App: AppStack,
  Auth: AuthStack
 }));
