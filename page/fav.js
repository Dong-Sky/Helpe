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
    const { token, uid, page } = this.state;
    const url = Service.BaseUrl+Service.v+`/fav?t=${token}&page=${page}&per-page=20`;
    console.log(url);


    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(res => {
      console.log(res);
      if(!parseInt(res.status)){
        this.setState({
          data: page === 1 ? res.data.data : [...this.state.data, ...res.data.data],
          loading: false,
          refreshing: false
        });
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+res.err);
      }
    })
    .then(() => this.setState({loading: false,refreshing: false}))
    .catch(err => {console.log(err) ; this.setState({loading: false,refreshing: false})})
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


  //收藏
  delfav = (id) =>{
    const { token,uid, } = this.state;
    const url = Service.BaseUrl+Service.v+`/fav/del?t=${token}`;
    const body = `id=${id}`;
    console.log(url);
    this.setState({loading: true})
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: body,
    })
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
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#fd586d'
              size={36}
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
        </View>
        <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#f2f2f2' ,marginTop: 0,borderColor: '#e5e5e5'}}>
          <FlatList
            style={{marginTop: 0,borderWidth: 0}}
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.id}
                title={item.iteminfo.name}
                subtitle={formatDate(item.ct)}
                rightTitle={item.flag==0?I18n.t('fav.underline'):I18n.t('fav.online')}
                avatar={{ uri:Service.BaseUri+item.iteminfo.img  }}
                avatarContainerStyle={{height:60,width:60}}
                avatarStyle={{height:60,width:60}}
                containerStyle={[{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',marginTop: 20,borderRadius: 15,width: width-20,marginLeft: 10,marginRight: 10},styles.shadow]}
                onPress={() => {
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
            )}
            keyExtractor={item => item.id}
            //ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
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
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
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
  shadow: {
    shadowColor:'black',
    shadowOffset:{height:0,width:0},
    shadowRadius: 1,
    shadowOpacity: 0.4,
  }
});
export default fav;
