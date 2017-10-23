import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';

 class compass extends Component {
   static navigationOptions = {
     tabBarLabel: 'compass',
     tabBarIcon: ({ tintColor }) => (
       <Image
         source={require('../icon/tarbar/compass.png')}
         style={[styles.icon, {tintColor: tintColor}]}
       />
     ),
   };

   constructor(props) {
     super(props);

     this.state = {
       token:null,
       uid:null,
       islogin:false,
     }
   };
   componentWillMount(){
     this.getLoginState();
   };

   componentDidMount() {

   };

   getLoginState = () => {
     storage.load({
       key: 'loginState',
     })
     .then((ret) => {
       console.log(ret);
       if(ret.token!=null&ret.uid!=null){
         this.setState({ islogin: true });
       }
       this.state.token = ret.token;
       this.state.uid = ret.uid;
         console.log(ret);
       }
     )
     .catch(error => {
       console.log(error);
     })
   };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        </View>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        alignItems: 'stretch'
  },
  StatusBar: {
        height:22,
        backgroundColor:'#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
  },
  instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
  },
  icon: {
     width: 25,
     height: 25,
   },
});
export default compass;
