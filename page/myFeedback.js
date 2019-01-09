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
import { List, ListItem,Icon,Button,Avatar,SearchBar,Rating } from 'react-native-elements';
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




class myFeedback extends Component {
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
    this.getMyFeedback()
  };

  componentDidMount() {
  };

  getMyFeedback = () => {
    const { token, uid } = this.state;
    const url = Service.BaseUrl+Service.v+`/feedback/aboutme?t=${token}&page=1&per-page=${50}`;
    console.log(url);

    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!parseInt(responseJson.status)){
        this.setState({data: responseJson.data.data});
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false,refreshing: false}))
    .catch(err => {console.log(err) ; this.setState({loading: false,refreshing: false,})})
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
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  returnAvatarSource = (face) => {
    var source;
    if(!face){
      source = require('../icon/person/default_avatar.png');
    }
    else{
      source = {uri: Service.BaseUri+face};
    }
    return source;
  };

  returnWork = () => {
    var str = '';
    if(this.state.user.work!=''&&this.state.user.occ!=''){
      str = this.state.user.occ+'/'+this.state.user.work;
    }
    else if(this.state.user.work!=''){
      str = this.state.user.work;
    }
    else if(this.state.user.occ!=''){
      str = this.state.user.occ;
    }
    return str;
  };

  render() {
    console.log(this.state);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <Image style={styles.header} source={require('../icon/account/bg.png')}>
          <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
            <Icon
              style={{marginLeft: 5}}
              name='chevron-left'
              color='#FFFFFF'
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',fontSize: 18,color: '#FFFFFF'}}>
              {I18n.t('myFeedback.myFeedback')}
            </Text>
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
          </View>
        </Image>
        <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#FFFFFF' ,marginTop: 0}}>
          <FlatList
            style={{marginTop: 0,borderWidth: 0}}
            data={this.state.data}
            renderItem={({ item }) => (
              <View>
                <ListItem
                  component={TouchableOpacity}
                  roundAvatar
                  key={item.id}
                  title={item.username?item.username:I18n.t('common.no_name')}
                  rightTitle={formatDate(item.ct)}
                  avatar={this.returnAvatarSource(item.face)}
                  onPress={() => {
                    const params = {
                      token: this.state.token,
                      uid: this.state.uid,
                      islogin: this.state.islogin,
                      order: {
                          id: item.orderid,
                      },
                    };
                    if(item.itemtype==0){
                      navigate('myOrderDetail_Service',params);
                    }
                    else if(item.itemtype==1){
                      navigate('myOrderDetail_Ask',params);
                    }
                  }}
                  avatarContainerStyle={{height:32,width:32}}
                  avatarStyle={{height:32,width:32}}
                  containerStyle={styles.listContainerStyle}
                />
                <View style={{marginLeft: 15,flexDirection: 'row',alignItems: 'center'}}>
                  <Rating
                    type="heart"
                    readonly
                    ratingCount={5}
                    fractions={1}
                    startingValue={(item.score/20).toFixed(1)}
                    imageSize={20}
                  />
                  <Text style={{marginLeft: 5,color: '#fd586d',fontSize: 14}}>
                    ({(item.score/20).toFixed(1)})
                  </Text>
                </View>
                <Text style={{color: '#333333',fontSize: 14,marginLeft: 15,marginRight: 15,marginBottom: 10,marginTop: 5}}>
                  {item.content}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            //onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            //onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <View style={{height: 1,backgroundColor: '#e5e5e5'}}></View>
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
    backgroundColor:'#fd586d',
  },
  header: {
    height: 44,
    width: width,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fd586d',
    borderColor: '#e5e5e5',
    borderBottomWidth: 1,
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
  list: {
    marginTop:10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
  },
});
export default myFeedback;
