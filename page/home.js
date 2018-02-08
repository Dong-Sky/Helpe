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
  NetInfo,
  DeviceEventEmitter,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import MapView from 'react-native-maps';
import Modalbox from 'react-native-modalbox';
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


    var d =  parseInt(dis * 6378137);
    if(d<=200){
      return '<200m';
    }
    if(d>200&d<=500){
      return  '<500m';
    }
    else if(d>500&&d<=1000){
      return '<1km';
    }
    else if(d>1000&d<=100000){
      var x = Number(d/1000).toFixed(1);
      return (x.toString()+'km');
    }
    else if(d>100000){
      return '>100km';
    }
    else{
      return '???m';
    }
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
      isDisabled: false,
      item: {},
      modalID: 0,

    };
  };


  componentWillMount(){


    this.getLoginState();

    this.subscription0 = DeviceEventEmitter.addListener('login',
    (e) => {
      //e==0登录,e!=0登出
      if(e){
        this.getLoginState();
      }
      else{
        this.setState({
          token: null,
          uid: null,
          islogin: false,
        })
      }

      }
    );

  };

  componentDidMount() {
    this.getLocation();
  };

  componentWillUnmount() {
    console.log('clear');
    try{
      this.subscription0.remove();

    }catch(e){
      console.log(e);
    }
  };

  onRegionChange = (region) => {
    this.setState({ region },this.getItemList);
    //this.state.region = region;
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

      }
    )
    .catch(error => {
      console.log(error);
    })
  };

  getLocation = () => {
     navigator.geolocation.getCurrentPosition(
         location => {

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
           this.state.myLocation = region;*/
           //this.getItemList();
           this.setState({ region }, this.getItemList);
         },
         error => {

           alert(I18n.t('err.getLocation_failed'));
         },
     );

  };

  getItemList = () => {

    const { token,uid,page,region,searchtp,tp,s } = this.state;
    var d1 = region.latitudeDelta;
    var d2 = region.longitudeDelta;
    if(d1>0.06){
      d1 = 0.03;
    }
    if(d2 = 0.04){
      d2 = 0.02;
    }
    //计算屏幕范围
    const minlat = region.latitude-0.5*d1;
    const maxlat = region.latitude+0.5*d1;
    const minlng = region.longitude-0.5*d2;
    const maxlng = region.longitude+0.5*d2;


    const url = Service.BaseUrl+`?a=item&v=${Service.version}&token=${token}&uid=${uid}&searchtp=${searchtp}&minlat=${minlat}&maxlat=${maxlat}&minlng=${minlng}&maxlng=${maxlng}&ps=10&tp=${tp}`;


    this.setState({ loading: true, });
    fetch(url)
      .then(res => res.json())
      .then(
        res => {

        this.setState({
          data: res.data.data,
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })

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
      var uri = Service.BaseUri+data[i].img;
      let id = i;
      bubble[i] = (
        <MapView.Marker
          key={i}
          coordinate={{ latitude: parseFloat(data[i].lat),longitude: parseFloat(data[i].lng) }}
          onPress={() => {

            this.setState({
              modalVisible: true,
              modalID: id,
            });
          }}
        >

          <Image
            style={styles.bubble}
            source={require('../icon/home/bubble1.png')}
            cover='cover'
          >
          {/*  <Image
              style={styles.bubble}
              source={{ uri: uri }}
              resizeMode="cover"
            />*/}
        </Image>

        </MapView.Marker>
      );
    }

    return bubble;
  };


  returnModal = () => {
    const { navigate } = this.props.navigation;
    //const item = this.state.data[this.state.modalID]?this.state.data[this.state.modalID]:{};
    let item = this.state.item;
    //console.log(this.state.item);
    return (
      <Modalbox
        style={{width:0.84*width,height: 70,marginTop: -20,borderWidth: 1,borderColor: '#e5e5e5',borderRadius: 20,overflow: 'hidden'}}
        isOpen={this.state.modalVisible}
        isDisabled={this.state.isDisabled}
        position='bottom'
        backdrop={false}
        backButtonClose={false}
        swipeToClose={true}
        backdropOpacity={0.1}
        backdropColor='#FFFFFF'
        onClosed={() => this.setState({modalVisible: false})}
        >
          <ListItem
            roundAvatar
            style={{flex: 1}}
            containerStyle={{borderBottomWidth: 0}}
            subtitleStyle={{color: '#fd586d',fontSize: 16}}
            title={item.name}
            rightTitle={getDisance(this.state.region.latitude,this.state.region.longitude,item.lat,item.lng)}
            subtitle={'￥'+item.price}
            //rightTitle={item.u=='""'||item.u==null? '￥'+item.price:'￥'+item.price+'/'+item.u}
            subtitleNumberOfLines={1}
            avatar={item.img==''?'':Service.BaseUri+item.img}
            onPressRightIcon={() => {
              const params = {
                token: this.state.token,
                uid: this.state.uid,
                islogin: this.state.islogin,
                itemId: item.id,
              };
              if(item.tp==0){
                navigate('itemDetail_Service',params);
              }
              else if(item.tp==1){
                navigate('itemDetail_Ask',params);
              }
            }}
            avatarContainerStyle={{height: 50,width: 50}}
            avatarStyle={{height: 50,width: 50}}
            leftIconOnPress={() => alert(123)}
          />
      </Modalbox>
    );
  }

  controlChooseBarStyle = (tp) => {
    if(this.state.tp==tp){
      return {backgroundColor: '#fd586d'};
    }
    else{
      return {};
    }
  };

  controlFontStyle = (tp) => {
    if(this.state.tp==tp){
      return {color: '#FFFFFF',fontSize: 16};
    }
    else{
      return {color: '#fd586d',fontSize: 16};
    }
  };


  render() {
    const {params} = this.props.navigation.state;
    const {navigate} = this.props.navigation;
    return (
        <View style = {styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={[styles.header,{height: 44}]}>
            <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',marginLeft: 10}}>
              <Icon
                style={{}}
                name='refresh'
                color='#fd586d'
                size={28}
                onPress={() => this.getItemList()}
              />
            </View>
            <View style={{flex:1,alignItems: 'center'}}>
              <View style={{width: 160,height: 30,borderWidth: 2, borderColor: '#fd586d',flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.choosebar,this.controlChooseBarStyle(0)]} onPress={() => this.reget(0)}>
                  <Text style={[this.controlFontStyle(0)]}>
                    {I18n.t('home.Service')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choosebar,this.controlChooseBarStyle(1)]} onPress={() => this.reget(1)}>
                  <Text style={[this.controlFontStyle(1)]}>
                    {I18n.t('home.Ask')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',marginRight: 10}}>
              <Icon
                style={{}}
                name='playlist-play'
                color='#fd586d'
                size={32}
                onPress={() => navigate('itemList',{
                  token:this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                })}
              />
            </View>
          </View>
          <View style={{flex:1}}>
            <MapView
              style={[styles.map,{flexDirection: 'column',justifyContent:'flex-start',alignItems: 'flex-start'}]}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
              showsUserLocation={true}
              showsBuildings={true}
              loadingEnabled={true}
              liteMode={true}
              userLocationAnnotationTitle='myLocation'
              //followsUserLocation={this.state.locate}
              showsMyLocationButton={true}
              //onRegionChangeComplete={() => {this.getItemList()}}
              scrollEnabled={true}
              onPanDrag={() => console.log('onPanDrag')}
            >
              <TouchableOpacity style={{height: 50,width: 50,}} onPress={() => {this.setState({modalVisible: false,modalID: 0});this.getLocation()}}>
                <Image
                  source={require('../icon/tarbar/locate.png')}
                  style={{height: 50,width: 50}}
                />
              </TouchableOpacity>
              <MapView.Marker coordinate={this.state.myLocation}/>
              {
                this.state.data.map((l,i) => (
                  <MapView.Marker
                    key={i}
                    coordinate={{ latitude: parseFloat(l.lat),longitude: parseFloat(l.lng) }}
                    onPress={() => this.setState({
                      item: l,
                      modalVisible: true,
                    })}
                  >

                    <Image
                      style={styles.bubble}
                      source={require('../icon/home/bubble.png')}
                      resizeMode='cover'
                      overflow='hidden'
                    >

                        <TouchableOpacity style={{height: 71,width: 71,borderRadius: 36,marginTop: -5,overflow: 'hidden'}}>
                            <Image
                              style={{flex: 1,overflow: 'hidden'}}
                              source={{ uri: Service.BaseUri+l.img }}
                              resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </Image>
                  </MapView.Marker>
              ))
            }
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
      tp: -1,
      cid: 0,
      searchtp: 1,
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      a: false,
      b: false,
      c: false,
      //
      category: [],
      DropTp: [I18n.t('home.all'),I18n.t('home.Service'),I18n.t('home.Ask')],
      stp: [I18n.t('home.near'),I18n.t('home.more_far'),I18n.t('home.all')],
      type: [],
      data: [],
      sorttp: [I18n.t('home.sortByT'),I18n.t('home.sortByD'),I18n.t('home.sortByS')],
      s: 0,
      //模糊匹配
      modalVisible: false,
      isDisabled: false,
      txt: null,
      fuzzyData: [],
      refreshing1: false,

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

    this.subscription0 = DeviceEventEmitter.addListener('login',
    (e) => {
      //e==0登录,e!=0登出
      if(e){
        this.getLoginState();
      }
      else{
        this.setState({
          token: null,
          uid: null,
          islogin: false,
        })
      }

      }
    );
  };

  componentDidMount() {
    this.getLocationAndItemList();
  };

  componentWillUnmount() {
    console.log('clear');
    try{
      this.subscription0.remove();

    }catch(e){
      console.log(e);
    }
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

      }
    )
    .catch(error => {
      console.log(error);
    })
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
        var type = [{name: I18n.t('home.all'),id: 0}];
        type = type.concat(category);
        this.state.category = category;
        this.state.type = type;
      }
      else {
        alert(I18n.t('err.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .catch(err => console.log(error))
  };

  makeRemoteRequest = () => {
    const { token,uid,page,searchtp,region,tp,cid,s } = this.state;
    //

    const lat = region.latitude;
    const lng = region.longitude;

    var d1 = 0.05;
    var d2 = 0.05;
    if(s==0){
      d1 = 0.05;
      d2 = 0.05;
    }
    else if (s==1){
      d1 = 0.4;
      d2 = 0.4;
    }

    const minlat = region.latitude-d1;
    const maxlat = region.latitude+d1;
    const minlng = region.longitude-d2;
    const maxlng = region.longitude+d2;
    var url1 = '';
    if(s!=2){
      url1 = `&minlat=${minlat}&maxlat=${maxlat}&minlng=${minlng}`;
    }



    var url;
    if(searchtp==1){
      url = Service.BaseUrl+`?a=item&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&searchtp=${searchtp}&lat=${lat}&lng=${lng}&tp=${tp}&cid=${cid==0?null: cid}`;
    }
    else{
      url = Service.BaseUrl+`?a=item&v=${Service.version}&token=${token}&uid=${uid}&p=${page}&ps=10&searchtp=${searchtp}&tp=${tp}&cid=${cid==0?null:cid}`;
    }
    url = url+url1;

    this.setState({ loading: true, });
    fetch(url)
      .then(res => res.json())
      .then(
        res => {

        this.setState({
          data: page === 1 ? res.data.data : [...this.state.data, ...res.data.data],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })

      .catch(error => {
        console.log(error);
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

  //模糊匹配

  fuzzy_matching = () => {
      const { token,uid,txt,region } = this.state;
      const lat = region.latitude;
      const lng = region.longitude;
      const url = Service.BaseUrl+`?a=item&v=${Service.version}&name=${txt}`;

      this.setState({loading: true});
      fetch(url)
        .then(res => res.json())
        .then(
          res => {

          this.setState({
            fuzzyData:res.data.data ,
            loading: false,
          });
        })
        .then(() => console.log(this.state.data))
        .catch(error => {
          console.log(error);
          this.setState({ error, loading: false });
        });
  };

  handleRefresh1 = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.fuzzy_matching();
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

renderModal = () => {
  const { navigate } = this.props.navigation;
  return(
    <Modalbox

      isOpen={this.state.modalVisible}
      isDisabled={this.state.isDisabled}
      position='center'
      backdrop={true}
      backButtonClose={false}
      swipeToClose={false}
      onClosed={() => this.setState({modalVisible: false})}
      >
        <View style={styles.container}>
          <View style={[styles.StatusBar,{}]}>
          </View>
          <View style={[styles.header,{height: 34,}]}>
            <View style={{flex: 1,height: 34,width: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start',}}>
              <View style={{marginLeft: 5}}>
                <Icon
                  style={{}}
                  name='keyboard-arrow-left'
                  color='#fd586d'
                  size={36}
                  onPress={() => this.setState({modalVisible: false,fuzzyData: [],txt: null,})}
                />
              </View>
            </View>
            <View style={{height: 34,width: width-80,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
              <TextInput
                style={{height: 24,width: width-80-20,borderRadius: 14,backgroundColor: '#f3f3f3',borderColor: '#e5e5e5',borderWidth: 1,marginRight: 5,marginLeft: 5,paddingLeft: 14,fontSize: 14,marginTop: 5,}}
                placeholder={I18n.t('home.default_txt')}
                placeholderTextColor='#999999'
                returnKeyType='done'
                clearButtonMode='always'
                value={this.state.txt}
                onChangeText={(txt) => this.setState({txt})}
                autoFocus={true}
              />
            </View>
            <View style={{height: 34,width: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
              <View style={{marginRight: 10}}>
                <Icon
                  name='search'
                  color='#fd586d'
                  size={28}
                  onPress={() => this.fuzzy_matching()}
                />
              </View>
            </View>
          </View>
          <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#f3f3f3' ,marginTop: 0}}>
            <FlatList
              style={{marginTop: 0,borderWidth: 0}}
              data={this.state.fuzzyData}
              renderItem={({ item }) => (
                <View>
                <ListItem
                  component={TouchableOpacity}
                  roundAvatar
                  key={item.id}
                  title={item.name}
                  subtitle={I18n.t('home.salenum')+': '+item.salenum+I18n.t('home.e')+'\n'+I18n.t('home.far')+': '+getDisance(this.state.region.latitude,this.state.region.longitude,item.lat,item.lng)}
                  subtitleNumberOfLines={2}
                  rightTitle={item.u=='""'||item.u==null? '￥'+item.price:'￥'+item.price+'/'+item.u}
                  avatar={{ uri:Service.BaseUri+item.img  }}
                  avatarContainerStyle={{height:50,width:50}}
                  avatarStyle={{height:50,width:50}}
                  rightTitleStyle={{color: '#f1a073'}}
                  containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF'}}
                  onPress={() => {
                    const params = {
                      token: this.state.token,
                      uid: this.state.uid,
                      islogin: this.state.islogin,
                      itemId: item.id,
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
              )}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              //ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              onRefresh={() => this.handleRefresh1}
              refreshing={this.state.refreshing1}

              onEndReachedThreshold={50}
            />
          </List>
        </View>
    </Modalbox>
  );
  };

  CateStyle = (bool) => {

    if(bool){

      return { color: '#fd586d'}
    }
    else{
      return {color: '#999999'}
    }


  }

  CateStyle1 = (bool) => {

    if(bool){

      return {borderColor: '#fd586d'}
    }
    else{
      return {borderColor: '#FFFFFF'}
    }

  }

  renderRow(rowData, rowID, highlighted) {
  let icon = highlighted ? <Image style={{height: 30,width: 30}} source={require('../icon/home/ischoosed.png')}/> : <View style={{height: 32,width: 30}}/>;

  return (
    <TouchableOpacity style={{height: 32,flexDirection: 'row',alignItems: 'center'}}>
        <View style={{height: 32,alignItems: 'center',justifyContent: 'center'}}>
          {
            icon
          }
        </View>
        <Text style={highlighted? styles.highlight:styles.DropText}>
          {rowData}
        </Text>
    </TouchableOpacity>
  );
}



  render() {

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={[styles.StatusBar,{}]}>
        </View>
        <View style={[styles.header,{height: 34,borderWidth: 0,borderBottomWidth: 0}]}>
          <View style={{height: 34,width: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>

            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../icon/home/map.png')}
                style={{height: 24,width: 24,marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={{height: 34,width:width-2*40,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: true})}>
              <View style={{flexDirection: 'row',height: 24,width:width-2*40-20,borderRadius: 14,backgroundColor: '#f3f3f3',alignItems: 'center'}}>
                <Image
                  source={require('../icon/home/search.png')}
                  style={{height: 24,width: 24,marginLeft: 5}}
                />
                <Text style={{fontSize: 14,color: '#999999'}}>
                  {I18n.t('home.Search')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{height: 34,width: 40,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
              <Icon
                name='search'
                color='#fd586d'
                size={28}
                onPress={() => this.setState({modalVisible: true})}
              />
            </View>
          </View>
        </View>
        <View style={{height: 40,width: width,borderBottomWidth: 1,borderColor: '#fd586d',backgroundColor: '#FFFFFF'}}>
          <ScrollView horizontal={true}>
            {
              this.state.type.map((item,i) => (
                <TouchableOpacity
                  style={[this.CateStyle1(item.id==this.state.cid),{height: 40,borderBottomWidth: 4,marginLeft: 10,marginRight: 10,backgroundColor: '#FFFFFF',justifyContent: 'center',alignItems: 'center'}]}
                  onPress={() => this.setState({cid: item.id},this.makeRemoteRequest)}
                  key={i}

                  >
                  <Text style={[this.CateStyle(item.id==this.state.cid),{fontSize: 14}]} >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>

        </View>
        <View style={{height: 40,width: width,flexDirection: 'row',alignItems: 'center',backgroundColor: '#FFFFFF'}}>
          <View style={{flex: 1,height: 40,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',marginLeft: 10}}>
            <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center'}} onPress={() => {this.refs.a.show();this.setState({a: true})}}>
              <Text style={[this.CateStyle(this.state.a),{fontSize: 14}]} >
                分类
              </Text>
              <Image
                source={this.state.a?require('../icon/home/drop2.png'):require('../icon/home/drop1.png')}
                style={{height: 30,width: 30}}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1,height: 40,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
            <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center'}} onPress={() => {this.refs.b.show();this.setState({b: true})}}>
              <Text style={[this.CateStyle(this.state.b),{fontSize: 14}]} >
                距离
              </Text>
              <Image
                source={this.state.b?require('../icon/home/drop2.png'):require('../icon/home/drop1.png')}
                style={{height: 30,width: 30}}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1,height: 40,flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'center',marginRight: 10}}>
            <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center'}} onPress={() => {this.refs.c.show();this.setState({c: true})}}>
              <Text style={[this.CateStyle(this.state.c),{fontSize: 14}]} >
                排序
              </Text>
              <Image
                source={this.state.c?require('../icon/home/drop2.png'):require('../icon/home/drop1.png')}
                style={{height: 30,width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 0,width: width}}>
          <ModalDropdown
            ref='a'
            style={styles.Dropdown}
            dropdownTextStyle={styles.DropText}
            dropdownStyle={[styles.Dropdown2,{height: 106,}]}
            dropdownTextHighlightStyle={styles.highlight}
            options={this.state.DropTp}
            defaultValue={this.state.DropTp[0]}
            defaultIndex={0}
            renderRow={this.renderRow.bind(this)}
            onSelect={(DropTp) => {
              if(DropTp==0){ this.state.tp = -1; }
              else if(DropTp==1){ this.state.tp = 0 ;}
              else if(DropTp==2){ this.state.tp = 1; }
              this.state.page = 1;
              this.makeRemoteRequest();
            }}
            renderSeparator={() => {
              return (<View style={{height: 1,backgroundColor: '#f3f3f3',width: width}}></View>)
            }}
            onDropdownWillHide={() => this.setState({a: false})}
          />
          <ModalDropdown
            ref='b'
            style={styles.Dropdown}
            dropdownTextStyle={styles.DropText}
            dropdownStyle={[styles.Dropdown2,{height: 106}]}
            dropdownTextHighlightStyle={styles.highlight}
            options={this.state.stp}
            defaultValue={this.state.stp[0]}
            defaultIndex={0}
            renderRow={this.renderRow.bind(this)}
            onSelect={(s) => {
              this.state.s = s;
              this.state.page = 1;
              this.makeRemoteRequest();
            }}
            renderSeparator={() => {
              return (<View style={{height: 1,backgroundColor: '#f3f3f3',width: width}}></View>)
            }}
            onDropdownWillHide={() => this.setState({b: false})}
          />
          <ModalDropdown
            ref='c'
            style={styles.Dropdown}
            dropdownTextStyle={styles.DropText}
            dropdownStyle={[styles.Dropdown2,{height: 106}]}
            dropdownTextHighlightStyle={styles.highlight}
            options={this.state.sorttp}
            defaultValue={this.state.sorttp[1]}
            defaultIndex={1}
            renderRow={this.renderRow.bind(this)}
            onSelect={(sorttp) => {

              /*if(sorttp==0){ this.state.searchtp = 2; }
              else { this.state.searchtp = sorttp-1; }*/

              this.state.searchtp = sorttp;
              this.state.page = 1;
              this.makeRemoteRequest();
            }}
            renderSeparator={() => {
              return (<View style={{height: 1,backgroundColor: '#f3f3f3',width: width}}></View>)
            }}
            onDropdownWillHide={() => this.setState({c: false})}
          />
        </View>

        <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#f3f3f3' ,marginTop: 0,alignSelf: 'center',}}>
          <FlatList
            style={{marginTop: 0,borderWidth: 0,alignSelf: 'center',flex: 1,width: width,}}

            data={this.state.data}
            numColumns={2}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{backgroundColor: '#ffffff',height: 200,width: 0.5*(width-4*8),marginLeft: 8,marginRight: 8,marginBottom: 5,marginTop: 5,borderRadius: 10,overflow:'hidden'}}
                onPress={() => {
                  const params = {
                    token: this.state.token,
                    uid: this.state.uid,
                    islogin: this.state.islogin,
                    itemId: item.id,
                  };
                  if(item.tp==0){
                    navigate('itemDetail_Service',params);
                  }
                  else if(item.tp==1){
                    navigate('itemDetail_Ask',params);
                  }
                }}
                >

                    <Image
                      style={{width:0.5*(width-4*6),alignSelf: 'center',height: 100,overflow:'hidden'}}
                      source={{ uri:Service.BaseUri+item.img }}
                      resizeMode="cover"

                    />
                    <View style={{height: 100,width:0.5*(width-4*8)}}>
                      <View style={{}}>
                        <Text
                          style={{marginLeft: 8,marginRight: 8,marginTop: 4,color: '#333333',fontSize: 14}}
                          numberOfLines={2}
                          >
                            {item.name}
                        </Text>
                       <Text
                          style={{height: 20,marginLeft: 8,marginRight: 8,marginTop: 4,color: '#fd586d',fontSize: 18,}}
                          numberOfLines={1}
                          >
                            {'￥'+item.price}
                        </Text>
                      </View>
                      <View style={{flex: 1,width: 0.5*(width-4*8),flexDirection: 'row',justifyContent: 'flex-start',}}>
                        <View style={{marginLeft: 10,marginBottom: 5,flex: 4,flexDirection: 'column',justifyContent: 'flex-end' }}>
                         <Text
                            style={{fontSize: 12,color: '#999999',}}
                            numberOfLines={1}
                          >
                            {item.tp==0?I18n.t('home.Service'):I18n.t('home.Ask')}{' · '}{this.state.category[Number(item.cid)]?this.state.category[Number(item.cid)].name : '?'}
                          </Text>
                        </View>
                        <View style={{marginRight: 10,marginBottom: 5,flex: 2,flexDirection: 'column',justifyContent: 'flex-end'}}>
                          <Text
                             style={{fontSize: 12,color: '#999999',textAlign: 'right'}}
                             numberOfLines={1}
                           >
                             {getDisance(this.state.region.latitude,this.state.region.longitude,item.lat,item.lng)}
                           </Text>
                        </View>
                      </View>
                    </View>




              </TouchableOpacity>
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
        {this.renderModal()}
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
    //onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    //onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f3f3f3'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  StatusBar:  {
    height:22,
    backgroundColor:'#FFFFFF',
  },
  header: {
    //height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
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
    marginTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e5e5e5',

  },
  Dropdown: {
    width: width,

  },
  Dropdown2: {
    width: width,
    //height: 32 ,
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  DropText: {
    //marginLeft: 10,
    //alignSelf: 'center',
    fontSize: 14,
    color: '#999999',
    //textAlign: 'center',
  },
  highlight: {
    //marginLeft: 10,
    //alignSelf: 'center',
    fontSize: 14,
    color: '#fd586d'
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
    height: 80,
    width: 80,
    overflow: 'hidden',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 2,
    //borderColor: '#FFFFFF',
  },
  bubble1: {
    height: 68,
    width: 68,
    overflow: 'hidden',
    //borderRadius: 28,
    //borderWidth: 2,
    //borderColor: '#FFFFFF',
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
