import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
  AsyncStorage,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import Storage from 'react-native-storage';
import util from '../common/util';
import service from '../common/service';
import DeviceStorage from '../common/DeviceStorage';
import Service from '../common/service'

export default class setting extends Component{
  constructor(props) {
    super(props);

    this.state = {
      token:null,
      uid:null,
      islogin:false,

    };
  }

  componentDidMount() {
    this.getLoginState();
  }

  getLoginState = () => {
    storage.load({
      key: 'loginState',
    })
    .then((ret) => {
      if(ret.token!=null&ret.uid!=null){
        this.setState({
          islogin:true,
        })
      }
      this.setState({
      token:ret.token,
      uid:ret.uid,
        });
        console.log(ret);
      }
    )
    .catch(error => {
      console.log(error);
    })
  };
  //用户登出方法loginOut()
  loginOut(url,v,token,uid,successCallback,failedCallback){
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:'a=user&m=out&v='+v+'&token='+token+'&uid='+uid,
    })
    .then((response) => response.json())
    .then((responseJson) => successCallback(responseJson))
    .catch((error) => failedCallback(error))
  }

  out = () => {
    const {params} = this.props.navigation.state;
    this.loginOut(
    service.BaseUrl,
    service.version,
    this.state.token,
    this.state.uid,
    function(response){
      console.log(response);
      //服务器端登出后还需要消除本地的登录状态。
      storage.remove({
        key:'loginState',
      })
      .then(
      this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({  routeName: 'welcome',  })
        ]
      })
     )
    )
    .then(() => alert('登出成功'))
    }.bind(this),
    function(err){
      console.log(err);
      alert('登出失败');
    }.bind(this),
  );
}

  //end
  render(){
    const {params} = this.props.navigation.state;
    const {navigate} = this.props.navigation;

    return(
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => this.out()}>
          loginOut
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
  header: {
        height: 200,
        backgroundColor: '#e1e8e2',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderWidth:1,
        borderBottomWidth:3,
        borderColor: '#e1e8e2',
    },
    //header内元素
  user: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderColor:'#e1e8e2',
    },
    order: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    //
  body: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e1e8e2',
    },
  tarbar_bottom: {
      position:'relative',
      borderWidth: 1,
      borderColor:'#d8dfd6',
      height: 49,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems:'center',
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
  listTitleStyle: {
   color:'#5c492b',
   fontWeight:'400',
   fontSize:18,
 },
 listRightTitleStyle: {
   color:'#5c492b',
   fontWeight:'400',
   fontSize:18,
 },

});
