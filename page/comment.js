import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter,
  ScrollView,
  TouchableOpacity,
  ListView,
  Dimensions,
  RefreshControl
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem, SearchBar,Icon } from "react-native-elements";
import Service from '../common/service';
import Util from '../common/util';
import Log from './log';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import SQLite from '../db/SQLite';
var sqLite = new SQLite();
var db ;
const TABLE_MSG = "MSG";
var ws,heartbeat,disConnect;

function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "/");
}




class comment extends Component {
  static navigationOptions = {
    tabBarLabel: 'comment',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/comment.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  }

  constructor(props) {
    super(props);

    this.state = {
      token: null,
      uid: null,
      islogin: false,
      ws: null,
      Ws: null,
      chatID: null,
      user: {},

      //
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };


  };

  componentWillMount(){
    this.getLoginState();

    this.subscription0 = DeviceEventEmitter.addListener('login',
    (e) => {

      //e==0登录,e!=0登出
      if(e){
        this.getLoginState();
      }
      else{
        this.setState({
          token: null,
          uid: null,
          islogin: false,
        })
      }

      }
    );

  };

  componentDidMount() {

  };

  componentWillUnmount() {
    try {
      if(this.subscription0){
        this.subscription0.close();
      }
    } catch (e) {

    } finally {

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

      this.setState(
        {
          token: ret.token,
          uid: ret.uid,
          islogin: ret.token!=null&ret.uid!=null?true: false,
          ws: ret.ws,
        },this.getLog)
      }
    )
    .catch(error => {
      console.log(error);
    })

};





  returnLogElement = (log) => {

    let result = {
      title: '',
      sub: '',
      next: '',
    };

    let data = JSON.parse(log.data);
    result = Util.log(Number(log.tpid),data);

    return result;
  }

  getLog = () => {
    console.log(123);
    const { token,uid,islogin} = this.state;

    if(!islogin){

      return;
    }
    const url = Service.BaseUrl+Service.v+`/mlog?t=${token}&page=1&per-page=${10}`
    this.setState({loading: true});
    fetch(url)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if(!parseInt(res.status)){
        this.setState({

          data: res.data.data,
        })
      }
      else{
        alert(res.err)
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {
      console.log(err);
      this.setState({loading: false});
    })
  };


  //获取用户信息
  getUserInfo = () => {
    const { token,uid } = this.state;
    const url = Service.BaseUrl+`?a=user&m=info&token=${token}&uid=${uid}&id=${uid}&v=${Service.version}`;

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({user: responseJson.data.user});
      }
      else{
        console.log(responseJson.err);
      }
    })
    .catch(err => console.log(err))
  };




  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${1}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
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
    //this.getChatList();
  };

  handleLoadMore = () => {

  };
  renderSeparator = (state) => {

    if(state == false){
      return ;
    }
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#f3f3f3",
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.StatusBar}>
      </View>
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
    const { params } = this.props.navigation.state;
    return (

        <View style={styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={[styles.header]}>
            <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
              <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                {I18n.t('comment.list')}
              </Text>
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
              <View style={{marginRight: 10}} >

                <Icon
                  style={{}}
                  name='refresh'
                  color='#fd586d'
                  size={28}
                  onPress={() => this.makeRemoteRequest()}
                />

              </View>
            </View>
          </View>
          <ScrollView>
            <List containerStyle={{ backgroundColor: '#f2f2f2',borderTopWidth: 1,flex:1 ,marginTop: 15,borderColor: '#e5e5e5',marginLeft: 0,marginRight: 0,}}>

              <ListItem
                component={TouchableOpacity}
                roundAvatar
                title={'聊天'}
                titleNumberOfLines={3}
                //rightTitle={formatDate(Number(item.t))}
                //rightIcon={<View></View>}
                subtitleNumberOfLines={3}
                subtitle={'Welcome Helpe!'}
                leftIcon={
                  <Icon
                    name='comment'
                    type='font-awesome'
                    size={20}
                    color='#fd586d'
                    reverse
                  />
                }
                //avatar={require('../icon/person/default_avatar.png')}
                //avatarContainerStyle={{height:40,width:40}}
                //avatarStyle={{height:40,width:40,tintColor: '#FFFFFF',backgroundColor: '#fd586d'}}
                containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',borderRadius: 0,marginBottom: 10,}}
                onPress={() => {

                  console.log(global.client);
                  if(!global.client){
                    return false;
                  }

                  this.props.navigation.navigate('chatList',{
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                  })}
                }
              />
              <ListItem
                component={TouchableOpacity}
                roundAvatar
                title={'通知'}
                titleNumberOfLines={5}
                //rightTitle={formatDate(Number(item.t))}
                //rightIcon={<View></View>}
                subtitleNumberOfLines={3}
                //subtitle={'Welcome Helpe!'}

                //avatar={require('../icon/person/default_avatar.png')}
                //avatarContainerStyle={{height:40,width:40}}
                //avatarStyle={{height:40,width:40,tintColor: '#FFFFFF',backgroundColor: '#fd586d'}}
                containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',borderRadius: 0,marginBottom: 10,}}
                onPress={() => this.props.navigation.navigate('log',{
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                })}
              />
              <Text style={{marginTop: 5,marginBottom: 15,alignSelf: 'center',color: '#999999',fontSize: 14}}>
                最近
              </Text>

              {
                this.state.data.map((item,index,arr) => {
                  return (
                    <View>
                      <ListItem
                        component={TouchableOpacity}
                        roundAvatar
                        key={item.id}
                        title={this.returnLogElement(item).sub}
                        subtitle={formatDate(Number(item.ct))}
                        titleNumberOfLines={3}
                        //rightTitle={formatDate(Number(item.t))}
                        rightIcon={<View></View>}
                        subtitleNumberOfLines={3}
                        titleStyle={{fontSize: 14}}
                        subtitleStyle={{marginTop: 15}}
                        //subtitle={this.returnLogElement(item).sub+'\n('+formatDate(Number(item.ct))+')'}
                        //avatar={require('../icon/person/default_avatar.png')}
                        leftIcon={
                          <Icon
                            name={this.returnLogElement(item).icon}
                            size={20}
                            color='#fd586d'
                            reverse
                          />
                        }
                        avatarContainerStyle={{height:40,width:40}}
                        avatarStyle={{height:40,width:40,tintColor: '#FFFFFF',backgroundColor: '#fd586d'}}
                        containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',borderRadius: 0,marginBottom: 0}}
                        onPress={() => navigate(this.returnLogElement(item).next,{
                          uid: this.state.uid,
                          token: this.state.token,
                          islogin: this.state.islogin,
                          status: '&status=0,10,20,30,40,50,60',
                          title: I18n.t('myOrder.o4'),
                        })}
                      />
                      {this.renderSeparator(true)}

                    </View>

                  );
                })
              }
            </List>
          </ScrollView>

        </View>
    );}
  };


const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        backgroundColor: '#f2f2f2'
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
    borderColor: '#e5e5e5',
  },
  icon: {
   width: 25,
   height: 25,
  },
});
export default comment;
