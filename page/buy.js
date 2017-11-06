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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List,CheckBox  } from 'react-native-elements';
import MapView, { marker,Callout,} from 'react-native-maps';
import Toast, {DURATION} from 'react-native-easy-toast';
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
    .then(uid => {
      console.log(uid);
      console.log(this.state);
      this.setState({loading: false})
    })
    .catch(error => console.log(error));
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

  //获取地址列表方法
  getAddress = () => {
      const {token,uid} = this.state;
      fetch(Service.BaseUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: 'a=addr&token='+token+'&uid='+uid+'&v='+Service.version,
     })
     .then(response => response.json())
     .then(responseJson => {
       console.log(responseJson);
       this.setState({ data: responseJson.data})
     })
     .catch(error => console.log(error))
  };

  //添加地址方法
  addAddress = () => {
    const { token,uid,region,aid,info } = this.state;
    const body = 'a=addr&m=add&v='+Service.version+'&token='+token+'&uid='+uid+'&aid='+aid+'&lat='+region.latitude+'&lng='+region.longitude+'&info='+info;
    fetch(Service.BaseUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: body,
   })
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert('添加成功');
     }
     else {
       alert('添加失败');
     }
   })
   .then(() => this.getAddress())
   .catch(error => console.log(error))
  };


  //定义详情描述窗口
  renderMarkModal = () => {
       return(
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.markModalVisible}
          onRequestClose={() => {console.log("Modal has been closed.")}}
          >
         <View style={styles.container}>
           <View style={styles.StatusBar}>
           </View>
           <View style={styles.header}>
             <Text
               style={{marginLeft:20,color:'#5c492b'}}
               onPress={() => this.setMarkModalVisible(!this.state.markModalVisible)}>
               返回
             </Text>
             <View style={{flex:1,}}>
             </View>
             <Text
               style={{marginRight:20,color:'#5c492b'}}
               onPress={Keyboard.dismiss}>
               完成
             </Text>
           </View>
           <ScrollView
             style={styles.contact_modal_body}
             showsVerticalScrollIndicator={true}
             >
             <TextInput
               style={{flex: 1,height: 1500,fontSize: 16,fontWeight: '500'}}
               autoCapitalize='none'
               placeholder='请详细描述您的服务'
               multiline={true}
               onChangeText={(mark) => this.setState({mark})}
               value={this.state.mark}
             />
             <Text style={{ marginTop: 10,marginBottom: 10,height: 40,fontSize: 12,fontWeight: '500',alignSelf: 'center'}}>
               不能再添加更多内容
             </Text>
           </ScrollView>
           </View>
        </Modal>
      );
  };


  //定义下单方法
  buy = () => {
    const { token,uid,aid,itemId,changeprice,num,mark } = this.state;
    const url = Service.BaseUrl;
    const url1 = Service.BaseUrl+`?a=buy&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}&aid=${aid}`
    console.log(url1);
    this.setState({loading: true})
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'a=buy&token='+token+'&uid='+uid+'&aid='+aid+'&id='+itemId+'&v='+Service.version+'&num='+Number(num)+'&changeprice='+Number(changeprice)+'&mark='+mark,
      })
      .then(response => response.json())
      .then(responseJson =>{
        console.log(responseJson);
        if(!responseJson.status){
          alert('下单成功');
        }
        else {
          alert(responseJson.err);
        }
      })
      .then(() => this.setState({loading: false}))
      .catch(error => console.log(error));
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
              <Text
                style={{marginLeft:20,color:'#5c492b'}}
                onPress={() => {
                  this.setAddressModalVisible(!this.state.addressModalVisible);
                }}>
                返回
              </Text>
              <View style={{flex:1,alignItems:'center'}}>
                <Text>
                  我的地址
                </Text>
              </View>
              <Text
                style={{marginRight:20,color:'#5c492b'}}
                onPress={() => {
                  this.setNewAddressModalVisible(true);
                }}>
                添加
              </Text>
            </View>
            <View style={{flex: 2,marginTop: 2,backgroundColor: '#FFFFFF'}}>
              <FlatList
                data={this.state.data}
                    renderItem={({ item }) => (
                      <CheckBox
                        containerStyle={{ borderBottomWidth: 0,borderWidth: 0,borderColor: '#FFFFFF',alignSelf: 'stretch' }}
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
            <Text
              style={{marginLeft:20,color:'#5c492b'}}
              onPress={() => {
                this.setNewAddressModalVisible(!this.state.newAddressModalVisible);
              }}>
              返回
            </Text>
            <View style={{flex:1,}}>
            </View>
            <Text
              style={{marginRight:20,color:'#5c492b'}}
              onPress={() => this.addAddress()}>
              确定
            </Text>
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
                <MapView.Marker
                  coordinate={this.state.region}
                />
            </MapView>
           </View>
           <View style={{flex:1,}}>
                 <TextInput
                   style={{height:50,alignSelf:'stretch'}}
                   placeholder="请输入内容"
                   onChangeText={(info) => this.setState({info})}
                   value={this.state.info}
                   onEndEditing={() => Keyboard.dismiss()}
                 />
           </View>
          </View>
       </Modal>
     );
   };

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
     if(!this.state.loading){
       return null;
     }
     else{
       return(
         <View
         >
           <ActivityIndicator animating size="large" />
         </View>
       );
     }
   };


  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        </View>
        {this.showLoading()}
        <ScrollView>
          <TouchableOpacity style={styles.item_pic}>
            {this.returnPhoto()}
          </TouchableOpacity>
          <List containerStyle={{marginBottom: 0,borderTopWidth: 0,marginTop:0,}}>
            <ListItem
              titleStyle={styles.title}
              title='价格'
              rightIcon={<View></View>}
              rightTitle={this.state.item.price}
            />
            <ListItem
              titleStyle={styles.title}
              title='数量'
              rightIcon={<View></View>}
              textInput={true}
              textInputStyle={styles.textInput}
              textInputOnChangeText={(num) => this.setState({num})}
              textInputValue={this.state.num}
              clearButtonMode='always'
              keyboardType='phone-pad'
            />
            <ListItem
              titleStyle={styles.title}
              title='补差价'
              rightIcon={<View></View>}
              textInput={true}
              textInputOnChangeText={(changeprice) => this.setState({changeprice})}
              textInputValue={this.state.changeprice}
              clearButtonMode='always'
              keyboardType='phone-pad'
            />
          </List>
          <List>
            <ListItem
              titleStyle={styles.title}
              title='线下支付'
              rightTitle={this.state.item.paytp>=1?'支持':'不支持'}
            />
            <ListItem
              titleStyle={styles.title}
              title='线上支付'
              rightTitle={this.state.item.paytp!=1?'支持':'不支持'}
            />
          </List>
          <List>
            <ListItem
              titleStyle={styles.title}
              title='我的地址'
              rightTitle={this.state.address? this.state.address:'请选择'}
              onPress={() => this.setAddressModalVisible(true)}
            />
            <ListItem
              titleStyle={styles.title}
              title='备注'
              rightTitle={this.state.mark==null?'未编辑':'已编辑'}
              onPress={() => this.setMarkModalVisible(true)}
            />
          </List>
          <List>
            <ListItem
              titleStyle={styles.title}
              title='总价'
              rightTitle={this.total()<0?'输入不合法':this.total().toString()}
            />
          </List>
        </ScrollView>
        <Button
          style={styles.button}
          buttonStyle={{marginTop:5,marginBottom:5,}}
          onPress={() => {
            if(this.total()<0){
              alert('输入合法的数量与差价（仅能为整数)');
            }
            else {
              this.buy();
            }
          }}
          backgroundColor='#f3456d'
          title='确认提交' />
        {this.renderAddressModal()}
        {this.renderMarkModal()}
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
      backgroundColor:'#f3456d',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3456d',
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
});

export default buy;
