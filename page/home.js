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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import MapView from 'react-native-maps';
import ModalDropdown from 'react-native-modal-dropdown';
import Service from '../common/service';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
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


class home1 extends Component {
  static navigationOptions = {
    tabBarLabel: 'home',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      token:null,
      uid:null,
      islogin:false,
      region:{
        latitude: 35.707091,
        longitude: 139.766671,
        latitudeDelta: 0.00629157290689264,
        longitudeDelta: 0.004999999999881766,
      },
      myLocation: {
        latitude: 35.707091,
        longitude: 139.766671,
      },
      locate: true,
      //列表控制
      searchtp: 1,
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      tp: 0,
      //页面
      bubble: [],
      modalVisible: false,
      item: null,
    };
  };


  componentWillMount(){
    this.getLoginState();
    this.getLocation();
  };

  componentDidMount() {

  };

  onRegionChange = (region) => {
    //this.setState({ region });
    this.state.region = region;
    //this.getItemList();
  };

  locate() {
    this.setState({locate:true})
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
      this.state.token = ret.token;
      this.state.uid = ret.uid;
        console.log(ret);
      }
    )
    .catch(error => {
      console.log(error);
    })
  };

  getLocation = () => {
     navigator.geolocation.getCurrentPosition(
         location => {
           console.log(location);
           var region = {
             latitude: location.coords.latitude,
             longitude: location.coords.longitude,
             latitudeDelta: 0.00629157290689264,
             longitudeDelta: 0.004999999999881766,
           };
           /*this.state.region = {

           }; */
           //this.setState({ region });
           /*this.state.region = region;
           this.state.myLocation = region;
           this.getItemList();*/
           this.setState({ region });
         },
         error => {
           console.log("获取位置失败："+ error);
         },
     );

  };

  getItemList = () => {
    console.log(this.state);
    const { token,uid,page,region,searchtp,tp } = this.state;

    //计算屏幕范围
    const minlat = region.latitude-0.5*region.latitudeDelta;
    const maxlat = region.latitude+0.5*region.latitudeDelta;
    const minlng = region.longitude-0.5*region.longitudeDelta;
    const maxlng = region.longitude+0.5*region.longitudeDelta;

    const url = Service.BaseUrl+`?a=item&v=${Service.version}&token=${token}&uid=${uid}&searchtp=${searchtp}&minlat=${minlat}&maxlat=${maxlat}&minlng=${minlng}&maxlng=${maxlng}&ps=10&tp=${tp}`;
    console.log(url);
    this.setState({ loading: true, });
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log(res.data);
        this.setState({
          data: res.data.data,
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

  reget = (tp) => {
    this.state.tp = tp;
    this.getItemList();
  }
  //以下定义页面元素
  returnBubble = () => {
    const { data } = this.state;
    var bubble = [];
    for(i=0; i<data.length ; i++){
      var uri = Service.BaseUri+data[i].img
      bubble[i] = (
        <MapView.Marker
          key={i}
          coordinate={{ latitude: parseFloat(data[i].lat),longitude: parseFloat(data[i].lng) }}
          onPress={() => {
            this.setState({
              modalVisible: true,
            });
          }}
        >
          <Image
            style={styles.bubble}
            source={{ uri: uri }}
          />
        </MapView.Marker>
      );
    }
    console.log(bubble);
    return bubble;
  };

  returnModal = () => {
    return(
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {console.log('close');}}
        >
          <TouchableOpacity style={styles.modal} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#FFFFFF',width:0.84*width,height: 60,marginBottom: 60,alignSelf: 'center',}} onPress={() => alert('hello')}>
            </TouchableOpacity>
          </TouchableOpacity>
      </Modal>
    );
  };

  controlChooseBarStyle = (tp) => {
    if(this.state.tp==tp){
      return {backgroundColor: '#5c492b'};
    }
    else{
      return {};
    }
  };

  controlFontStyle = (tp) => {
    if(this.state.tp==tp){
      return {color: '#FFFFFF'};
    }
    else{
      return {};
    }
  };

  render() {
    console.log(this.state);
    const {params} = this.props.navigation.state;
    const {navigate} = this.props.navigation;
    return (
        <View style = {styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={styles.header}>
            <Text
              onPress={() => this.getItemList()}
              style={{marginLeft:10,}}
              >
              搜索
            </Text>
            <View style={{flex:1,alignItems: 'center'}}>
              <View style={{width: 120,height: 30,borderWidth: 2, borderColor: '#5c492b',flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.choosebar,this.controlChooseBarStyle(0)]} onPress={() => this.reget(0)}>
                  <Text style={[this.controlFontStyle(0)]}>
                    Service
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choosebar,this.controlChooseBarStyle(1)]} onPress={() => this.reget(1)}>
                  <Text style={[this.controlFontStyle(1)]}>
                    Ask
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              onPress={() => navigate('itemList',{
                token:this.state.token,
                uid: this.state.uid,
                islogin: this.state.islogin,
              })}
              style={{marginRight:10,}}
              >
              列表
            </Text>
          </View>
          <View style={{flex:1}}>
            <MapView
              style={[styles.map,{flexDirection: 'row',justifyContent:'flex-start'}]}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
              showsUserLocation={true}
              showsBuildings={true}
              loadingEnabled={true}
              liteMode={true}
              userLocationAnnotationTitle='myLocation'
              //followsUserLocation={this.state.locate}
              showsMyLocationButton={true}
              onRegionChangeComplete={() => {this.getItemList()}}
              scrollEnabled={true}
              onPanDrag={() => console.log('onPanDrag')}
            >
              <TouchableOpacity style={{marginLeft:5}}>
                <Icon
                  name={'my-location'}
                  size={35}
                  color='#fbe994'
                  style={{alignSelf:'flex-start',marginRight:10,marginTop:10,padding:5}}
                  onPress={() => this.getLocation()}
                 />
              </TouchableOpacity>

               <MapView.Marker coordinate={this.state.myLocation}/>
               {this.returnBubble()}
            </MapView>
            {this.returnModal()}
          </View>
      </View>
  );
  }
}

class itemList extends Component {
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
      myLocation: {
        latitude: null,
        longitude: null,
      },
      region:{
        latitude: 35.707091,
        longitude: 139.766671,
        latitudeDelta: 0.00629157290689264,
        longitudeDelta: 0.004999999999881766,
      },
      //列表控制
      tp: 0,
      cid: null,
      searchtp: 2,
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      //
      category: [],
      DropTp: ['全部','服务','求助'],
      type: ['全部'],
      data: [],
      sorttp: ['距离排序','时间排序','销量排序'],
    };
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      token: params.token,
      uid: params.uid,
      islogin: params.uid,
    });
    this.getItemCategory();
  };

  componentDidMount() {
    this.getLocationAndItemList();
  };

  getLocationAndItemList = () => {
    console.log(this.state);
     navigator.geolocation.getCurrentPosition(
         location => {
           console.log(location);
           var region = {
             latitude: location.coords.latitude,
             longitude: location.coords.longitude,
             latitudeDelta: 0.00629157290689264,
             longitudeDelta: 0.004999999999881766,
           };
           /*this.state.region = {

           }; */
           //this.setState({ region });
           this.state.region = region;
           this.makeRemoteRequest();
         },
         error => {
           console.log("获取位置失败："+ error);
         },
     );

  };

  //获取商品类型
  getItemCategory = () => {
    const url = Service.BaseUrl+`?a=category&v=${Service.version}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        console.log(responseJson.data.data);
        var category = responseJson.data.data;
        var type = ['全部'];
        for(i=0;i<category.length;i++){
          type.push(category[i].name);
        }
        this.state.category = category;
        this.state.type = type;
      }
      else {
        alert('请求错误');
      }
    })
    .catch(err => console.log(error))
  };

  makeRemoteRequest = () => {
    const { token,uid,page,searchtp,region,tp } = this.state;
    const minlat = region.latitude-20.0;
    const maxlat = region.latitude+20.0;
    const minlng = region.longitude-20.0;
    const maxlng = region.longitude+20.0;

    const url = Service.BaseUrl+`?a=item&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&searchtp=${searchtp}&minlat=${minlat}&maxlat=${maxlat}&minlng=${minlng}&maxlng=${maxlng}&tp=${tp}`;
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

  returnType = () => {
    return (this.state.type)
  }

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
      <View style={{marginBottom: 2,}}>
        <SearchBar
            round
            lightTheme
            placeholder="input something plz"
            containerStyle={{marginBottom: 0}}
            inputStyle={{backgroundColor: '#f2f2f2',color: '#333333'}}
          />
          <View style={styles.choosebar2}>
            <ModalDropdown
              style={styles.Dropdown}
              textStyle={styles.DropText}
              dropdownStyle={styles.Dropdown2}
              dropdownTextHighlightStyle={styles.highlight}
              options={this.state.DropTp}
              defaultValue={this.state.DropTp[0]}
              defaultIndex={0}
            />
            <ModalDropdown
              style={styles.Dropdown}
              textStyle={styles.DropText}
              dropdownStyle={styles.Dropdown2}
              dropdownTextHighlightStyle={styles.highlight}
              options={this.state.type}
              defaultValue={this.state.type[0]}
              defaultIndex={0}
            />
            <ModalDropdown
              style={styles.Dropdown}
              textStyle={styles.DropText}
              dropdownStyle={styles.Dropdown2}
              dropdownTextHighlightStyle={styles.highlight}
              options={this.state.sorttp}
              defaultValue={this.state.sorttp[0]}
              defaultIndex={0}
            />
            <ModalDropdown
              style={styles.Dropdown}
              textStyle={styles.DropText}
              dropdownStyle={styles.Dropdown2}
              dropdownTextHighlightStyle={styles.highlight}
              options={this.state.DropTp}
              defaultIndex={0}
            />
          </View>
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
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0,flex:1, }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View>
              <ListItem
                component={TouchableOpacity}
                roundAvatar
                key={item.id}
                title={item.name}
                subtitle={'开始:'+formatDate(item.t)+'\n'+'相距:'+getDisance(this.state.region.latitude,this.state.region.longitude,item.lat,item.lng)+'m'}
                rightTitle={item.u=='""'||item.u==null? item.price+'圆':item.price+'圆/'+item.u}
                avatar={{ uri:Service.BaseUri+item.img  }}
                avatarStyle ={{height:74,width:74}}
                containerStyle={{ borderBottomWidth: 0 }}
                onPress={() => navigate('itemDetail',{
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  itemId: item.id,
                })}
              />
              </View>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
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

const home = StackNavigator({
  home1:  { screen:  home1  },
  itemList: { screen: itemList  },
}, {
    initialRouteName: 'home1', // 默认显示界面
    navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
      headerStyle:{
        backgroundColor:'#333333',
      },
      cardStack: {
          gesturesEnabled: true,
      }
    },
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'none', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        alignItems: 'stretch'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  StatusBar:  {
    height:22,
    backgroundColor:'#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
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
    marginTop: 0
  },
  Dropdown: {
    alignSelf: 'center',
    height: 22,
    borderWidth: 2,
    borderColor: '#e1e8e2',
    width: '25%',
  },
  Dropdown2: {
    width: width/4,
  },
  DropText: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  highlight: {
    color: '#fbe994'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
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
  bubble: {
    height: 62,
    width: 62,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
export default home;
