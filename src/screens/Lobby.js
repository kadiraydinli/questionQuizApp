import React, { Component } from "react";
import { StyleSheet, View, Text, StatusBar, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import ioApi from "../socket";

let io = null;

export class Lobby extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userCount: 0,
      pin: 0
    };
  }

  componentDidMount() {
    try {
      this.setState({ pin: this.props.navigation.getParam('pin', 0) });

      io = ioApi.connectionsRoom("game");

      if (this.props.navigation.getParam("admin"))
        io.emit('sendAdmin', this.props.navigation.getParam('pin', 0));
      
      io.on("newUser", data => {
        this.setState({ users: data, userCount: Object.keys(data).length });
      });

      io.on("gameStart", () => {
        
        this.props.navigation.navigate("Play");
      });

      io.on("gameStartError", (data) => {
        Alert.alert("Error", data)
      });
    } catch (error) {
      Alert.alert("Error", "Lobby Screen\n" + error);
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener("newUser");
      io.removeListener("gameStart");
      io.removeListener("gameStartError");
    }
    catch (error) {
      Alert.alert("Error", "Lobby Screen WillUnmount\n" + error);
    }
  }

  start() {
    try {
      io.emit("startGame", this.state.userCount);
    } catch (error) {
      Alert.alert("Error", error);
    }
  }

  usersRender() {
    return this.state.users.map((data, index) => {
      return (
        <Text key={index} style={{ fontSize: 25, margin: 25, fontFamily: "PoppinsMedium" }}>
          {data}
        </Text>
      );
    });
  }

  exitButton() {
    let text;
    this.props.navigation.getParam("admin", false) ? 
      (text = "This quiz will be closed if you leave the lobby. Do you want to leave?") : 
      (text = "Are you sure you want to leave the Lobby?");
    Alert.alert("", text, [
      {text: "Cancel"},
      {text: "Leave", onPress: () => this.props.navigation.navigate('Home')}
    ])
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#9B3ADB" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.exitButton} onPress={() => this.exitButton()}>
            <Icon name="times" size={35} color="white" />
          </TouchableOpacity>
          <Text style={styles.pinTitle}>{this.state.pin}</Text>
        </View>
        <ScrollView style={{ width: "100%" }}>
          <View style={{justifyContent: "center", flexDirection: "row", flexWrap: "wrap"}}>
            {this.usersRender()}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.playersTitle}>
            {this.state.userCount} Players
          </Text>
          {this.props.navigation.getParam("admin", false) ? (
            <Button onPress={() => this.start()} titleStyle={styles.buttonTitle}
              buttonStyle={styles.button} containerStyle={{ width: "35%" }} title="Play" />
            ) : (null)}
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
    backgroundColor: "#9B3ADB",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  exitButton: {
    right: "87%",
    position: "absolute"
  },
  pinTitle: {
    fontSize: 35,
    color: "white",
    fontFamily: "PoppinsMedium"
  },
  footer: {
    width: "100%",
    backgroundColor: "#9B3ADB",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  playersTitle: {
    fontSize: 20,
    fontFamily: "PoppinsMedium",
    color: "white"
  },
  buttonTitle: {
    fontSize: 18,
    fontFamily: "PoppinsMedium"
  },
  button: {
    backgroundColor: "#FFB200",
    height: 45
  }
});

export default Lobby;
