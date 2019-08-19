import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  Switch,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Input, Button } from "react-native-elements";
import PhotoUpload from "react-native-photo-upload";
import ioApi from "../socket";

let io = null;

export class Create extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false,
      quizId: "",
      file: "",
      token: "",
      isImageSelected: false,
      picker: "",
      visibleTo: true,
      title: "",
      description: "",
      question: [],
      buttonDisabled: false
    };
  }

  async componentDidMount() {
    this.setState({isUpdate: false});
    try {
      io = ioApi("profile", await AsyncStorage.getItem("token"));
      io.on("quizId", quizId => {
        if (this.state.file) {
          let url = global.url + "api/upload";
          let body = new FormData();
          body.append("quizId", quizId);
          body.append("whereToIns", "quiz");
          body.append("theFile", {
            uri: this.state.file.uri,
            name: this.state.file.fileName,
            filename: this.state.file.fileName,
            type: "image/png"
          });
          body.append("Content-Type", "image/png");

          fetch(url, {
            method: "POST",
            headers: {"Content-Type": "multipart/form-data"},
            body: body
          })
            .then(res => {
              res.ok
                ? this.props.navigation.navigate("AddQuestion", { id: quizId })
                : null;
            })
            .catch(e => console.log(e))
            .done();
        }
      });
      io.on("quizError", error => {
        Alert.alert("Error", error.message);
      });
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      this.setState({
        isUpdate: false,
        quizId: "",
        file: "",
        token: "",
        image: "",
        isImageSelected: false,
        picker: "",
        visibleTo: true,
        title: "",
        description: "",
        question: [],
        buttonDisabled: false
      });
      io.removeListener("quizId");
      io.removeListener("quizError");
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  _getTokenStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value != null) this.setState({ token: value });
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  };

  createButton() {
    try {
      if (this.state.title.trim() != "") {
        this.setState({ buttonDisabled: true });
        io.emit("quizCreate", {
          title: this.state.title,
          description: this.state.description,
          location: "Earth",
          language: "Turkish",
          question: this.state.question,
          img: "",
          visibleTo: this.state.visibleTo
        });
      } else {
        Alert.alert("Information", "Please enter title!");
      }
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  questionUpdate() {
    
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
          {this.state.isUpdate ? (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.text}>Update</Text>
            </TouchableOpacity>
          ) : (null)}
        </View>
        <TouchableOpacity style={styles.addImage}>
          <PhotoUpload
            onPhotoSelect={avatar => {if (avatar) { this.setState({isImageSelected: true}) }}}
            onResponse={image => {if (image) { this.setState({ file: image }) }}}>
            <Image style={styles.uploadImage} resizeMode="cover" />
          </PhotoUpload>
          {!this.state.isImageSelected ? (
            <Text style={{ ...styles.text, position: "absolute" }}>
              Tap to add cover images
            </Text>
          ) : null}
        </TouchableOpacity>
        <View style={{ width: "90%", marginTop: "-8%" }}>
          <View style={{ flexDirection: "row", padding: 10, bottom: 10, alignItems: "center"}}>
            <Switch
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              value={this.state.visibleTo}
              thumbColor={"#FFAA00"}
              trackColor={{ true: "#ffdd8f", false: "#A0A0A0" }}
              onValueChange={visibleTo => this.setState({ visibleTo })} />
            <Text style={{ ...styles.text, left: "40%" }}>
              {this.state.visibleTo ? "Visible To" : "Invisible"}
            </Text>
          </View>
          <Input
            onChangeText={title => this.setState({ title })}
            value={this.state.title}
            placeholder="Title"
            containerStyle={styles.input}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ fontFamily: "PoppinsMedium" }}
          />
          <Input
            onChangeText={description => this.setState({ description })}
            value={this.state.description}
            multiline={true}
            numberOfLines={6}
            placeholder="Description"
            containerStyle={styles.input}
            textAlignVertical={"top"}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ fontFamily: "PoppinsMedium" }}
          />
        </View>
        {this.state.isUpdate ? (
          <View style={{ width: "90%", alignItems: "center", top: "-3%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: "90%" }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AddQuestion')} style={styles.miniCard}>
                <Image style={styles.miniCardImage} source={require('../assets/images/e56809f40f7d2a4f8905f135ada6039f4f7551c8.png')} />
                <View style={styles.miniCardFooter}>
                  <Text style={styles.miniCardText}>Questions 1</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <View style = {{ width: "60%", marginTop: "-8%", top: "-1.5%" }}>
            <Button disabled={this.state.buttonDisabled} onPress={() => this.createButton()}
              titleStyle={styles.buttonText} buttonStyle={styles.buttonInput} title="Add Question" />
          </View>
        )}
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    justifyContent: "space-between"
  },
  text: {
    fontSize: 17,
    fontFamily: "PoppinsMedium"
  },
  addImage: {
    width: "100%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-10%"
  },
  uploadImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    paddingVertical: 30,
  },
  input: {
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
    elevation: 3
  },
  miniCard: {
    width: 160,
    height: 100,
    borderRadius: 10,
    marginRight: 20
  },
  miniCardImage: {
    width: 160,
    height: 100,
    borderRadius: 10
  },
  miniCardFooter: {
    width: "100%",
    height: 40,
    top: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 9,
  },
  miniCardText: {
    fontFamily: "PoppinsMedium"
  },
  buttonInput: {
    borderRadius: 5,
    marginBottom: 20,
    height: 45,
    backgroundColor: "#FFAA00",
    elevation: 3
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "PoppinsMedium"
  }
});

export default Create;
