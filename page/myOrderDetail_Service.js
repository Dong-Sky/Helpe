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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox,Rating  } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';

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
      //窗口
      payModalVisible: false,
      feedbackModalVisible: false,
      isDisabled1: false,
      isDisabled2: false,
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
        state.press = () => this.setState({feedbackModalVisible: true});
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

  //获取订单
  getOrderInfo = () => {
    const { token,uid,porder } = this.state;
    const url = Service.BaseUrl+`?a=order&m=info&token=${token}&uid=${uid}&id=${porder.oid}&v=${Service.version}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({
          item: responseJson.data.item,
          user: responseJson.data.user,
          order: responseJson.data.order,
          orderaddr: responseJson.data.orderaddr,
        })
      }
      else{
        alert('请求错误'+'\n'+'错误原因: '+responseJson.err);
      }
    })
    .catch(err => console.log(err))
  };


  //操作订单
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

  //评价
  feedback = () => {
    const { token,uid,score,content,item } = this.state;
    const url = Service.BaseUrl+`?a=feedback&m=save&v=${Service.version}&token=${token}&uid=${uid}&id=${item.id}&score=${20*score}&content=${content}`;
    console.log(url);

    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert('评价成功!');
      }
      else{
        alert('请求失败\n'+'错误原因: '+responseJson.err);
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
            选择支付方式
          </Text>
          <View style={{flex: 1,marginLeft: 10,marginRight: 10,marginTop: 10, alignSelf: 'stretch'}}>
            <CheckBox
              style={{backgroundColor: '#FFFFFF',borderWidth: 0,alignSelf: 'flex-start'}}
              containerStyle={{backgroundColor: '#FFFFFF',borderWidth: 0}}
              title='Helpme钱包支付'
              checked={this.state.methodOfPay==0}
              onPress={() => alert('暂未开放')}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
              *说明：使用Helpme钱包进行线上支付(暂未开放)。
            </Text>
            <CheckBox
              style={{backgroundColor: '#FFFFFF',borderWidth: 0,alignSelf: 'flex-start'}}
              containerStyle={{backgroundColor: '#FFFFFF',borderWidth: 0}}
              title='现金或其他渠道支付'
              checked={this.state.methodOfPay==1}
              onPress={() => this.setState({methodOfPay: 0})}
            />
            <Text style={{marginLeft: 10,fontSize: 12,color: '#999999'}}>
              *说明：已通过现金或其他渠道支付，经过双方确认支付完成后订单结束。
            </Text>
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f3456d'
            borderRadius={5}
            title='确认支付'
            onPress={() => this.operate_order('money')}
          />
          {this.showLoading()}
      </Modalbox>
    );
  };

  //评论页面
  renderFeedbackModal = () => {
    return(
      <Modalbox
        style={{height: 320,width: 300,alignItems: 'center',}}
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
            title='提交评价'
            onPress={() => this.feedback()}
          />
      </Modalbox>
    );
  };

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
    console.log(this.state);
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
          <ListItem
            roundAvatar
            component={TouchableOpacity}
            title={this.state.item.name}
            titleStyle={styles.title1}
            //rightTitle={'$'+this.state.item.price+'\n'+'*'+this.state.order.num}
            rightIcon={
              <View style={{alignSelf: 'center'}}>
                <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                  {'$'+this.state.item.price}
                </Text>
                <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                  {'X'+this.state.order.num}
                </Text>
                <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
                  {this.state.order.changeprice>=0?'+'+this.state.order.changeprice:this.state.order.changeprice}
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
              title={this.state.item==0?'服务名称':'求助名称'}
              rightTitle={this.state.item.name}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='数量'
              rightTitle={this.state.order.num}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='补差价'
              rightTitle={this.state.order.changeprice}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='总价'
              rightTitle={'2000'}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title='订单编号'
              rightTitle={this.state.order.id}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='下单地址'
              rightTitle={this.state.orderaddr.info==''?'未填写':this.state.orderaddr.info}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='下单时间'
              rightTitle={formatDate(this.state.order.t)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title1}
              title='备注'
              rightTitle={this.state.porder.mark=''?'未填写':'查看'}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title1}
              title='订单发起人'
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
              rightTitle={'查看'}
              subtitle={this.returnWork()}
              avatar={this.returnUserAvatarSource()}
              avatarContainerStyle={{height: 40,width: 40}}
              avatarStyle={{height: 40,width: 40}}
              containerStyle={[styles.listContainerStyle]}
            />
          </List>

        </ScrollView>
        <Button
          style={styles.button}
          //containerStyle={styles.buttonContainer}
          backgroundColor='#f3456d'
          borderRadius={5}
          title={this.returnButtonState().title}
          onPress={this.returnButtonState().press}
        />
        {this.renderPayModal()}
        {this.renderFeedbackModal()}
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
});

export default myOrderDetail;
