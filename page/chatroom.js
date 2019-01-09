
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
import { List, ListItem, SearchBar,Icon,Avatar } from "react-native-elements";
import Service from '../common/service';
import { GiftedChat, Actions, Bubble, SystemMessage,Send ,} from 'react-native-gifted-chat';
import CustomView from './CustomView';

var { TextMessage } = require('leancloud-realtime');
// Tom 用自己的名字作为 clientId，获取 IMClient 对象实例


class chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      uid: null,
      uuid: null,
      islogin: false,


      //
      user: {},
      uuser: {},
      conversation: null,
      messageIterator: null,

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

    this.listener = DeviceEventEmitter.addListener('message', (message) => {
      if(!message.text){
        return false;
      }

      if(this.state.conversation){
        conversation.read().catch(err => console.log(err))
      }

      console.log(message.text);
      this.onReceive(message.text);

      return true;
    })

    this.setState({
      token: params.token,
      uid: params.uid,
      uuid: params.uuid,
      islogin: params.islogin,

    },this.createConversation);

  }

  componentDidMount() {

  };


  componentWillUnmount() {

    DeviceEventEmitter.emit('updateChatList');

    try{
      this.listener.remove();
    }catch(err){
      console.log(err);
    }


    this.updateConversation()

  };

  createConversation = () => {

    if(!global.client){
      return false;
    }



    let user1 = this.state.user.username?this.state.user.username: '?';
    let user2 = this.state.uuser.username?this.state.uuser.username: '?';





    global.client.createConversation({
      members: [String(this.state.uuid)],
      unique: true,
      name: this.props.navigation.state.params.name?this.props.navigation.state.params.name: '?&?'
    }).then((conversation) => {

      this.getInfo();
      conversation.read().catch(err => console.log(err))
      this.setState({conversation: conversation,messageIterator: messageIterator});

      var messageIterator = conversation.createMessagesIterator({ limit: 10 });

      return messageIterator;
    }).then((messageIterator) => {

      this.getHistory(messageIterator);



    }).catch(console.error);
  }

  getHistory = (messageIterator) => {
    if(!messageIterator){
      return false;
    }

    messageIterator.next().then((result) => {

      console.log(this.state);

      let results = result.value;

      let msgs = [];
      let len = result.value.length;
      for(var i=len-1;i>=0;i--){

        let msg = {
          _id: Math.round(Math.random() * 10000000),
          text: results[i].text,
          createdAt: results[i].timestamp,
          user: {
            _id: Number(results[i].from),
            name: 'client',
            avatar: Number(results[i].from)==this.state.uid?this.returnAvatarSource(this.state.user.face):require('../icon/person/default_avatar.png'),
          }
        };

          msgs.push(msg);
      }

      console.log(msgs);

      this.setState({
        messages: this.state.page==0?msgs: [...this.state.messages,...msgs],
        page: this.state.page+1,
      })
    }).catch(err => console.log(err))
  }



  updateConversation = () => {

    if(!this.state.conversation){
      return false;
    }

    const { conversation } = this.state;

    console.log(conversation);



    let user1 = this.state.user.username?this.state.user.username: '?';
    let user2 = this.state.uuser.username?this.state.uuser.username: '?';


    try{
      var name = conversation.members[1]==this.state.uid?(user2+'&'+user1):(user1+'&'+user2);
    }catch(err){
      console.log(err);
    }


    if(!this.state.conversation){
      return false;
    }
    let conv = this.state.conversation;


    conv.name = name;
    console.log('update');
    return conv.save();

  }




  getInfo = () => {
    this.getMyInfo();
    this.getUserInfo();
  }

  getMyInfo = () => {
    const { token,uid } = this.state;
    if(!token){ return }
    const url = Service.BaseUrl+Service.v+`/user/info?t=${token}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      if(!responseJson.status){
        this.setState({user: responseJson.data},this.updateConversation);

      }
      else{

        console.log(responseJson.err);

      }
    })
    .catch(err => console.log(err))
  };




  //获取用户信息
  getUserInfo = () => {
    console.log(this.state.uuid);
    const { token,uuid } = this.state;
    const url = Service.BaseUrl+Service.v+`/user/get-info-by-id?id=${uuid}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({uuser: responseJson.data},this.updateConversation);
      }
      else{
        console.log(responseJson.err);
      }
    })
    .catch(err => console.log(err))
  };


  onReceive(text) {
  this.setState((previousState) => {
    return {
      messages: GiftedChat.append(previousState.messages, {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: {
          _id: this.state.uuid,
          name: 'client',
          avatar: require('../icon/person/default_avatar.png'),
        },
      }),
    };
  });
}




  onSend = (messages = []) => {

    if(!this.state.conversation){
      return false;
    }

    let conv = this.state.conversation;


    if(conv){

      conv.send(new TextMessage(messages[0].text))
      .then((message) => {
        conv.set('last',message);
        conv.save()


      })
      .catch(err => console.log(err));



    }





    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    return true;
  };

  onLoadEarlier = () =>  {

  };

  returnAvatarSource = (face) => {
    if(!face){
      return require('../icon/person/default_avatar.png')
    }
    let source =  Service.BaseUri+face;


    return {uri: source};
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
          backgroundColor: '#fd586d',
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
                      color='#fd586d'
                    />
                </View>
            </Send>
        );
  }

  renderAvatar = (props) => {
    return (
      <Avatar
        small
        rounded
        source={props.position=='left'?this.returnAvatarSource(this.state.uuser.face):this.returnAvatarSource(this.state.user.face)}
        containerStyle={{backgroundColor: '#FFFFFF'}}
        style={{backgroundColor: '#FFFFFF'}}
        onPress={() => console.log("Works!")}
        activeOpacity={0.7}
      />
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
              color='#fd586d'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
              {this.state.uuser.username?this.state.uuser.username: '?'}
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
              name: 'me',
              avatar: this.returnAvatarSource(this.state.user.face),
            }}
            renderAvatar={this.renderAvatar}
            showUserAvatar={true}
            renderAvatarOnTop={true}
            loadEarlier={true}
            renderBubble={this.renderBubble}
            renderCustomView={this.renderCustomView}
            isLoadingEarlier={this.state.isLoadingEarlier}
            loadEarlier={this.state.loadEarlier}
            renderSend={this.renderSend}
            onLoadEarlier={() => this.onLoadEarlier()}
            showAvatarForEveryMessage={true}
            renderAvatarOnTop={true}
            onPressAvatar={(user) => {
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
        backgroundColor: '#f3f3f3',
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
      backgroundColor: '#fd586d',
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
