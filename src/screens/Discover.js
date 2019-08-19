import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Input } from "react-native-elements";
import ioApi from "../socket";

let io = null;

export class Discover extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      _refresh: false,
      quizzesTrend: [],
      myQuizzes: []
    };
  }

  _refresh(data) {
    this.setState({ _refresh: data });
    this.componentDidMount();
  }

  async componentDidMount() {
    try {
      io = ioApi("profile", await AsyncStorage.getItem("token"));
      io.emit("getDiscover");
      io.on("setDiscoverTrend", data => {
        this.setState({ quizzesTrend: data });
      });
      io.on("setDiscoverMyQuiz", data => {
        this.setState({ myQuizzes: data });
      });
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  componentWillUnmount() {
    try {
      io.removeListener("setDiscoverTrend");
      io.removeListener("setDiscoverMyQuiz");
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  }

  trendsRender() {
    return this.state.quizzesTrend.map((data, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Description", { _refresh: this._refresh.bind(this), data: data })}
          style={styles.card}>
          <Image style={styles.cardImage} source={{ uri: global.url + data.img }} />
          <View style={styles.cardFooter}>
            <View style={styles.cardUser}>
              <Text style={styles.cardNick}>{data.username}</Text>
              <Image style={styles.cardUserImage} source={{ uri: global.url + data.userImg }} />
            </View>
            <Text style={styles.cardTitle}>{data.title}</Text>
            <Text style={{ fontFamily: "PoppinsLight" }}>
              {data.questionCount} Questions
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  myQuizzesRender() {
    return this.state.myQuizzes.map((data, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Description", { data: data })} style={styles.miniCard}>
          <Image style={styles.miniCardImage} source={{ uri: global.url + data.img }} />
          <View style={styles.miniCardFooter}>
            <Text style={data.title.length >= 21 ? ({...styles.miniCardTitle, fontSize: 13}): 
              (data.title.length >= 13 ? ({...styles.miniCardTitle, fontSize: 14}):(styles.miniCardTitle))}>
              {data.title}
            </Text>
            <Text style={styles.miniCardText}>
              {data.questionCount} Questions
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <View style={{ width: "90%", alignSelf: "center" }}>
          <Input
            placeholder="Ara"
            containerStyle={styles.searchInput}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={styles.inputStyle}
            leftIconContainerStyle={styles.inputIcon}
            shake={true}
            leftIcon={<Icon name="search" size={25} color="#D8D8D8" />}
          />
        </View>
        <View style={styles.trendingsView}>
          <View style={styles.trendingsHeadline}>
            <Text style={styles.trendingsHeadlineText}>Trendings</Text>
            <TouchableOpacity>
              <Text style={{ ...styles.trendingsHeadlineText, fontSize: 15 }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingLeft: 20, width: "95%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.myQuizzes}>
              {this.trendsRender()}
            </ScrollView>
          </View>
        </View>
        <View style={styles.topPicsView}>
          <Text style={styles.topPicsTitle}>Top Pics</Text>
          <View style={{ flexDirection: "row" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: "100%" }}>
              {this.myQuizzesRender()}
            </ScrollView>
          </View>
        </View>
        <View style={styles.footerView}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Discover")}>
            <Icon name="compass" size={30} color="#6520A0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Create")}>
            <Icon name="plus-square" size={30} color="#D4D3D3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image style={styles.footerHome} source={require("../assets/icon/home.png")} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="star" size={30} color="#D4D3D3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
            <Icon name="user" size={30} color="#D4D3D3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "space-between"
  },
  searchInput: {
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 30,
    marginTop: "5%"
  },
  inputStyle: {
    fontFamily: "PoppinsMedium"
  },
  inputIcon: {
    marginLeft: 5,
    marginRight: 5
  },
  trendingsView: {
    width: "87%",
    height: "45%",
    marginTop: "7%",
    backgroundColor: "#9B3ADB",
    borderBottomRightRadius: 61,
    borderTopRightRadius: 61
  },
  trendingsHeadline: {
    flexDirection: "row",
    padding: 25,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "space-between"
  },
  trendingsHeadlineText: {
    color: "white",
    fontFamily: "PoppinsMedium",
    fontSize: 25
  },
  myQuizzes: {
    alignSelf: "center",
    flexDirection: "row",
    margin: 5
  },
  card: {
    width: 140,
    height: 200,
    borderRadius: 10,
    marginRight: 25,
    backgroundColor: "#DCDCDC"
  },
  cardImage: {
    width: 140,
    height: 200,
    borderRadius: 10
  },
  cardFooter: {
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    justifyContent: "space-between",
    height: "40%",
    borderRadius: 9,
    top: "60%"
  },
  cardUser: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  cardNick: {
    fontSize: 12,
    fontFamily: "PoppinsMedium"
  },
  cardUserImage: {
    width: 20,
    height: 20,
    borderRadius: 200 / 2,
    left: 3
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold"
  },
  topPicsView: {
    flex: 1,
    alignSelf: "center",
    padding: 20
  },
  topPicsTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    bottom: "4%"
  },
  miniCard: {
    width: 160,
    height: 130,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: "#DCDCDC"
  },
  miniCardImage: {
    width: 160,
    height: 130,
    borderRadius: 10
  },
  miniCardFooter: {
    width: "100%",
    height: 52,
    top: "60%",
    paddingLeft: 7,
    paddingBottom: 2,
    paddingTop: 2,
    backgroundColor: "white",
    justifyContent: "space-between",
    position: "absolute",
    borderRadius: 9
  },
  miniCardTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold"
  },
  miniCardText: {
    fontFamily: "PoppinsLight",
    fontSize: 12
  },
  footerView: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  footerHome: {
    width: 75,
    height: 75,
    zIndex: 1,
    bottom: 15,
    borderRadius: 15
  }
});

export default Discover;
