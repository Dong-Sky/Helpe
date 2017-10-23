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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button,Avatar } from 'react-native-elements';
import QRCode from 'react-native-qrcode';



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


 onPressHeader = (islogin) => {
    if(islogin){
      this.props.navigation.navigate('personal')
    }
    else{
      alert('请先登录！');
    }
 };

 //一下定义页面元素
 renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  returnAvatar = () => {
    const {navigate} = this.props.navigation;
    if(this.state.islogin){
      return (
        <Avatar
          large
          rounded
          source={{uri:"https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
          containerStyle={{marginTop:5,marginLeft:5,}}
        />
      );
    }
    else{
      return(
        <Avatar
          large
          rounded
          icon={{name: 'person'}}
          onPress={() =>
            navigate('login',{
            token:this.state.token,
            uid:this.state.uid,
            islogin:this.state.islogin,
            })
          }
            activeOpacity={0.7}
            containerStyle={{ marginTop: 5,marginLeft:5,}}
          />
      );
    }
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
      {
        title: '我的钱包',
        icon : (
          <Image
          source={require('../icon/account/钱包.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#5c492b',
        x:2,
      },
      {
        title: '我的订单',
        icon : (
          <Image
          source={require('../icon/account/订单.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#5c492b',
        x:2,
        press(state){
          if(state.islogin){
            navigate('myOrder',{
              token: state.token,
              uid: state.uid,
              islogin: state.islogin,
            })
          }
          else{
            alert('请登录！');
          }
        },
      },
      {
        title: '我的发布',
        icon : (
          <Image
          source={require('../icon/account/我发布的.png')}
          style={styles.account_icon}
        />
      ),
        icon_color:'#5c492b',
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
            alert('请登录！');
          }
        },
      },
    ];
    const list2 = [
  {
    title: '收藏',
    icon : (
      <Image
      source={require('../icon/account/收藏.png')}
      style={styles.account_icon}
    />
  ),
    icon_color:'#5c492b',
    x:2,
    press(islogin){
      if(islogin) navigate('personal')
      else{
        alert('请登录！');
      }
    },
  },
  {
    title: '我的地址',
    icon: (
      <Image
      source={require('../icon/account/地址.png')}
      style={styles.account_icon}
    />
  ),
    icon_color:'#5c492b',
    x:7,
    press(state){
      if(state.islogin){
        navigate('myAdress',state);
      }
      else {
        alert('请登录！');
      }
    },
  },
  {
    title: '我的评价',
    icon: (
      <Image
      source={require('../icon/account/评价.png')}
      style={styles.account_icon}
    />
  ),
    icon_color:'#5c492b',
    x:7,
    press(){alert('hi');},
  },
  {
    title: '订阅',
    icon: (
      <Image
      source={require('../icon/account/订阅.png')}
      style={styles.account_icon}
    />
  ),
    icon_color:'#5c492b',
    x:5,
    press(){
      alert('hi');}
  },
  ];
   const list3 = [
     {
       title: '设置',
       icon: (
         <Image
         source={require('../icon/account/设置.png')}
         style={styles.account_icon}
       />
     ),
       icon_color:'#5c492b',
       x:5,
       press(state){
         console.log(state);
          if(state.islogin){
             navigate('setting',{
             });
           }
           else{
             alert('请登录');
           }
         },
     },
   ];
   return (
     <View style={styles.container}>
       <View style={styles.StatusBar}>
       </View>
       <View style={styles.header}>
         <View style={{flex: 1}}>
         </View>
         <Text style={{fontSize: 16,fontWeight: '500', color: '#333333',}}>
           我
         </Text>
         <View style={{flex: 1}}>
         </View>
       </View>
       <ScrollView>
         <View style={styles.userInfo}>
            <TouchableOpacity style={styles.user} onPress={() => this.onPressHeader(this.state.islogin)}>
              {this.returnAvatar()}
              <Text style={{marginTop:50,marginLeft:100,}}>
                用户信息
              </Text>
            </TouchableOpacity>
           <View style={styles.order}>
             <TouchableOpacity
               style={{flex:1,borderWidth:1,borderColor: '#e5e5e5',flexDirection: 'column',justifyContent: 'center', alignItems: 'center',}}
               onPress={() => {
                 if(this.state.islogin){
                 navigate('myQRcode',{
                   uid:this.state.uid,
                   token:this.state.token,
                 });
               }
               else {
                 alert('请登录');
               }
             }
           }
               >
              <Image
                   source={require('../icon/account/收钱.png')}
                   style={{width:40,height:40}}
                  />
              <Text
                style={{color:'#5c492b',fontWeight:'500',fontSize:14,}}
                >
                收钱
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex:1,borderWidth:1,borderColor: '#e5e5e5',flexDirection: 'column', justifyContent: 'center',alignItems: 'center',}}
              onPress={() => navigate('scanner')}
              >
               <Image
               source={require('../icon/account/付款.png')}
               style={{width:40,height:40}}
             />
               <Text  style={{color:'#5c492b',fontWeight:'500',fontSize:14,}}>
                 付款
               </Text>
             </TouchableOpacity>
           </View>
         </View>
         <List containerStyle={{marginTop:10}} ItemSeparatorComponent={this.renderSeparator}>
           {
            list1.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                leftIcon={item.icon}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                onPress={() => item.press(this.state)}
                titleStyle={styles.title}
              />
            ))
          }
         </List>
         <List containerStyle={{marginTop:10}}>
           {
            list2.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                leftIcon={item.icon}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                onPress={() => item.press(this.state)}
                titleStyle={styles.title}
              />
            ))
          }
         </List>
         <List containerStyle={{marginTop:10,}}>
           {
            list3.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                leftIcon={item.icon}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                onPress={() => item.press(this.state)}
                titleStyle={styles.title}
              />
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
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
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
      backgroundColor:'#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
  },
  userInfo: {
        height: 180,
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderWidth:1,
        borderBottomWidth:3,
        borderColor: '#e5e5e5',
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
        alignItems: 'stretch'
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
  listTitleStyle: {
      color:'#5c492b',
      fontWeight:'400',
      fontSize:18,
      marginLeft:10,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333333',
  },
  account_icon: {
      tintColor:'#5c492b',
      width:25,
      height:25,
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
  }
});
export default account;
