import React, { Component } from "react";
import { StyleSheet, View, Text, Image, StatusBar, TouchableOpacity, ScrollView, Alert } from "react-native";
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
            userImage: '',
            fullName: '',
            userName: '',
            quizzes: [],
            quizCount: 0
        });
    }

    async componentDidMount() {
        try {
            io = ioApi('profile', await AsyncStorage.getItem('token'))
            io.emit('getProfilInfo');

            io.on('setProfilInfo', (data) => {
                this.setState({ 
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
                        <Text style={styles.cardTitle}>{data.title}</Text>
                        <Text style={{ fontFamily: "PoppinsLight" }}>{this.state.quizCount} Question</Text>
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
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Icon name="times" size={25} color="white" /></TouchableOpacity>
                        <View style={{flexDirection: "row", justifyContent: "space-between", width: "30%"}}>
                            <TouchableOpacity>
                                <Icon name="star" size={25} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="share-alt" size={25} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.logout()}>
                                <Icon name="sign-out" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.userInfo}>
                        <Image source={require('../assets/images/a.png')} style={styles.userImage} />
                        <View style={styles.userText}>
                            <Text style={styles.userName}>{this.state.fullName}</Text>
                            <Icon name="pencil" size={25} color="white" onPress={() => this.props.navigation.navigate('UserEdit')} />
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
        margin: 15
    },
    userInfo: {
        alignItems: "center",
        width: "100%"
    },
    userImage: {
        borderWidth: 1,
        width: 100,
        height: 100,
        borderRadius: 200 / 2,
        marginTop: 5
    },
    userText: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 7
    },
    userName: {
        color: "white",
        fontSize: 22,
        marginRight: 10,
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
        fontSize: 17,
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