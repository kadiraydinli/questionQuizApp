import React, { Component } from "react";
import { StyleSheet, View, Text, Animated, TouchableOpacity, Easing, Image  } from "react-native";
import PhotoUpload from 'react-native-photo-upload';
import { Input, CheckBox } from 'react-native-elements';

export class Dene extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      fadeValue: new Animated.Value(0),
      xValue: new Animated.Value(0),
      time: 5,
      checked: true
    }
  }

  _fadeAnimation = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
   
  _moveAnimation = () => {
    Animated.timing(this.state.xValue, {
      toValue: 100,
      duration: 100,
      easing: Easing.cubic,
    }).start(() => {
      Animated.timing(this.state.xValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.bounce
      }).start()
    });
  }

  componentDidMount() {
    this.interval = 0;
    this.interval = setInterval(() => {
      this.setState({time: this.state.time - 1});
    }, 1000);
  }

  componentDidUpdate() {
    if(this.state.time == 0) {
      clearInterval(this.interval);
      alert("bitti")
    }
  }
  
  render() {
    return (
      <View style={styles.root}>
        <Animated.View style= {[{left: this.state.xValue, bottom: this.state.xValue}]}>
          <TouchableOpacity onPress={this._moveAnimation} style={styles.button}>
            <Text style={styles.buttonText}>Animate</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text>{this.state.time}</Text>
        <PhotoUpload
          onPhotoSelect={avatar => {
            if (avatar) {
              console.log('Image base64 string: ', avatar)
            }
          }}
        >
          <Image
            style={{
              paddingVertical: 30,
              width: 500,
              height: 500
            }}
            resizeMode='cover'
            source={{
              uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
            }}
          />
        </PhotoUpload>
        <CheckBox containerStyle={{ alignSelf: "flex-end", alignItems: "flex-start" }}
          checked={this.state.checked} title='Click Here' onPress={() => this.setState({checked: !this.state.checked})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  animationView: {
    width: 100,
     height: 100,
    backgroundColor: "red"
  },
  button: {
    backgroundColor: "blue",
    height: 45,
    marginTop: 20,
    alignSelf: "center"
  },
  buttonText: {
    color: "white",
    padding: 12,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default Dene;