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
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlight
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Input, Button } from "react-native-elements";
import PhotoUpload from "react-native-photo-upload";
import ioApi from "../socket";

let io = null;

export class Quiz extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      quizId: "",
      file: "",
      token: "",
      isImageSelected: false,
      image: "",
      picker: "",
      visibleTo: true,
      title: "",
      description: "",
      characterLength: 256,
      question: [],
      buttonDisabled: false
    };
  }

  _refresh(data) {
    this.setState({ _refresh: data });
    this.componentDidMount();
  }

  async componentDidMount() {
    try {
      io = ioApi.connectionsRoom("profile", await AsyncStorage.getItem("token"));
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
                ? this.props.navigation.navigate("Question", { id: quizId })
                : null;
            })
            .catch(e => console.log(e))
            .done();
        }
      });

      io.on("quizError", error => {
        Alert.alert("Error", error.message);
      });

      this.quizUpdate()

      io.on('quizUpdateFile', () => {
        if(this.state.file != "") {
          io.emit('quizDeleteImg', this.state.quizId);
          let url = global.url + "api/upload";
          let body = new FormData();
          body.append("quizId", this.state.quizId);
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
            headers: { "Content-Type": "multipart/form-data" },
            body: body
          })
          .catch(e => console.log(e))
          .done();
        }
      });

      io.on('errors', (data) => {
        Alert.alert("Error", data.message);
      });

      io.on('quizUpdateSuccess', (data) => {
        Alert.alert("Successful", data);
        this.props.navigation.navigate('Home');
      });
    } catch (error) {
      Alert.alert("Error", "Quiz Screen componentDidMount\n" + JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener("quizId");
      io.removeListener("quizError");
      io.removeListener("quizUpdateFile");
      io.removeListener("errors");
      io.removeListener("quizUpdateSuccess");
      io.removeListener("sendQuizInfo");
    } catch (error) {
      Alert.alert("Error", "Quiz Screen componentWillUnmount\n" + JSON.stringify(error));
    }
  }

  _getTokenStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value != null) this.setState({ token: value });
    } catch (error) {
      Alert.alert("Error", "Quiz Screen componentWillUnmount\n" + JSON.stringify(error));
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
      Alert.alert("Error", "Quiz Screen createButton\n" + JSON.stringify(error));
    }
  }

  quizUpdate() {
    if (this.props.navigation.getParam('isEditing', false)) {
      this.setState({ isEditing: true });
      io.emit('reqQuizInfo', this.props.navigation.getParam('id', ''));
      io.on('sendQuizInfo', (data) => {
        this.setState({
          quizId: this.props.navigation.getParam('id', ''),
          title: data.title,
          description: data.description,
          characterLength: 256 - data.description.length,
          isImageSelected: true,
          image: data.img,
          question: data.question
        });
      });
    }
  }

  quizDelete(id, title) {
    Alert.alert("", "Are you sure you want to delete \"" + title + "\"?", [
      {text: "Cancel"},
      {text: "Delete", onPress: () => {
        io.emit('questionDelete', id);
        this.componentDidMount();
      }}
    ])
  }

  quizUpdateButton() {
    io.emit('quizUpdate', {
      _id: this.state.quizId,
      title: this.state.title,
      description: this.state.description,
      location: "Earth",
      language: "Turkish",
      question: this.state.question,
      img: "",
      visibleTo: this.state.visibleTo
    });
  }

  questionsRender() {
    return this.state.question.map((data, index) => {
      return (
        <TouchableHighlight key={index} style={styles.miniCard}
          onLongPress={() => this.quizDelete(data._id, data.questionTitle)} underlayColor="gray"
          onPress={() => 
            this.props.navigation.navigate('Question', 
              { _refresh: this._refresh.bind(this), isEditing: true, id: data._id, count: index })}>
          <View style={styles.miniCard}>
            <Image style={styles.miniCardImage} source={{ uri: global.url + data.img }} />
            <View style={styles.miniCardFooter}>
              <Text style={styles.miniCardText}>{data.questionTitle}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
          {this.state.isEditing ? (
            <TouchableOpacity onPress={() => this.quizUpdateButton()}>
              <Text style={styles.text}>Update</Text>
            </TouchableOpacity>
          ) : (null)}
        </View>
        <TouchableOpacity style={styles.addImage}>
          <PhotoUpload
            onPhotoSelect={avatar => {if (avatar) { this.setState({isImageSelected: true}) }}}
            onResponse={image => {if (image) { this.setState({ file: image }) }}}>
              {this.state.isEditing ? (
                <Image style={styles.uploadImage} source={{ uri: global.url + this.state.image }} resizeMode="cover" />
              ) : (
                <Image style={styles.uploadImage} resizeMode="cover" />
              ) }
          </PhotoUpload>
          {!this.state.isImageSelected ? (
            <Text style={{ ...styles.text, position: "absolute", zIndex: -1 }}>
              Tap to add cover images
            </Text>
          ) : null}
        </TouchableOpacity>
        <View style={{ width: "90%", marginTop: "-1%" }}>
          <View style={styles.switchView}>
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
            maxLength={100}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ fontFamily: "PoppinsMedium" }}
          />
          <View style={{...styles.input}}>
            <KeyboardAvoidingView>
              <ScrollView>
                <Input
                  onChangeText={description => this.setState({ description, characterLength: 256 - description.length })}
                  value={this.state.description}
                  multiline={true}
                  numberOfLines={5}
                  scrollEnabled={false}
                  placeholder="Description"
                  textAlignVertical={"top"}
                  maxLength={256}
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{ fontFamily: "PoppinsMedium" }}
                />
              </ScrollView>
            </KeyboardAvoidingView>
            <Text style={styles.characterLength}>Character: {this.state.characterLength}</Text>
          </View>
        </View>
        {this.state.isEditing ? (
          <View style={{ width: "90%", alignItems: "center", marginTop: "-3%", marginBottom: "4%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: "90%" }}>
              {this.questionsRender()}
            </ScrollView>
          </View>
        ) : (
          <View style = {{ width: "60%", marginTop: "-2%", height: 100, justifyContent: "center" }}>
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
  },
  uploadImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    paddingVertical: 30,
  },
  switchView: {
    flexDirection: "row",
    paddingTop: 10,
    bottom: 10,
    alignItems: "center"
  },
  input: {
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
    elevation: 3
  },
  characterLength: {
    alignSelf: "flex-end",
    paddingRight: 5,
    fontFamily: "PoppinsMedium"
  },
  miniCard: {
    width: 160,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
    flexDirection: "column-reverse"
  },
  miniCardImage: {
    width: 160,
    height: 100,
    borderRadius: 10
  },
  miniCardFooter: {
    width: "100%",
    height: 40,
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

export default Quiz;