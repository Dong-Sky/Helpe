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
  Switch,
<<<<<<< Updated upstream
=======
  DeviceEventEmitter,
>>>>>>> Stashed changes
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox,Rating  } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';

<<<<<<< Updated upstream
=======
returnState = (status) => {
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
      title = I18n.t('myOrder.s40');
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

>>>>>>> Stashed changes
//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}

class myOrderDetail extends Component{
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
<<<<<<< Updated upstream
      //窗口
      payModalVisible: false,
      feedbackModalVisible: false,
      isDisabled1: false,
      isDisabled2: false,
=======
      uuser: {},
      //窗口
      payModalVisible: false,
      feedbackModalVisible: false,
      isMarkModalVisible: false,
      isDisabled1: false,
      isDisabled2: false,
      isDisabled3: false,
>>>>>>> Stashed changes
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

  returnButtonState = () => {
    const { uid } = this.state;
    const { status }= this.state.order;
    var state = {
      title : '?',
      press : () => {},
    };
    switch(Number(status)){
      case 0:
        state.title = I18n.t('myOrder.od0');
        state.press = () => alert(I18n.t('myOrder.s0'));
        break;
      case 10:
        state.title = I18n.t('myOrder.od10');
        state.press = () => {
          Alert.alert(
            I18n.t('myOrder.dtxt1'),
            I18n.t('myOrder.dtxt2'),
            [
              {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: I18n.t('myOrder.confirm'), onPress: () => this.operate_order('arrival')},
            ],
            { cancelable: false }
          )
        }
        break;
      case 20:
        state.title = I18n.t('myOrder.od20');
        state.press = () => this.setState({payModalVisible: true});
        break;
      case 30:
        state.title = I18n.t('myOrder.od30');
        state.press = () => alert(I18n.t('myOrder.dtxt3'));
        break;
      case 40:
<<<<<<< Updated upstream
        state.title = '去评论';
=======
        state.title = I18n.t('myOrder.od40');
>>>>>>> Stashed changes
        state.press = () => this.setState({feedbackModalVisible: true});
        break;
      case 50:
        state.title = I18n.t('myOrder.od50');
        state.press = () => alert(I18n.t('myOrder.dtxt4'));
        break;
      case 60:
        state.title = I18n.t('myOrder.od60');
        state.press = () => alert(I18n.t('myOrder.dtxt5'));
        break;
      default:
        state.title = '?';
        state.press = () => {};
    }
    console.log(state);
    return state;
  };

  //获取订单
  getOrderInfo = () => {
    const { token,uid,porder } = this.state;
    const url = Service.BaseUrl+`?a=order&m=info&token=${token}&uid=${uid}&id=${porder.oid}&v=${Service.version}`;
<<<<<<< Updated upstream
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
=======

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

>>>>>>> Stashed changes
      if(!responseJson.status){
        this.setState({
          item: responseJson.data.item,
          user: responseJson.data.user,
<<<<<<< Updated upstream
=======
          uuser: responseJson.data.uuser,
>>>>>>> Stashed changes
          order: responseJson.data.order,
          orderaddr: responseJson.data.orderaddr,
        })
      }
      else{
<<<<<<< Updated upstream
        alert('请求错误'+'\n'+'错误原因: '+responseJson.err);
=======
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
>>>>>>> Stashed changes
      }
    })
    .catch(err => console.log(err))
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
        
        DeviceEventEmitter.emit('operate_Order');

        var txt = I18n.t('success.fetch');
        switch (m){
          case 'arrival':
            txt = I18n.t('myOrder.dtxt6');
            break;
          case 'money':
            txt = I18n.t('myOrder.dtxt7');
            break;
          case 'getmoney':
            txt = I18n.t('myOrder.dtxt8');
            break;
          case 'cancel':
            txt = I18n.t('myOrder.dtxt9');
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
    const { token,uid,score,content,item } = this.state;
    const url = Service.BaseUrl+`?a=feedback&m=save&v=${Service.version}&token=${token}&uid=${uid}&id=${item.id}&score=${20*score}&content=${content}`;
    console.log(url);

    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
<<<<<<< Updated upstream
      console.log(responseJson);
      if(!responseJson.status){
        alert('评价成功!');
      }
      else{
        alert('请求失败\n'+'错误原因: '+responseJson.err);
=======

      if(!responseJson.status){
        alert(I18n.t('success.feedback'));
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
>>>>>>> Stashed changes
      }
    })
    .then(() => this.setState({loading: false,feedbackModalVisible: false,content: null}))
    .catch(err => {console.log(err);this.setState({loading: false,content: null})})
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
<<<<<<< Updated upstream
              title='Helpme钱包支付'
=======
              title={I18n.t('myOrder.dtxt11')}
>>>>>>> Stashed changes
              checked={this.state.methodOfPay==0}
              onPress={() => alert(I18n.t('myOrder.dtxt12'))}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
<<<<<<< Updated upstream
              *说明：使用Helpme钱包进行线上支付(暂未开放)。
=======
              {I18n.t('myOrder.dtxt13')}
>>>>>>> Stashed changes
            </Text>
            <CheckBox
              style={{backgroundColor: '#FFFFFF',borderWidth: 0,alignSelf: 'flex-start'}}
              containerStyle={{backgroundColor: '#FFFFFF',borderWidth: 0}}
<<<<<<< Updated upstream
              title='现金或其他渠道支付'
=======
              title={I18n.t('myOrder.dtxt14')}
>>>>>>> Stashed changes
              checked={this.state.methodOfPay==1}
              onPress={() => this.setState({methodOfPay: 1})}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
<<<<<<< Updated upstream
              *说明：已通过现金或其他渠道支付，经过双方确认支付完成后订单结束。
=======
              {I18n.t('myOrder.dtxt15')}
>>>>>>> Stashed changes
            </Text>
          </View>
          <Button
            style={styles.button1}
<<<<<<< Updated upstream
            backgroundColor='#f3456d'
            borderRadius={5}
            title='确认支付'
            onPress={() => this.operate_order('money')}
=======
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('myOrder.pay')}
            onPress={() => {
              Alert.alert(
                I18n.t('myOrder.dtxt16'),
                I18n.t('myOrder.money')+': ￥'+(this.total()<0?I18n.t('myOrder.money_err'):this.total().toString()),
                [
                  {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.confirm'), onPress: () => this.operate_order('money')},
                ],
                { cancelable: false }
              )
            }}
>>>>>>> Stashed changes
          />
          {this.showLoading()}
      </Modalbox>
    );
  };

  //评论页面
  renderFeedbackModal = () => {
    return(
      <Modalbox
<<<<<<< Updated upstream
        style={{height: 320,width: 300,alignItems: 'center',}}
=======
        style={{height: 330,width: 300,alignItems: 'center',}}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            title='提交评价'
=======
            title={I18n.t('myOrder.feedback')}
>>>>>>> Stashed changes
            onPress={() => this.feedback()}
          />
      </Modalbox>
    );
  };

<<<<<<< Updated upstream
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
    if(this.state.user.face==''){
      source = {uri:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' };
    }
    else{
      source = {uri: Service.BaseUri+this.state.user.face};
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
    console.log(str);
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



=======
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
            {I18n.t('myOrder.dtxt9')}
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
            title={I18n.t('common.finish')}
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
    if(this.state.user.face==''){
      source = {uri:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' };
    }
    else{
      source = {uri: Service.BaseUri+this.state.user.face};
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



>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    console.log(this.state);
=======
    const { navigate } = this.props.navigation;

>>>>>>> Stashed changes
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
<<<<<<< Updated upstream
          <Text style={{marginLeft: 10,}} onPress={() => this.setState({payModalVisible: true})}>
            支付
          </Text>
=======
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
>>>>>>> Stashed changes
        </View>
        <ScrollView>
          <ListItem
            roundAvatar
            component={TouchableOpacity}
            title={this.state.item.name}
            titleStyle={styles.title1}
<<<<<<< Updated upstream
            //rightTitle={'$'+this.state.item.price+'\n'+'*'+this.state.order.num}
            rightIcon={
              <View style={{alignSelf: 'center'}}>
                <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                  {'$'+this.state.item.price}
=======

            rightIcon={
              <View style={{alignSelf: 'center'}}>
                <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                  {'￥'+this.state.item.price}
>>>>>>> Stashed changes
                </Text>
                <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                  {'X'+this.state.order.num}
                </Text>
                <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
<<<<<<< Updated upstream
                  {this.state.order.changeprice>=0?'+'+this.state.order.changeprice:this.state.order.changeprice}
=======
                  {this.state.order.changeprice>=0?'+￥'+this.state.order.changeprice:'-￥'+(-this.state.order.changeprice)}
>>>>>>> Stashed changes
                </Text>
              </View>
            }
            avatar={this.returnItemAvatarSource()}
            avatarContainerStyle={{height: 80,width: 80}}
            avatarStyle={{height: 80,width: 80}}
            containerStyle={[styles.listContainerStyle,{borderWidth: 1,borderColor: '#e5e5e5'}]}
          />
<<<<<<< Updated upstream
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={this.state.item==0?'服务名称':'求助名称'}
=======

          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.order_status')}
              rightTitle={returnState(this.state.order.status)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title={I18n.t('myOrder.cancel_order')}
              rightTitle={I18n.t('common.cancel')}
              containerStyle={styles.listContainerStyle}
              onPress={() => {
                const s = Number(this.state.order.status);
                if(s>=40){
                  alert(I18n.t('myOrder.order_end'));

                }
                else{
                  Alert.alert(
                    I18n.t('myOrder.waiver'),
                    I18n.t('myOrder.dtxt17'),
                    [
                      {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {
                        text: I18n.t('common.yes'), onPress: () => {
                          this.operate_order('cancel');
                        }
                      },
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
>>>>>>> Stashed changes
              rightTitle={this.state.item.name}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='数量'
=======
              title={I18n.t('myOrder.n')}
>>>>>>> Stashed changes
              rightTitle={this.state.order.num}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='补差价'
=======
              title={I18n.t('myOrder.changeprice')}
>>>>>>> Stashed changes
              rightTitle={this.state.order.changeprice}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='总价'
              rightTitle={'2000'}
=======
              title={I18n.t('myOrder.total')}
              rightTitle={'￥'+(this.total()<0?I18n.t('myOrder.money_err'):this.total().toString())}
>>>>>>> Stashed changes
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='订单编号'
=======
              title={I18n.t('myOrder.code')}
>>>>>>> Stashed changes
              rightTitle={this.state.order.id}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='下单地址'
              rightTitle={this.state.orderaddr.info==''?'未填写':this.state.orderaddr.info}
              containerStyle={styles.listContainerStyle}
=======
              title={I18n.t('myOrder.addr')}
              rightTitle={this.state.orderaddr.info==''?I18n.t('myOrder.none'):this.state.orderaddr.info}
              containerStyle={styles.listContainerStyle}
              onPress={() => alert(this.state.orderaddr.info==''?I18n.t('myOrder.none'):this.state.orderaddr.info)}
>>>>>>> Stashed changes
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='下单时间'
=======
              title={I18n.t('myOrder.t')}
>>>>>>> Stashed changes
              rightTitle={formatDate(this.state.order.t)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='备注'
              rightTitle={this.state.porder.mark=''?'未填写':'查看'}
              containerStyle={styles.listContainerStyle}
=======
              title={I18n.t('myOrder.mark')}
              rightTitle={this.state.porder.mark==''?I18n.t('myOrder.none'):I18n.t('myOrder.go')}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({isMarkModalVisible: true})}
>>>>>>> Stashed changes
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              title='订单发起人'
=======
              title={I18n.t('myOrder.onwer')}
>>>>>>> Stashed changes
              rightTitle={this.state.user.name}
              rightIcon={<View></View>}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              roundAvatar
              component={TouchableOpacity}
              title={this.state.user.name}
              titleStyle={styles.title1}
<<<<<<< Updated upstream
              rightTitle={'查看'}
=======
              rightTitle={I18n.t('myOrder.go')}
>>>>>>> Stashed changes
              subtitle={this.returnWork()}
              avatar={this.returnUserAvatarSource()}
              avatarContainerStyle={{height: 40,width: 40}}
              avatarStyle={{height: 40,width: 40}}
              containerStyle={[styles.listContainerStyle]}
<<<<<<< Updated upstream
=======
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  uuid: this.state.user.id?this.state.user.id:this.state.uid,
                };
                navigate('user',params);
              }}
>>>>>>> Stashed changes
            />
          </List>

        </ScrollView>
        <Button
          style={styles.button}
          //containerStyle={styles.buttonContainer}
<<<<<<< Updated upstream
          backgroundColor='#f3456d'
=======
          backgroundColor='#f1a073'
>>>>>>> Stashed changes
          borderRadius={5}
          title={this.returnButtonState().title}
          onPress={this.returnButtonState().press}
        />
        {this.renderPayModal()}
        {this.renderFeedbackModal()}
<<<<<<< Updated upstream
=======
        {this.renderMarkModal()}
>>>>>>> Stashed changes
        {this.showLoading()}
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
    borderColor: '#e5e5e5',
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
    alignSelf: 'center',
    marginTop : 5,
    width: 240,
    height: 50,
  },
  buttonContainer: {
    borderRadius: 30,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 14,
    color: '#666666',
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
  title: {
    fontWeight: '500',
    marginLeft: 14,
    marginTop: 5,
  },
  title1: {
    fontSize: 16,
    color: '#333333'
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
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
});

export default myOrderDetail;
