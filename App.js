import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import * as Screens from './src/screens';

export class AuthLoading extends React.Component {
  constructor() {
    super();
    this.control()
  }
  
  async control() {
    const token = await AsyncStorage.getItem("token");
    this.props.navigation.navigate(token ? 'App' : 'Auth');
  }

  render() {return (<></>)};
} 

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
  Create: { screen: Screens.Create },
  AddQuestion: { screen: Screens.AddQuestion },
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
