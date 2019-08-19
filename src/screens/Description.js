import React, { Component } from "react";
import { StyleSheet, View, Image, Text, StatusBar, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import ioApi from "../socket";

let io = null;
let data;

export class Description extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  goBack() {
    this.props.navigation.state.params._refresh(true);
    this.props.navigation.goBack();
  }

  async componentDidMount() {
    try {
      io = ioApi("profile", await AsyncStorage.getItem("token"));
      alert(JSON.stringify(data))
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener("quizDel");
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  quizDelete() {
    try {
      Alert.alert("", "Are you sure you want to delete it?", [
        {text: "Cancel"},
        {text: "Delete", onPress: () => {
          io.emit('quizDel', data._id);
          this.goBack();
        }}
      ]);
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  render() {
    const { navigation } = this.props;
    data = navigation.getParam("data", "");
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <Image
          source={{ uri: global.url + data.img }}
          resizeMode="cover"
          style={styles.image}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={styles.backButton}>
          <Icon name="times" size={30} color="white" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.userView}>
            <View style={styles.userInfo}>
              {typeof data.userImg != "undefined" ? (
                <Image
                  style={styles.userImage}
                  source={{ uri: global.url + data.userImg }}
                />
              ) : null}
              <Text style={styles.userNick}>{data.username}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity>
                <Icon name="star" size={30} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.quizDelete()}>
                <Icon name="trash" size={30} style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "90%", margin: 15 }}>
            <ScrollView style={{ width: "100%", height: "38%" }}>
              <Text style={{ fontFamily: "PoppinsLight", fontSize: 17 }}>
                {data.description}
              </Text>
            </ScrollView>
          </View>
          <Button
            onPress={() => this.props.navigation.navigate('Lobby', { pin: data.pin, admin: true })}
            title="Play"
            titleStyle={styles.buttonTitle}
            containerStyle={{ width: "60%" }}
            buttonStyle={styles.button}
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
    padding: 0
  },
  image: {
    width: "100%",
    height: "43%",
    borderBottomLeftRadius: 35,
    top: -2
  },
  backButton: {
    position: "absolute",
    left: "3%",
    top: "3%"
  },
  title: {
    fontSize: 35,
    width: "90%",
    fontFamily: "PoppinsSemiBold"
  },
  userView: {
    width: "90%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center"
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 200 / 2,
    borderWidth: 1,
    backgroundColor: "gray"
  },
  userNick: {
    fontSize: 19.5,
    left: 15,
    fontFamily: "PoppinsMedium"
  },
  /*descriptionTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 17,
    marginBottom: 10
  },*/
  button: {
    backgroundColor: "#9B3ADB",
    borderRadius: 10,
    height: 40,
    marginBottom: 20,
    elevation: 5
  },
  buttonTitle: {
    fontSize: 15,
    fontFamily: "PoppinsMedium"
  }
});

export default Description;
