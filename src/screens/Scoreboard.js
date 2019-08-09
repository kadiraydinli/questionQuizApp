import React, { Component } from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import { Button } from "react-native-elements";

let score;

export class Scoreboard extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
  }

  scoreList() {
    const scoreboard = [];
    for (let i = 1; i < Math.min(score.length, 4); i++) {
      scoreboard.push(
        <View key={i} style={styles.card}>
          <Text style={styles.cardText}>{score[i].username}</Text><Text style={styles.cardText}>{score[i].score}</Text>
        </View>
      )
    }
    return scoreboard;
  }

  render() {
    const {navigation} = this.props;
    score = navigation.getParam('score', '');
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="rgba(155, 58, 219, 1)" barStyle="light-content" />
        <Text style={styles.scoreboard}>Scoreboard</Text>
        <View style={styles.firstCardView}>
          <View style={styles.firstCard}>
            <Image source={require('../assets/icon/medal.png')} style={styles.cardMedal} />
            <View style={styles.firstCardBody}>
              <Text style={{ ...styles.cardText, fontSize: 17 }}>{score[0].username}</Text>
              <Text style={{ ...styles.cardText, fontSize: 17 }}>{score[0].score}</Text>
            </View>
          </View>
          <View style={styles.firstShadow} />
        </View>
        {this.scoreList()}
        <Button onPress={() => this.props.navigation.navigate('Home')}
          title="OK" titleStyle={styles.buttonText} 
          containerStyle={{ width: "60%" }} buttonStyle={styles.button} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1, 
    backgroundColor: "rgba(155, 58, 219, 1)",
    justifyContent: "center",
     alignItems: "center"
  },
  scoreboard: {
    fontSize: 30,
    color: "white",
    marginBottom: 15,
    fontFamily: "PoppinsSemiBold"
  },
  firstCardView: {
    width: "100%",
    height: "11.5%",
    margin: 10,
    alignItems: "center"
  },
  firstCard: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 5
  },
  cardMedal: {
    width: 15,
    height: 25,
    alignSelf: "flex-end",
    right: 10,
    position: "absolute"
  },
  firstCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
    paddingLeft: 15,
    top: "5.5%",
  },
  firstShadow: {
    backgroundColor: "#F8F4F4",
    width: "80%",
    height: "75%",
    alignSelf: "center",
    zIndex: -2,
    top: "25%",
    borderRadius: 5,
    opacity: 0.25,
    position: "absolute"
  },
  card: {
    width: "77%",
    height: "8%",
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    margin: 10
  },
  cardText: {
    fontFamily: "PoppinsMedium"
  },
  button: {
     backgroundColor: "#FFAA00",
     borderRadius: 10,
     height: 50,
     marginTop: 20,
     elevation: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "PoppinsMedium"
  }
});

export default Scoreboard;