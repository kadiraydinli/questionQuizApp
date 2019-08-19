import React, { Component } from "react";
import { StyleSheet, View, Text, Image, StatusBar, TouchableOpacity, ScrollView, Alert, BackHandler } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import ioApi from "../socket";

let io = null;

export class Profile extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = ({
            _refresh: false,
            userImage: '',
            fullName: '',
            userName: '',
            quizzes: [],
            quizCount: 0
        });
    }

    _refresh(data) {
        this.setState({_refresh: data});
        this.componentDidMount();
    }

    async componentDidMount() {
        try {
            io = ioApi('profile', await AsyncStorage.getItem('token'))
            io.emit('getProfilInfo');

            io.on('setProfilInfo', (data) => {
                this.setState({ 
                    userImage: data.img,
                    fullName: data.firstname + " " + data.lastname,
                    userName: data.username
                });
            });

            io.on('profilQuiz', (quizzes) => {
                this.setState({ 
                    quizzes: quizzes,
                    quizCount: quizzes.length
                });
            });
        }
        catch (error) {
            Alert.alert("Error", error);
        }
    }

    componentWillUnmount() {
        io.removeListener('setProfilInfo');
        io.removeListener('profilQuiz');
    }

    async logout() {
        try {
            Alert.alert("", "Are you sure you want to logout?", 
            [
                {text: 'Cancel'},
                {
                    text: 'Log out', onPress: async () => {
                        await AsyncStorage.removeItem('token')
                        this.props.navigation.navigate('Login')
                        Alert.alert("Successful", "You logged out!");
                    }
                }
            ]); 
        }
        catch (error) {
            Alert.alert("Error", error);
        }
    }

    myQuizzesRender() {
        return this.state.quizzes.map((data, index) => {
            return (
                <TouchableOpacity key={index} style={styles.card} onPress={() => this.props.navigation.navigate('Description', { data: data })}>
                    <Image style={styles.cardImage} source={{ uri: global.url + data.img }} />
                    <View style={styles.cardFooter}>
                        <Text style={data.title.length >= 21 ? ({...styles.cardTitle, fontSize: 13}): 
                            (data.title.length >= 13 ? ({...styles.cardTitle, fontSize: 14}):(styles.cardTitle))}>
                            {data.title}
                        </Text>
                        <Text style={{ fontFamily: "PoppinsLight" }}>{data.questionCount} Question</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor="#9B3ADB" barStyle="light-content" />
                <View style={styles.header}>
                    <View style={styles.headerButton}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }}>
                            <Icon name="times" size={25} color="white" />
                        </TouchableOpacity>
                        <View style={{flexDirection: "row", justifyContent: "space-between", width: "33%"}}>
                            <TouchableOpacity style={{ padding: 10 }}>
                                <Icon name="star" size={25} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10 }}>
                                <Icon name="share-alt" size={25} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.logout()} style={{ padding: 10 }}>
                                <Icon name="sign-out" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: global.url + this.state.userImage }} style={styles.userImage} />
                        <View style={styles.userText}>
                            <Text style={styles.userName}>{this.state.fullName}</Text>
                            <Icon name="pencil" size={25} color="white" style={{ padding: 10 }}
                                onPress={() => this.props.navigation.navigate('UserEdit', { _refresh: this._refresh.bind(this)})} />
                        </View>
                        <Text style={styles.userNick}>{this.state.userName}</Text>
                    </View>
                    <View style={styles.userPlay}>
                        <TouchableOpacity style={styles.playInfo}>
                            <Text style={styles.playInfoText}>Quiz Created</Text>
                            <Text style={styles.playInfoText}>{this.state.quizCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.playInfo}>
                            <Text style={styles.playInfoText}>Hosted Games</Text>
                            <Text style={styles.playInfoText}>{this.state.quizCount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.quizzes}>
                    <Text style={styles.quizzesTitle}>My Quizzes</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.myQuizzes}>
                        {this.myQuizzesRender()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F9F9F9"
    },
    header: {
        backgroundColor: "#9B3ADB",
        width: "100%",
        height: "53.5%",
        borderBottomLeftRadius: 61
    },
    headerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 15,
        marginTop: 0
    },
    userInfo: {
        alignItems: "center",
        width: "100%"
    },
    userImage: {
        backgroundColor: "#DCDCDC",
        borderWidth: 1,
        width: 100,
        height: 100,
        borderRadius: 200 / 2,
        marginTop: 5
    },
    userText: {
        flexDirection: "row",
        alignItems: "center"
    },
    userName: {
        color: "white",
        fontSize: 22,
        fontFamily: "PoppinsMedium"
    },
    userNick: {
        color: "#D08AFF",
        fontSize: 17,
        fontFamily: "PoppinsLight",
        marginBottom: 5
    },
    userPlay: {
        alignItems: "center",
        width: "100%"
    },
    playInfo: {
        backgroundColor: "#8A2BC9",
        width: "70%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
        borderRadius: 5,
        elevation: 5,
        margin: 7
    },
    playInfoText: {
        color: "white",
        fontFamily: "PoppinsLight",
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
        marginRight: 30,
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
        justifyContent: "space-between",
        position: "absolute",
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
        fontSize: 17,  //14
        fontFamily: "PoppinsSemiBold"
    },
    quizzes: {
        marginLeft: 20,
        marginRight: 20
    },
    quizzesTitle: {
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 20,
        //margin: 30,
        fontFamily: "PoppinsMedium"
    }
});

export default Profile;