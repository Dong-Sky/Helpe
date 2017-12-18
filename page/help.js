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
  Modal,
  FlatList,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox  } from 'react-native-elements';
import MapView, { marker,Callout,} from 'react-native-maps';
import Toast, {DURATION} from 'react-native-easy-toast';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';

//获取屏幕宽高
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function isRealNum(val){
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if(val === "" || val ==null){
        return false;
    }
    if(!isNaN(val)){
        return true;
    }else{
        return false;
    }
};

 class help extends Component {
   constructor(props) {
    super(props);
    this.state = {
      //用户信息
      token: null,
      uid: null,
      islogin: null,
      //modal控制
      addressModalVisible: false,
      newAddressModalVisible: false,
      markModalVisible: false,
      backModalVisible: false,
      isDisabled: false,
      isDisabled1: false,
      //商品信息
      defaultImg: '',
      itemId: null,
      detail: {},
      img: [],
      item: {},
      //地址信息
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0052,
        longitudeDelta: 0.0052,
      },
      data: [],
      address: null,
      info: null,
      //订单信息
      num: '1',
      aid: null,
      mark: null,
      changeprice: '0',
      //
      loading: false
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
    this.getLocation();
    this.getItemInfo();
  };

  //打开地址选择窗口
  setAddressModalVisible(visible) {
    this.getAddress();
    this.setState({addressModalVisible: visible});
  };

  //打开地址添加窗口
  setNewAddressModalVisible(visible){
    this.setState({newAddressModalVisible: visible});
  };

  onRegionChange = (region) => {
     this.setState({ region });
  };

  //打开备注窗口
  setMarkModalVisible(visible){
    this.setState({markModalVisible: visible});
  };

  //获取商品详细数据
  getItemInfo = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=item&m=info&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {

      var defaultImg = responseJson.data.img[0].url? Service.BaseUri+responseJson.data.img[0].url:null;
      console.log(defaultImg);
      this.setState({
        detail: responseJson.data.detail,
        img: responseJson.data.img,
        item: responseJson.data.item,
        defaultImg: defaultImg,
      });

      return responseJson.data.item.uid;
    })
    .then(() => this.setState({loading: false}))
    .catch(error => {console.log(error);this.setState({loading: false})});
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
           this.setState({ region });
         },
         error => {
           console.log("获取位置失败："+ error);
         },
     );

  };



  //备注页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',}}
        isOpen={this.state.markModalVisible}
        isDisabled={this.state.isDisabled}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({markModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('buy.remark')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.contactInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              editable={true}
              onChangeText={(mark) => this.setState({mark})}
              value={this.state.mark}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.finish')}
            onPress={() => this.setState({markModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //请求成功
  renderBackModal = () => {
    return(
      <Modalbox
        style={{height: 180,width: 300,alignItems: 'center',}}
        isOpen={this.state.backModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={false}
        backdropPressToClose={false}
        swipeToClose={false}
        onClosed={() => this.setState({backModalVisible: false})}
        >
          <Text style={{marginTop: 10,fontSize: 18,color: '#f1a073'}}>
            {I18n.t('success.submit')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch',marginLeft: 10,marginRight: 10}}>
            <Text style={{fontSize: 14,color: '#333333'}}>
              {'\t'}{I18n.t('buy.txt4')}{'\n\n'}{'\t'}{I18n.t('buy.txt2')}
            </Text>
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.finish')}
            onPress={() => {this.setState({backModalVisible: false,});this.props.navigation.goBack()}}
          />
      </Modalbox>
    );
  };

  //定义下单方法
  buy = () => {
    const { token,uid,itemId,changeprice,num,mark } = this.state;
    const url = Service.BaseUrl;
    const url1 = Service.BaseUrl+`?a=buy&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    body =  '?a=buy&tp=1&token='+token+'&uid='+uid+'&id='+itemId+'&v='+Service.version+'&num='+Number(num)+'&changeprice='+Number(changeprice)+'&mark='+mark;

    this.setState({loading: true})
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'a=buy&tp=1&token='+token+'&uid='+uid+'&id='+itemId+'&v='+Service.version+'&num='+Number(num)+'&changeprice='+Number(changeprice)+'&mark='+mark,
      })
      .then(response => response.json())
      .then(responseJson =>{
        console.log(responseJson);
        if(!responseJson.status){
          this.setState({backModalVisible: true});
        }
        else {
          alert(responseJson.err);
        }
      })
      .then(() => this.setState({loading: false}))
      .catch(error => {console.log(error);this.setState({loading: false})});
  };

  total = () => {
    const { price } = this.state.item;
    const num = Number(this.state.num);
    const changeprice = Number(this.state.changeprice);
    if(isNaN(num)){
      return -1;
    }
    else if(isNaN(changeprice)){
      return -1;
    }
    else if(!Number.isInteger(num)){
      return -1;
    }
    else if(!Number.isInteger(changeprice)){
      return -1;
    }
    else{
      return price*num+changeprice;
    }
  }

  //页面元素

   //定义照片组件
   returnPhoto = () => {
     if(this.state.defaultImg==null||this.state.defaultImg==''){
       return(
         <TouchableOpacity
           style={{height: 200}}
           >
             <Image
               style={styles.img}
               source={require('../icon/publish/choose.png')}
               resizeMode='cover'
             />
         </TouchableOpacity>
       );
     }
     else{
       return(
         <TouchableOpacity
           style={{height: 200 }}
           >
           <Image
             style={styles.img}
             source={{uri: this.state.defaultImg}}
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

  render() {
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
              {I18n.t('buy.help')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </View>

        <ScrollView>
          <TouchableOpacity style={styles.item_pic}>
            {this.returnPhoto()}
          </TouchableOpacity>
          <List containerStyle={[styles.list,{marginTop: 0,}]}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.pay')}
              rightIcon={<View></View>}
              rightTitle={this.state.item.price}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.n')}
              rightIcon={<View></View>}
              textInput={true}
              textInputStyle={styles.textInput}
              textInputOnChangeText={(num) => this.setState({num})}
              textInputValue={this.state.num}
              clearButtonMode='always'
              keyboardType='numeric'
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.changeprice')}
              rightIcon={<View></View>}
              textInput={true}
              textInputOnChangeText={(changeprice) => this.setState({changeprice})}
              textInputValue={this.state.changeprice}
              clearButtonMode='always'
              keyboardType='numeric'
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.underline')}
              rightTitle={this.state.item.paytp>=1?I18n.t('buy.y'):I18n.t('buy.n')}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.online')}
              rightTitle={this.state.item.paytp!=1?I18n.t('buy.y'):I18n.t('buy.n')}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.remark')}
              rightTitle={this.state.mark==null?I18n.t('buy.has_remark'):I18n.t('buy.no_remark')}
              onPress={() => this.setMarkModalVisible(true)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.total')}
              rightTitle={this.total()<0?I18n.t('input_err'):this.total().toString()}
              containerStyle={styles.listContainerStyle}
            />
          </List>
        </ScrollView>
        <Button
          style={styles.button}
          buttonStyle={{marginTop:5,marginBottom:5,}}
          borderRadius={5}
          onPress={() => {
            if(this.total()<0){
              alert(I18n.t('buy.price_err'));
            }
            else {
              Alert.alert(
                I18n.t('buy.text3'),
                I18n.t('buy.n')+': '+this.state.num+'\n'+I18n.t('buy.changeprice')+': '+this.state.changeprice+'\n'+I18n.t('buy.total')+': '+this.total().toString(),
                [
                  {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.confirm'), onPress: () => this.buy()},
                ],
                { cancelable: false }
              )
            }
          }}
          backgroundColor='#f1a073'
          title={I18n.t('common.submit')} />
        {this.renderMarkModal()}
        {this.showLoading()}
        {this.renderBackModal()}
      </View>

    );
  }
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  item_pic: {
    height: 200,
    marginTop: 1,
    width: width,
  },
  title: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  bottom: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch' ,
    backgroundColor: '#f4eede',
    borderTopWidth: 1,
    borderColor: '#FFFFFF',
  },
  icon: {
     width: 25,
     height: 25,
  },
  button: {
    alignSelf:'center',
    width:280,
    height:50,
  },
  img: {
    flex:1,
    height: 200,
    width: '100%',
    //alignSelf: 'center'
  },
  list: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF'
  },
  contactInput:{
    width: 260,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  button1: {
    alignSelf: 'center',
    marginTop : 5,
    width: 240,
    height: 50,
  },
});

export default help;
