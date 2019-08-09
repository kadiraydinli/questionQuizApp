import React, { Component } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Dimensions, Image, Alert, ScrollView } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { Input, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PhotoUpload from 'react-native-photo-upload';
import ioApi from "../socket";

let io = null;
let getId;

const timeSelect = [{ label: '10 Sec', value: 10 }, { label: '20 Sec', value: 20 }, { label: '30 Sec', value: 30 }, { label: '40 Sec', value: 40 },
  { label: '50 Sec', value: 50 }, { label: '60 Sec', value: 60 }];

export class AddQuestion extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = ({
      questionCount: 1,
      questionImage: '',
      time: 10,
      question: '',
      answer: -1,
      answer0: '',
      answer1: '',
      answer2: '',
      answer3: '',
    });
  }

  async componentDidMount() {
    try {
      io = ioApi('profile', await AsyncStorage.getItem('token'))
      io.on('newQuestionCreate', (quiz) => {
        if (this.file) {
          Superagent
            .post('http://localhost:3000/api/upload')
            .field('questionId', quiz.questionId)
            .field('whereToIns', 'question')
            .attach("theFile", this.file)
        }
        this.cleanState();
      });
      io.on('questionErr', (error) => {
        Alert.alert("Error", error.message);
      });
    }
    catch (error) {
      Alert.alert("Error", error)
    }
  }

  addQuestionButton() {
    try {
      io.emit('addingQuestions', {
        quizId: getId,
        questionTitle: this.state.question,
        answers: [this.state.answer0, this.state.answer1, this.state.answer2, this.state.answer3],
        answer: this.state.answer,
        time: this.state.time,
        img: this.state.questionImage
      });
    }
    catch (error) {
      Alert.alert("Error", error)
    }
  }

  cleanState() {
    this.setState({
      questionImage: '',
      time: 10,
      question: '',
      answer: -1,
      answer0: '',
      answer1: '',
      answer2: '',
      answer3: '',
    });
    this.setState({ questionCount: this.state.questionCount + 1 })
  }

  componentWillUnmount() {
    io.removeListener('newQuestionCreate')
    io.removeListener('questionErr')
  }
  
  render() {
    const { navigation } = this.props;
    getId = navigation.getParam('id', '');
    const pickerPlaceHolder = {};
    return (
      <ScrollView style={{ backgroundColor: "#F9F9F9" }}>
        <View style={styles.root}>
          <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
          <View style={styles.header}>
            <Text style={{ ...styles.text, position: "relative" }}>Soru {this.state.questionCount}</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={{ ...styles.text, position:"relative" }}>Finish</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addImage}>
            <PhotoUpload onPhotoSelect={avatar => {
              if (avatar) {
                this.setState({ isImageSelected: true })
              }
            }}>
              <Image style={{
                paddingVertical: 30, width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2.8
              }}
                resizeMode='cover' />
            </PhotoUpload>
            {!this.state.isImageSelected ?
              <Text style={styles.text}>Tap to add cover images</Text> : null}
          </TouchableOpacity>
          <View style={{ width: "85%", alignSelf: "center", position: "absolute", top: "36%" }}>
            <RNPickerSelect
              placeholder={pickerPlaceHolder}
              items={timeSelect}
              onValueChange={value => { this.setState({ time: value }) }}
              style={{ ...styles }}
              value={this.state.time}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <View style={styles.inputView}>
            <Input
              onChangeText={(question) => this.setState({ question })}
              multiline={true} numberOfLines={2}
              value={this.state.question} placeholder='Tap to add question'
              containerStyle={styles.inputContainer} inputContainerStyle={{ borderBottomWidth: 0 }}
              inputStyle={{ fontFamily: "PoppinsMedium", textAlign: "center" }} />
          </View>
          <View style={styles.answersView}>
            <View style={{ flexDirection: "row", marginBottom: 18 }}>
              <View style={{ ...styles.answers, backgroundColor: "#FF3D71", marginRight: 18 }}>
                <CheckBox containerStyle={styles.checkBox}
                  checked={this.state.answer == 0 ? true : false} checkedColor="#f4f4f4" uncheckedColor="#f4f4f4"
                  onPress={() => this.state.answer == 0 ? this.setState({ answer: -1 }) : this.setState({ answer: 0 })} />
                <Input
                  onChangeText={(answer0) => this.setState({ answer0 })}
                  value={this.state.answer0} placeholder='Answer 1'
                  placeholderTextColor="#f4f4f4" inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{ fontFamily: "PoppinsMedium", textAlign: "center", color: "#f4f4f4" }} />
              </View>
              <View style={{ ...styles.answers, backgroundColor: "#FFAA00" }}>
                <CheckBox containerStyle={styles.checkBox}
                  checked={this.state.answer == 1 ? true : false} checkedColor="#f4f4f4" uncheckedColor="#f4f4f4"
                  onPress={() => this.state.answer == 1 ? this.setState({ answer: -1 }) : this.setState({ answer: 1 })} />
                <Input
                  onChangeText={(answer1) => this.setState({ answer1 })}
                  value={this.state.answer1} placeholder='Answer 2'
                  placeholderTextColor="#f4f4f4" inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{ fontFamily: "PoppinsMedium", textAlign: "center", color: "#f4f4f4" }} />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ ...styles.answers, backgroundColor: "#0EC6F1", marginRight: 18 }}>
                <CheckBox containerStyle={styles.checkBox}
                  checked={this.state.answer == 2 ? true : false} checkedColor="#f4f4f4" uncheckedColor="#f4f4f4"
                  onPress={() => this.state.answer == 2 ? this.setState({ answer: -1 }) : this.setState({ answer: 2 })} />
                <Input
                  onChangeText={(answer2) => this.setState({ answer2 })}
                  value={this.state.answer2} placeholder='Answer 3'
                  placeholderTextColor="#f4f4f4" inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{ fontFamily: "PoppinsMedium", textAlign: "center", color: "#f4f4f4" }} />
              </View>
              <View style={{ ...styles.answers, backgroundColor: "#00D68F" }}>
                <CheckBox containerStyle={styles.checkBox}
                  checked={this.state.answer == 3 ? true : false} checkedColor="#f4f4f4" uncheckedColor="#f4f4f4"
                  onPress={() => this.state.answer == 3 ? this.setState({ answer: -1 }) : this.setState({ answer: 3 })} />
                <Input
                  onChangeText={(answer3) => this.setState({ answer3 })}
                  value={this.state.answer3} placeholder='Answer 4'
                  placeholderTextColor="#f4f4f4" inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{ fontFamily: "PoppinsMedium", textAlign: "center", color: "#f4f4f4" }} />
              </View>
            </View>
          </View>
          <View style={styles.addButtonView}>
            <TouchableOpacity onPress={() => this.addQuestionButton()}>
              <Icon name="plus-circle" size={45} color="#0D5AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "space-between",
    //height: Dimensions.get('window').height
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  addImage: {
    width: "100%",
    height: "37%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 17,
    fontFamily: "PoppinsMedium",
    position: "absolute"
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    elevation: 3,
    color: "white",
    width: "20%",
    alignSelf:"flex-end",
    backgroundColor: "#9B3ADB"
  },
  inputView: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10
  },
  inputContainer: {
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 45,
    backgroundColor: 'white',
    elevation: 3
  },
  answersView: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  answers: {
    width: 160,
    height: 100,
    elevation: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  checkBox: {
    alignSelf: "flex-end",
    position: "absolute",
    top: "-10%",
    right: "-10%"
  },
  addButtonView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  }
});

export default AddQuestion;