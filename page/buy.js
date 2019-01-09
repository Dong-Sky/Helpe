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
  Switch,
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
import DropdownAlert from 'react-native-dropdownalert';

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

 class buy extends Component {
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
      isInfoModalVisible: false,
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
      paytp: -1,
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
    const url = Service.BaseUrl+Service.v+`/item/info?t=${token}&uid=${uid}&id=${itemId}`;
    this.setState({loading: true})
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      if(!parseInt(responseJson.status)){

        var defaultImg = responseJson.data.img? Service.BaseUri+responseJson.data.img:null;
        this.setState({
          detail: responseJson.data.itemdetail,
          img: responseJson.data.itemimg,
          item: responseJson.data,
          defaultImg: defaultImg,
        });
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(error => {console.log(error);this.setState({loading: false,})});
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
           //console.log("获取位置失败："+ error);
         },
     );

  };

  //获取地址列表方法
  getAddress = () => {
      const {token,uid} = this.state;
      const url = Service.BaseUrl+Service.v+`/address?t=${token}&page=0&per-page=50`;
      console.log(url);
      fetch(url)
      .then(response => response.json())
      .then(responseJson => {

       this.setState({ data: responseJson.data.data})
      })
      .catch(error => console.log(error))
  };

  //添加地址方法
  addAddress = () => {
    const { token,uid,region,aid,info } = this.state;
    const body = 'token='+token+'&uid='+uid+'&aid='+aid+'&lat='+region.latitude+'&lng='+region.longitude+'&info='+info;
    fetch(Service.BaseUrl+Service.v+`/address/add?t=${token}`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: body,
   })
   .then(response => response.json())
   .then(responseJson => {

     if(!responseJson.status){
       alert(I18n.t('success.add'));

     }
     else {
       alert(I18n.t('error.add_failed'));
     }
   })
   .then(() => this.getAddress())
   .catch(error => console.log(error))
  };


  //备注页面
  renderMarkModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',overflow: 'hidden',borderRadius: 20}}
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
            backgroundColor='#fd586d'
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
        style={{height: 180,width: 300,alignItems: 'center',borderRadius: 20,overflow: 'hidden'}}
        isOpen={this.state.backModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={false}
        backdropPressToClose={false}
        swipeToClose={false}
        onClosed={() => this.setState({backModalVisible: false})}
        >
          <Text style={{marginTop: 10,fontSize: 18,color: '#fd586d'}}>
            {I18n.t('success.submit')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch',marginLeft: 10,marginRight: 10}}>
            <Text style={{fontSize: 14,color: '#333333'}}>
              {'\t'}{I18n.t('buy.txt1')}{'\n\n'}{'\t'}{I18n.t('buy.txt2')}
            </Text>
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#fd586d'
            borderRadius={5}
            title={I18n.t('common.finish')}
            onPress={() => {this.setState({backModalVisible: false,});this.props.navigation.goBack()}}
          />
      </Modalbox>
    );
  };


  //定义下单方法
  buy = () => {



    const { token,uid,aid,itemId,changeprice,num,mark,paytp } = this.state;
    const url = Service.BaseUrl+Service.v+`/order/buy?t=${token}`;
    body =  'aid='+aid+'&id='+itemId+'&num='+Number(num)+'&changeprice='+Number(changeprice)+'&remark='+mark+'&paytp='+paytp;
    console.log(body);
    this.setState({loading: true})
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      })
      .then(response => response.json())
      .then(responseJson =>{
        console.log(responseJson);
        if(!parseInt(responseJson.status)){
          AnalyticsUtil.onEvent('buy');

          this.setState({backModalVisible: true});
          this.AlertDropDown(I18n.t('buy.txt4'))
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
  //定义地址列表窗口
   renderAddressModal = () => {
       return(
         <Modal
           animationType={"slide"}
           transparent={false}
           visible={this.state.addressModalVisible}
           onRequestClose={() => {console.log("Modal has been closed.")}}
           >
          <View style={[styles.container]}>
            <View style={styles.StatusBar}>
            </View>
            <View style={styles.header}>
              <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
                <Icon
                  style={{marginLeft: 5}}
                  name='keyboard-arrow-left'
                  color='#fd586d'
                  size={36}
                  onPress={() => this.setState({addressModalVisible: false})}
                />
              </View>
              <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                  {I18n.t('buy.myAddress')}
                </Text>
              </View>
              <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
                <View style={{marginRight: 10}}>
                  <Icon
                    name='add'
                    color='#fd586d'
                    size={28}
                    onPress={() => this.setState({newAddressModalVisible: true},this.getLocation)}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 2,marginTop: 2,backgroundColor: '#FFFFFF'}}>
              <FlatList
                data={this.state.data}
                    renderItem={({ item }) => (
                      <CheckBox
                        key={item.id}
                        containerStyle={{ borderBottomWidth: 0,borderWidth: 0,borderColor: '#FFFFFF',alignSelf: 'stretch',marginTop: 0,marginBottom: 0,backgroundColor: '#FFFFFF' }}
                        title={item.info}
                        titleStyle={styles.title}
                        iconRight={true}
                        right={false}
                        checked={this.state.aid==item.id? true:false}
                        onPress={() => this.setState({aid: item.id,address: item.info})}
                       />
                    )}
                    onPress={() => {
                      this.setState({
                        address: item.info,
                        aid: item.id,
                      });
                    }}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={item => item.id}

                //ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
              />
            </View>
          </View>
          {this.renderNewAddressModal()}
           <Toast ref="toast_add" position='center' textStyle={{color: '#FFFFFF',fontSize: 16}}/>
         </Modal>
       );
   };

   //定义新增地址窗口
   renderNewAddressModal = () => {
     return (
       <Modal
         animationType={"slide"}
         transparent={false}
         visible={this.state.newAddressModalVisible}
         onRequestClose={() => {console.log("Modal has been closed.")}}
         >
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
                onPress={() => {
                  this.setNewAddressModalVisible(!this.state.newAddressModalVisible);
                }}
              />
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
              <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
                {I18n.t('buy.newAddress')}
              </Text>
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            </View>
          </View>
          <View style={{flex:1,}}>
            <MapView
                style={styles.map}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                showsUserLocation={true}
                showsBuildings={true}
                loadingEnabled={true}
                liteMode={true}
                userLocationAnnotationTitle='myLocation'
                //followsUserLocation={this.state.locate}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region) => console.log(region)}
              >
                <TouchableOpacity style={{height: 50,width: 50,}} onPress={() => this.getLocation()}>
                  <Image
                    source={require('../icon/tarbar/locate.png')}
                    style={{height: 50,width: 50}}
                  />
                </TouchableOpacity>
                <MapView.Marker
                  coordinate={this.state.region}
                />
            </MapView>
           </View>
           <View style={{flex: 1}}>
             <ListItem
               title={I18n.t('buy.info')}
               titleStyle={styles.title}
               rightTitle={this.state.info==''?I18n.t('myAddress.no_info'):this.state.info}
               containerStyle={styles.listContainerStyle}
               rightTitleNumberOfLines={3}
               onPress={() => this.setState({isInfoModalVisible: true})}
             />
           </View>
           <Button
             style={styles.button}
             buttonStyle={{marginTop:5,marginBottom:5,}}
             borderRadius={5}
             backgroundColor='#fd586d'
             onPress={() => {
               if(this.state.info==null){
                 alert(I18n.t('buy.no_info'));
               }
               else{
                 this.addAddress();
               }
             }}
             title={I18n.t('buy.add')} />
             {this.renderInfoModal()}
          </View>
       </Modal>
     );
   };

   renderInfoModal = () => {
     return(
       <Modalbox
         style={{height: 220,width: 300,alignItems: 'center',borderRadius: 20,overflow: 'hidden'}}
         isOpen={this.state.isInfoModalVisible}
         isDisabled={this.state.isDisabled1}
         position='center'
         backdrop={true}
         backButtonClose={true}
         onClosed={() => this.setState({isInfoModalVisible: false})}
         >
           <Text style={{marginTop: 10}}>
             {I18n.t('buy.no_info')}
           </Text>
           <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
             <TextInput
               style={styles.markInput}
               autoCapitalize='none'
               multiline = {true}
               underlineColorAndroid="transparent"
               editable={true}
               value={this.state.info}
               onChangeText={(info) => this.setState({info})}
               maxLength={50}
               placeholder={I18n.t('buy.p1')}
             />
           </View>
           <Button
             style={styles.button1}
             backgroundColor='#fd586d'
             borderRadius={5}
             title={I18n.t('common.confirm')}
             onPress={() => this.setState({isInfoModalVisible: false,})}
           />
       </Modalbox>
     );
   };


   //定义照片组件
   returnPhoto = () => {
     if(this.state.defaultImg==null||this.state.defaultImg==''){
       return(
         <TouchableOpacity
           style={{height: 200,alignItems: 'center'}}
           >
             <Image
               style={{flex: 1,}}
               source={require('../icon/publish/choose.png')}
               resizeMode='contain'
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
              color='#fd586d'
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
              {I18n.t('buy.order')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </View>

        <ScrollView>
          <TouchableOpacity style={styles.item_pic}>
            {this.returnPhoto()}
          </TouchableOpacity>
          <List containerStyle={[styles.list,{marginTop: 0}]}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.price')}
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
              titleStyle={[styles.title,this.state.item.paytp>=1?{}:{color: '#999999'}]}
              title={I18n.t('buy.underline')}
              //rightTitle={this.state.item.paytp>=1?I18n.t('buy.y'):I18n.t('buy.n')}
              containerStyle={styles.listContainerStyle}
              rightIcon={
                <Switch
                  value={this.state.paytp==1}
                  onValueChange={(online) => {

                      this.setState({paytp: 1})


                  }}
                  onTintColor='#fd586d'
                />
              }
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={[styles.title,this.state.item.paytp!=1?{}:{color: '#999999'}]}
              title={I18n.t('buy.online')}
              rightIcon={
                <Switch
                  value={this.state.paytp==0}
                  onValueChange={(online) => {
                    if(this.state.item.paytp!=1){
                      this.setState({paytp: 0})
                    }
                  }}
                  onTintColor='#fd586d'
                />
              }

              //rightTitle={this.state.item.paytp!=1?I18n.t('buy.y'):I18n.t('buy.n')}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.myAddress')}
              rightTitle={this.state.address? this.state.address:I18n.t('buy.choose')}
              onPress={() => this.setAddressModalVisible(true)}
              containerStyle={styles.listContainerStyle}
            />
            {this.renderSeparator()}
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.remark')}
              rightTitle={this.state.mark!=null?I18n.t('buy.has_remark'):I18n.t('buy.no_remark')}
              onPress={() => this.setMarkModalVisible(true)}
              containerStyle={styles.listContainerStyle}
            />
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              titleStyle={styles.title}
              title={I18n.t('buy.total')}
              rightTitle={this.total()<0?I18n.t('buy.input_err'):this.total().toString()}
              containerStyle={styles.listContainerStyle}
            />
          </List>
        </ScrollView>
        <Button
          style={styles.button}
          buttonStyle={{marginTop:5,marginBottom:5,}}
          borderRadius={5}
          backgroundColor='#fd586d'
          onPress={() => {
            if(this.state.aid==null){
              alert(I18n.t('buy.choose_addr'));
            }
            else if(this.total()<0){
              alert(I18n.t('buy.price_err'));
            }
            else if(this.state.paytp<0){
              alert(I18n.t('publish.no_paytp'));
            }
            else {
              Alert.alert(
                I18n.t('buy.txt3'),
                I18n.t('buy.n')+': '+this.state.num+'\n'+I18n.t('buy.changeprice')+': '+this.state.changeprice+'\n'+I18n.t('buy.total')+': '+this.total().toString(),
                [
                  {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.confirm'), onPress: () => this.buy()},
                ],
                { cancelable: false }
              )
            }
          }}
          backgroundColor='#fd586d'
          title={I18n.t('common.submit')}/>
        {this.renderAddressModal()}
        {this.renderMarkModal()}
        {this.showLoading()}
        {this.renderBackModal()}
         <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} />
      </View>

    );
  }
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
    alignSelf: 'center'
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
    borderColor: '#fd586d',
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
  markInput:{
    width: 260,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#fd586d',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
});

export default buy;
