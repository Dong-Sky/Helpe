import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,

  DeviceEventEmitter,

} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Tile,Card,Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

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

     this.subscription0 = DeviceEventEmitter.addListener('login',
     (e) => {

       //e==0登录,e!=0登出
       if(e){
         this.getLoginState();
       }
       else{
         this.setState({
           token: null,
           uid: null,
           islogin: false,
         })
       }

       }
     );

   };

   componentDidMount() {

   };

   componentWillUnmount() {
     console.log('clear');
     try{
       this.subscription0.remove();

     }catch(e){
       console.log(e);
     }
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
        <Text style={{fontSize: 16,color: '#999999'}}>
          welcome!
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
  },
  StatusBar: {

        height:22,
        backgroundColor:'#FFFFFF',
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
