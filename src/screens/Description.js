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
    this.state = {
      titleStyle: { fontSize: 35, width: "90%", fontFamily: "PoppinsSemiBold"},
      id: "",
      title: "",
      description: "",
      image: "",
      userImage: "",
      pin: 0,
      userName: "",
      questionCount: 0
    }
  }

  goBack() {
    this.props.navigation.state.params._refresh(true);
    this.props.navigation.goBack();
  }

  async componentDidMount() {
    try {
      io = ioApi.connectionsRoom("profile", await AsyncStorage.getItem("token"));
      data = this.props.navigation.getParam("data", "");
      this.setState({
        id: data._id,
        title: data.title,
        description: data.description,
        image: data.img,
        pin: data.pin,
        userImage: data.userImg,
        userName: data.username,
        questionCount: data.questionCount
      })
      //alert(this.state.image)
      this.fontSizeEdit();
    } catch (error) {
      Alert.alert("Error", "Description Screen componentDidMount\n" + JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener("quizDel");
    } catch (error) {
      Alert.alert("Error", "Description Screen componentWillUnmount\n" + JSON.stringify(error));
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
      Alert.alert("Error", "Description Screen quizDelete\n" + JSON.stringify(error));
    }
  }

  fontSizeEdit() {
    let length = this.state.title.length;
    let style = { width: "90%", fontFamily: "PoppinsSemiBold", fontSize: 35}
    if(length >= 25 && length <= 30) style = {...style, fontSize: 25}
    else if (length >= 31 && length <= 40) style = { ...style, fontSize: 24 }
    else if (length >= 41 && length <= 45) style = { ...style, fontSize: 23 }
    else if (length >= 46 && length <= 50) style = { ...style, fontSize: 22 }
    else if (length >= 51 && length <= 60) style = { ...style, fontSize: 21 }
    else if (length >= 61 && length <= 80) style = { ...style, fontSize: 16 }
    else if (length >= 81) style = { ...style, fontSize: 15 }
    this.setState({titleStyle: style})
  }

  render() {
    const { navigation } = this.props;
    data = navigation.getParam("data", "");
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <Image
          source={{ uri: global.url + this.state.image }}
          resizeMode="cover"
          style={styles.image}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={styles.backButton}>
          <Icon name="times" size={30} color="white" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={{...this.state.titleStyle}}>{this.state.title}</Text>
          <View style={styles.userView}>
            <View style={styles.userInfo}>
              {typeof data.userImg != "undefined" ? (
                <Image
                  style={styles.userImage}
                  source={{ uri: global.url + data.userImg }}
                />
              ) : null}
              <Text style={styles.userNick}>{this.state.userName}</Text>
            </View>
            {this.props.navigation.getParam("isAdmin", false) ? (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ padding: 5 }} 
                  onPress={() => this.props.navigation.navigate('Quiz', { isEditing: true, id: this.state.id })}>
                  <Icon name="pencil" size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 20, padding: 5 }} onPress={() => this.quizDelete()}>
                  <Icon name="trash" size={30} />
                </TouchableOpacity>
              </View>
            ) : (null)}
          </View>
          <View style={{ width: "90%", margin: 15 }}>
            <Text style={{ fontFamily: "PoppinsLight", fontSize: 17 }}>
              {this.state.description}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center", position: "absolute", width: "100%", height: "100%", flexDirection: "column-reverse" }}>
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
    padding: 0,
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
    marginBottom: 25,
    elevation: 5
  },
  buttonTitle: {
    fontSize: 15,
    fontFamily: "PoppinsMedium"
  }
});

export default Description;
