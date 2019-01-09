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
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Dimensions
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button,Avatar } from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Service from '../common/service';
import DropdownAlert from 'react-native-dropdownalert';

//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
};


class myOrder extends Component {
  constructor(props) {
      super(props);
      this.state = {
        title: '',
      }
  };

  componentWillMount(){
    this.setState({title: this.props.navigation.state.params.title})
  }

  AlertOnSuccess = (txt) => {
  if (txt) {
    this.dropdown.alertWithType('success', 'success', txt);
  }
  };
  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }


 render() {
   return (
     <View style={styles.container}>
       <View style={styles.StatusBar}>
       </View>
       <Image style={styles.header} source={require('../icon/account/bg.png')}>
         <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
           <Icon
             style={{marginLeft: 5}}
             name='keyboard-arrow-left'
             color='#ffffff'
             size={36}
             onPress={() => this.props.navigation.goBack()}
           />
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
           <Text style={{alignSelf: 'center',color: '#ffffff',fontSize: 18}}>
             {this.state.title}
           </Text>
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
         </View>
       </Image>
       <ScrollableTabView
         tabBarUnderlineStyle={{backgroundColor:'#fd586d'}}
         tabBarActiveTextColor='#fd586d'
         tabBarInactiveTextColor='#999999'
         style={{backgroundColor: '#FFFFFF'}}
         >
        <Order1
          tabLabel={I18n.t('myOrder.title1')}
          labelStyle={{color: '#999999'}}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Order2
          tabLabel={I18n.t('myOrder.title2')}
          labelStyle={{color: '#999999'}}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
      </ScrollableTabView>
      <DropdownAlert

        ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} />
     </View>
   );
 }
}

//服务页面
class Order1 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
        status: '',
        title: '',
        //列表数据
        tp: null,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      }
  };

  componentDidMount() {

    this.setState({
      token: this.props.state.token,
      uid: this.props.state.uid,
      islogin: this.props.state.islogin,
      status: this.props.state.status,
      title: this.props.state.title,
    },this.makeRemoteRequest)


    this.subscription = DeviceEventEmitter.addListener('operate_Order', () => this.makeRemoteRequest());

  };

  componentWillUnmount() {
    // 移除
    this.subscription.remove();
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp,status } = this.state;
    const url = Service.BaseUrl+Service.v+`/order?type=-1${status}&t=${token}&page=${page}&per-page=20`;
    console.log(url);
    this.setState({ loading: true, });
    fetch(url)
      .then(res => res.json())
      .then(
        res => {

        this.setState({
          data: page === 1 ? res.data.data : [...this.state.data, ...res.data.data],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })

      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  operate_order = (id,m) => {
    const { token,uid,} = this.state;
    const url = Service.BaseUrl+Service.v+`/order/${m}?t=${token}`;
    const body = 'id='+id;
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

      if(!parseInt(responseJson.status)){

        DeviceEventEmitter.emit('operate_Order');

        var txt = I18n.t('success.fetch');
        switch (m){
          case 'finish':
            //alert(I18n.t('order_Finish'));
            txt = I18n.t('common.service_ok');
            break;
          case 'cancel':
            //alert(I18n.t('order_Cancel'));
            txt = I18n.t('myOrder.dtxt9');
            break;
          default:

        }
        alert(txt);
      }
      else{
        this.AlertOnError(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,payModalVisible: false,page: 1},this.makeRemoteRequest))
    .catch(err => {console.log(err);this.setState({loading: false,})})
  };



  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 15,
          width: "100%",
          backgroundColor: "#f3f3f3",
          marginLeft: "0%"
        }}
      />
    );
  };
  renderSeparator1 = () => {
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
  };



  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  returnState = (status) => {
    var title = '';
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
        title = '';
    }
    //console.log(title);

    return title;
  };


  render() {



    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0,backgroundColor: '#f3f3f3' }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF', marginTop: 15,borderRadius: 0,marginLeft: 0,marginRight: 0,}}
              >
              <ListItem
                roundAvatar
                //avatar={item.ownerinfo.face?{uri: Service.BaseUri+item.ownerinfo.face}:require('../icon/person/default_avatar.png')}
                avatarStyle={{backgroundColor: '#FFFFFF'}}
                //title={item.ownerinfo.username}
                rightTitle={this.returnState(item.status)}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}


                onPress={() => {
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    order: item,
                  };
                  if(item.type==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.type==1){
                    navigate('myOrderDetail_Ask',params);
                  }
                }}
              />

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.id}
                title={item.iteminfo.name}
                subtitle={I18n.t('myOrder.tp')+': '+(item.type==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
                avatarContainerStyle={{height:80,width:80}}
                avatarStyle={{height:80,width:80}}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f3f3f3' }}
                avatar={{uri: Service.BaseUri+item.iteminfo.img}}
                subtitleNumberOfLines={2}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                      {'￥'+item.iteminfo.price}
                    </Text>
                    <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                      {'X'+item.num}
                    </Text>
                    <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
                      {item.changeprice>=0?'+￥'+item.changeprice:'-￥'+(-item.changeprice)}
                    </Text>
                  </View>
                }
                onPress={() => {
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    order: item,
                  };
                  if(item.type==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.type==1){
                    navigate('myOrderDetail_Ask',params);
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
                        {'￥'+ parseInt(item.cash).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}
                      </Text>
                    </Text>
                  </View>
                }
              />
              <View style={{backgroundColor: '#FFFFFF',height: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
                <Button
                  containerViewStyle={{marginLeft: 0,marginRight: 10}}
                  title={I18n.t('myOrder.go')}
                  borderRadius={15}
                  buttonStyle={{borderWidth: 1,borderColor: '#999999',height: 30,}}
                  backgroundColor='#FFFFFF'
                  textStyle={{fontSize: 12,color: '#999999'}}
                  onPress={() => {
                    const params = {
                      token: this.state.token,
                      uid: this.state.uid,
                      islogin: this.state.islogin,
                      order: item,
                    };
                    if(item.type==0){
                      navigate('myOrderDetail_Service',params);
                    }
                    else if(item.type==1){
                      navigate('myOrderDetail_Ask',params);
                    }
                  }}
                />
                {
                  (() => {
                    if(item.status<40){
                      return (
                        <Button
                          title={I18n.t('myOrder.cancel_order')}
                          containerViewStyle={{marginLeft: 0,marginRight: 10}}
                          borderRadius={15}
                          buttonStyle={{borderWidth: 1,borderColor: '#fd586d',height: 30,}}
                          backgroundColor='#FFFFFF'
                          textStyle={{fontSize: 12,color: '#fd586d'}}
                          onPress={() => this.operate_order(item.id,'cancel')}
                        />
                      );
                    }
                    return null;
                  })()


                }

              </View>
            </View>

          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          //onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}

class Order2 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
        status: '',
        title: '',
        //列表数据
        tp: 0,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      }
  };

  componentDidMount() {

    this.setState({
      token: this.props.state.token,
      uid: this.props.state.uid,
      islogin: this.props.state.islogin,
      status: this.props.state.status,
      title: this.props.state.title,
    },this.makeRemoteRequest)

    this.subscription = DeviceEventEmitter.addListener('operate_Order', () => this.makeRemoteRequest());

  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp,status } = this.state;
    const url = Service.BaseUrl+Service.v+`/order/sale?type=-1${status}&t=${token}&page=${page}&per-page=20`;
    console.log(url);
    this.setState({ loading: true, });
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log(res.data);
        this.setState({
          data: page === 1 ? res.data.data : [...this.state.data, ...res.data.data],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .then(() => console.log(this.state.data))
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  operate_order = (id,m) => {
    const { token,uid,} = this.state;
    const url = Service.BaseUrl+Service.v+`/order/${m}?t=${token}`;
    const body = 'id='+id;
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

      if(!parseInt(responseJson.status)){

        DeviceEventEmitter.emit('operate_Order');

        var txt = I18n.t('success.fetch');
        switch (m){
          case 'finish':
            //alert(I18n.t('order_Finish'));
            txt = I18n.t('common.service_ok');
            break;
          case 'cancel':
            //alert(I18n.t('order_Cancel'));
            txt = I18n.t('myOrder.dtxt9');
            break;
          default:

        }
        alert(txt);
      }
      else{
        this.AlertOnError(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,payModalVisible: false,page: 1},this.makeRemoteRequest))
    .catch(err => {console.log(err);this.setState({loading: false,})})
  };


  componentWillUnmount() {
    // 移除
    this.subscription.remove();
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 15,
          width: "100%",
          backgroundColor: "#f3f3f3",
          marginLeft: "0%"
        }}
      />
    );
  };


  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  returnState = (status) => {
    var title = '';
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
        title = '';
    }
    //console.log(title);

    return title;
  };


  render() {
    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0,backgroundColor: '#f3f3f3' }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF', marginTop: 15,borderRadius: 0,marginLeft: 0,marginRight: 0,}}
              >
              <ListItem

                roundAvatar
                avatar={item.userinfo.face?{uri: Service.BaseUri+item.userinfo.face}:require('../icon/person/default_avatar.png')}
                avatarStyle={{backgroundColor: '#FFFFFF'}}
                title={item.userinfo.username}
                rightTitle={this.returnState(item.status)}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}


                onPress={() => {
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    order: item,
                  };
                  if(item.type==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.type==1){
                    navigate('myOrderDetail_Ask',params);
                  }
                }}
              />

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.id}
                title={item.iteminfo.name}
                subtitle={I18n.t('myOrder.tp')+': '+(item.type==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
                avatarContainerStyle={{height:80,width:80}}
                avatarStyle={{height:80,width:80}}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f3f3f3' }}
                avatar={{uri: Service.BaseUri+item.iteminfo.img}}
                subtitleNumberOfLines={2}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                      {'￥'+item.iteminfo.price}
                    </Text>
                    <Text style={{color: '#999999',alignSelf: 'flex-end'}}>
                      {'X'+item.num}
                    </Text>
                    <Text style={{color: '#da695c',alignSelf: 'flex-end'}}>
                      {item.changeprice>=0?'+￥'+item.changeprice:'-￥'+(-item.changeprice)}
                    </Text>
                  </View>
                }
                onPress={() => {
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    order: item,
                  };
                  if(item.type==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.type==1){
                    navigate('myOrderDetail_Ask',params);
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
                        {'￥'+ parseInt(item.cash).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}
                      </Text>
                    </Text>
                  </View>
                }
              />
              <View style={{backgroundColor: '#FFFFFF',height: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
                <Button
                  containerViewStyle={{marginLeft: 0,marginRight: 10}}
                  title={I18n.t('myOrder.go')}
                  borderRadius={15}
                  buttonStyle={{borderWidth: 1,borderColor: '#999999',height: 30,}}
                  backgroundColor='#FFFFFF'
                  textStyle={{fontSize: 12,color: '#999999'}}
                  onPress={() => {
                    const params = {
                      token: this.state.token,
                      uid: this.state.uid,
                      islogin: this.state.islogin,
                      order: item,
                    };
                    if(item.type==0){
                      navigate('mySaleDetail_Service',params);
                    }
                    else if(item.type==1){
                      navigate('mySaleDetail_Ask',params);
                    }
                  }}
                />
                {
                  (() => {
                    if(item.status<40){
                      return (
                        <Button
                          title={I18n.t('myOrder.cancel_order')}
                          containerViewStyle={{marginLeft: 0,marginRight: 10}}
                          borderRadius={15}
                          buttonStyle={{borderWidth: 1,borderColor: '#fd586d',height: 30,}}
                          backgroundColor='#FFFFFF'
                          textStyle={{fontSize: 12,color: '#fd586d'}}
                          onPress={() => this.operate_order(item.id,'cancel')}
                        />
                      );
                    }
                    return null;
                  })()


                }

              </View>
            </View>

          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          //onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}



const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f3f3f3',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#fd586d',
  },
  header: {
    height: 44,
    width: width,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fd586d',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  icon: {
     width: 25,
     height: 25,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  account_icon: {
      tintColor:'#fd586d',
      width:25,
      height:25,
  },
});
export default myOrder;
