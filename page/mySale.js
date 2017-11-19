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



class mySale extends Component {
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
       </View>
       <ScrollableTabView
         tabBarUnderlineStyle={{backgroundColor:'#f3456d'}}
         tabBarActiveTextColor='#f3456d'
         >
        <Sale1
          tabLabel="待接受"
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Sale2
          tabLabel="进行中"
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Sale3
          tabLabel="已结束"
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
      </ScrollableTabView>
     </View>
   );
 }
}

//服务页面
class Sale1 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();
    console.log(this.state);
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&m=sale&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&tp=${tp}&status=0`;
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
          width: "86%",
          backgroundColor: "#e5e5e5",
          marginLeft: "14%"
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
              key={item.itemid}
              title={'商品号: '+item.itemid}
              subtitle={'订单号: '+item.id}
              avatarStyle ={{height:60,width:60}}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('mySaleDetail_Service',params);
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

class Sale2 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();
    console.log(this.state);
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&m=sale&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&tp=${tp}&status=10,20,30`;
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
          width: "86%",
          backgroundColor: "#e5e5e5",
          marginLeft: "14%"
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
              key={item.itemid}
              title={'商品号: '+item.itemid}
              subtitle={'订单号: '+item.id}
              avatarStyle ={{height:60,width:60}}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('mySaleDetail_Service',params);
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

class Sale3 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        token:null,
        uid:null,
        islogin:false,
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
    this.state.token = this.props.state.token;
    this.state.uid = this.props.state.uid;
    this.state.islogin = this.props.state.islogin;
    this.makeRemoteRequest();
    console.log(this.state);
  };

  makeRemoteRequest = () => {
    const { token,uid,page,seed,tp } = this.state;
    const url = Service.BaseUrl+`?a=order&m=sale&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&tp=${tp}&status=40,50,60`;
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
          width: "86%",
          backgroundColor: "#e5e5e5",
          marginLeft: "14%"
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
              key={item.itemid}
              title={'商品号: '+item.itemid}
              subtitle={'订单号: '+item.id}
              avatarStyle ={{height:60,width:60}}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {
                const params = {
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  order: item,
                };
                if(item.tp==0){
                  navigate('mySaleDetail_Service',params);
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
      backgroundColor:'#f3456d',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3456d',
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
      tintColor:'#5c492b',
      width:25,
      height:25,
  },
});
export default mySale;
