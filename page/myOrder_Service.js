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

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
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

  return title;
};

class myOrder extends Component {
  constructor(props) {
      super(props);
      this.state = {

      }
  };

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
             {I18n.t('myOrder.myOrder')}
           </Text>
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
         </View>
       </View>
       <ScrollableTabView
         tabBarUnderlineStyle={{backgroundColor:'#f1a073'}}
         tabBarActiveTextColor='#f1a073'
         style={{backgroundColor: '#FFFFFF'}}
         >
        <Order1
          tabLabel={I18n.t('myOrder.o1')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Order2
          tabLabel={I18n.t('myOrder.o2')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Order3
          tabLabel={I18n.t('myOrder.o3')}
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();

    this.subscription = DeviceEventEmitter.addListener('operate_Order', () => this.makeRemoteRequest());

    console.log(this.state);
  };

  componentWillUnmount() {
    // 移除
    this.subscription.remove();
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&tp=${tp}&ps=10&status=0`;
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
          height: 10,
          width: "100%",
          backgroundColor: "#f2f2f2",
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0,backgroundColor: '#f2f2f2' }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF'}}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('myOrderDetail_Service',params);
                }
                else if(item.tp==1){
                  navigate('myOrderDetail_Ask',params);
                }
              }}
              >
              <ListItem
                title={item.name}
                rightTitle={returnState(item.status)}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}
              />

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.oid}
                title={item.name}
                subtitle={I18n.t('myOrder.tp')+': '+(item.tp==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
                avatarContainerStyle={{height:80,width:80}}
                avatarStyle={{height:80,width:80}}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f2f2f2' }}
                avatar={{uri: Service.BaseUri+item.img}}
                subtitleNumberOfLines={2}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                      {'$'+item.price}
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
                  if(item.tp==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.tp==1){
                    navigate('myOrderDetail_Ask',params);
                  }
                }}
              />
              <ListItem
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0 }}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end',fontSize: 16}}>
                      {I18n.t('myOrder.total')+': '+'$'}{Number(item.price)*Number(item.num)+Number(item.changeprice)}
                    </Text>
                  </View>
                }
              />
            </TouchableOpacity>

          )}
          keyExtractor={item => item.oid}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();

    this.subscription = DeviceEventEmitter.addListener('operate_Order', () => this.makeRemoteRequest());

  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&tp=${tp}&ps=10&status=10,20,30`;

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
          height: 10,
          width: "100%",
          backgroundColor: "#e5e5e5",
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0,backgroundColor: '#f2f2f2' }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF'}}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('myOrderDetail_Service',params);
                }
                else if(item.tp==1){
                  navigate('myOrderDetail_Ask',params);
                }
              }}
              >
              <ListItem
                title={item.name}
                rightTitle={returnState(item.status)}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}
              />

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.oid}
                title={item.name}
                subtitle={I18n.t('myOrder.tp')+': '+(item.tp==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
                avatarContainerStyle={{height:80,width:80}}
                avatarStyle={{height:80,width:80}}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f2f2f2' }}
                avatar={{uri: Service.BaseUri+item.img}}
                subtitleNumberOfLines={2}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                      {'$'+item.price}
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
                  if(item.tp==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.tp==1){
                    navigate('myOrderDetail_Ask',params);
                  }
                }}
              />
              <ListItem
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0 }}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end',fontSize: 16}}>
                      {I18n.t('myOrder.total')+': '+'$'}{Number(item.price)*Number(item.num)+Number(item.changeprice)}
                    </Text>
                  </View>
                }
              />
            </TouchableOpacity>

          )}
          keyExtractor={item => item.oid}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}


class Order3 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();


    this.subscription = DeviceEventEmitter.addListener('operate_Order', () => this.makeRemoteRequest());

  };

  componentWillUnmount() {
    // 移除
    this.subscription.remove();
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&tp=${tp}&ps=10&status=40,50,60`;
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
          height: 10,
          width: "100%",
          backgroundColor: "#e5e5e5",
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0,backgroundColor: '#f2f2f2' }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{borderWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF'}}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('myOrderDetail_Service',params);
                }
                else if(item.tp==1){
                  navigate('myOrderDetail_Ask',params);
                }
              }}
              >
              <ListItem
                title={item.name}
                rightTitle={returnState(item.status)}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0}}
              />

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.oid}
                title={item.name}
                subtitle={I18n.t('myOrder.tp')+': '+(item.tp==0?I18n.t('myOrder.tp0'):I18n.t('myOrder.tp1'))}
                avatarContainerStyle={{height:80,width:80}}
                avatarStyle={{height:80,width:80}}
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0,borderColor: '#e5e5e5',backgroundColor: '#f2f2f2' }}
                avatar={{uri: Service.BaseUri+item.img}}
                subtitleNumberOfLines={2}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end'}}>
                      {'$'+item.price}
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
                  if(item.tp==0){
                    navigate('myOrderDetail_Service',params);
                  }
                  else if(item.tp==1){
                    navigate('myOrderDetail_Ask',params);
                  }
                }}
              />
              <ListItem
                containerStyle={{ borderBottomWidth: 0,borderTopWidth: 0 }}
                rightIcon={
                  <View style={{alignSelf: 'center',marginRight: 5}}>
                    <Text style={{color: '#333333',alignSelf: 'flex-end',fontSize: 16}}>
                      {I18n.t('myOrder.total')+': '+'$'}{Number(item.price)*Number(item.num)+Number(item.changeprice)}
                    </Text>
                  </View>
                }
              />
            </TouchableOpacity>

          )}
          keyExtractor={item => item.oid}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
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
      tintColor:'#f1a073',
      width:25,
      height:25,
  },
});
export default myOrder;
