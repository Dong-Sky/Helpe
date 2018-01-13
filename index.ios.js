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
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import Storage from 'react-native-storage';
import util from './common/util';
import { I18n } from './common/I18n';
import Service from './common/service';
//import 分页面
//四个主页面
import home from './page/home';
import comment from './page/comment';
import send from './page/send';
import compass from './page/compass';
import account from './page/account';
//详细页面
import personal from './page/personal';
import login from './page/login';
import register from './page/register';
import setting from './page/setting';
import scanner from './page/scanner';
import myItem from './page/myItem';
import myOrder_Service from './page/myOrder_Service';
import myOrder_Ask from './page/myOrder_Ask';
import mySale_Service from './page/mySale_Service';
import mySale_Ask from './page/mySale_Ask';
import myAdress from './page/myAdress';
import myItemDetail_Service from './page/myItemDetail_Service';
import myItemDetail_Ask from './page/myItemDetail_Ask';
import itemDetail_Service from './page/itemDetail_Service';
import itemDetail_Ask from './page/itemDetail_Ask';
import chatroom from './page/chatroom';
import payment from './page/payment';
import publish_Service from './page/publish_Service';
import publish_Ask from './page/publish_Ask';
import buy from './page/buy';
import help from './page/help';
import online from './page/online';
import mySaleDetail_Service from './page/mySaleDetail_Service';
import mySaleDetail_Ask from './page/mySaleDetail_Ask';
import myOrderDetail_Service from './page/myOrderDetail_Service';
import myOrderDetail_Ask from './page/myOrderDetail_Ask';
import fav from './page/fav';
import follow from './page/follow';
import user from './page/user';
import myFeedback from './page/myFeedback';
import log from './page/log';

import AnalyticsUtil from './common/AnalyticsUtil';
import PushUtil from './common/PushUtil';
import Util from './common/util';



var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

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

global.AnalyticsUtil = AnalyticsUtil;
global.PushUtil = PushUtil;
global.storage = storage;
global.I18n = I18n;

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

/*PushUtil.addAlias('answer','Helpe',(code) =>{
  console.log(code);

})*/

/*PushUtil.deleteAlias('answer',"Helpe",(code) =>{


  console.log(code);
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
};

class easygo extends Component {

  constructor(props) {
  super(props);
  this.state = {
    token: null,
    uid: null,
    islogin: false,
  };

}


  componentWillMount(){
    AnalyticsUtil.onEvent('index');

    this.getLoginState();
  };

  componentDidMount(){

  };

  componentWillUnmount() {
    // 移除

  };

  getLoginState = () => {
    storage.load({
      key: 'loginState',
    })
    .then((ret) => {
      console.log(ret);
      if(ret.token!=null&ret.uid!=null){
        const token1 = ret.token;
        const uid1 = ret.uid;
        const url = Service.BaseUrl+`?a=oauth&m=check&v=${Service.version}&token=${token1}&uid=${uid1}`;
        fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          if(!responseJson.data.res){
            storage.remove({
              key:'loginState',
            })
            .then(() => {
              Util.deleteAlias(ret.uid);

              DeviceEventEmitter.emit('login',false);
            })
            .then(() => alert('登录已失效'));

          }
          else{
            this.setState({token: token1,uid: uid1,islogin: true})
          }
        })
        .catch(err => console.log(err))
      }
    }
  )
    .catch(error => {
      console.log(error);
    })
  };

  render() {

    return (
    <EasygoPage
      loginState={{
        token: this.state.token,
        uid: this.state.uid,
        islogin: this.state.islogin,
      }}
    />
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
      activeTintColor: '#f1a073', // 文字和图片选中颜色
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
  //onTransitionStart: ()=>{console.log('导航开始'); },  // 回调
  //onTransitionEnd: ()=>{ console.log('导航结束'); }  // 回调
});

const EasygoPage = StackNavigator({
    welcome: { screen: welcome },
    main: { screen: main  },
    login:  { screen: login },
    register: { screen:  register },
    setting:  { screen: setting },
    personal: {  screen: personal },
    myAdress: { screen: myAdress },
    scanner:  { screen: scanner },
    myItem: { screen: myItem },
    myOrder_Service: { screen: myOrder_Service },
    myOrder_Ask: { screen: myOrder_Ask },
    mySale_Service: { screen: mySale_Service },
    mySale_Ask: { screen: mySale_Ask },
    myItemDetail_Service: { screen: myItemDetail_Service },
    myItemDetail_Ask: { screen: myItemDetail_Ask },
    itemDetail_Service: { screen: itemDetail_Service  },
    itemDetail_Ask: { screen: itemDetail_Ask },
    chatroom: { screen: chatroom },
    payment:  { screen: payment },
    publish_Service:  { screen: publish_Service },
    publish_Ask:  { screen: publish_Ask  },
    buy:  { screen: buy },
    help: { screen: help },
    online: { screen: online },
    mySaleDetail_Service: { screen: mySaleDetail_Service },
    mySaleDetail_Ask: { screen: mySaleDetail_Ask },
    myOrderDetail_Service: { screen: myOrderDetail_Service },

    myOrderDetail_Ask: { screen: myOrderDetail_Ask },
    fav: { screen: fav },
    follow: { screen: follow },
    myFeedback: { screen: myFeedback },
    user: { screen: user },
    log: { screen: log },
}, {
    initialRouteName: 'main', // 默认显示界面
    navigationOptions: {// 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
        headerStyle:{
          backgroundColor:'#FFFFFF',
        },
        cardStack: {
            gesturesEnabled: true
        },
        headerTintColor:'#FFFFFF',
    },
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'none', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    //onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    //onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
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
    height: 50,
  },

});

AppRegistry.registerComponent('easygo', () => easygo);
