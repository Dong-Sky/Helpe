
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
} from 'react-native';
import { List, ListItem, SearchBar,Icon } from "react-native-elements";
import Service from '../common/service';
import { GiftedChat, Actions, Bubble, SystemMessage,Send } from 'react-native-gifted-chat';
import CustomView from './CustomView';

import SQLite from '../db/SQLite';
var sqLite = new SQLite();
var db = sqLite.open();
const TABLE_MSG = "MSG";

class chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: false,
      //
      user: {},
      uuser: {},

      //
      uuid: null,
      uuface: '',
      uuname: '???',
      //
      messages: [],
      isLoadingEarlier: false,
      loadEarlier: true,
      page: 0,
    };

  }
  componentWillMount() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    this.state.token = params.token;
    this.state.uid = params.uid;
    this.state.uuid = params.uuid;
    this.state.islogin = params.islogin;
    this.state.uuface = params.uuface;
    this.state.uuname = params.uuname;

    this.setState({
      token: params.token,
      uid: params.uid,
      uuid: params.uuid,
      islogin: params.islogin,
      uuface: params.uuface,
      uuname: params.uuname,
      user: params.user,
    },
    () => {
      DeviceEventEmitter.emit('chating', this.state.uuid);

      //取聊天记录
      this.get_message();
    })




  }

  componentDidMount() {
    console.log(this.state);
    this.createEventEmitter();
  };


  componentWillUnmount() {

      this.subscription.remove();
      DeviceEventEmitter.emit('chating_end');
  };

  //创建监听
  createEventEmitter = () => {
    this.subscription = DeviceEventEmitter.addListener('NewMessage',
    (MsgData) => {

      let messages = [];
      for(var i = 0;i<MsgData.length;i++){
        //逐条处理
          let obj = MsgData[i];


          if(obj.tp==1){
            let msg = {
                //_id: this.state.messages.length+i+1,
                _id: Math.round(Math.random() * 1000000),
                text: obj.msg,
                createdAt: new Date(obj.t*1000),
                user: {
                  _id: obj.uuid,
                  name: this.state.uuname==''?'未知用户':unescape(this.state.uuname),
                  avatar: this.returnAvatarSource(this.state.uuface),
                },
              };

              messages.unshift(msg);
          }
      }


      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });

    });
  }


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

  //获取聊天记录
  get_message = () => {
    const { token,uid,uuid,page } = this.state;
    const p = page*10;
    if(!db){
       db = sqLite.open();
    }
    this.setState({isLoadingEarlier: true})
    db.transaction((tx)=>{
    tx.executeSql("select * from "+TABLE_MSG+" Where uid="+uid+" And uuid="+uuid+" Order by t DESC LIMIT 10 OFFSET "+p, [],(tx,results)=>{
      var len = results.rows.length;

      var messages = [];
      for(let i=0; i<len; i++){
        var obj = results.rows.item(i);
        //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
        console.log(obj);
        let msg = {
            //_id: this.state.messages.length+i+1,
            _id: Math.round(Math.random() * 1000000),
            text: obj.msg,
            createdAt: new Date(obj.t*1000),
            user: {
              _id: obj.tp==0?obj.uid:obj.uuid,
              name: this.state.uuname==''?'未知用户':this.state.uuname,
              avatar: obj.tp==0?this.returnAvatarSource(this.state.user.face):this.returnAvatarSource(this.state.uuface),
            },
          };

        messages.push(msg);
      }

      this.setState({messages: [...this.state.messages, ...messages],isLoadingEarlier: false})
    });
    },(error)=>{//打印异常信息
      console.log(error);
      this.setState({isLoadingEarlier: false})
    })
  };



  onSend = (messages = []) => {

    var msg = {
      "uid": this.state.uuid,
      "msg": escape(messages[0].text),
    };

    var data = {
      uid: parseInt(this.state.uid),
      uuid: parseInt(this.state.uuid),
      uuface: this.state.uuface,
      uuname: this.state.uuname,
      t: (Date.parse(new Date())/1000),
      tp: 0, //0为发送出去的，1为接受到的
      flag: 1 , //0为未读,1为已读
      msg: messages[0].text,
    }

    var da = {"o":3,"d":JSON.stringify(msg)};


    DeviceEventEmitter.emit('send_message', {da,data});

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  };

  onLoadEarlier = () =>  {
  this.setState((previousState) => {
    return {
      isLoadingEarlier: true,
      page: this.state.page+1,
    };
  },
  () => this.get_message()
);
  };

  returnAvatarSource = (face) => {
    var source = require('../icon/person/default_avatar.png');
    if(face==''||face==null||face==undefined){

    }
    else{
      source =  Service.BaseUri+face;
    }


    return source;
  };

  renderBubble = (props)  => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#FFFFFF',
        },
        right: {
          backgroundColor: '#f1a073',
        }
      }}
    />
  );
};

renderCustomView = (props) => {
  return (
    <CustomView
      {...props}
    />
  );
};

renderSend = (props) => {
        return (
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 5}}>
                    <Icon
                      name='send'
                      color='#f1a073'
                    />
                </View>
            </Send>
        );
    }




  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
            <Icon
              style={{marginLeft: 5}}
              name='chevron-left'
              color='#f1a073'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
              {this.state.uuname}
            </Text>
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
          </View>
        </View>
        <View style={{flex: 1}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: parseInt(this.state.uid),
              name: this.state.user.name==''?'未命名': this.state.user.name,
              avatar: this.returnAvatarSource(this.state.user.face),
            }}
            showUserAvatar={true}
            renderAvatarOnTop={true}
            loadEarlier={true}
            renderBubble={this.renderBubble}
            renderCustomView={this.renderCustomView}
            isLoadingEarlier={this.state.isLoadingEarlier}
            loadEarlier={this.state.loadEarlier}
            renderSend={this.renderSend}
            onLoadEarlier={() => this.onLoadEarlier()}
            onPressAvatar={(user) => {
              console.log(user);
              const params = {
                token: this.state.token,
                uid: this.state.uid,
                islogin: this.state.islogin,
                uuid: user._id,
              };
              navigate('user',params);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
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
      borderColor: '#e5e5e5',
    },
    banner: {
      height: 120,
      alignSelf: 'stretch',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f1a073',
    },
    avatar: {
      height: 80,
      width: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    title: {
      fontWeight: '500',
      marginLeft: 10,
      marginTop: 5,
    },
    listContainerStyle:{
      borderBottomWidth: 0,
      backgroundColor: '#FFFFFF'
    },
    button: {
      alignSelf: 'center',
      marginTop: 5,
      width: 280,
      height: 50,
    },
    list: {
      marginTop:10,
      borderWidth: 1,
      borderColor: '#e5e5e5'
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
    button1: {
      alignSelf: 'center',
      marginTop : 5,
      width: 240,
      height: 50,
    },
});


export default chatroom;
