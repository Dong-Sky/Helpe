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
<<<<<<< Updated upstream
=======
  Alert,
>>>>>>> Stashed changes
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';



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



class fav extends Component {
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
    this.makeRemoteRequest();
  };

  componentDidMount() {
  };

  makeRemoteRequest = () => {
    const { token, uid } = this.state;
    const url = Service.BaseUrl+`?a=fav&v=${Service.version}&token=${token}&uid=${uid}`;
<<<<<<< Updated upstream
    console.log(url);
=======
    
>>>>>>> Stashed changes

    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({data: responseJson.data});
      }
      else{
<<<<<<< Updated upstream
        alert('请求失败\n'+'错误原因: '+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {console.log(err) ; this.setState({loading: false})})
=======
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,refreshing: false}))
    .catch(err => {console.log(err) ; this.setState({loading: false,refreshing: false})})
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  //收藏
  delfav = (id) =>{
    const { token,uid, } = this.state;
    const url = Service.BaseUrl+`?a=fav&m=del&token=${token}&uid=${uid}&id=${id}&v=${Service.version}`;
    console.log(url);
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert(I18n.t('success.delete'));
      }
      else{
        alert(I18n.t('error.delete_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
    .then(() => this.makeRemoteRequest())
    .catch(err => {console.log(err);this.setState({loading: false})})
  };


>>>>>>> Stashed changes

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
<<<<<<< Updated upstream
          backgroundColor: "#CED0CE",
=======
          backgroundColor: "#e5e5e5",
>>>>>>> Stashed changes
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
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    console.log(this.state);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
<<<<<<< Updated upstream
=======
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
              {I18n.t('fav.fav')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
>>>>>>> Stashed changes
        </View>
        <List containerStyle={{ borderTopWidth: 1,flex:1,backgroundColor: '#FFFFFF' ,marginTop: 0,borderColor: '#e5e5e5'}}>
          <FlatList
            style={{marginTop: 0,borderWidth: 0}}
            data={this.state.data}
            renderItem={({ item }) => (
<<<<<<< Updated upstream
              <View>
=======
>>>>>>> Stashed changes
              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.id}
                title={item.name}
<<<<<<< Updated upstream
                subtitle={'开始:'+formatDate(item.t)+'\n'+'相距:'+(item.juli)+'m'}
                rightTitle={item.u=='""'||item.u==null? item.price+'圆':item.price+'圆/'+item.u}
=======
                subtitle={formatDate(item.t)}
                rightTitle={item.flag==0?I18n.t('fav.underline'):I18n.t('fav.online')}
>>>>>>> Stashed changes
                avatar={{ uri:Service.BaseUri+item.img  }}
                avatarContainerStyle={{height:60,width:60}}
                avatarStyle={{height:60,width:60}}
                containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF'}}
                onPress={() => {
<<<<<<< Updated upstream
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    itemId: item.itemid,
                  };
                  if(item.tp==0){
                    navigate('itemDetail_Service',params);
                  }
                  else if(item.tp==1){
                    navigate('itemDetail_Ask',params);
                  }
                }}
              />
              </View>
=======
                  Alert.alert(
                    I18n.t('fav.choose'),
                    '',
                    [
                      {
                        text: I18n.t('fav.go'),
                        onPress: () => {
                            const params = {
                              token: this.state.token,
                              uid: this.state.uid,
                              islogin: this.state.islogin,
                              itemId: item.itemid,
                            };
                            if(item.tp==0){
                              navigate('itemDetail_Service',params);
                            }
                            else if(item.tp==1){
                              navigate('itemDetail_Ask',params);
                            }
                        }
                       },
                      {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: I18n.t('fav.del'), onPress: () => this.delfav(item.id)},
                    ],
                    { cancelable: false }
                  )
                }}
              />
>>>>>>> Stashed changes
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
<<<<<<< Updated upstream
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
=======
            //ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            //onEndReached={this.handleLoadMore}
>>>>>>> Stashed changes
            onEndReachedThreshold={50}
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
        backgroundColor: '#FFFFFF'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  StatusBar:  {
    height:22,
<<<<<<< Updated upstream
    backgroundColor:'#f3456d',
=======
    backgroundColor:'#FFFFFF',
>>>>>>> Stashed changes
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< Updated upstream
    backgroundColor: '#f3456d',
=======
    backgroundColor: '#FFFFFF',
>>>>>>> Stashed changes
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
  navi: {
    width:32,
    height:32,
    alignSelf:'flex-end',
    marginTop:30,
    marginRight:30,
    backgroundColor: 'red'
  },
});
export default fav;
