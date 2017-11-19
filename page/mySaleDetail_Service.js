import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List  } from 'react-native-elements';
import Service from '../common/service';


class mySaleDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: false,
      order: {},
      //
      loading: false,
    };
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    console.log(params.token);
    console.log(params);
    this.state.token = params.token;
    this.state.uid = params.uid;
    this.state.islogin = params.islogin;
    this.state.order = params.order;
    this.setState({order: params.order})
  };

  componentDidMount(){
  };

  returnButtonState = () => {
    const { uid } = this.state;
    const { status }= this.state.order;
    var state = {
      title : '',
      press : () => {},
    };
    switch(Number(status)){
      case 0:
        state.title = '接受订单';
        state.press = () => this.operate_order('accept');
        break;
      case 10:
        state.title = '等待确认';
        state.press = () => alert('请等待对方确认服务完成并付款');
        break;
      case 20:
        state.title = '等待付款';
        state.press = () => alert('等待对方付款');
        break;
      case 30:
        state.title = '确认收款';
        state.press = () => this.operate_order('getmoney');
        break;
      case 40:
        state.title = '已结束';
        state.press = () => alert('订单已结束');
        break;
      case 50:
        state.title = '已经拒绝';
        state.press = () => alert('已拒绝订单');
        break;
      case 60:
        title = '已经取消';
        state.press = () => alert('订单已取消');
        break;
      default:
        state.title = '';
        state.press = () => {};
    }
    console.log(state);
    return state;
  };


  //接受订单
  operate_order = (m) => {
    const { token,uid,order } = this.state;
    const url = Service.BaseUrl;
    const body = 'a=order&m='+m+'&token='+token+'&uid='+uid+'&v='+Service.version+'&id='+order.id;

    console.log(body);

    this.setState({loading: true})
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: body,
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        var txt = '请求成功';
        switch (m){
          case 'accept':
            txt = '已接受订单';
            break;
          case 'refuse':
            txt = '已拒绝订单';
            break;
          case 'getmoney':
            txt = '已确认收款';
            break;
          case 'cancel':
            txt = '已取消订单';
            break;
          default:

        }
        alert(txt);
      }
      else{
        alert('请求失败\n错误原因: '+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
  };


  ButtonPress = () =>{
    var func = this.returnButtonPress();
    console.log(func);
    func();
  };

  returnButtonPress = () => {
    return this.a;
  };

  a  = () => {
    alert('hello')
  };

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        </View>
        <ScrollView>
          <View style={styles.banner}>
          </View>
          <View style={styles.user}>
          </View>
        </ScrollView>
        <Button
          style={styles.button}
          backgroundColor='#f3456d'
          title={this.returnButtonState().title}
          onPress={this.returnButtonState().press}
           />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#f2f2f2',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#f3456d',
  },
  banner: {
    height: 150,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4eede',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3456d',
  },
  user: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  button: {
    alignSelf:'center',
    //marginTop:15,
    width:280,
    height:50,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 5,
  },
  sub: {
    fontSize: 14,
    color: '#666666',
  }
});

export default mySaleDetail;
