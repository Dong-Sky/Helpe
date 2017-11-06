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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox  } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';


class myOrderDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: false,
      order: {},
      //
      payModalVisible: false,
      isDisabled: false,
      methodOfPay:1,
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
        state.title = '等待接受';
        state.press = () => alert('等待接受');
        break;
      case 10:
        state.title = '确认并付款';
        state.press = () => {
          Alert.alert(
            '确认完成',
            '请确认对方已经完成订单内容，点击确定后请继续完成支付',
            [
              {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '确定', onPress: () => this.operate_order('arrival')},
            ],
            { cancelable: false }
          )
        }
        break;
      case 20:
        state.title = '支付金额';
        state.press = () => this.setState({payModalVisible: true});
        break;
      case 30:
        state.title = '等待确认';
        state.press = () => alert('等待对方确认收款');
        break;
      case 40:
        state.title = '去评论';
        state.press = () => alert('添加评论');
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
    console.log(url);
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
          case 'arrival':
            txt = '已确认完成服务';
            break;
          case 'money':
            txt = '已付款，等待对方确认';
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
    .then(() => this.setState({loading: false,payModalVisible: false,}))
    .catch(err => console.log(err))
  };

  //支付页面
  renderPayModal = () => {
    return(
      <Modalbox
        style={{height: 220,width: 300,alignItems: 'center',}}
        isOpen={this.state.payModalVisible}
        isDisabled={this.state.isDisabled}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({payModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            选择支付方式
          </Text>
          <View style={{flex: 1,marginLeft: 20,marginRight: 20,marginTop: 20, alignSelf: 'stretch'}}>
            <CheckBox
              style={{alignSelf: 'stretch'}}
              title='Helpme钱包支付'
              checked={this.state.methodOfPay==0}
              onPress={() => alert('暂未开放')}
            />
            <Text style={{fontSize: 12,color: '#999999'}}>
              *说明：使用Helpme钱包进行线上支付(暂未开放)。
            </Text>
            <CheckBox
              style={{alignSelf: 'stretch'}}
              title='现金或其他渠道支付'
              checked={this.state.methodOfPay==1}
              onPress={() => this.setState({methodOfPay: 0})}
            />
            <Text style={{fontSize: 12,color: '#999999'}}>
              *说明：已通过现金或其他渠道支付，经过双方确认支付完成后订单结束。
            </Text>
          </View>
          <Button
            style={styles.button}
            backgroundColor='#f3456d'
            title='确认支付'
            onPress={() => {this.operate_order('money');}}
          />
      </Modalbox>
    );
  };



  render(){
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <Text style={{marginLeft: 10,}} onPress={() => this.setState({payModalVisible: true})}>
            支付
          </Text>
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
        {this.renderPayModal()}

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
    alignSelf: 'center',
    marginTop :5,
    width: 280,
    height: 50,
  },
  button1: {
    marginTop : 5,
    width: 280,
    height: 50,
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

export default myOrderDetail;
