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
  TouchableOpacity,
  StatusBar,
  Modal,
  Dimensions,
  NativeModules,
  Alert,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Interactable from 'react-native-interactable';




import Service from '../common/service';


//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

//计算距离常量
var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}

//计算距离
function toRad(d) {  return d * Math.PI / 180; }
function getDisance(lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return parseInt(dis * 6378137);
}

/*
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
             {I18n.t('follow.follow')}
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
        <Follow1
          tabLabel={I18n.t('myItem.Service')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
        <Follow2
          tabLabel={I18n.t('myItem.Ask')}
          state={this.props.navigation.state.params}
          navigation={this.props.navigation}
        />
      </ScrollableTabView>
     </View>
   );
 }
}*/


class follow extends Component {
  static navigationOptions = {
    tabBarLabel: 'home',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  }

  constructor(props) {
    super(props);

    this.state = {
      //用户登录信息
      token: null,
      uid: null ,
      islogin: false,
      //列表控制
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      //
      data: [],
    };
  };

  componentWillMount() {

    const { params } = this.props.navigation.state;
    this.state.token = params.token;
    this.state.uid = params.uid;
    this.state.islogin = params.islogin;

    /*
    this.setState({
      token: this.props.state.token,
      uid: this.props.state.uid,
      islogin: this.props.state.islogin,
    },this.makeRemoteRequest);*/
  };

  componentDidMount() {
    this.makeRemoteRequest();

  };

  makeRemoteRequest = () => {
    const { token, uid } = this.state;
    const url = Service.BaseUrl+`?a=follow&v=${Service.version}&token=${token}&uid=${uid}`;


    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

      if(!responseJson.status){
        this.setState({data: responseJson.data});
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,refreshing: false,}))
    .catch(err => {console.log(err) ; this.setState({loading: false,refreshing: false})})
  };



  //收藏
  delfollow = (id) =>{
    const { token,uid, } = this.state;
    const url = Service.BaseUrl+`?a=follow&m=del&token=${token}&uid=${uid}&id=${id}&v=${Service.version}`;
    console.log(url);
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

      if(!responseJson.status){
        alert(I18n.t('success.delete'));
      }
      else{
        alert(I18n.t('error.delete_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,}))
    .then(() => this.makeRemoteRequest())
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
          height: 1,
          width: "95%",
          backgroundColor: "#e5e5e5",
          marginLeft: "5%"
        }}
      />
    );
  };

  renderFooter = () => {


    return (
      <View
        style={{
          width: width,
          height: 1,
          backgroundColor: '#e5e5e5',
        }}
      >

      </View>
    );
  };

  render() {
    //console.log(this.state.data);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
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
              {I18n.t('follow.follow')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </View>
        {/*
        <List containerStyle={{borderWidth: 1,borderColor: '#e5e5e5',marginTop: 0,flex: 1}}>
          <FlatList
            style={{flex: 1,backgroundColor: 'red'}}
            data={this.state.data}

            renderItem={({ item }) => {
              <Interactable.View
                style={{height: 40,width: width+50,flexDirection: 'row',alignItems: 'center',backgroundColor: '#FFFFFF'}}
                horizontalOnly={true}
                key={item.id}
                snapPoints={[{x: 0}, {x: -50}]}
                >
                  <ListItem
                    //roundAvatar
                    titleStyle={styles.title}
                    key={item.id}
                    title={item.name}
                    rightIcon={<View></View>}
                    //avatar={{ uri:Service.BaseUri+item.face }}
                    //avatarContainerStyle={{height:60,width:60}}
                    //avatarStyle={{height:60,width:60}}
                    containerStyle={[styles.listContainerStyle,{height: 40,width: width,backgroundColor: 'blue'}]}
                    onPress={() => {
                      Alert.alert(
                        I18n.t('follow.choose'),
                        '',
                        [
                          {
                            text: I18n.t('follow.go'),
                            onPress: () => {
                                const params = {
                                  token: this.state.token,
                                  uid: this.state.uid,
                                  islogin: this.state.islogin,
                                  uuid: item.uuid,
                                };
                                navigate('user',params);
                            }
                           },
                          {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: I18n.t('common.delete'), onPress: () => this.delfollow(item.id)},
                        ],
                        { cancelable: false }
                      )
                    }}
                  />
                  <View style={{height: 40,width: 50,flexDirection: 'column',alignItems: 'center',backgroundColor: '#f1a073'}}>
                    <Icon
                      name='delete'
                      color='#FFFFFF'
                    />
                  </View>
              </Interactable.View>
            }}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
            //ListFooterComponent={this.renderFooter}
            //onRefresh={this.handleRefresh}
            //refreshing={this.state.refreshing}
            //onEndReached={this.handleLoadMore}
            //onEndReachedThreshold={50}
          />
        </List>*/}
        <List containerStyle={{borderWidth: 1,borderColor: '#e5e5e5',marginTop: 0,flex: 1}}>
          <FlatList
            style={{flex: 1}}
            data={this.state.data}
            renderItem={({item}) => (
              <Interactable.View
                component={TouchableOpacity}
                style={{height: 50,width: width+50,flexDirection: 'row',alignItems: 'center',backgroundColor: '#FFFFFF'}}
                horizontalOnly={true}
                key={item.id}
                snapPoints={[{x: 0}, {x: -50}]}
                >
                <ListItem
                  roundAvatar
                  avatar={{ uri:Service.BaseUri+item.face }}
                  title={item.name}
                  titleStyle={styles.title}
                  containerStyle={[styles.listContainerStyle,{height: 50,width: width,alignSelf: 'center'}]}
                  rightIcon={<View></View>}
                  onPress={() => {
                              const params = {
                              token: this.state.token,
                              uid: this.state.uid,
                              islogin: this.state.islogin,
                              uuid: item.uuid,
                            };
                            navigate('user',params);
                   }}
                />
                <View style={{height: 50,width: 50,backgroundColor: '#f1a073',flexDirection: 'column',justifyContent: 'center'}}>
                  <Icon
                    style={{alignSelf: 'center'}}
                    name='delete'
                    color='#FFFFFF'
                    size={30}
                    onPress={() => this.delfollow(item.id)}
                  />
                </View>
              </Interactable.View>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
          />
        </List>
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
        backgroundColor: '#f2f2f2'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  },
  choosebar: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#fbe994',
    width: 120,
  },
  choosebar2: {
    height: 26,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 0,
    backgroundColor: '#f3456d'
  },

  icon: {
     width: 25,
     height: 25,
  },
  title: {
    color: '#333333',
    fontSize: 16,
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
    //height: 50,
    //width: 200,
  },
  navi: {
    width:32,
    height:32,
    alignSelf:'flex-end',
    marginTop:30,
    marginRight:30,
    backgroundColor: 'red'
  },
});
export default follow;
