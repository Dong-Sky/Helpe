/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import Storage from 'react-native-storage';
import util from './common/util.js';
import service from './common/service.js';
import user from './common/user.js';
import DeviceStorage from './common/DeviceStorage';
import Service from './common/service.js';
import home from './page/home.js';
import comment from './page/comment.js';
import send from './page/send.js';
import compass from './page/compass.js';
import account from './page/account.js';
import personal from './page/personal.js';
import setting from './page/setting';

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是写到另一个文件里，这里require引入
  // 或是在任何时候，直接对storage.sync进行赋值修改
  //sync: require('./sync')  // 这个sync文件是要你自己写的
})
global.storage = storage;
/*storage.save({
      key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
      data: {
        token:null,
        uid:null,
      },
      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      expires: null,
    })*/
class welcome extends Component {
  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => navigate('main')}>
          Let's go!
        </Text>
      </View>
    );
  }
}


class login extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: 'songsj125@gmail.com',//songsj125@gmail.com
            password: '1111',//1111
            token: null,
            uid: null,
      }
    }
  //定义登录跳转方法
  render(){
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return(
        <View style={styles.container}>
            <TextInput
            style={{height: 40,width:200, borderColor: 'gray', borderWidth: 1,alignSelf:'center'}}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
            autoCapitalize = 'none'
          />
            <TextInput
            style={{height: 40,width:200, borderColor: 'gray', borderWidth: 1,alignSelf:'center'}}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            autoCapitalize = 'none'
          />
           <Text style={styles.instructions} onPress={() => util.postRequest(
             service.BaseUrl,
             'a=oauth&v=1.0.0&username='+this.state.username+'&password='+this.state.password,
             function(response){
               console.log(response);
               if(!response.status){
                storage.save({
                      key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
                      data: {
                        token:response.data.token,
                        uid:response.data.uid,
                      },
                      // 如果不指定过期时间，则会使用defaultExpires参数
                      // 如果设为null，则永不过期
                      expires: null,
                    })
                 .then(this.setState({
                   token:response.data.token,
                   uid:response.data.uid,
                 }))
                 .then(this.props.navigation.dispatch(NavigationActions.reset({
                   index: 0,
                   actions: [
                     NavigationActions.navigate({
                       routeName: 'main',
                       params:{
                         usr: {
                           token:this.state.token,
                           uid:this.state.uid,
                         }
                       },
                   }),
                   ]
                 })))
               }
               else{alert(response.err);}
             }.bind(this),
             function(err){
               console.log(err);}.bind(this),
           )}>
             登录
           </Text>
           <Text onPress={() => {
             console.log(DeviceStorage.get(user.token));
             console.log(DeviceStorage.get(user.uid));
              }
            }>
             获取
           </Text>
           <Text onPress={() => console.log(this.state)}>
             input
           </Text>
           <Text onPress={() => this.props.navigation.dispatch(goMain)}>
             gogogo!
           </Text>
         </View>
    );
  }
}



const main = TabNavigator({
  home: {
    screen: home ,
  },
  comment :{
    screen: comment,
  },
  send: {
    screen: send,
  },
  compass:  {
    screen: compass,
  },
  account:  {
    screen: account,
  },
}, {
  animationEnabled: false,// 切换页面时不显示动画
  tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
  swipeEnabled: false, // 禁止左右滑动
  backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
  tabBarOptions: {
      activeTintColor: '#f0b913', // 文字和图片选中颜色
      inactiveTintColor: '#595959', // 文字和图片默认颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      showLabel: false,
      indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
      style: {
          backgroundColor: '#FFFFFF', // TabBar 背景色
      },
      labelStyle: {
          fontSize: 12, // 文字大小
      },
  },
  onTransitionStart: ()=>{console.log('导航开始'); },  // 回调
  onTransitionEnd: ()=>{ console.log('导航结束'); }  // 回调
});

const easygo = StackNavigator({
    welcome: { screen: welcome },
    main: { screen: main  },
    login:  { screen: login },
    setting:  { screen: setting },
    personal: {  screen: personal},
}, {
    initialRouteName: 'main', // 默认显示界面
    navigationOptions: {// 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
        headerStyle:{
          backgroundColor:'#fbe994',
        },
        cardStack: {
            gesturesEnabled: true
        },
        headerTintColor:'#5c492b',
    },
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#e1e8e2',
    },
    backgroundImage:{
   flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:null,
   width:null,
   //不加这句，就是按照屏幕高度自适应
   //加上这几，就是按照屏幕自适应
   //resizeMode:Image.resizeMode.contain,
   //祛除内部元素的白色背景
   backgroundColor:'rgba(0,0,0,0)',
 },
    body: {
        flex: 1,
        backgroundColor: '#e1e8e2',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  icon: {
   width: 25,
   height: 25,
 },
 icon_send: {
  width: 50,
  height: 50
},
});

AppRegistry.registerComponent('easygo', () => easygo);
