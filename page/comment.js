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
  ListView
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem, SearchBar,Icon } from "react-native-elements";
import Service from '../common/service';

import SQLite from '../db/SQLite';
var sqLite = new SQLite();
var db ;
const TABLE_MSG = "MSG";
var ws,heartbeat,disConnect;

function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint8Array(buf));
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
    this.subscription0 = DeviceEventEmitter.addListener('login',
    (e) => {

      //e==true登录,e==false登出
      if(e){
        //登录状态
        this.getLoginState();
      }
      else{
        this.setState({
          token: null,
          uid: null,
          islogin: false,
          data: [],
          chatID: null,
          user: {},
        },() => {

            ws.close();

        })
      }

    });

    if(!db){
    db = sqLite.open();
    }

    sqLite.createTable();
    this.getLoginState();
    //sqLite.deleteAllData()
    //获取聊天室的对象
    this.subscription = DeviceEventEmitter.addListener('chating',
    (id) => {

      this.setState({chatID: id})
      }
    );

    //销毁聊天对象
    this.subscription1 = DeviceEventEmitter.addListener('chating_end',
    (id) => {

      this.setState({chatID: null });
      }
    );

  };

  componentDidMount() {

    this.subscription3 = DeviceEventEmitter.addListener('update_user',() => this.getUserInfo())
  };

  componentWillUnmount() {
    console.log('clear');
    try{
      this.subscription0.remove();
      this.subscription1.remove();
      /*if(this.subscription2){
        this.subscription2.remove();
      }*/
      this.subscription3.remove();

    }catch(e){
      console.log(e);
    }




    clearInterval(heartbeat);
    ws.close();
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
        },
        () => {

          this.getUserInfo();
          //建立连接
          const wsUri = ret.ws+`uid=${ret.uid}&token=${ret.token}`;
          this.CreateWs(wsUri);

          this.getChatList();
        }
      )




      }
    )
    .catch(error => {
      console.log(error);
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


  //get聊天列表

  getChatList = () => {
    const uid = this.state.uid;
    this.SelectNearAndGroup(uid);
  };

  SelectNearAndGroup = (uid) => {
    //获取聊天列表
    if(!db){
       db = sqLite.open();
    }

    let offset = (this.state.page-1)*10
    db.transaction((tx)=>{
    tx.executeSql("select *,COUNT(*) from "+TABLE_MSG+" Where uid="+uid+" Group By uuid Order by t DESC LIMIT 10 OFFSET "+offset, [],(tx,results)=>{
      var len = results.rows.length;

      var data = [];
      for(let i=0; i<len; i++){
        var u = results.rows.item(i);
        //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
        data.push(u);
      }
      console.log(data);
      this.setState({data});
    });
    },(error)=>{//打印异常信息
      console.log(error);

    })

  }


  //WebSocket
  CreateWs = (wsUri) => {
    console.log(wsUri);
    clearInterval(disConnect);
    ws = new WebSocket(wsUri);


    console.log(ws);

    ws.onopen = () => {
      console.log('open');

      heartbeat = setInterval(
       () => {

        if(ws){
           try {
             console.log('发送心跳');
             ws.send(JSON.stringify( {"o":1,"d":""}));
           }
           catch (ex) {
             console.log(ex);
           }
         }
       },
       10000);

    };

    ws.onmessage = (e) => {
      //解析数据
      try{
        let d = JSON.parse(unescape(ab2str(e.data)));

        console.log(d);
        if(d.O==5&&d.D!=undefined){
          //在线数据
          let data = JSON.parse(unescape(d.D));
          console.log(data);
          //存入数据库
          this.Record_online(data);
        }
        else if(d.O==6&&d.D!=undefined){
          //离线数据
          let messages = JSON.parse(d.D);
          this.Record_offline(messages);
        }
        else{
          //未知数据
        }
      }catch(e){
        console.log(e);
      }




      this.getChatList();
    };

    ws.onerror = (e) => {
      console.log(e);
      //this.reconnect();
    };


    ws.onclose = (e) => {
      //console.log(e);
      /*try{
        if(this.subscription2){
          this.subscription2.remove();
        }
      }catch(e){
        console.log(e);
      }*/
      console.log('连接关闭');
      clearInterval(heartbeat);
      disConnect = setInterval(
       () => {

         this.reconnect();
       },
       10000);
    };

    this.subscription2 = DeviceEventEmitter.addListener('send_message',
    (e) => {
      //发送消息
      var da = e.da;
      var data = e.data;
      console.log(data);
      if(ws){

        try {

          ws.send(JSON.stringify(da));
          this.Record_send(data);
        }
        catch (ex) {
          console.log("send error: " + ex);
        }
      }

    }
  );

  };

  reconnect = () => {
    const { token,uid,ws } = this.state;
    const wsUri = ws+`uid=${uid}&token=${token}`;
    if(token){
      console.log('重连');
      this.CreateWs(wsUri);
    }

  }

  Record_online = (data) => {
    console.log(data);
    let MsgData = [];
    if(data.Uid!=this.state.uid){
      console.log('执行存储');
      let msg = {
        uid: parseInt(this.state.uid),
        uuid: parseInt(data.Uid),
        uuface: data.Uface,
        uuname: data.Uname==''?I18n.t('common.no_name'):unescape(data.Uname),
        t: data.T,
        tp: data.Uid==this.state.uid? 0:1, //0为发送出去的，1为接受到的
        flag: (data.Uid==this.state.chatID||data.Uid==this.state.uid)? 1:0 , //0为未读,1为已读
        msg: unescape(data.Msg),
      };

      console.log(msg);
      MsgData.push(msg);

      sqLite.insertUserData(MsgData);

      if(data.Uid==this.state.chatID){

        //向聊天室发送数据
        DeviceEventEmitter.emit('NewMessage', MsgData);
      }

    }


  };

  Record_offline = (messages) => {

    let MsgData = [];
    let MsgData1 = [];//发送给聊天室的
    for(var i=0;i<messages.length;i++){
      let d = JSON.parse(messages[i]);
      if(d.O==5){
        let data = JSON.parse(d.D);

        let msg = {
          uid: parseInt(this.state.uid),
          uuid: parseInt(data.Uid),
          uuface: data.Uface,
          uuname: data.Uname==''?I18n.t('common.no_name'):unescape(data.Uname),
          t: data.T,
          tp: data.Uid==this.state.uid? 0:1, //0为发送出去的，1为接受到的
          flag: (data.Uid==this.state.chatID||data.Uid==this.state.uid)? 1:0 , //0为未读,1为已读
          msg: unescape(data.Msg),
        };

        if(data.Uid==this.state.chatID||data.Uid==this.state.uid){
          //存入向聊天室发送的数据
          MsgData1.unshift(msg);
        }

        MsgData.unshift(msg);
      }
      else{
        //不作处理
      }
    }

    sqLite.insertUserData(MsgData);

    //DeviceEventEmitter.emit('NewMessage', MsgData1);
  };

  Record_send = (data) => {
    console.log(data);
    sqLite.insertUserData([data]);
  };



  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
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
    this.getChatList();
  };

  handleLoadMore = () => {

  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
          backgroundColor: "#CED0CE",
          marginLeft: "5%"
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
                  name='refresh'
                  color='#f1a073'
                  size={28}
                  onPress={() => this.getChatList()}
                />
              </View>
            </View>
          </View>
          <ScrollView>
           <List containerStyle={{ borderTopWidth: 0,backgroundColor: '#f2f2f2' ,marginTop: 0,height: '100%'}}>
              <ListItem
                roundAvatar
                component={TouchableOpacity}
                key={1}
                title={'官方助手'}
                subtitle={'新的消息'}
                avatar={require('../icon/person/default_avatar.png')}
                containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF' }}
                onPress={() => {
                  if(this.state.islogin){
                    navigate('log',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                    })
                  }
                  else{
                    alert(I18n.t('comment.not_login'))
                  }
                }}
              />
              {this.renderSeparator()}
              <ListItem
                roundAvatar
                component={TouchableOpacity}
                key={2}
                title={'全部聊天'}
                subtitle={'点击查看全部会话'}
                avatar={require('../icon/person/default_avatar.png')}
                containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF' }}
                onPress={() => {
                  if(this.state.islogin){
                    navigate('log',{
                      uid: this.state.uid,
                      token: this.state.token,
                      islogin: this.state.islogin,
                    })
                  }
                  else{
                    alert(I18n.t('comment.not_login'))
                  }
                }}
              />
              {this.renderSeparator()}
              {/*<FlatList
                style={{marginTop: 0,borderWidth: 0,flex: 1,}}
                data={this.state.data}
                renderItem={({ item }) => (
                  <ListItem
                    roundAvatar
                    component={TouchableOpacity}
                    key={item.i}
                    title={item.uuname==''?I18n.t('common.no_name'):item.uuname}
                    subtitle={item.msg}
                    avatar={{ uri: Service.BaseUri+item.uuface  }}
                    containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF' }}
                    onPress={
                      () => navigate('chatroom',
                      {
                        item:item,
                        token: this.state.token,
                        uid: this.state.uid,
                        user: this.state.user,
                        uuid: item.uuid,
                        islogin: this.state.islogin,
                        uuface: item.uuface,
                        uuname: item.uuname,
                        //ws: this.state.ws,
                      })
                    }
                  />
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={this.renderSeparator}
                //ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onRefresh={this.handleRefresh}
                refreshing={this.state.refreshing}
                //onEndReached={this.handleLoadMore}
                onEndReachedThreshold={50}
              />*/}

              {this.state.data.map((item,i) => (
                <View key={i}>
                  <ListItem
                    roundAvatar
                    component={TouchableOpacity}
                    key={item.i}
                    title={item.uuname==''?I18n.t('common.no_name'):item.uuname}
                    subtitle={item.msg}
                    avatar={{ uri: Service.BaseUri+item.uuface  }}
                    containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF' }}
                    onPress={
                      () => navigate('chatroom',
                      {
                        item:item,
                        token: this.state.token,
                        uid: this.state.uid,
                        user: this.state.user,
                        uuid: item.uuid,
                        islogin: this.state.islogin,
                        uuface: item.uuface,
                        uuname: item.uuname,
                        //ws: this.state.ws,
                      })
                    }
                  />
                  {this.state.data.length-1!=i?this.renderSeparator():undefined}
                </View>


              ))}

            </List>

          </ScrollView>
        </View>

    );
  }
}

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
