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
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox,Rating } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';

returnState = (status,fd) => {
  var title = '?';
  switch(Number(status)){
    //0: 待接受,10: 已接受,20: 已收货/求助完成,30: 已付款,40: 确认付款,50: '已拒绝',60: '已取消'
    case 0:
      title = I18n.t('myOrder.s0');
      break;
    case 10:
      title = I18n.t('myOrder.s10');
      break;
    case 20:
      title = I18n.t('myOrder.s20');
      break;
    case 30:
      title = I18n.t('myOrder.s30');
      break;
    case 40:
      title = Number(fd)>0?'已评论':I18n.t('myOrder.s40');
      break;
    case 50:
      title = I18n.t('myOrder.s50');
      break;
    case 60:
      title = I18n.t('myOrder.s60');
      break;
    default:
      title = '?';
  }

  return title;
};

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}


class mySaleDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: false,
      porder: {},
      order: {},
      item: {},
      orderaddr: {},
      user: {},
      uuser: {},
      //窗口
      payModalVisible: false,
      feedbackModalVisible: false,
      isMarkModalVisible: false,
      isDisabled1: false,
      isDisabled2: false,
      isDisabled3: false,
      methodOfPay:1,
      //评价
      content: null,
      score: 2.5,
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
    this.state.porder = params.order;
    this.getOrderInfo();
  };

  componentDidMount(){
  };


  //获取订单
  getOrderInfo = () => {
    const { token,uid,porder } = this.state;
    const url = Service.BaseUrl+`?a=order&m=info&token=${token}&uid=${uid}&id=${porder.oid}&v=${Service.version}`;

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({
          item: responseJson.data.item,
          user: responseJson.data.user,
          uuser: responseJson.data.uuser,
          order: responseJson.data.order,
          orderaddr: responseJson.data.orderaddr,
        })
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .catch(err => console.log(err))
  };

  returnButtonState = () => {
    const { uid } = this.state;
    const { status,fd }= this.state.order;
    var state = {
      title : '',
      press : () => {},
    };
    switch(Number(status)){
      case 0:
        state.title = I18n.t('myOrder.sa0');
        state.press = () => this.operate_order('accept');
        break;
      case 10:
        state.title = I18n.t('myOrder.sa10');
        state.press = () => {
          Alert.alert(
            I18n.t('myOrder.satxt1'),
            I18n.t('myOrder.satxt2'),
            [
              {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: I18n.t('common.confirm'), onPress: () => this.operate_order('arrival')},
            ],
            { cancelable: false }
          )
        }
        break;
      case 20:
        state.title = I18n.t('myOrder.sa20');
        state.press = () => this.setState({payModalVisible: true});
        break;
      case 30:
        state.title = I18n.t('myOrder.sa30');
        state.press = () => {alert(I18n.t('myOrder.satxt3'))};
        break;
      case 40:
        state.title = I18n.t('myOrder.sa40');
        state.press = () => {
          if(Number(fd)>0){
            alert('已评论');
          }
          else{
            this.setState({feedbackModalVisible: true});
          }
        };
        break;
      case 50:
        state.title = I18n.t('myOrder.sa50');
        state.press = () => alert(I18n.t('myOrder.satxt5'));
        break;
      case 60:
        state.title = I18n.t('myOrder.sa60');
        state.press = () => alert(I18n.t('myOrder.satxt6'));
        break;
      default:
        state.title = '';
        state.press = () => {};
    }

    return state;
  };


  //操作订单
  operate_order = (m) => {
    const { token,uid,order } = this.state;
    const url = Service.BaseUrl;
    const body = 'a=order&m='+m+'&token='+token+'&uid='+uid+'&v='+Service.version+'&id='+order.id;



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

      if(!responseJson.status){

        DeviceEventEmitter.emit('operate_Sale');

        var txt = I18n.t('success.fetch');
        switch (m){
          case 'accept':
            txt = I18n.t('myOrder.sdtxt7');
            break;
          case 'refuse':
            txt = I18n.t('myOrder.sdtxt8');
            break;
          case 'money':
            txt = I18n.t('myOrder.sdtxt9');
            break;
          case 'getmoney':
            txt = I18n.t('myOrder.sdtxt10');
            break;
          case 'cancel':
            txt = I18n.t('myOrder.sdtxt11');
            break;
          default:

        }
        alert(txt);
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.getOrderInfo())
    .then(() => this.setState({loading: false,payModalVisible: false,}))
    .catch(err => console.log(err))
  };

  //评价
  feedback = () => {
    const { token,uid,score,content,item,order } = this.state;
    const url = Service.BaseUrl+`?a=feedback&m=save&v=${Service.version}&token=${token}&uid=${uid}&id=${order.id}&score=${20*score}&content=${content}`;
    console.log(url);

    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

      if(!responseJson.status){
        alert(I18n.t('success.feedback'));
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,feedbackModalVisible: false,content: null}))
    .catch(err => {console.log(err);this.setState({loading: false,content: null})})
  };

  //评论页面
  renderFeedbackModal = () => {
    return(
      <Modalbox
        style={{height: 330,width: 300,alignItems: 'center',borderRadius: 10}}
        isOpen={this.state.feedbackModalVisible}
        isDisabled={this.state.isDisabled2}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({feedbackModalVisible: false,score: 2.5,content: null,})}
        >
          <View style={{flex: 1,marginTop: 0, alignSelf: 'stretch'}}>
            <Rating
              showRating
              type="bell"
              ratingCount={5}
              imageSize={35}
              fractions={1}
              startingValue={2.5}
              onFinishRating={(score) => this.setState({score})}
              style={{alignSelf: 'center',paddingVertical: 10}}
            />
            <TextInput
              style={styles.feedbackInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              maxLength={140}
              value={this.state.content}
              onChangeText ={(content) => this.setState({content})}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('myOrder.feedback')}
            onPress={() => this.feedback()}
          />
      </Modalbox>
    );
  };




  //支付页面
  renderPayModal = () => {
    return(
      <Modalbox
        style={{height: 280,width: 300,alignItems: 'center',}}
        isOpen={this.state.payModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({payModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('myOrder.dtxt10')}
          </Text>
          <View style={{flex: 1,marginLeft: 10,marginRight: 10,marginTop: 10, alignSelf: 'stretch'}}>
            <CheckBox
              style={{backgroundColor: '#FFFFFF',borderWidth: 0,alignSelf: 'flex-start'}}
              containerStyle={{backgroundColor: '#FFFFFF',borderWidth: 0}}
              title='Helpme钱包支付'
              checked={this.state.methodOfPay==0}
              onPress={() => alert(I18n.t('myOrder.dtxt12'))}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
              {I18n.t('myOrder.dtxt13')}
            </Text>
            <CheckBox
              style={{backgroundColor: '#FFFFFF',borderWidth: 0,alignSelf: 'flex-start'}}
              containerStyle={{backgroundColor: '#FFFFFF',borderWidth: 0}}
              title={I18n.t('myOrder.dtxt14')}
              checked={this.state.methodOfPay==1}
              onPress={() => this.setState({methodOfPay: 1})}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
              {I18n.t('myOrder.dtxt15')}
            </Text>
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('myOrder.pay')}
            onPress={() => {
              Alert.alert(
                I18n.t('myOrder.pay'),
                I18n.t('myOrder.money')+': ￥'+(this.total()<0?I18n.t('myOrder.money_err'):this.total().toString()),
                [
                  {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.confirm'), onPress: () => this.operate_order('money')},
                ],
                { cancelable: false }
              )
            }}
          />
          {this.showLoading()}
      </Modalbox>
    );
  };


  //备注页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',}}
        isOpen={this.state.isMarkModalVisible}
        isDisabled={this.state.isDisabled3}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({isMarkModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('myOrder.mark')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.markInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              editable={false}
              value={this.state.order.remark}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.confirm')}
            onPress={() => this.setState({isMarkModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //计算价格
  total = () => {
    const cash = Number(this.state.order.cash);
    const changeprice = Number(this.state.order.changeprice);
    if(isNaN(cash)){
      return -1;
    }
    else if(isNaN(changeprice)){
      return -1;
    }
    else if(!Number.isInteger(cash)){
      return -1;
    }
    else if(!Number.isInteger(changeprice)){
      return -1;
    }
    else{
      return cash+changeprice;
    }
  }


  returnItemAvatarSource = () => {
    var source;
    if(this.state.item.img==''){
      source = {uri:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' };
    }
    else{
      source = {uri: Service.BaseUri+this.state.item.img};
    }
    return source;
  };

  returnUserAvatarSource = () => {
    var source;
    if(this.state.uuser.face==''){
      source = {uri:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' };
    }
    else{
      source = {uri: Service.BaseUri+this.state.uuser.face};
    }
    return source;
  };


  returnWork = () => {
    var str = '';
    if(this.state.user.work!=''&&this.state.user.occ!=''){
      str = this.state.user.occ+'/'+this.state.user.work;
    }
    else if(this.state.user.work!=''){
      str = this.state.user.work;
    }
    else if(this.state.user.occ!=''){
      str = this.state.user.occ;
    }

    return str;
  };

  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "95%",
            backgroundColor: "#e5e5e5",//CED0CE
            marginLeft: "5%"
          }}
        />
      );
  };

  renderFooter = () => {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#e5e5e5"
          }}
        >
        </View>
      );
  };

  renderHeader = () => {
      return (<View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "0%"
                  }}>
              </View>
          );
  };



  showLoading = () => {
    return(
      <Modalbox
        style={{height: 60, width: 60,backgroundColor: '#FFFFFF',opacity: 0.4,}}
        position='center'
        isOpen={this.state.loading}
        backdropOpacity={0}
        backdropPressToClose={false}
        swipeToClose={false}
        swipeThreshold={200}
        swipeArea={0}
        animationDuration={0}
        backdropColor='#FFFFFF'
        >
          <ActivityIndicator
            animating={true}
            style={{alignSelf: 'center',height: 50}}
            color='#333333'
            size="large" />
      </Modalbox>
    );
  };


  render(){

    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#f1a073'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
              {I18n.t('myOrder.order_info')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </View>
        <ScrollView>
          <ListItem
            roundAvatar
            component={TouchableOpacity}
            title={this.state.item.name}
            titleStyle={styles.title1}

            rightIcon={
              <View style={{alignSelf: 'center'}}>
                <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                  {'￥'+this.state.item.price}
                </Text>
                <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                  {'X'+this.state.order.num}
                </Text>
                <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
                  {this.state.order.changeprice>=0?'+￥'+this.state.order.changeprice:'-￥'+(-this.state.order.changeprice)}
                </Text>
              </View>
            }
            avatar={this.returnItemAvatarSource()}
            avatarContainerStyle={{height: 80,width: 80}}
            avatarStyle={{height: 80,width: 80}}
            containerStyle={[styles.listContainerStyle,{borderWidth: 1,borderColor: '#e5e5e5'}]}
          />
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.order_status')}
              rightTitle={returnState(this.state.order.status,this.state.order.fd)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={Number(this.state.order.status)?I18n.t('myOrder.cancel_order'):I18n.t('myOrder.refuse_order')}
              rightTitle={Number(this.state.order.status)?I18n.t('common.cancel'):I18n.t('common.refuse')}
              containerStyle={styles.listContainerStyle}
              onPress={() => {
                const s = Number(this.state.order.status);
                if(s>=40){
                  alert(I18n.t('myOrder.sdtxt11'));
                }
                else{
                  Alert.alert(
                    I18n.t('myOrder.waiver'),
                    I18n.t('myOrder.dtxt17'),
                    [
                      {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: I18n.t('common.yes'), onPress: () => {

                        if(!s){
                          this.operate_order('refuse');
                        }
                        else{
                          this.operate_order('cancel');
                        }
                      }},
                    ],
                    { cancelable: false }
                  )
                }
              }}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={this.state.item.tp==0?I18n.t('myOrder.S_name'):I18n.t('myOrder.A_name')}
              rightTitle={this.state.item.name}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.e')}
              rightTitle={this.state.order.num}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.changeprice')}
              rightTitle={this.state.order.changeprice}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.total')}
              rightTitle={'￥'+(this.total()<0?I18n.t('myOrder.money_err'):this.total().toString())}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.code')}
              rightTitle={this.state.order.id}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.t')}
              rightTitle={formatDate(this.state.order.t)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.mark')}
              rightTitle={this.state.porder.mark==''?I18n.t('myOrder.none'):I18n.t('myOrder.go')}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({isMarkModalVisible: true})}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.client1')}
              rightTitle={this.state.uuser.name}
              rightIcon={<View></View>}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              roundAvatar
              component={TouchableOpacity}
              title={this.state.uuser.name}
              titleStyle={styles.title1}
              rightTitle={'查看'}
              subtitle={this.returnWork()}
              avatar={this.returnUserAvatarSource()}
              avatarContainerStyle={{height: 40,width: 40}}
              avatarStyle={{height: 40,width: 40}}
              containerStyle={[styles.listContainerStyle]}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  uuid: this.state.uuser.id?this.state.uuser.id:this.state.uid,
                };
                navigate('user',params);
              }}
            />
          </List>

        </ScrollView>
        <Button
          style={styles.button}
          backgroundColor='#f1a073'
          borderRadius={5}
          title={this.returnButtonState().title}
          onPress={this.returnButtonState().press}
        />
        {this.renderPayModal()}
        {this.renderMarkModal()}
        {this.showLoading()}
        {this.renderFeedbackModal()}
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
      backgroundColor:'#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  user: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  button: {
    alignSelf:'center',
    marginTop: 5,
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
  },
  list: {
    marginTop:10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
  },
  title1: {
    fontSize: 16,
    color: '#333333'
  },
  button1: {
    alignSelf: 'center',
    marginTop : 5,
    width: 240,
    height: 50,
  },
  markInput:{
    width: 260,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  feedbackInput:{
    width: 260,
    height: 160,
    textAlignVertical: 'top',
    padding: 0,
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    padding: 5,
    fontSize: 16,
  },
});

export default mySaleDetail;
