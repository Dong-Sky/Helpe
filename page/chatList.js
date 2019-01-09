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
import { List, ListItem, SearchBar,Icon ,Badge} from "react-native-elements";
import Service from '../common/service';
import Util from '../common/util';
import Log from './log';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import SQLite from '../db/SQLite';
/*
var sqLite = new SQLite();
var db ;
const TABLE_MSG = "MSG";
*/
function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "/");
}




class chatList extends Component {
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
    const { params } = this.props.navigation.state;
    console.log(params);

    this.listener = DeviceEventEmitter.addListener('updateChatList', () => {

      this.getConversation()
    })

    this.setState({
      token: params.token,
      uid: params.uid,
      islogin: params.islogin,
    },this.getConversation);

    //sqLite.createTable();

  };

  componentDidMount() {

    //sqLite.SelectConversationByUser(this.state.uid,this.updateData);

  };

  componentWillUnmount() {

    try{
      this.listener.remove();
    }catch(err){
      console.log(err);
    }

  };

  getConversation = () => {

    if(!global.client){
      return false;
    }

    /*
    if(!global.client){
      return false;
    }

    if(!this.state.uid){
      return false;
    }*/

    global.client.getQuery().limit(20).containsMembers([String(this.state.uid)]).find().then((conversations) =>  {

      console.log(conversations);
      let data = [];

      for(i=0;i<conversations.length;i++){

        let conversation = conversations[i];
        let conv = {};
        conv.creator = conversation.creator;
        conv.name = conversation.name;
        conv.key = conversation.id;
        conv.id = i;
        conv.lastMessageAt = conversation.lastMessageAt ;
        conv.lastMessage = conversation.get('last')?conversation.get('last'):{};
        conv.unreadMessagesCount = conversation.unreadMessagesCount;
        conv.members = conversation.members;

        conv.user1 = conversation.members[0];
        conv.user2 = conversation.members[1];
        let usernames = conversation.name.split('&');
        conv.username1 = usernames[0]?usernames[0]:'?';
        conv.username2 = usernames[1]?usernames[1]:'?';

        data.push(conv);

      }

      this.setState({data: data},() => console.log(this.state.data))
    })
  .catch(err => console.log(err))

  return true;

  };

  updateData = (data) => {
    this.setState({data: data},() => console.log(this.state))
  }



  handleRefresh = () => {

  };

  handleLoadMore = () => {

  };
  renderSparator = () => {
    return (
      <View
        style={{
          height: 15,
          width: "95%",
          backgroundColor: "#f2f2f2",
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
              <Icon
                style={{marginLeft: 5}}
                name='chevron-left'
                color='#fd586d'
                size={32}
                onPress={() => this.props.navigation.goBack()}
              />
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
                  onPress={() => this.getConversation()}
                />

              </View>
            </View>
          </View>
          <ScrollView>


            <List containerStyle={{borderWidth: 0,borderColor: '#e5e5e5',marginTop: 10,flex: 1,backgroundColor: '#f2f2f2',marginLeft: 20,marginRight: 20}}>
              <FlatList
                style={{flex: 1}}
                data={this.state.data}
                renderItem={({item}) => (

                  <ListItem
                    component={TouchableOpacity}
                    roundAvatar
                    key={item.id}
                    title={this.state.uid==item.user1?item.username2:item.username1}
                    titleNumberOfLines={3}
                    //rightTitle={formatDate(Number(item.t))}
                    rightIcon={
                      (function(item){
                        if(item.unreadMessagesCount>0){
                          return (
                            <Badge
                              value={item.unreadMessagesCount}
                              textStyle={{ color: '#FFFFFF' }}
                              containerStyle={{backgroundColor: '#fd586d',marginTop: 5}}
                            />
                          );
                        }
                        return (<View></View>)
                      })(item)
                    }
                    subtitleNumberOfLines={1}
                    subtitle={item.lastMessage.text?item.lastMessage.text:''}
                    avatar={require('../icon/person/default_avatar.png')}
                    avatarContainerStyle={{height:40,width:40}}
                    avatarStyle={{height:40,width:40,tintColor: '#FFFFFF',backgroundColor: '#fd586d'}}
                    containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',borderRadius: 10,marginBottom: 15}}
                    onPress={() => {
                      if(!global.client){
                        return false;
                      }

                      let uuid = this.state.uid==item.user1?item.user2:item.user1;

                      if(uuid==undefined){
                        return false;
                      }

                      navigate('chatroom',{
                        uid: this.state.uid,
                        token: this.state.token,
                        islogin: this.state.islogin,
                        uuid: uuid,
                        name: item.name,
                    })

                    }
                  }
                  />

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
export default chatList;
