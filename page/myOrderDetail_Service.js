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
  DeviceEventEmitter,
  Dimensions
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox,Rating  } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';
import DropdownAlert from 'react-native-dropdownalert';

//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;




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
      owner: {},
      uuser: {},
      feedback: {},
      //窗口
      payModalVisible: false,
      feedbackModalVisible: false,
      feedbackModalVisible1: false,
      isMarkModalVisible: false,
      isDisabled1: false,
      isDisabled2: false,
      isDisabled3: false,
      isDisabled4: false,
      methodOfPay:1,
      //评价
      content: null,
      score: 2.5,
      //
      fd: 0,
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
    this.getFeedback();
  };

  componentDidMount(){

  };

  AlertOnSuccess = (txt) => {
    if (txt) {
      this.dropdown.alertWithType('success', 'Success', txt);
    }
  };

  AlertOnError = (err) => {
    if (err) {
      this.dropdown.alertWithType('error', 'Error', err);
    }
  };
  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  returnButtonState = () => {
    const { uid,fd } = this.state;
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
        state.title = I18n.t('myOrder.do_finish');
        state.press = () => {
          Alert.alert(
            I18n.t('common.finish'),
            '',
            [
              {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: I18n.t('common.confirm'), onPress: () => this.operate_order('finish')},
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
        state.title = Number(fd)>0?I18n.t('myOrder.oa401'):I18n.t('myOrder.od40');
        state.press = () => {
          if(Number(fd)>0){
            this.setState({feedbackModalVisible1: true});
          }
          else{
            this.setState({feedbackModalVisible: true});
          }
        };
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

  returnState = (status) => {
    var title = '?';
    switch(Number(status)){
      //0: 待接受,10: 已接受,20: 已收货/求助完成,30: 已付款,40: 确认付款,50: '已拒绝',60: '已取消'
      case 0:
        title = I18n.t('myOrder.service_status0');
        break;
      case 10:
        title = I18n.t('myOrder.service_status10');
        //title= 'test';
        break;
      case 20:
        title = I18n.t('myOrder.s20');
        break;
      case 30:
        title = I18n.t('myOrder.s30');
        break;
      case 40:
        title = I18n.t('myOrder.service_status40');
        break;
      case 50:
        title = I18n.t('myOrder.service_status50');
        break;
      case 60:
        title = I18n.t('myOrder.service_status60');
        break;
      default:
        title = '?';


    }

    console.log(title);

    return title;
  };



  //获取订单
  getOrderInfo = () => {
    const { token,uid,porder } = this.state;
    const url = Service.BaseUrl+Service.v+`/order/info?t=${token}&id=${porder.id}`;
    console.log(url);

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!parseInt(responseJson.status)){
        this.setState({
          item: responseJson.data.iteminfo?responseJson.data.iteminfo:{},
          user: responseJson.data.userinfo?responseJson.data.userinfo:{},
          owner: responseJson.data.ownerinfo?responseJson.data.ownerinfo:{},
          order: responseJson.data?responseJson.data:{},
          orderaddr: responseJson.data.orderaddr?responseJson.data.orderaddr:{},
          fd: Number(responseJson.data.fd),
        })
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .catch(err => console.log(err))
  };


  //操作订单
  operate_order = (m) => {
    const { token,uid,order } = this.state;
    const url = Service.BaseUrl+Service.v+`/order/${m}?t=${token}`;
    const body = 'id='+order.id;
    console.log(url);


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
          case 'finish':
            AnalyticsUtil.onEvent('order_Finish');
            txt = I18n.t('common.service_ok');
            break;
          case 'cancel':
            AnalyticsUtil.onEvent('order_Cancel');
            txt = I18n.t('myOrder.dtxt9');
            break;
          default:

        }
        this.AlertOnSuccess(txt);
      }
      else{
        this.AlertOnError(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.getOrderInfo())
    .then(() => this.setState({loading: false,payModalVisible: false,}))
    .catch(err => {console.log(err);this.setState({loading: false,})})
  };


  getFeedback = () => {
    const { token, uid ,porder } = this.state;
    console.log(porder);
    const url = Service.BaseUrl+Service.v+`/feedback?orderid=${porder.id}`;
    console.log(url);

    //this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!parseInt(responseJson.status)){
        this.setState({feedback: responseJson.data.data[0]?responseJson.data.data[0]:{}});
        console.log(responseJson.data.data[0]);

      }
      else{
        console.log(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,refreshing: false}))
    .catch(err => {console.log(err) ; this.setState({loading: false,refreshing: false,})})
  };


  feedback = () => {
    AnalyticsUtil.onEvent('feedback');
    const { token,uid,score,content,item,order } = this.state;
    const url = Service.BaseUrl+Service.v+`/feedback/save?t=${token}`;
    const body = `orderid=${order.id}&content=${content}&score=${score*20}`;
    console.log(url);
    console.log(body);

    this.setState({loading: true,feedbackModalVisible: false,content: null,})
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: body,
    })
    .then(response => response.json())
    .then(responseJson => {
      if(!parseInt(responseJson.status)){
        this.AlertOnSuccess(I18n.t('success.feedback'));
      }
      else{
        this.AlertOnError(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
      return !parseInt(responseJson.status)?1:0;
    })
    .then((fd) => this.setState({loading: false,fd: 1},this.getFeedback))
    .catch(err => {console.log(err);this.setState({loading: false,content: null})})
  };

  //支付页面
  renderPayModal = () => {
    return(
      <Modalbox
        style={{height: 280,width: 300,alignItems: 'center',borderRadius: 10}}
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
              title={I18n.t('myOrder.dtxt11')}
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
                I18n.t('myOrder.dtxt16'),
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

  //评论页面
  renderFeedbackModal = () => {
    return(
      <Modalbox
        style={{height: 330,width: 300,alignItems: 'center',borderRadius: 10,borderRadius: 20,overflow: 'hidden'}}
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
              type="heart"
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
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('myOrder.feedback')}
            onPress={() => this.feedback()}
          />
      </Modalbox>
    );
  };


  renderFeedbackModal1 = () => {
    const score = this.state.feedback.score?Number(this.state.feedback.score): 0;
    const content = this.state.feedback.content?this.state.feedback.content: '';
    return(
      <Modalbox
        style={{height: 330,width: 300,alignItems: 'center',borderRadius: 10,borderRadius: 20,overflow: 'hidden'}}
        isOpen={this.state.feedbackModalVisible1}
        isDisabled={this.state.isDisabled4}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({feedbackModalVisible1: false,score: 2.5,content: null,})}
        >
          <View style={{flex: 1,marginTop: 0, alignSelf: 'stretch'}}>
            <Rating
              showRating
              type="heart"
              ratingCount={5}
              imageSize={35}
              fractions={1}
              readonly
              startingValue={score==undefined||score==null?0:Number(score/20)}
              //startingValue={2.5}
              //onFinishRating={(score) => this.setState({score})}
              style={{alignSelf: 'center',paddingVertical: 10}}
            />
            <TextInput
              style={styles.feedbackInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              maxLength={140}
              editable={false}
              value={!!content?content:''}
              //onChangeText ={(content) => this.setState({content})}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('common.back')}
            onPress={() => this.setState({feedbackModalVisible1: false})}
          />
      </Modalbox>
    );
  };


  //备注页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',borderRadius: 20,overflow: 'hidden'}}
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
            backgroundColor='#fd586d'
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
        <Image style={styles.header} source={require('../icon/account/bg.png')}>
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#FFFFFF'
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',color: '#FFFFFF',fontSize: 18}}>
              {I18n.t('myOrder.order_info')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </Image>


        <ScrollView style={{backgroundColor: '#f3f3f3'}} scrollEnabled={height<650}>

          <Image style={styles.banner} source={require('../icon/order/banner.png')} resizeMode='cover'>
            <Text style={{color: '#FFFFFF',fontSize: 16,marginLeft: 30,backgroundColor: 'rgba(255,255,255,0)'}}>
              {this.returnState(this.state.order.status)}
            </Text>
          </Image>

          <ListItem
            titleStyle={styles.title1}
            subtitleStyle={styles.subtitle}
            leftIcon={{name: 'location-pin',color: '#fd586d',type: 'simple-line-icon'}}
            rightIcon={<View></View>}

            title={I18n.t('myOrder.addr')}
            subtitle={this.state.orderaddr.info==''?I18n.t('myOrder.none'):this.state.orderaddr.info}
            //rightTitle={this.state.orderaddr.info==''?I18n.t('myOrder.none'):this.state.orderaddr.info}
            containerStyle={styles.listContainerStyle}
            onPress={() => alert(this.state.orderaddr.info==''?I18n.t('myOrder.none'):this.state.orderaddr.info)}
          />
          {this.renderSeparator()}
          <ListItem
            titleStyle={styles.title1}
            title={I18n.t('myOrder.mark')}
            leftIcon={{name: 'bubble',color: '#fd586d',type: 'simple-line-icon'}}
            rightTitle={this.state.porder.mark==''?I18n.t('myOrder.none'):I18n.t('myOrder.go_mark')}
            containerStyle={styles.listContainerStyle}
            onPress={() => this.setState({isMarkModalVisible: true})}
          />


          <ListItem
            titleStyle={[styles.title1]}
            subtitleStyle={styles.subtitle}
            leftIcon={{name:'payment',color: '#fd586d',themes: 'outlined'}}
            title={I18n.t('myOrder.paytp')}
            rightIcon={<View></View>}
            rightTitle={this.state.order.paytp==0?I18n.t('myOrder.online'):I18n.t('myOrder.underline')}
            rightTitleStyle={{color: '#fd586d'}}
            containerStyle={[styles.listContainerStyle,{marginTop: 10}]}
          />
          <View
            style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF', marginTop: 15,borderRadius: 0,marginLeft: 0,marginRight: 0,}}
            >
            <ListItem
              roundAvatar
              avatar={this.state.owner.face?{uri: Service.BaseUri+this.state.owner.face}:require('../icon/person/default_avatar.png')}
              title={this.state.owner.username}
              avatarStyle={{backgroundColor: '#FFFFFF'}}
              //rightTitle={returnState(this.state.order.status)}
              containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}


              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  uuid: this.state.owner.id?this.state.owner.id:this.state.uid,
                };
                navigate('user',params);
              }}

            />

            <ListItem
              component={TouchableOpacity}
              roundAvatar
              key={1}
              title={this.state.item.name}
              subtitle={I18n.t('myOrder.tp')+': '+(this.state.item.type==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
              avatarContainerStyle={{height:80,width:80}}
              avatarStyle={{height:80,width:80}}
              containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f3f3f3' }}
              avatar={{uri: Service.BaseUri+this.state.item.img}}
              subtitleNumberOfLines={2}
              rightIcon={
                <View style={{alignSelf: 'center',marginRight: 5}}>
                  <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                    {'￥'+this.state.item.price}
                  </Text>
                  <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                    {'X'+this.state.order.num}
                  </Text>
                  <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
                    {this.state.order.changeprice>=0?'+￥'+this.state.order.changeprice:'-￥'+(this.state.order.changeprice)}
                  </Text>
                </View>
              }

              style={{backgroundColor: '#ffffff',height: 220,width: 0.5*(width-4*8),marginLeft: 8,marginRight: 8,marginBottom: 5,marginTop: 5,borderRadius: 10,overflow:'hidden'}}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  itemId: this.state.item.id,
                };

                if(this.state.item.type==0){
                  navigate('itemDetail_Service',params);
                }
                else if(this.state.item.type==1){
                  navigate('itemDetail_Ask',params);
                }
              }}
            />
            <ListItem
              containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0 }}
              rightIcon={
                <View style={{alignSelf: 'center',marginRight: 5}}>
                  <Text style={{color: '#333333',alignSelf: 'flex-end',fontSize: 14}}>
                    {I18n.t('myOrder.total')+': '}
                    <Text style={{color: '#fd586d',fontSize: 18,fontWeight: '500'}}>
                      {'￥'+ parseInt(this.state.order.cash).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}
                    </Text>
                  </Text>
                </View>
              }
            />
            <View style={{backgroundColor: '#FFFFFF',height: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
              <Button
                containerViewStyle={{marginLeft: 0,marginRight: 10}}
                borderRadius={15}
                buttonStyle={{borderWidth: 1,borderColor: '#fd586d',height: 30,}}
                backgroundColor='#FFFFFF'
                textStyle={{fontSize: 12,color: '#fd586d'}}
                title={this.returnButtonState().title}
                onPress={this.returnButtonState().press}
              />
              {
                (() => {
                  if(this.state.order.status<40){
                    return (
                      <Button
                        title={I18n.t('myOrder.cancel_order')}
                        containerViewStyle={{marginLeft: 0,marginRight: 10}}
                        borderRadius={15}
                        buttonStyle={{borderWidth: 1,borderColor: '#999999',height: 30,}}
                        backgroundColor='#FFFFFF'
                        textStyle={{fontSize: 12,color: '#999999'}}
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
                    );
                  }
                  return null;
                })()


              }

            </View>
          </View>
          <View style={styles.footer}>
            <Text style={{fontSize: 14,color: '#333333',width: '100%',marginLeft: 10,marginTop: 10}}>
              {I18n.t('myOrder.code')}{' : '}<Text style={{color: '#999999',fontWeight: '500'}}>{this.state.order.id+''}</Text>
            </Text>
            <Text style={{fontSize: 14,color: '#333333',width: '100%',marginLeft: 10,marginTop: 5,marginBottom: 10}}>
              {I18n.t('myOrder.t')}{' : '}<Text style={{color: '#999999',fontWeight: '500'}}>{formatDate(this.state.order.ct)}</Text>
            </Text>
          </View>

        </ScrollView>

        {this.renderPayModal()}
        {this.renderFeedbackModal()}
        {this.renderMarkModal()}
        {this.showLoading()}
        {this.renderFeedbackModal1()}
        <DropdownAlert
          ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)}
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
        backgroundColor: '#fd586d',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#fd586d',
  },
  banner: {
    height: 100,
    width: width,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    marginTop: 0,
    //backgroundColor: 'blue'
    //backgroundColor: '#f4eede',
  },
  header: {
    height: 44,
    width: width,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#FFFFFF',
    //opacity: 0.9,
    //borderBottomWidth: 1,
    //borderColor: '#e5e5e5',
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
    borderColor: '#fd586d',
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
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
    marginLeft: 2,
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
  markInput:{
    width: 260,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#fd586d',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  footer: {
    marginTop: 10,
    width: width,
    backgroundColor: '#FFFFFF'

  }
});

export default myOrderDetail;
