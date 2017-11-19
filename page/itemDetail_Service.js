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
      //窗口
      isDisabled1: false,
      isDisabled2: false,
      isDisabled3: false,
      isDisabled4: false,
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
    console.log(this.state);
    this.getItemInfo();
    this.getContent();
  };

  //获取商品详细数据
  getItemInfo = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=item&m=info&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);

      if(!responseJson.status){
        this.setState({
          addr: responseJson.data.addr,
          category: responseJson.data.category,
          detail: responseJson.data.detail,
          img: responseJson.data.img,
          item: responseJson.data.item,
          user: responseJson.data.user,
        });
      }
      else{
        alert(responseJson.err);
      }
      return responseJson.data.img;
    })
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
        this.setState({slide: slide1,album: album1,loading: false});
      }
    })
    .catch(error => console.log(error));
  };

  getContent = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=feedback&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    console.log(url);

    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        this.setState({content: responseJson.data});
      }
      else {
        alert('请求失败\n'+'错误原因: '+responseJson.err);
      }
    })
    .catch(err => {console.log(err)})
  };

  //收藏
  fav = () =>{
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=fav&m=save&token=${token}&uid=${uid}&id=${itemId}&v=${Service.version}`;
    console.log(url);
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert('收藏成功!');
      }
      else{
        alert('请求失败\n'+'错误原因：'+responseJson.err);
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => console.log(err))
  };

  saveImg = (img) =>  {
    var promise = CameraRoll.saveToCameraRoll(img);
    promise.then(function(result) {
      alert('保存成功！');
    }).catch(function(error) {
      alert('保存失败！\n' + error);
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
              '请选择',
              '是否保存图片?',
              [
                {text: '是', onPress: () => this.saveImg(ImgUrl)},
                {text: '否', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
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
              '请选择',
              '是否保存图片?',
              [
                {text: '是', onPress: () => this.saveImg(ImgUrl)},
                {text: '否', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
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
            style={{alignSelf: 'center',height: 50}}
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
    if(this.state.user.face==''){
      source = require('../icon/person/default_avatar.png');
    }
    else{
      source = {uri: Service.BaseUri+this.state.user.face};
    }
    return source;
  };

  returnAvatarSource = (face) => {
    var source;
    if(face==''){
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

  returnPayTp =() => {
    var str = '';
    if(this.state.item.paytp==0){
      str = '线上';
    }
    else if(this.state.item.paytp==1){
      str = '线下';
    }
    else if(this.state.item.paytp==2){
      str = '线下&线上';
    }
    return str;
  };


  //联系方式页面
  renderContactModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',}}
        isOpen={this.state.contactModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({contactModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            联系方式
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
            backgroundColor='#f1a073'
            borderRadius={5}
            title='确定'
            onPress={() => this.setState({contactModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //详情页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: '80%',width: '90%',alignItems: 'center',}}
        isOpen={this.state.markModalVisible}
        isDisabled={this.state.isDisabled2}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({markModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            详细内容
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
            backgroundColor='#f1a073'
            borderRadius={5}
            title='确定'
            onPress={() => this.setState({markModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //地图页面
  renderMapModal = () => {
    return(
      <Modalbox
        style={{height: 300,width: 300,alignItems: 'center',}}
        isOpen={this.state.mapModalVisible}
        isDisabled={this.state.isDisabled4}
        position='center'
        backdrop={true}
        backButtonClose={true}
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
                  我的位置
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
        style={{height: 260,width: '100%',alignItems: 'center',}}
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
                  评论
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
                      title={item.name==''?'匿名用户':item.name}
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
              color='#f1a073'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',color: '#333333',fontSize: 16}}>
              服务详情
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
              <Icon
                name='favorite-border'
                color='#f1a073'
                size={28}
                onPress={() => {
                  Alert.alert(
                    '收藏',
                    '是否要收藏?',
                    [
                      {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '确定', onPress: () => this.fav()},
                    ],
                    { cancelable: false }
                  )
                }}
              />
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
            title={this.state.user.name}
            titleStyle={styles.title1}
            subtitle={this.returnWork()}
            avatar={this.returnUserAvatarSource()}
            avatarContainerStyle={{height: 50,width: 50}}
            avatarStyle={{height: 50,width: 50}}
            containerStyle={[styles.listContainerStyle,{borderWidth: 1,borderColor: '#e5e5e5'}]}
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
            <Text style={[styles.title,{fontSize: 16,marginTop: 10,color: '#333333'}]}>
              {this.state.item.name}
            </Text>
            <Text style={[styles.title,{fontSize: 14,color: '#da695c'}]}>
              {this.state.item.u? this.state.item.price+'圆/'+this.state.item.u:this.state.item.price+'圆'}
            </Text>
            <Text style={[styles.title,{fontSize: 14,color: '#333333',marginBottom: 5}]}>
              {'已成交: '+this.state.item.salenum+'次'}
            </Text>
            {this.renderSeparator()}
            <Text style={[styles.title,styles.sub]}>
              {'服务类型: '+this.state.category.name}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {'支付方式: '+this.returnPayTp()}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {this.state.item.pt?'截止时间: '+formatDate(this.state.item.pt):null}
            </Text>
            <Text style={[styles.title,styles.sub,{marginBottom: 10}]}>
              {'我的地址: '+this.state.addr.info}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mark}>
            <Text style={{fontSize: 16,fontWeight: '500',alignSelf: 'center',color: '#333333',marginTop: 10}}>
              服务内容
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
              点击查看全部内容
            </Text>
          </TouchableOpacity>
          <List containerStyle={styles.list}>
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title='我的地址'
              containerStyle={styles.listContainerStyle}
              onPress={() => {
                if(this.state.addr.lat==undefined||this.state.addr.lng==undefined){
                  alert('获取地址失败!');
                }
                else{
                  this.setState({mapModalVisible: true});
                }
              }}
            />
            {this.renderSeparator()}
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title='联系方式'
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({contactModalVisible: true})}
            />
            {this.renderSeparator()}
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title='相册'
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({albumModalVisible: true})}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              component={TouchableOpacity}
              titleStyle={styles.title}
              title='评价'
              containerStyle={styles.listContainerStyle}
              onPress={() => this.setState({contentModalVisible: true})}
            />
          </List>
        </ScrollView>
          <Button
            style={styles.button}
            buttonStyle={{marginTop:5,marginBottom:5,}}
            borderRadius={5}
            backgroundColor='#f1a073'
            onPress={() => navigate('buy',{
              token: this.state.token,
              uid: this.state.uid,
              islogin: this.state.islogin,
              itemId: this.state.itemId,
            })}
            title='立即下单' />
            {this.showLoading()}
            {this.renderContactModal()}
            {this.renderMarkModal()}
            {this.renderAlbumModal()}
            {this.renderContentModal()}
            {this.renderMapModal()}
      </View>
    );
  };
}


const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
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
    width:280,
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
    marginTop :5,
    width: 280,
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
    padding: 0,
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
  },
  markInput:{
    width: '90%',
    height: '100%',
    textAlignVertical: 'top',
    padding: 0,
    borderWidth: 1,
    borderColor: '#f1a073',
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
