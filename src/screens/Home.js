import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import Icon from 'react-native-vector-icons/FontAwesome5';
import ioApi from "../socket";

let io = null;

export class Home extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    io = ioApi('game');
    io.on('connected', () => {
      console.log("Connected");
    });
  }
  
  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <Image style={styles.logo} resizeMode="center" source={require('../assets/icon/logo-v.png')} />
        <TouchableOpacity style={styles.enterButton} onPress={() => this.props.navigation.navigate('EnterPin')}>
          <View style={{flexDirection: "row", marginBottom: 5}}>
              <View style={{ ...styles.cup, backgroundColor: "#FF3D71", borderTopLeftRadius: 5, marginRight: 5 }}>
                <Svg viewBox={"-0 -0 42.21166884206205 32.84998096838486"} style={styles.figure}>
                  <Path strokeWidth={0} fill={"#FFFF"}
                    d={"M21.75 0.00 L0.00 32.85 L42.21 32.85 L21.75 0.00 Z"} />
                </Svg>
              </View>
              <View style={{ ...styles.cup, backgroundColor: "#FFAA00", borderTopRightRadius: 5 }}>
                <Svg style={{ ...styles.figure, transform: [{ rotate: "-45deg" }] }}>
                  <Rect width="40" height="40" stroke="#FFFF" fill="#FFFF" />
                </Svg>
              </View>
          </View>
          <View style={{flexDirection: "row"}}>
              <View style={{ ...styles.cup, backgroundColor: "#0EC6F1", borderBottomLeftRadius: 5, marginRight: 5 }}>
                <Svg viewBox={"-0 -0 28 28"} style={styles.figure}>
                <Path strokeWidth={0} fill={"#FFFF"}
                    d={"M14.00 28.00 C21.73 28.00 28.00 21.73 28.00 14.00 C28.00 6.27 21.73 0.00 14.00 0.00 C6.27 0.00 " + 
                      "0.00 6.27 0.00 14.00 C0.00 21.73 6.27 28.00 14.00 28.00 Z"} />
                </Svg>
              </View>
              <View style={{ ...styles.cup, backgroundColor: "#00D68F", borderBottomRightRadius: 5 }}>
                <Svg style={styles.figure}>
                  <Rect width="40" height="40" stroke="#fff" fill="#fff" />
                </Svg>
              </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonUnderView}>
          <View style={styles.line} />
          <Text style={styles.text}>Enter Pin</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.footerView}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Discover')}>
            <Icon name="compass" size={30} color="#D4D3D3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Create')}>
            <Icon name="plus-square" size={30} color="#D4D3D3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('EnterPin')}>
            <Image style={styles.footerHome} source={require('../assets/icon/homeActive.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="star" size={30} color="#D4D3D3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
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
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    width: "25%",
    height: "20%",
    marginTop: 40,
    left: "1%"
  },
  cup: {
    width: 113,
    height: 104,
    justifyContent: "center"
  },
  figure: {
    alignSelf: "center",
    width: 45,
    height: 45,
    backgroundColor: "transparent",
    position: "absolute",
    borderColor: "transparent"
  },
  enterButton: {
    backgroundColor: "rgba(155, 58, 219, 1)",
    borderRadius: 5,
    width: 240,
    height: 224,
    padding: 5
  },
  buttonUnderView: {
    flexDirection: "row",
    alignItems: "center",
    top: "-10%"
  },
  line: {
    width: "25%",
    height: 1,
    backgroundColor: "#D4D3D3"
  },
  text: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: "PoppinsMedium"
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

export default Home;