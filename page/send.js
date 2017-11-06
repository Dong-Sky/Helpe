import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button } from 'react-native-elements';

 class send extends Component {
   static navigationOptions = {
     tabBarLabel: ' ',
     tabBarIcon: ({ tintColor }) => (
       <Icon
         name='add-circle'
         color='#f3456d'
         size={40} />
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
        <Button
        title='Service'
        onPress={() => {
          if(this.state.islogin){
            this.props.navigation.navigate('publish_Service',{
              token:this.state.token,
              uid:this.state.uid,
              islogin:this.state.islogin,
            })
          }
          else {
            alert('请先登录');
          }
        }}
      />
        <Button
        title='Ask'
        onPress={() => {
          if(this.state.islogin){
            this.props.navigation.navigate('publish_Ask',{
              token:this.state.token,
              uid:this.state.uid,
              islogin:this.state.islogin,
            })
          }
          else {
            alert('请先登录');
          }
        }}
       />
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
  StatusBar:  {
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
  welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
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
  icon_send: {
  width: 25,
  height: 25,
  },
});
export default send;
