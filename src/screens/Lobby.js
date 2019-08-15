import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Text,
  StatusBar,
  ScrollView,
  Alert
} from "react-native";
import { Button } from "react-native-elements";
import ioApi from "../socket";

let io = null;
let pin;

export class Lobby extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      users: [],
      userCount: 0
    };
  }

  componentDidMount() {
    alert(global.pin)
    try {
      io = ioApi("game");
      io.on("newUser", data => {
        this.setState({ users: data, userCount: this.state.userCount + 1 });
        //alert(data);
      });

      io.on("gameStart", () => {
        this.props.navigation.navigate("Play");
      });
    } catch (error) {
      Alert.alert("Error", error);
    }
  }

  componentWillUnmount() {
    io.removeListener("newUser");
    io.removeListener("gameStart");
  }

  animationText() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300
    }).start();
  }

  start() {
    try {
      io.emit("sendAdmin", global.pin);
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

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#9B3ADB" barStyle="light-content" />
        <View
          style={{
            width: "100%",
            backgroundColor: "#9B3ADB",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
          }}>
          <Text
            style={{
              fontSize: 35,
              color: "white",
              fontFamily: "PoppinsMedium"
            }}>
            {global.pin}
          </Text>
        </View>
        <ScrollView style={{ width: "100%" }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {this.usersRender()}
          </View>
        </ScrollView>
        <View
          style={{
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
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "PoppinsMedium",
              color: "white"
            }}>
            {this.state.userCount} Players
          </Text>
          <Button
            onPress={() => this.start()}
            titleStyle={{ fontSize: 18, fontFamily: "PoppinsMedium" }}
            buttonStyle={{ backgroundColor: "#FFB200", height: 45 }}
            containerStyle={{ width: "35%" }}
            title="Play"
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
  }
});

export default Lobby;
