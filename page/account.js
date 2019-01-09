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
  Dimensions,
  TouchableWithoutFeedback
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

import Modalbox from 'react-native-modalbox';


//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

console.log(height);



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
        })
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
    if(!token){ return }
    const url = Service.BaseUrl+Service.v+`/user/info?t=${token}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      if(!responseJson.status){
        this.setState({user: responseJson.data});
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

    return source;
  };

  renderOrderModal = () => {
    return (
      <Modalbox
        style={[styles.shadow,{width:width-40,height: 113,marginTop: 155,borderWidth: 0,borderColor: '#e5e5e5',borderRadius: 15,backgroundColor: '#FFFFFF',alignItems: 'center'}]}
        isOpen={true}
        isDisabled={false}
        position='Top'
        backdrop={false}
        backButtonClose={false}
        swipeToClose={false}
        //backdropOpacity={0.1}
        //backdropColor='#FFFFFF'
        //onClosed={() => this.setState({modalVisible: false})}
        >

            <View style={{flexDirection: 'row',height: 30,marginTop: 15,width: width-40-20,marginLeft: 10,marginRight: 10,alignItems: 'flex-start',}}>
              <Image
                style={{height: 24,width: 24,tintColor: '#fd586d'}}
                source={require('../icon/account/order.png')}
              />
              <View style={{height: 30,alignItems: 'center',justifyContent: 'center',marginLeft: 5}}>
                <Text style={{fontSize: 14,color:'#999999',height: 24 }}>
                  {I18n.t('myOrder.myOrder')}
                </Text>
              </View>

            </View>
            <View style={{flexDirection: 'row',height: 113-30-30,width: width-10-40,marginLeft: 5,marginRight: 5,}}>
              <View style={{flex: 1,height: 113-60,alignItems: 'center',justifyContent: 'center',}}>

                <TouchableWithoutFeedback onPress={() => {
                  if(this.state.islogin){
                    this.props.navigation.navigate('myOrder',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                      status: '&status=0',
                      title: I18n.t('myOrder.o1'),
                    })
                  }
                  else{
                    alert(I18n.t('account.noLogin'))
                  }
                }}>
                  <View style={{alignItems: 'center',justifyContent: 'center'}}>
                    <Image
                      style={{height: 28,width: 28}}
                      source={require('../icon/account/order1.png')}
                      resizeMode='contain'
                    />
                    <Text style={{fontSize: 14,color: '#999999',marginTop: 10}}>
                      {I18n.t('myOrder.o1')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex: 1,height: 113-60,alignItems: 'center',justifyContent: 'center'}}>
                <TouchableWithoutFeedback onPress={() => {
                  if(this.state.islogin){
                    this.props.navigation.navigate('myOrder',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                      status: '&status=10,20,30',
                      title: I18n.t('myOrder.o2'),
                    })
                  }
                  else{
                    alert(I18n.t('account.noLogin'))
                  }
                }}>
                  <View style={{alignItems: 'center',justifyContent: 'center'}}>
                    <Image
                      style={{height: 28,width: 28}}
                      source={require('../icon/account/order2.png')}
                      resizeMode='contain'
                    />
                    <Text style={{fontSize: 14,color: '#999999',marginTop: 10}}>
                      {I18n.t('myOrder.o2')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

              </View>
              <View style={{flex: 1,height: 113-60,alignItems: 'center',justifyContent: 'center'}}>
                <TouchableWithoutFeedback onPress={() => {
                  if(this.state.islogin){
                    this.props.navigation.navigate('myOrder',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                      status: '&status=40,50,60',
                      title: I18n.t('myOrder.o3'),
                    })
                  }
                  else{
                    alert(I18n.t('account.noLogin'))
                  }
                }}>
                  <View style={{alignItems: 'center',justifyContent: 'center'}}>
                    <Image
                      style={{height: 28,width: 28}}
                      source={require('../icon/account/order3.png')}
                      resizeMode='contain'
                    />
                    <Text style={{fontSize: 14,color: '#999999',marginTop: 10}}>
                      {I18n.t('myOrder.o3')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex: 1,height: 113-60,alignItems: 'center',justifyContent: 'center'}}>
                <TouchableWithoutFeedback onPress={() => {
                  if(this.state.islogin){
                    this.props.navigation.navigate('myOrder',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                      status: '&status=0,10,20,30,40,50,60',
                      title: I18n.t('myOrder.o4'),
                    })
                  }
                  else{
                    alert(I18n.t('account.noLogin'))
                  }
                }}>
                  <View style={{alignItems: 'center',justifyContent: 'center'}}>
                    <Image
                      style={{height: 28,width: 28}}
                      source={require('../icon/account/order4.png')}
                      resizeMode='contain'
                    />
                    <Text style={{fontSize: 14,color: '#999999',marginTop: 10}}>
                      {I18n.t('myOrder.o4')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>


      </Modalbox>
    );
  }


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
      /*{
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
        id: 1,
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
      {
        id: 2,
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
        id: 3,
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
        id: 4,
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
      {
        id: 5,
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

    const list2 =[
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


    ];

   return (

     <View style={styles.container}>
       <ScrollView scrollEnabled={height<650} style={{height: 2000}}>
       <View style={[styles.StatusBar,{backgroundColor: '#fd586d'}]}>
       </View>

       <View>
         <Image style={styles.userInfo} source={require('../icon/account/bg.png')}>
           <View style={styles.user}>
             <View  style={{width: 40,justifyContent: 'flex-end',alignItems: 'center'}}>
               <Image
                 source={require('../icon/account/good.png')}
                 style={{height: 24,width: 24,marginBottom: 20}}
                 resizeMode="cover"
               />
             </View>
             <View style={{flex: 1,alignItems: 'center'}}>
               <TouchableOpacity
                 style={styles.avatarTouch}
                 onPress={() => {
                   if(!this.state.islogin){
                     navigate('login',{
                     token:this.state.token,
                     uid:this.state.uid,
                     islogin:this.state.islogin,
                     })
                   }
                   else{
                     //alert('已经登录!');
                     navigate('personal',{
                     token:this.state.token,
                     uid:this.state.uid,
                     islogin:this.state.islogin,
                     })
                   }
                 }}>
                 <Image
                   style={styles.avatar}
                   source={this.returnAvatar()}

                 />
               </TouchableOpacity>
               <TouchableOpacity style={{width: width-180-50,height: 44,justifyContent: 'center',alignItems: 'center'}}>
                 <Text
                   numberOfLines={2}
                   style={{fontSize: 16,color: '#FFFFFF'}}
                   onPress={() => {
                     if(!this.state.islogin){
                       navigate('login',{
                       token:this.state.token,
                       uid:this.state.uid,
                       islogin:this.state.islogin,
                       })
                     }
                     else{
                       //alert('已经登录!');
                       navigate('personal',{
                       token:this.state.token,
                       uid:this.state.uid,
                       islogin:this.state.islogin,
                       })
                     }
                   }}
                   >
                   {this.state.islogin?this.state.user.username:I18n.t('account.goLogin')}
                 </Text>
               </TouchableOpacity>
             </View>
             <View style={{width: 40,justifyContent: 'flex-end',alignItems: 'center'}}>
               <Image
                 source={require('../icon/account/fav1.png')}
                 style={{height: 24,width: 24,marginBottom: 20}}
               />
             </View>
           </View>
         </Image>
       </View>
       {this.renderOrderModal()}

       {
         list1.map((item,i) => (
           <Modalbox
             key={i}
             style={[styles.shadow,{width:width-40,height: 50,justifyContent: 'center',marginTop: 155+10+113+i*50,borderWidth: 0,borderColor: '#e5e5e5',borderRadius: 15,backgroundColor: '#FFFFFF'}]}
             isOpen={true}
             isDisabled={false}
             position='Top'
             backdrop={false}
             backButtonClose={false}
             swipeToClose={false}
             //backdropOpacity={0.1}
             //backdropColor='#FFFFFF'
             //onClosed={() => this.setState({modalVisible: false})}
             >
               <ListItem
                 containerStyle={styles.listContainerStyle}
                 //rightIcon={{name: 'chevron-right',color: '#999999',size: 12}}
                 title={item.title}
                 leftIcon={item.icon}
                 onPress={() => item.press(this.state)}
                 titleStyle={styles.title}
               />
           </Modalbox>
         ))
       }
       {
         list2.map((item,i) => (
           <Modalbox
             key={i}
             style={[styles.shadow,{width:width-40,justifyContent: 'center',height: 50,marginTop: 155+20+113+list1.length*50+10,borderWidth: 0,borderColor: '#e5e5e5',borderRadius: 15,backgroundColor: '#FFFFFF',}]}
             isOpen={true}
             isDisabled={false}
             position='Top'
             backdrop={false}
             backButtonClose={false}
             swipeToClose={false}
             //backdropOpacity={0.1}
             //backdropColor='#FFFFFF'
             //onClosed={() => this.setState({modalVisible: false})}
             >
               <ListItem
                 containerStyle={styles.listContainerStyle}

                 title={item.title}
                 leftIcon={item.icon}
                 onPress={() => item.press(this.state)}
                 titleStyle={styles.title}
               />
           </Modalbox>
         ))
       }
       <View style={{height: 500}}>
       </View>


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
        //alignItems: 'stretch',
        backgroundColor: '#f3f3f3',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#FFFFFF',
      width: width
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
        height: 200,
        width: width,
        backgroundColor: '#fd586d',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 0,
        //borderBottomWidth: 1,
        //borderColor: '#e5e5e5',
        marginTop: 0
    },
    //header内元素
  user: {
    width: width-100,
    height: 155-22,
    //backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'stretch'
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
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 15
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
    color: '#666666',
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
    height: 64,
    width: 64,
    //marginTop: 20,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF'
  },
  avatarTouch: {
    height: 64,
    width: 64,
    marginTop: 20,
    borderRadius: 32,
    //borderWidth: 2,
    //borderColor: '#FFFFFF'
  },
  shadow: {
    shadowColor:'black',
    shadowOffset:{height:0,width:0},
    shadowRadius: 1,
    shadowOpacity: 0.4,
    //backgroundColor: '#f3f3f3'
  }
});
export default account;
