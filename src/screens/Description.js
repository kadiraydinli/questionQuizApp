import React, { Component } from "react";
import { StyleSheet, View, Image, Text, StatusBar, TouchableOpacity, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

let data;

export class Description extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    alert(data.userImg)
  }

  render() {
    const {navigation} = this.props;
    data = navigation.getParam('data', '');
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
        <Image source={{ uri: global.url + data.img}}
          resizeMode="cover" style={styles.image} />
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
          <Icon name="times" size={30} color="white" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.userView}>
            <View style={styles.userInfo}>
              {typeof(data.userImg) != 'undefined' ? (
                <Image style={styles.userImage} source={{ uri: global.url + data.userImg }} />
              ) : (null)}
              <Text style={styles.userNick}>{data.username}</Text>
            </View>
            <View style={{ flexDirection:"row" }}>
              <TouchableOpacity><Icon name="star" size={30} style={{ right: 10 }} /></TouchableOpacity>
              <TouchableOpacity><Icon name="ellipsis-v" size={30} /></TouchableOpacity>
            </View>
          </View>
          <View style={{width:"90%", margin: 15}}>
            <ScrollView style={{width:"100%", height: "29%"}}>
            <Text style={{ fontFamily: "PoppinsLight" }}>
              {data.description}
            </Text>
            </ScrollView>
          </View>
          <Button title="Play" titleStyle={styles.buttonTitle} 
            containerStyle={{ width: "60%"}} buttonStyle={styles.button} />
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
    fontSize: 33,
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
    fontSize: 17,
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