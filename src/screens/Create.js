import React, { Component } from "react";
import { StyleSheet, View, Text, Image, StatusBar, TouchableOpacity, Dimensions, Alert, Switch } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import PhotoUpload from 'react-native-photo-upload';
import ioApi from "../socket";

let io = null;

export class Create extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = ({
      quizId: '',
      file: '',
      token: '',
      image: '',
      isImageSelected: false,
      picker: '',
      switchValue: true,
      title: '',
      description: '',
      question: []
    });
  }

  async componentDidMount() {
    try {
      io = ioApi('profile', await AsyncStorage.getItem('token'))
      io.on('quizId', (quizId) => {
        if (this.state.file) {
          Superagent
            .post('http://localhost:3000/api/upload')
            .field('quizId', quizId)
            .field('whereToIns', 'quiz')
            .attach("theFile", this.state.file)
            .end((err, result) => {
              console.log(result);
            })
        }
        this.state.quizId = quizId
        this.props.navigation.navigate('AddQuestion', {id: quizId})
      });
      io.on('quizError', (error) => {
        //Alert.alert("Error", error.message);
      });
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  _getTokenStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if(value != null)
        this.setState({ token: value });
    }
    catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  createButton() {
    try{
      if (this.state.title.trim() != '') {
        io.emit('quizCreate', {
          title: this.state.title,
          description: this.state.description,
          location: 'Earth',
          language: 'Turkish',
          question: this.state.question,
          img: this.state.image
        });
      }
      else {
        Alert.alert("Information", "Please enter title!");
      }
    }
    catch(error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      this.setState({
        quizId: '',
        file: '',
        token: '',
        image: '',
        isImageSelected: false,
        picker: '',
        title: '',
        description: '',
        question: []
      });
      io.removeListener('quizId')
      io.removeListener('quizError')
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
        <TouchableOpacity style={styles.addImage}>
          <PhotoUpload onPhotoSelect={avatar => {
              if (avatar) {
                this.setState({isImageSelected: true})
              }
            }}>
            <Image style={{
                paddingVertical: 30, width: Dimensions.get('window').width, height: Dimensions.get('window').height/3 }}
              resizeMode='cover' />
          </PhotoUpload>
          {!this.state.isImageSelected ?
            <Text style={{ ...styles.text, position: "absolute" }}>Tap to add cover images</Text> : null}
        </TouchableOpacity>
        <View style={{ width: "90%", marginTop: "-8%"}}>
          <View style={{ flexDirection: "row", padding: 10, bottom: 10, alignItems: "center"}}>
            <Switch style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              value={this.state.switchValue}
              thumbColor={"#FFAA00"}
              trackColor={{ true: "#ffdd8f", false: "#A0A0A0" }}
              onValueChange={(switchValue) => this.setState({ switchValue })} />
            <Text style={{ ...styles.text, left: "40%"}}>{this.state.switchValue ? ("Visible To") : ("Invisible")}</Text>
          </View>
          <Input
            onChangeText={(title) => this.setState({title})}
            value={this.state.title}
            placeholder='Title' containerStyle={styles.input} 
            inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={{ fontFamily: "PoppinsMedium" }} />
          <Input
            onChangeText={(description) => this.setState({ description })}
            value={this.state.description} multiline={true} numberOfLines={6}
            placeholder='Description' containerStyle={styles.input} textAlignVertical={'top'}
            inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={{ fontFamily: "PoppinsMedium" }} />
        </View>
        <View style={{width: "60%", marginTop: "-8%", top: "-1.5%"}}>
          <Button
            onPress={() => this.createButton()}
            titleStyle={styles.buttonText}
            buttonStyle={styles.buttonInput}
            title="Add Question"
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    justifyContent: "space-between",
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
  input: {
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    elevation: 3
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