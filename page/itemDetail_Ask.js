import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  CameraRoll,
  Dimensions,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,Rating  } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import ViewPager from 'react-native-viewpager';
import Modalbox from 'react-native-modalbox';
import MapView from 'react-native-maps';
import Service from '../common/service';
import DropdownAlert from 'react-native-dropdownalert';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

//时间转化成字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}

 class itemDetail extends Component {
   constructor(props) {
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: null,
      //商品信息
      itemId: null,
      addr: {},
      category: {},
      detail: {},
      img: [],
      content: [],
      slide: [],
      album: [],
      Swiper: [],
      item: {},
      user: {},
      isfav: 0,
      report: '',
      //窗口
      isDisabled1: false,
      isDisabled2: false,
      isDisabled3: false,
      isDisabled4: false,
      isDisabled5: false,
      reportModalVisible: false,
      contactModalVisible: false,
      contentModalVisible: false,
      markModalVisible: false,
      albumModalVisible: false,
      mapModalVisible: false,
      //
      loading: false,
    };
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      token: params.token,
      uid: params.uid,
      islogin: params.uid,
      itemId: params.itemId,
    });
  };

  componentDidMount() {

    AnalyticsUtil.onEvent('askDetail');

    console.log(this.state);
    this.getItemInfo();
    //this.getContent();
  };

  AlertDropDown = (txt)=> {
  if (txt) {
    this.dropdown.alertWithType('success', 'success', txt);
    }
  };

  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  //获取商品详细数据
  getItemInfo = () => {
    const { token,uid,itemId } = this.state;

    const url = Service.BaseUrl+Service.v+`/item/info?id=${itemId}`;
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

      if(!parseInt(responseJson.status)){
        this.setState({
          addr: responseJson.data.addr,
          category: responseJson.data.category,
          detail: responseJson.data.itemdetail,
          img: responseJson.data.itemimg,
          item: responseJson.data,
          user: responseJson.data.userInfo,
          isfav: responseJson.data.isfav,
        });
      }
      else{
        alert(responseJson.err);
      }
      return responseJson.data.itemimg;
    })
    .then(img => {this.setState({loading: false});return img;})
    .then(img => {
      for(i=0;i<=img.length;i++){
        var slide1 = this.state.slide;
        var album1 = this.state.album;
        var ImgUrl = Service.BaseUri+img[i].url;
        var newImg = (
          <TouchableOpacity style={styles.slide} key={i}>
            <Image
              style={styles.slide}
              source={{uri: ImgUrl}}
              resizeMode='cover'
            />
          </TouchableOpacity>
        );
        slide1.push(newImg);
        this.setState({slide: slide1,album: album1});
      }
    })
    .catch(error => {console.log(error);this.setState({loading: false})});
  };



  getContent = () => {
    const { token,uid,itemId } = this.state;

    const url = Service.BaseUrl+Service.v+`/feedback?itemid=${itemId}`;
    console.log(url);

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      //console.log(responseJson);
      if(!parseInt(responseJson.status)){
        this.setState({content: responseJson.data.data});
      }
      else {
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
      }
    })
    .catch(err => {console.log(err)})
  };

  fav = () =>{

    AnalyticsUtil.onEvent('fav_Service');

    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+Service.v+`/fav/save?t=${token}`;
    const body = `id=${itemId}`;

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
        alert(I18n.t('success.fav'));
      }
      else{
        alert(I18n.t('error.fav_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {console.log(err);this.setState({loading: false})})
  };

  report = () => {
    AnalyticsUtil.onEvent('report');


    const { token,uid,itemId,report } = this.state;
    if(!report){
      alert('Number of words is not enough!(>10)');
      return;
    }
    if (report.length<10){
      alert('Number of words is not enough!(>10)');
      return;
    }
    const url = Service.BaseUrl+Service.v+`/report/add?t=${token}`;
    const body = `item_value=${itemId}&item_type=${0}&reason=${report}`;


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

      if(!parseInt(responseJson.status)){
        this.setState({reportModalVisible: true});
        this.AlertDropDown(I18n.t('success.report'))
      }
      else{
        alert(I18n.t('error.report_failed')+'\n'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {console.log(err);this.setState({loading: false})})
  }

  saveImg = (img) =>  {
    var promise = CameraRoll.saveToCameraRoll(img);
    promise.then(function(result) {
      alert(I18n.t('success.save'));
    }).catch(function(error) {
      alert(I18n.t('error.save_failed')+'\n' + error);
    });
  }

  //以下定义页面元素

  //虽然看上去很傻，但这是本页最精髓的函数，我花了2天，2天！！！做到了!！穷举万岁！无任何播放问题!睡觉!
  returnSwiper = () =>{
    const { img } = this.state;
    var Swiper1 = (
      <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>

      </Swiper>
    );
    if(img.length==1){
     Swiper1 = (
       <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>
         {this.returnSlideElement(0)}
       </Swiper>
     );
    }
    else if(img.length==2){
      Swiper1 = (
        <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>
          {this.returnSlideElement(0)}
          {this.returnSlideElement(1)}
        </Swiper>
      );
    }
    else if(img.length==3){
      Swiper1 = (
        <Swiper style={styles.wrapper} autoplay={true} showsButtons={false} >
          {this.returnSlideElement(0)}
          {this.returnSlideElement(1)}
          {this.returnSlideElement(2)}
        </Swiper>
      );
    }
    else if(img.length==4){
      Swiper1 = (
        <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>
          {this.returnSlideElement(0)}
          {this.returnSlideElement(1)}
          {this.returnSlideElement(2)}
          {this.returnSlideElement(3)}
        </Swiper>
      );
    }
    else if(img.length==5){
      Swiper1 = (
        <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>
          {this.returnSlideElement(0)}
          {this.returnSlideElement(1)}
          {this.returnSlideElement(2)}
          {this.returnSlideElement(3)}
          {this.returnSlideElement(4)}
        </Swiper>
      );
    }
    else{
      Swiper1 = (
        <Swiper style={styles.wrapper} autoplay={true} showsButtons={false}>
          {this.returnSlideElement(0)}
          {this.returnSlideElement(1)}
          {this.returnSlideElement(2)}
          {this.returnSlideElement(3)}
          {this.returnSlideElement(4)}
          {this.returnSlideElement(5)}
        </Swiper>
      );
    }
    return Swiper1;
  };

  returnAlbum = () =>{
    const { img } = this.state;
    var album = img;
    var theAlbum = (
            <Swiper style={styles.wrapper} autoplay={false}>
            </Swiper>
         );
    if(album.length==1){
     theAlbum = (
       <Swiper style={styles.wrapper} autoplay={false}>
         {this.returnAlbumElement(0)}
       </Swiper>
     );
    }
    else if(album.length==2){
      theAlbum = (
        <Swiper style={styles.wrapper} autoplay={false}>
          {this.returnAlbumElement(0)}
          {this.returnAlbumElement(1)}
        </Swiper>
      );
    }
    else if(album.length==3){
      theAlbum = (
        <Swiper style={styles.wrapper} autoplay={false}>
          {this.returnAlbumElement(0)}
          {this.returnAlbumElement(1)}
          {this.returnAlbumElement(2)}
        </Swiper>
      );
    }
    else if(album.length==4){
      theAlbum = (
        <Swiper style={styles.wrapper} autoplay={false}>
          {this.returnAlbumElement(0)}
          {this.returnAlbumElement(1)}
          {this.returnAlbumElement(2)}
          {this.returnAlbumElement(3)}
        </Swiper>
      );
    }
    else if(album.length==5){
      theAlbum = (
        <Swiper style={styles.wrapper} autoplay={false}>
          {this.returnAlbumElement(0)}
          {this.returnAlbumElement(1)}
          {this.returnAlbumElement(2)}
          {this.returnAlbumElement(3)}
          {this.returnAlbumElement(4)}
        </Swiper>
      );
    }
    else{
      theAlbum = (
        <Swiper style={styles.wrapper} autoplay={false}>
          {this.returnAlbumElement(0)}
          {this.returnAlbumElement(1)}
          {this.returnAlbumElement(2)}
          {this.returnAlbumElement(3)}
          {this.returnAlbumElement(4)}
          {this.returnAlbumElement(5)}
        </Swiper>
      );
    }
    return theAlbum;
  };

  returnAlbumElement = (i) => {
    if(this.state.img[i]==undefined){
      return null;
    }
    else if(this.state.img[i].url==''||this.state.img[i].url==null&this.state.img[i].url==undefined){
      return null;
    }
    else{
      var ImgUrl = Service.BaseUri+this.state.img[i].url;
      return(
        <TouchableOpacity
          style={styles.albumSlide}
          key={i}
          onLongPress={() => {
            Alert.alert(
              I18n.t('itemDetail.choose'),
              I18n.t('itemDetail.is_save_img'),
              [
                {text: I18n.t('common.yes'), onPress: () => this.saveImg(ImgUrl)},
                {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              ],
              { cancelable: false }
            )
          }}>
          <Image
            style={styles.albumSlide}
            source={{uri: ImgUrl}}
            resizeMode='cover'
          />
        </TouchableOpacity>
        );
    }
  };

  returnSlideElement = (i) => {
    if(this.state.img[i]==undefined){
      return null;
    }
    else if(this.state.img[i].url==''||this.state.img[i].url==null&this.state.img[i].url==undefined){
      return null;
    }
    else{
      var ImgUrl = Service.BaseUri+this.state.img[i].url;
      return(
        <TouchableOpacity
          style={styles.slide}
          key={i}
          onLongPress={() => {
            Alert.alert(
              I18n.t('itemDetail.choose'),
              I18n.t('itemDetail.is_save_img'),
              [
                {text: I18n.t('common.yes'), onPress: () => this.saveImg(ImgUrl)},
                {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              ],
              { cancelable: false }
            )
          }}>
          <Image
            style={styles.slide}
            source={{uri: ImgUrl}}
            resizeMode='cover'
          />
        </TouchableOpacity>
        );
    }
  };



  //加载器
  showLoading = () => {
    return(
      <Modalbox
        style={{height: 60, width: 60,backgroundColor: '#FFFFFF',opacity: 0.4,}}
        position='center'
        isOpen={this.state.loading}
        backdropOpacity={0}
        backdropPressToClose={false}
        swipeToClose={false}
        swipeThreshold={200}
        swipeArea={0}
        animationDuration={0}
        backdropColor='#FFFFFF'
        >
          <ActivityIndicator
            animating={true}
            style={{alignSelf: 'center',height: 50,}}
            color='#333333'
            size="large" />
      </Modalbox>
    );
  };

  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "95%",
            backgroundColor: "#e5e5e5",//CED0CE
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

  returnUserAvatarSource = () => {
    var source;
    if(!this.state.user.face){
      source = require('../icon/person/default_avatar.png');
    }
    else{
      source = {uri: Service.BaseUri+this.state.user.face};
    }
    return source;
  };

  returnUserAvatarStyle = () => {

    if(!this.state.user.face){
      return {tintColor: '#FFFFFF',backgroundColor: '#fd586d'};
    }

    return {};
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

  returnPayTp =() => {
    var str = '';
    if(this.state.item.paytp==0){
      str = I18n.t('itemDetail.online');
    }
    else if(this.state.item.paytp==1){
      str = I18n.t('itemDetail.underline');
    }
    else if(this.state.item.paytp==2){
      str = I18n.t('itemDetail.both');
    }
    return str;
  };

  //举报页面
  renderReportModal = () => {
    return(
      <Modalbox
        style={{height: 260,width: 300,alignItems: 'center',borderRadius: 20}}
        isOpen={this.state.reportModalVisible}
        isDisabled={this.state.isDisabled5}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({reportModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>

            {'Reason'}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={[styles.contactInput,{}]}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              //editable={false}
              value={this.state.report}
              onChangeText={(report) => this.setState({report})}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('common.report')}
            onPress={() => this.report()}
          />
      </Modalbox>
    );
  };


  //联系方式页面
  renderContactModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',borderRadius: 20}}
        isOpen={this.state.contactModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({contactModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('itemDetail.contact')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.contactInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              editable={false}
              value={this.state.item.contact}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('common.confirm')}
            onPress={() => this.setState({contactModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //详情页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: '80%',width: '90%',alignItems: 'center',borderRadius: 20}}
        isOpen={this.state.markModalVisible}
        isDisabled={this.state.isDisabled2}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({markModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('itemDetail.detail')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.markInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              editable={false}
              value={this.state.detail.mark}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('common.confirm')}
            onPress={() => this.setState({markModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //地图页面
  renderMapModal = () => {
    return(
      <Modalbox
        style={{height: 300,width: width-40,alignItems: 'center',}}
        isOpen={this.state.mapModalVisible}
        isDisabled={this.state.isDisabled4}
        position='center'
        backdrop={true}
        backButtonClose={true}
        swipeToClose={false}
        onClosed={() => this.setState({mapModalVisible: false})}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: this.state.addr.lat/1,
              longitude: this.state.addr.lng/1,
              latitudeDelta: 0.00629157290689264,
              longitudeDelta: 0.004999999999881766,
            }}
          >
            <MapView.Marker coordinate={{
              latitude: this.state.addr.lat/1,
              longitude: this.state.addr.lng/1,
            }}>
              <MapView.Callout>
                <Text style={{color: '#333333',fontSize: 14}}>
                  {I18n.t('itemDetail.myLocation')}
                </Text>
              </MapView.Callout>
            </MapView.Marker>
        </MapView>
      </Modalbox>
    );
  };

  //相册页面
  renderAlbumModal = () => {
    return(
      <Modalbox
        style={{height: 260,width: width-20,alignItems: 'center',}}
        isOpen={this.state.albumModalVisible}
        isDisabled={this.state.isDisabled3}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({albumModalVisible: false})}
        >
            {this.returnAlbum()}
      </Modalbox>
    );
  };

  //评论页面
  renderContentModal = () => {
    return(
      <Modalbox
        isOpen={this.state.contentModalVisible}
        isDisabled={this.state.isDisabled3}
        position='center'
        backdrop={true}
        backButtonClose={true}
        swipeToClose={false}
        onClosed={() => this.setState({contentModalVisible: false})}
        >
          <View style={styles.container}>
            <View style={styles.StatusBar}>
            </View>
            <View style={styles.header}>
              <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
                <Icon
                  style={{marginLeft: 5}}
                  name='chevron-left'
                  color='#f1a073'
                  size={32}
                  onPress={() => this.setState({contentModalVisible: false})}
                />
              </View>
              <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center'}}>
                  {I18n.t('itemDetail.feedback')}
                </Text>
              </View>
              <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
              </View>
            </View>
            <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#FFFFFF' ,marginTop: 0}}>
              <FlatList
                style={{marginTop: 0,borderWidth: 0}}
                data={this.state.content}
                renderItem={({ item }) => (
                  <View>
                    <ListItem
                      component={TouchableOpacity}
                      roundAvatar
                      key={item.id}
                      title={item.name==''?I18n.t('common.no_name'):item.name}
                      rightTitle={formatDate(item.t)}
                      avatar={this.returnAvatarSource(item.face)}
                      onPress={() => {console.log(typeof item.name);console.log(typeof item.content);}}
                      avatarContainerStyle={{height:32,width:32}}
                      avatarStyle={{height:32,width:32}}
                      containerStyle={styles.listContainerStyle}
                    />
                    <View style={{marginLeft: 15,flexDirection: 'row',alignItems: 'center'}}>
                      <Rating
                        type="bell"
                        readonly
                        ratingCount={5}
                        fractions={1}
                        startingValue={(item.score/20)}
                        imageSize={20}
                      />
                      <Text style={{marginLeft: 5,color: '#f1a073',fontSize: 14}}>
                        ({item.score/20})
                      </Text>
                    </View>
                    <Text style={{color: '#333333',fontSize: 14,marginLeft: 15,marginRight: 15,marginBottom: 10,marginTop: 5}}>
                      {item.content}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={50}
              />
              <View style={{height: 1,backgroundColor: '#e5e5e5'}}></View>
            </List>
          </View>
      </Modalbox>
    );
  };

  render(){
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
              {I18n.t('itemDetail.Ask')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={styles.item_pic}>
            {this.returnSwiper()}
          </View>

          <ListItem
            roundAvatar
            component={TouchableOpacity}

            title={this.state.user.username?this.state.user.username:'???'}
            titleStyle={styles.title1}
            //subtitle={this.returnWork()}
            avatar={this.returnUserAvatarSource()}
            avatarContainerStyle={[{height: 40,width: 40,},]}
            avatarStyle={[{height: 40,width: 40,},this.returnUserAvatarStyle()]}
            containerStyle={[styles.listContainerStyle,{borderWidth: 1,borderColor: '#e5e5e5', }]}
            onPress={() => {
              const params = {
                token: this.state.token,
                uid: this.state.uid,
                islogin: this.state.islogin,
                uuid: this.state.item.uid?this.state.item.uid:this.state.uid,
              };
              navigate('user',params);
            }}
          />
          <TouchableOpacity style={styles.item}>
            <Text style={[styles.title,{fontSize: 20,marginTop: 10,color: '#333333'}]}>
              {this.state.item.name}

            </Text>
            <Text style={[styles.title,{fontSize: 18,color: '#fd586d',marginTop: 10,marginBottom: 10}]}>

              {this.state.item.unit&&this.state.item!=''? '￥'+parseInt(this.state.item.price).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+'/'+this.state.item.unit:'￥'+parseInt(this.state.item.price).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}
            </Text>
            {/*
            <Text style={[styles.title,{fontSize: 14,color: '#333333',marginBottom: 5,marginTop: 10}]}>
              {I18n.t('itemDetail.sale')+': '+this.state.item.salenum+I18n.t('itemDetail.e')}
            </Text>*/}
            {this.renderSeparator()}
            <Text style={[styles.title,styles.sub]}>
              {I18n.t('itemDetail.A_cate')+': '+this.state.category.jp_name}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {I18n.t('itemDetail.paytp')+': '+this.returnPayTp()}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {this.state.item.pet?I18n.t('itemDetail.deadline')+': '+formatDate(this.state.item.pet):null}
            </Text>
            <Text style={[styles.title,styles.sub,{marginBottom: 10}]}>
              {I18n.t('itemDetail.myAddress')+': '+this.state.addr.info}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mark}>
            <Text style={{fontSize: 16,fontWeight: '500',alignSelf: 'center',color: '#333333',marginTop: 10}}>
              {I18n.t('itemDetail.A_info')}
            </Text>
            <Text
              style={{marginLeft: 10,marginRight: 10,marginTop: 10,marginBottom: 10,fontSize: 14,color: '#999999'}}
              numberOfLines={20}>
              {this.state.detail.mark}
            </Text>
            <Text
              style={{fontSize: 12,fontWeight: '500',alignSelf: 'center',color: '#333333',marginBottom: 10,marginTop: 5}}
              onPress={() => this.setState({markModalVisible: true})}
              >
              {I18n.t('itemDetail.read_more')}
            </Text>
          </TouchableOpacity>
          <List containerStyle={styles.list}>
            {/*
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title={I18n.t('itemDetail.myAddress')}
              containerStyle={styles.listContainerStyle}
              onPress={() => {
                if(this.state.addr.lat==undefined||this.state.addr.lng==undefined){
                  alert(I18n.t('itemDetail.getLocation_failed'));
                }
                else{
                  this.setState({mapModalVisible: true});
                }
              }}
            />
            {this.renderSeparator()}
            */}
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title={I18n.t('itemDetail.contact')}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({contactModalVisible: true})}
            />
            {/*
            {this.renderSeparator()}
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title={I18n.t('itemDetail.album')}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({albumModalVisible: true})}
            />*/}
          </List>
          <List containerStyle={[styles.list,{marginBottom: 10}]}>
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title={I18n.t('itemDetail.feedback')}
              rightTitle={'('+this.state.content.length+')'}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({contentModalVisible: true})}
            />
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title={I18n.t('common.report')}
              //rightTitle={'('+this.state.content.length+')'}
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({reportModalVisible: true})}
            />
          </List>
          {this.showLoading()}
        </ScrollView>
        <View style={{height: 50,width: width,borderTopWidth: 1,borderColor: '#e5e5e5',backgroundColor: '#FFFFFF',flexDirection: 'row',marginTop: 0}}>
          <View style={{height: 50,width: 50,alignItems: 'center',justifyContent: 'center'}}>
            <Icon
              name='location-on'
              color='#999999'
              size={24}

              onPress={() => {
                if(this.state.addr.lat==undefined||this.state.addr.lng==undefined){
                  alert(I18n.t('itemDetail.getLocation_failed'));
                }
                else{
                  this.setState({mapModalVisible: true});
                }
              }}
            />
          </View>
          <View style={{height: 50,width: 50,alignItems: 'center',justifyContent: 'center'}}>
            <Icon
              name='photo-library'
              color='#999999'
              size={24}
              onPress={() => this.setState({albumModalVisible: true})}
            />
          </View>
          <View style={{height: 50,width: 50,alignItems: 'center',justifyContent: 'center'}}>
            <Icon
              name={this.state.isfav>0?'favorite':'favorite-border'}
              color={this.state.isfav>0?'#fd586d':'#999999'}
              size={24}

              onPress={() => {
                if(this.state.isfav>0){

                }
                else{
                  Alert.alert(
                    I18n.t('itemDetail.fav'),
                    I18n.t('itemDetail.is_fav'),
                    [
                      {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: I18n.t('common.yes'), onPress: () => this.fav()},
                    ],
                    { cancelable: false }
                  )
                }
              }}
            />
          </View>
          <View style={{height: 50,width: 50,alignItems: 'center',justifyContent: 'center'}}>
            <Icon
              name='message'
              color='#999999'
              size={24}

              onPress={() => {


                if(!this.state.uid){
                  return
                }

                if(!this.state.islogin){
                  return
                }

                if(!this.state.user.id||this.state.user.id==this.state.uid){
                  return
                }

                this.props.navigation.navigate('chatroom',{
                  uid: this.state.uid,
                  token: this.state.token,
                  islogin: this.state.islogin,
                  uuid: this.state.user.id,
                  name: '?&?',
                })
              }}
            />
          </View>
          <Button
            style={styles.button}
            buttonStyle={{height: 50}}
            borderRadius={0}
            backgroundColor='#fd586d'
            onPress={() => {
              if(this.state.item.flag==1){
                navigate('buy',{
                  token: this.state.token,
                  uid: this.state.uid,
                  islogin: this.state.islogin,
                  itemId: this.state.itemId,
                });
              }
              else if(this.state.item.flag==0){
                alert(I18n.t('itemDetail.sold_out'));
              }
              else {
                alert(I18n.t('error.getItemInfo_failed'));
              }
            }}
            title={I18n.t('itemDetail.buy')}/>
        </View>
            <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} />

            {this.renderContactModal()}
            {this.renderMarkModal()}
            {this.renderAlbumModal()}
            {this.renderContentModal()}
            {this.renderMapModal()}
            {this.renderReportModal()}
      </View>
    );
  };
}


const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#f3f3f3',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#FFFFFF',
  },
  header: {
    height: 44,
    width: width,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  item_pic: {
    height: 200,
    marginBottom: 0,
    //marginTop: 1,
  },
  user: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  item: {
    marginTop: 10,
    //height: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  mark: {
    flexDirection: 'column',
    marginTop: 10,
    //height: 500,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  bottom: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch' ,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
  },
  album: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  comment: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
     width: 25,
     height: 25,
  },
  button: {
    alignSelf:'center',
    //marginTop:15,

    width: width-60*4,
    height:50,
  },
  wrapper: {
  },
  slide: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%',
    //backgroundColor: '#9DD6EB',
  },
  albumSlide: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
    width: '100%',
    //backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '500',
    marginLeft: 14,
    marginTop: 5,
  },
  title1: {
    fontSize: 16,
    color: '#333333'
  },
  sub: {
    fontSize: 14,
    color: '#999999',
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
  subtitleView: {
  },
  ratingText: {
    color: '#666666',
    marginLeft: 10,
  },
  button: {
    alignSelf: 'center',
    marginTop :0,
    width: width-50*4,
    height: 50,
  },
  button1: {
    alignSelf: 'center',
    marginTop : 5,
    width: 240,
    height: 50,
  },
  contactInput:{
    width: 260,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#fd586d',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,

    padding: 5,
  },
  markInput:{
    width: '86%',
    height: '100%',
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#fd586d',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default itemDetail;
