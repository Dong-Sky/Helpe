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
  TouchableHightlight,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button,Avatar } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import Service from '../common/service';



class account1 extends Component {
  static navigationOptions = {
    tabBarLabel: 'account',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/account.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props) {
      super(props);
      this.state = {
        token: null,
        uid: null,
        islogin: false,
        user: {},
      }
  };

  componentWillMount(){
    this.getLoginState();

    this.subscription0 = DeviceEventEmitter.addListener('login',
    (e) => {
    console.log(e);
      //e==0登录,e!=0登出
      if(e){
        console.log('登录');
        this.getLoginState();
      }
      else{
        console.log('登出');
        this.setState({
          token: null,
          uid: null,
          islogin: false,
          user: {},
        },this.getUserInfo)
      }
      }
    );

  };

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('update_user',() => this.getUserInfo())
  };

  componentWillUnmount() {
    console.log('clear');
    try{
      this.subscription0.remove();
      this.subscription.remove();
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
    .then()
    .catch(error => {
      console.log(error);
    })
    .then(() => this.getUserInfo())
  };

  getUserInfo = () => {
    const { token,uid } = this.state;
    const url = Service.BaseUrl+`?a=user&m=info&token=${token}&uid=${uid}&id=${uid}&v=${Service.version}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      if(!responseJson.status){
        this.setState({user: responseJson.data.user});
      }
      else{

        console.log(responseJson.err);

      }
    })
    .catch(err => console.log(err))
  };


 onPressHeader = (islogin) => {
    if(islogin){
      this.props.navigation.navigate('personal',{
        token: this.state.token,
        uid: this.state.uid,
        islogin: this.state.islogin,
      })
    }
    else{
      this.props.navigation.navigate('login');
    }
 };

 //一下定义页面元素
 renderSeparator = (bool) => {
   if(!bool){
     return (
       <View
         style={{
           height: 1,
           width: "95%",
           backgroundColor: "#e5e5e5",
           marginLeft: "5%"
         }}
       />
     );
   }
   else {
     return (
       <View>
       </View>
     );
   }
  };

  returnAvatar = () => {
    const {navigate} = this.props.navigation;
    var source = require('../icon/person/default_avatar.png');
    if(this.state.user.face==''||this.state.user.face==null||this.state.user.face==undefined){

    }
    else{
      source = {uri: Service.BaseUri+this.state.user.face};
    }
    return(
      <TouchableOpacity
        style={{marginTop: 10,marginLeft: 15}}
        onPress={() => {
          if(!this.state.islogin){
            navigate('login',{
            token:this.state.token,
            uid:this.state.uid,
            islogin:this.state.islogin,
            })
          }
          else{
            alert('已经登录!');
          }
        }}
        >
        <Image
          style={styles.avatar}
          source={source}
        />
      </TouchableOpacity>
      );
  };

 render() {
    const {params} = this.props.navigation.state;
    const {navigate} = this.props.navigation;
    //跳转到登录页面方法goLogin()
    //定义一个导航器重置方法，重置导航状态，使登录页面不可返回。
    //跳转登录页面方法
    const goLogin = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'login'}),
    ]
    })
    //end
    //定义列表

    const list1 = [
    /*  {
        id: 1,
        title: '我的钱包',
        icon : (
          <Image
          source={require('../icon/account/money.png')}
          style={styles.account_icon}
        />

      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          alert('暂未开放')
        },
      },*/
      {
        id: 2,
        title: I18n.t('account.pub'),
        icon : (
          <Image
          source={require('../icon/account/myItem.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          if(state.islogin){
            navigate('myItem',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert(I18n.t('account.noLogin'));
          }
        },
      },
    ];
    const list2 =[
      {
        id: 1,
        title: I18n.t('account.fav'),
        icon : (
          <Image
          source={require('../icon/account/fav.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          if(state.islogin) navigate('fav',{
            uid: state.uid,
            token: state.token,
            islogin: state.islogin,
          })
          else{
            alert(I18n.t('account.noLogin'));
          }
        },
      },
      {
        id: 2,
        title: I18n.t('account.myAddress'),
        icon: (
          <Image
          source={require('../icon/account/address.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:7,
        press(state){
          if(state.islogin){
            navigate('myAdress',state);
          }
          else {
            alert(I18n.t('account.noLogin'));
          }
        },
      },

    ];

    const list3 = [
      {
        id: 1,
        title: '购买的服务',
        icon : (
          <Image
          source={require('../icon/account/order.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f3456d',
        x:2,
        press(state){
          if(state.islogin){
            navigate('myOrder_Service',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert(I18n.t('account.noLogin'));
          }
        },
      },
      {
        id: 2,
        title: '出售的服务',
        icon : (
          <Image
          source={require('../icon/account/sale.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          if(state.islogin){
            navigate('mySale_Service',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert(I18n.t('noLogin'));
          }
        },
      },
      {
        id: 3,
        title: '帮助他人',
        icon : (
          <Image
          source={require('../icon/account/order.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          if(state.islogin){
            navigate('myOrder_Ask',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert(I18n.t('account.noLogin'));
          }
        },
      },
      {
        id: 4,
        title: '发布的求助',
        icon : (
          <Image
          source={require('../icon/account/sale.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:2,
        press(state){
          if(state.islogin){
            navigate('mySale_Ask',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert(I18n.t('noLogin'));
          }
        },
      },
      {
        id: 5,
        title: I18n.t('account.myFollow'),
        icon: (
          <Image
          source={require('../icon/account/ord.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:5,
        press(state){
          if(state.islogin){
            navigate('follow',state);
          }
          else {
            alert(I18n.t('account.noLogin'));
          }
        },
      },
      {
        id: 6,
        title: I18n.t('account.myContent'),
        icon: (
          <Image
          source={require('../icon/account/content.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#f1a073',
        x:7,
        press(state){
          if(state.islogin){
            navigate('myFeedback',state);
          }
          else {
            alert(I18n.t('account.noLogin'));
          }
        },
      },
    ];

   const list4 = [
     {
       id: 1,
       title: I18n.t('account.setting'),
       icon: (
         <Image
         source={require('../icon/account/setting.png')}
         style={styles.account_icon}
       />
     ),
       icon_color:'#f1a073',
       x:5,
       press(state){

             navigate('setting',{
             })
         },
     },
   ];
   return (
     <View style={styles.container}>
       <View style={styles.StatusBar}>
       </View>
       <View style={styles.header}>
         <View style={{flex: 1,}}>
         </View>
         <View style={{flex: 1,}}>

           <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
             {I18n.t('account.me')}
           </Text>
         </View>
         <View style={{flex: 1,}}>
         </View>
       </View>
       <ScrollView>
         <View style={styles.userInfo}>
            <TouchableOpacity style={styles.user} onPress={() => this.onPressHeader(this.state.islogin)}>
              {this.returnAvatar()}
              <Text style={{alignSelf: 'center',marginTop: 10,marginLeft: 15,fontSize: 16,color: '#333333'}}>
                {this.state.islogin?this.state.user.name:I18n.t('account.goLogin')}
              </Text>
            </TouchableOpacity>
           <View style={styles.order}>
             <TouchableOpacity
               style={{flex:1,borderRightWidth:1,borderColor: '#e5e5e5',flexDirection: 'column',justifyContent: 'center', alignItems: 'center',}}

               onPress={() => alert(I18n.t('account.not_open'))}
               >
              <Image
                   source={require('../icon/account/getmoney.png')}
                   style={{width:40,height:40}}
                  />
              <Text
                style={{color:'#333333',fontWeight:'500',fontSize:14,}}
                >
                {I18n.t('account.getmoney')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex:1,borderLeftWidth:1,borderColor: '#e5e5e5',flexDirection: 'column', justifyContent: 'center',alignItems: 'center',}}
              onPress={() => alert(I18n.t('account.not_open'))}
              >
               <Image
               source={require('../icon/account/qrcode.png')}
               style={{width:40,height:40}}
             />
               <Text  style={{color:'#333333',fontWeight:'500',fontSize:14,}}>

                 {I18n.t('account.pay')}

               </Text>
             </TouchableOpacity>
           </View>
         </View>
         <List containerStyle={styles.list}>
           <ListItem
             component={TouchableOpacity}
             title={list1[0].title}
             leftIcon={list1[0].icon}
             onPress={() => list1[0].press(this.state)}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />

         </List>
         <List containerStyle={styles.list}>
           {
            list2.map((item, i) => (
              <View key={i}>
                <ListItem
                  component={TouchableOpacity}
                  key={i}
                  title={item.title}
                  leftIcon={item.icon}
                  onPress={() => item.press(this.state)}
                  titleStyle={styles.title}
                  containerStyle={styles.listContainerStyle}
                />
                {this.renderSeparator(i==list2.length-1)}
              </View>
            ))
          }
         </List>
         <List containerStyle={styles.list} >
           {
            list3.map((item, i) => (
              <View key={i}>
                <ListItem
                  component={TouchableOpacity}
                  key={i}
                  title={item.title}
                  leftIcon={item.icon}
                  onPress={() => item.press(this.state)}
                  titleStyle={styles.title}
                  containerStyle={styles.listContainerStyle}
                />
                {this.renderSeparator(i==list3.length-1)}
              </View>
            ))
          }
         </List>
         <List containerStyle={styles.list}>
           {
            list4.map((item, i) => (
              <View key={i}>
                <ListItem
                  component={TouchableOpacity}
                  key={i}
                  title={item.title}
                  leftIcon={item.icon}
                  onPress={() => item.press(this.state)}
                  titleStyle={styles.title}
                  containerStyle={styles.listContainerStyle}
                />
                {this.renderSeparator(i==list4.length-1)}
              </View>
            ))
          }
         </List>
        </ScrollView>
      </View>
   );
 }
}

class myQRcode extends Component {
  static navigationOptions = {
    tabBarLabel: 'account',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/account.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props) {
      super(props);
      const {params} = this.props.navigation.state;
      const {navigate} = this.props.navigation;
      this.state = {
        uid: params.uid,
      }
    }
  render() {
    return (
      <View style={styles.container1}>
        <QRCode
          value={this.state.uid}
          size={200}
          bgColor='purple'
          fgColor='white'/>
      </View>
    );
  };
}
const account = StackNavigator({
  account1:  { screen:  account1  },
  myQRcode: { screen: myQRcode  },
}, {
    initialRouteName: 'account1', // 默认显示界面
    navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
      headerStyle:{
        backgroundColor:'#333333',
      },
      cardStack: {
          gesturesEnabled: true
      }
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
        //justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f2f2f2',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

    borderColor: '#e5e5e5',
    borderBottomWidth: 1,

  },
  userInfo: {
        height: 160,
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#e5e5e5',
        marginTop: 10,
    },
    //header内元素
  user: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderColor:'#e1e8e2',
    },
  order: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderWidth: 0
    },
    //
  body: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e1e8e2',
  },
  icon: {
     width: 25,
     height: 25,
  },
  list: {
    marginTop:10,
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  listTitleStyle: {
      color:'#5c492b',
      fontWeight:'400',
      fontSize:18,
      marginLeft:10,
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333333',
  },
  account_icon: {
    //  tintColor: '#5c492b',
      width: 25,
      height: 25,
  },
  container1: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
  },
  input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
export default account;
