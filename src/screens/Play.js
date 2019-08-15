import React, { Component } from "react";
import { StyleSheet, View, Image, Text, StatusBar, TouchableOpacity, Animated, Easing, Alert } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as Progress from 'react-native-progress';
import { Button } from "react-native-elements";
import ioApi from "../socket";

let io = null;

let ANSWER_STYLE = [
  { backgroundColor: "#FF3D71", marginRight: 18 }, { backgroundColor: "#FFAA00" },
  { backgroundColor: "#0EC6F1", marginRight: 18 }, { backgroundColor: "#00D68F" }
  ];
let ANSWER_STYLE_ORIGINAL = [
  { backgroundColor: "#FF3D71", marginRight: 18 }, { backgroundColor: "#FFAA00" },
  { backgroundColor: "#0EC6F1", marginRight: 18 }, { backgroundColor: "#00D68F" }
];

export class Play extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      answer: -1,
      isTimeOver: false,
      isGameEnd: false,
      isSelected: false,
      selected: -1,
      moveAnswer: new Animated.Value(0),
      buttonOpacity: new Animated.Value(0),
      time: 0,
      progress: 1,
      question: '',
      answer0: '',
      answer1: '',
      answer2: '',
      answer3: '',
      questionImage: '',
      scoreData: [],
      answerStyle: ANSWER_STYLE
    }
  }

  componentDidMount() {
    try {
      io = ioApi('game');
      io.on('newQuestion', (data) => {
        veri = JSON.stringify(data)
        this.setState({
          isTimeOver: false,
          isSelected: false,
          selected: -1,
          moveAnswer: new Animated.Value(0),
          buttonOpacity: new Animated.Value(0),
          progress: 1,
          time: data.time,
          answer: data.answer,
          question: data.questionTitle,
          answer0: data.answers[0],
          answer1: data.answers[1],
          answer2: data.answers[2],
          answer3: data.answers[3],
          questionImage: data.img,
          answerStyle: ANSWER_STYLE
        });

        this.interval = 0;
        this.progressSecond = 1 / this.state.time;
        this.interval = setInterval(() => {
          this.setState({
            time: this.state.time - 1,
            progress: this.state.progress - this.progressSecond
          });
          if (this.state.time <= 0 && !this.state.isTimeOver) {
            this.timeOver();
            clearInterval(this.interval);
            Animated.timing(this.state.moveAnswer, {
              toValue: 10,
              duration: 600,
              easing: Easing.cubic,
            }).start(() => {
              Animated.timing(this.state.buttonOpacity, {
                toValue: 1,
                duration: 100
              }).start();
            });
          }
        }, 1000);
      });

      io.on('showScoreboard', () => {
        this.setState({ isGameEnd: true });
        io.on('Scoreboard', (data) => {
          this.setState({ scoreData: data })
        });
      });
    }
    catch (error) {
      Alert.alert("Error", error)
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener('newQuestion')
      io.removeListener('showScoreboard')
      io.removeListener('Scoreboard')
    }
    catch (error) {
      Alert.alert('Error', JSON.stringify(error))
    }
  }

  timeOver() {
    for(let i = 0; i <= 4; i++){
      if (i == this.state.answer) {
        ANSWER_STYLE[i] = { ...ANSWER_STYLE_ORIGINAL[i] }
        alert(JSON.stringify(ANSWER_STYLE_ORIGINAL[i]))
      }
      else
        ANSWER_STYLE[i] = { ...ANSWER_STYLE[i], backgroundColor: "gray" }
    }
    
    this.setState({ isTimeOver: true, selected: this.state.answer, isSelected: true, answerStyle: ANSWER_STYLE });

    for(let i = 0; i <= 4; i++) {
      ANSWER_STYLE[i] = { ...ANSWER_STYLE_ORIGINAL[i]}
    }
  }

  selected(id) {
    for(let i = 0; i <= 4; i++) {
      if(i != id) ANSWER_STYLE[i] = { ...ANSWER_STYLE[i], backgroundColor: "gray"}
    }

    this.setState({
      selected: id,
      isSelected: true,
      answerStyle: ANSWER_STYLE
    });

    io.emit('sendAnswer', {answer:id});
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <Image style={styles.questionImage} source={{ uri: global.url + this.state.questionImage}} />
        <View style={styles.questionView}>
          <Svg viewBox={"-0 -0 349 203.6159086335475"} style={styles.questionSvg}>
            <Path
              strokeWidth={0} fill={"rgba(155,58,219,1)"}
              d={
                "M321.00 0.00 C321.00 0.00 349.00 0.00 349.00 28.00 C349.00 28.00 349.00 144.00 349.00 144.00 C349.00 " + 
                  "144.00 349.00 172.00 321.00 172.00 C321.00 172.00 317.00 172.00 317.00 172.00 C317.00 172.00 317.00 " + 
                  "211.00 317.00 211.00 C317.00 215.00 311.64 205.39 311.64 205.39 C311.64 205.39 293.36 172.61 293.36 " + 
                  "172.61 C293.24 172.40 293.13 172.20 293.03 172.00 C293.03 172.00 28.00 172.00 28.00 172.00 C28.00 " + 
                  "172.00 0.00 172.00 0.00 144.00 C0.00 144.00 0.00 28.00 0.00 28.00 C0.00 28.00 0.00 0.00 28.00 0.00 " + 
                  "C28.00 0.00 321.00 0.00 321.00 0.00 Z"
              }
            />
            <Text style={styles.questionText}>
              {this.state.question}
            </Text>
          </Svg>
        </View>
        <View style={styles.progress}>
          <Progress.Bar progress={this.state.progress} width={285} height={20} borderRadius={15} color="#F60E4C">
            <Text style={{ position: "absolute", color: "black", alignSelf: "center"}}>{this.state.time}</Text>
          </Progress.Bar>
        </View>
        <View style={styles.answersView}>
          <View style={{flexDirection:"row", marginBottom: 18}}>
            <Animated.View style={{ ...this.state.answer == 0 && this.state.isTimeOver == true ? { left: this.state.moveAnswer, bottom: this.state.moveAnswer } : null }}>
              <TouchableOpacity disabled={this.state.isSelected} key={0} onPress={() => this.selected(0)}
                style={[this.state.answerStyle[0], styles.answers]}>
                <Text style={styles.answerText}>{this.state.answer0}</Text>
              </TouchableOpacity>
            </Animated.View>
            {this.state.answer == 0 && this.state.isTimeOver == true ? (
              <View style={{ ...styles.rightAnswer }} />
            ) : (<></>)}
            <Animated.View style={{ ...this.state.answer == 1 && this.state.isTimeOver == true ? { left: this.state.moveAnswer, bottom: this.state.moveAnswer } : null }}>
              <TouchableOpacity disabled={this.state.isSelected} key={1} onPress={() => this.selected(1)}
                style={[this.state.answerStyle[1], styles.answers]}>
                <Text style={styles.answerText}>{this.state.answer1}</Text>
              </TouchableOpacity>
            </Animated.View>
            {this.state.answer == 1 && this.state.isTimeOver == true ? (
              <View style={{ ...styles.rightAnswer, left: 178 }} />
            ) : (<></>)}
          </View>
          <View style={{ flexDirection: "row" }}>
            <Animated.View 
              style={{ ...this.state.answer == 2 && this.state.isTimeOver == true ? { left: this.state.moveAnswer, bottom: this.state.moveAnswer } : null}}>
            <TouchableOpacity disabled={this.state.isSelected} key={2} onPress={() => this.selected(2)}
                style={[this.state.answerStyle[2], styles.answers]}>
                <Text style={styles.answerText}>{this.state.answer2}</Text>
            </TouchableOpacity>
          </Animated.View>
          {this.state.answer == 2 && this.state.isTimeOver == true ? (
            <View style={{ ...styles.rightAnswer }} />
          ) : (<></>)}
          <Animated.View
              style={{ ...this.state.answer == 3 && this.state.isTimeOver == true ? { left: this.state.moveAnswer, bottom: this.state.moveAnswer } : null }}>
            <TouchableOpacity disabled={this.state.isSelected} key={3} onPress={() => this.selected(3)}
                style={[this.state.answerStyle[3], styles.answers]}>
                <Text style={styles.answerText}>{this.state.answer3}</Text>
            </TouchableOpacity>
          </Animated.View>
          {this.state.answer == 3 && this.state.isTimeOver == true ? (
            <View style={{ ...styles.rightAnswer, left: 178 }} />
          ) : (<></>)}
          </View>
        </View>
        <View>
          {this.state.isGameEnd == false && this.state.isTimeOver == true ? ( 
            this.state.isGameEnd == true ? (
              <Animated.View style={{ position: "absolute", top: -65, alignSelf: "center", opacity: this.state.buttonOpacity }}>
                <Text style={{ fontSize: 20 }}>Sorular bitti puanlar hesaplanıyor..</Text>
              </Animated.View>
            ) : (
              <Animated.View style= {{ position: "absolute", top:-65, alignSelf: "center", opacity: this.state.buttonOpacity}}>
                <Text style={{ fontSize: 20 }}>Sonraki soruya {this.state.time} saniye</Text>
              </Animated.View>
            )   
          ) :  (this.state.isGameEnd == true ? (
              <Animated.View style={{ alignSelf: "center", position: "absolute", top: -65, opacity: this.state.buttonOpacity}}>
                <Button onPress={() => this.props.navigation.navigate('Scoreboard', {score: this.state.scoreData})}
                  title="Scoreboard" titleStyle={styles.buttonTitle} buttonStyle={styles.button} />
            </Animated.View>
            ): null)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "space-evenly",
    alignItems:"center",
    padding: 0
  },
  questionImage: {
    width: "75%",
    height: "25%",
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    top: 0
  },
  questionView: {
    width: "100%",
    alignItems: "center"
  },
  questionSvg: {
    width: "82%",
    height: "70%",
    top: "20%"
  },
  questionText: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    fontFamily: "PoppinsMedium",
    top: "500%"
  },
  progress: {
    width: "100%",
    alignItems: "center",
    left: "-6%",
    top: "-15%"
  },
  answersView: {
    width: "100%",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    top: "-11%"
  },
  answers: {
    width: 160,
    height: 100,
    elevation: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  answerText: {
    color: "#f4f4f4",
    fontFamily: "PoppinsMedium"
  },
  rightAnswer: {
    width: 160,
    height: 100,
    position: "absolute",
    backgroundColor: "#494444",
    opacity: 0.5,
    borderRadius: 5
  },
  rightAnswerStyle: {
    top: -10, left: 10
  },
  button: {
    backgroundColor: "#0D5AFF",
    borderRadius: 10,
    height: 40,
    elevation: 5,
    width: "100%"
  },
  buttonTitle: {
    fontSize: 15,
    fontFamily: "PoppinsMedium"
  }
});

export default Play;