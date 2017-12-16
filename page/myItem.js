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
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button,Avatar } from 'react-native-elements';
import MapView, { marker,Callout,} from 'react-native-maps';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Service from '../common/service';

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}



class myItem extends Component {
  constructor(props) {
      super(props);
      this.state = {

      }
  };


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
             {I18n.t('myItem.myItem')}
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
        <ServicePage
          tabLabel={I18n.t('myItem.Service')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <AskPage
          tabLabel={I18n.t('myItem.Ask')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
      </ScrollableTabView>
     </View>
   );
 }
}

//服务页面
class ServicePage extends Component {
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

  componentWillMount() {
    this.setState({
      token: this.props.state.token,
      uid: this.props.state.uid,
      islogin: this.props.state.islogin,
    });
  };

  componentDidMount() {
    this.makeRemoteRequest();

    this.subscription = DeviceEventEmitter.addListener('refresh_myItem',() => this.makeRemoteRequest());


  };


  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=user&m=item&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&tp=${tp}`;

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
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              component={TouchableOpacity}
              roundAvatar
              key={item.id}
              title={item.name}
              subtitleNumberOfLines={2}
              subtitle={formatDate(item.t)+'\n'+I18n.t('myItem.salenum')+': '+item.salenum+I18n.t('myItem.e')}
              rightTitle={item.flag==1? I18n.t('myItem.online'):I18n.t('myItem.underline')}
              avatar={{ uri:Service.BaseUri+item.img  }}
              avatarContainerStyle={{height:60,width:60}}
              avatarStyle={{height:60,width:60}}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.uid,
                  itemId: item.id,
                };
                if(item.tp==0){
                  navigate('myItemDetail_Service',params);
                }
                else if(item.tp==1){
                  navigate('myItemDetail_Ask',params)
                }
              }}
            />
          )}
          keyExtractor={item => item.id}
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

//求助页面
class AskPage extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token: null,
        uid: null,
        islogin: false,
        //列表数据
        tp: 1,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      }
  };

  componentWillMount() {
    this.setState({
      token: this.props.state.token,
      uid: this.props.state.uid,
      islogin: this.props.state.islogin,
    });
  };

  componentDidMount() {
    this.makeRemoteRequest();

    this.subscription = DeviceEventEmitter.addListener('refresh_myAsk',() => this.makeRemoteRequest());

    
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=user&m=item&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&tp=${tp}`;
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
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1,marginTop: 0  }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              component={TouchableOpacity}
              roundAvatar
              key={item.id}
              title={item.name}
              subtitle={I18n.t('myItem.start')+': '+formatDate(item.t)}
              rightTitle={item.flag==1? 'online':'not online'}
              avatar={{ uri:Service.BaseUri+item.img  }}
              avatarContainerStyle={{height:60,width:60}}
              avatarStyle={{height:60,width:60}}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.uid,
                  itemId: item.id,
                };
                if(item.tp==0){
                  navigate('myItemDetail_Service',params);
                }
                else if(item.tp==1){
                  navigate('myItemDetail_Ask',params)
                }
              }}
            />
          )}
          keyExtractor={item => item.id}
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
    borderColor: '#e5e5e5',
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
export default myItem;
