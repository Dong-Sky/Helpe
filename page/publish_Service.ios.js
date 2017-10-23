import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Picker,
  ScrollView,
  Modal,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon, Button, CheckBox } from 'react-native-elements';
import { List, ListItem, FormLabel, FormInput } from 'react-native-elements';
import MapView, { marker,Callout,} from 'react-native-maps';
import { Makiko,Kohana } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import Toast, {DURATION} from 'react-native-easy-toast';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Service from '../common/service';

//获取屏幕宽高
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

//图片选择器参数设置
var options = {
  title: '请选择图片来源',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'相册图片',
  /*customButtons: [
    {name: 'hangge', title: 'hangge.com图片'},
  ],*/
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  maxWidth: 2000,
  maxHeight: 2000,
};

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

 class publish_Service extends Component {
  constructor(props) {
       super(props);
       this.state = {
         token: null,
         uid: null,
         islogin: false,
         //modal
         markModalVisible: false,
         addressModalVisible: false,
         newAddressModalVisible: false,
         contactModalVisible: false,
         addPhotoModalVisible: false,
         categoryMoalVisible: false,
         isDateTimePickerVisible: false,
         data: [],
         category: [{id:'0' ,name: '请选择',parent: '0'}],
         //地图信息
         region:{
           latitude: 0,
           longitude: 0,
           latitudeDelta: 0.0052,
           longitudeDelta: 0.0052,
         },
         locate: true,
         info: null,
         address: null,
         //发布信息
         name: null,
         tp: 0,
         cid: 0,
         aid : null,
         price: null,
         u: null,
         contact: null,
         mark: null,
         offline: false,
         online: false,
         defaultImgSouce: null,
         img: [ null,null,null,null,null,null],
         online: false,
         underline: false,
         deadline: null,
         //
         loading: false,
       }
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    this.setState({
      token:params.token,
      uid:params.uid,
      islogin:params.islogin,
    });
  };

  componentDidMount() {
    this.getItemCategory();
    this.getLocation();
  };
  //打开详情描述窗口
  setMarkModalVisible(visible){
    this.setState({markModalVisible: visible});

  };

  //打开地址选择窗口
  setAddressModalVisible(visible){
    this.getAddress();
    this.setState({addressModalVisible: visible});
  };

  //打开地址添加窗口
  setNewAddressModalVisible(visible){
    this.setState({newAddressModalVisible: visible});
  };

  //打开商品类型窗口
  setCategoryModalVisible(visible){
    this.setState({categoryMoalVisible: visible});
  };

  //打开联系方式窗口
  setContactModalVisible(visible){
    this.setState({contactModalVisible: visible});
  };

  //打开相册添加窗口
  setAddPhotoModalVisible(visible){
    this.setState({addPhotoModalVisible: visible});
  };

  //打开时间选择器
  setDateTimePicker(visible){
    this.setState({isDateTimePickerVisible: visible});
  };

  //选择时间
  handleDatePicked = (date) => {
    //const deadline = date.toString();
    console.log('A date has been picked: ', date);
    this.setState({deadline: date.toString()});
    this.setDateTimePicker(false);
  };

  addDate = (days) => {
   var date =new Date();
   date.setDate(date.getDate()+days);
   return date;
  };

  onRegionChange = (region) => {
     this.setState({ region });
  };

  //选择默认图片
  choosePic() {
      ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('cancel!');
      }
      else if (response.error) {
        alert("ImagePickerError: " + response.error);
      }
      else if (response.customButton) {
        alert("customButton: " + response.customButton);
      }
      else {
        console.log(response);
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          defaultImgSouce: response.uri,
        });
      }
    });
  };

  //添加相册
  addPhoto(i) {
      ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('cancel！');
      }
      else if (response.error) {
        alert("ImagePickerError:" + response.error);
      }
      else if (response.customButton) {
        alert("customButton:" + response.customButton);
      }
      else {
        console.log(response);
        let source = { uri: response.uri };
        var img = this.state.img;
        img[i] = response.uri;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({img: img});
        console.log(this.state.img);
      }
    });
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

  //获取商品类型
  getItemCategory = () => {
    const url = Service.BaseUrl+`?a=category&v=${Service.version}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        var category = this.state.category;
        var arr = responseJson.data.data;
        console.log(arr);
        var newCategory = category.concat(arr);
        console.log(newCategory);
        this.setState({category: newCategory});
      }
      else {
        alert('请求错误');
      }
    })
    .catch(err => console.log(error))
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
       this.setState({ data: responseJson.data });
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

  //发布方法
  publish = () => {
      this.setState({ loading: true });
      const { name,token,aid,uid,tp,cid,price,mark,defaultImgSouce,img,underline,online,u,contact,deadline } = this.state;

      var paytp = null;
      if(online==true&&underline==false){
        paytp = 0;
      }
      else if(online==false&&underline==true){
        paytp = 1;
      }
      else if(online==true&&underline==true){
        paytp = 2;
      }
      else{
        paytp = null;
      }

      let formData = new FormData();
      for(i=0;i<6;i++){
        if(img[i]!=null){
          let file = {uri: img[i], type: 'multipart/form-data', name: 'img0'};
          formData.append('itemfile'+i,file);
        }
      }
      console.log(formData);
      //const body = `a=itempub&v=${Service.version}&token=${token}&uid=${uid}&aid=${aid}&name=${name}&tp=${tp}&cid=${cid}&price=${price}&mark=${mark}`;
      const url = Service.BaseUrl;

      //添加参数
      formData.append('a','itempub');
      formData.append('v',Service.version);
      formData.append('token',token);
      formData.append('uid',uid);
      formData.append('aid',aid);
      formData.append('name',name);
      formData.append('tp',tp);
      formData.append('cid',cid);
      formData.append('price',price);
      formData.append('u',u);
      formData.append('contact',contact);
      formData.append('mark',mark);
      formData.append('paytp',paytp);
      formData.append('deadline',deadline);

      console.log(formData);

      fetch(url,{
          method:'POST',
          headers:{
              'Content-Type':'multipart/form-data',
          },
          body: formData,
        })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({ loading: false });
          if(!responseJson.status){
            alert('发布成功!');
            console.log(this.state);
            this.props.navigation.dispatch(
              NavigationActions.reset({
               index: 0,
               actions: [
                 NavigationActions.navigate({
                   routeName: 'online',
                   params:  {
                     token: this.state.token,
                     uid: this.state.uid,
                     islogin: this.state.islogin,
                     res: responseJson,
                   },
                 })
               ]
             })
           );
          }
          else {
            alert('发布失败!');
          }
        })
        .catch(error => console.log(error))
  };


  //以下定义页面元素
  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "95%",
            backgroundColor: "#e1e8e2",//CED0CE
            marginLeft: "5%"
          }}
        />
      );
  };

  renderFooter = () => {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#e1e8e2"
          }}
        >
        </View>
      );
  };

  renderHeader = () => {
      return (<View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "0%"
                  }}>
              </View>
          );
  };

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

  //定义选择类型窗口
  renderCategoryModal = () => {
      return(
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.categoryMoalVisible}
          onRequestClose={() => {console.log("Modal has been closed.")}}
          >
         <View style={[styles.container]}>
           <View style={styles.StatusBar}>
           </View>
           <View style={styles.header}>
             <Text
               style={{marginLeft:20,color:'#5c492b'}}
               onPress={() => {
                 this.setCategoryModalVisible(!this.state.categoryMoalVisible);
               }}>
               返回
             </Text>
             <View style={{flex:1,alignItems:'center'}}>
               <Text>
                 服务类型
               </Text>
             </View>
           </View>
           <View style={{flex: 2,marginTop: 5}}>
             <FlatList
               data={this.state.category.slice(1)}
               renderItem={({ item }) => (
                 <CheckBox
                   containerStyle={{backgroundColor: '#FFFFFF'}}
                   title={item.name}
                   iconRight={true}
                   right={false}
                   textStyle={styles.title}
                   checked={this.state.cid==item.id? true:false}
                   onPress={() => this.setState({cid: item.id})}
                  />
               )}
               //ItemSeparatorComponent={this.renderSeparator}
               //ListHeaderComponent={this.renderHeader}
               //ListFooterComponent={this.renderFooter}
             />
           </View>
         </View>
          <Toast ref="toast_category" position='center' textStyle={{color: '#FFFFFF',fontSize: 16}}/>
        </Modal>
      );
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

  //定义联系方式添加窗口
  renderContactModal = () => {
       return(
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.contactModalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={styles.container}>
           <View style={styles.StatusBar}>
           </View>
           <View style={styles.header}>
             <Text
               style={{marginLeft:20,color:'#5c492b'}}
               onPress={() => this.setContactModalVisible(!this.state.contactModalVisible)}>
               返回
             </Text>
             <View style={{flex:1,}}>
             </View>
             <Text
               style={{marginRight:20,color:'#5c492b'}}
               onPress={() => {Keyboard.dismiss();alert('键盘已收起')}}>
               完成
             </Text>
           </View>
           <ScrollView
             style={styles.mark_modal_body}
             showsVerticalScrollIndicator={true}
             >
             <TextInput
               style={{flex: 1,fontSize: 16,fontWeight: '500'}}
               autoCapitalize='none'
               placeholder='fb?line?100字以内'
               multiline={true}
               maxLength={100}
               onChangeText={(contact) => this.setState({contact})}
               value={this.state.contact}
             />
           </ScrollView>
           </View>
        </Modal>
      );
  };

  //定义相册添加窗口
  renderAddPhotoModal = () => {
    return(
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.addPhotoModalVisible}
        onRequestClose={() => {console.log("Modal has been closed.")}}
        >
       <View style={styles.container}>
         <View style={styles.StatusBar}>
         </View>
         <View style={styles.header}>
           <Text
             style={{marginLeft:20,color:'#5c492b'}}
             onPress={() => {
               this.setAddPhotoModalVisible(!this.state.addPhotoModalVisible);
             }}>
             返回
           </Text>
         </View>
         <View style={styles.photo_modal_body}>
           <ScrollView>
             <TouchableOpacity style={styles.photo_view} key={0}>
              {this.returnPhoto(0)}
             </TouchableOpacity>
             <TouchableOpacity style={styles.photo_view} key={1}>
              {this.returnPhoto(1)}
             </TouchableOpacity>
             <TouchableOpacity style={styles.photo_view} key={2}>
               {this.returnPhoto(2)}
             </TouchableOpacity>
             <TouchableOpacity style={styles.photo_view} key={3}>
               {this.returnPhoto(3)}
             </TouchableOpacity>
             <TouchableOpacity style={styles.photo_view} key={4}>
               {this.returnPhoto(4)}
             </TouchableOpacity>
             <TouchableOpacity style={styles.photo_view} key={5}>
               {this.returnPhoto(5)}
             </TouchableOpacity>
             <View style={{height: 100,borderTopWidth: 1,borderBottomWidth: 2,borderColor: '#e1e8e2',alignItems: 'center'}} key={6}>
               <Text>
                 至多添加6张图片
               </Text>
             </View>
           </ScrollView>
         </View>
         </View>
      </Modal>
    );
  };

  //定义照片组件
  returnPhoto = (i) => {
    const { img } = this.state;
    if(img[i]==null||img[i]==''){
      return(
        <TouchableOpacity
          style={{height: 200}}
          onPress={() => this.addPhoto(i)}
          >
            <Image
              style={styles.img}
              source={require('../icon/publish/choose.png')}
              resizeMode='center'
            />
        </TouchableOpacity>
      );
    }
    else{
      return(
        <TouchableOpacity
          style={{height: 200 }}
          onPress={() => {
            Alert.alert(
              '请选择',
              '',
              [
                {
                  text: '修改',
                  onPress: () => {
                    this.addPhoto(i);
                  }
                },
                {
                  text: '删除',
                  onPress: () => {
                    var img = this.state.img;
                    img[i] = null;
                    this.setState({img: img});
                  }
                },
              ],
              { cancelable: true }
            );
          }}
          >
          <Image
            style={styles.img}
            source={{uri: this.state.img[i]}}
            resizeMode='center'
          />
        </TouchableOpacity>
      );
    }
  }

  returnLoadingMoadl = () => {
    return(
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.loading}
      >
        <View style={styles.container}>
          <View style={{alignSelf: 'center'}}>
            <ActivityIndicator animating size="small" />
          </View>
        </View>
      </Modal>
    );
  };

  showLoading = () => {
    if(!this.state.loading){
      return null;
    }
    else{
      return(
        <View
          style={{
            height: 22,
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    }
  };

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={styles.header}>
          </View>
          {this.showLoading()}
          <ScrollView>
            <TouchableOpacity
              style={styles.item_pic}
              >
              {this.returnPhoto(0)}
            </TouchableOpacity>
            <List containerStyle={{ borderTopWidth: 0,marginTop:0,marginBottom: 0,}}>
                  <ListItem
                      rightIcon={<TextInput
                      style={{ marginLeft:0,flex:1,fontSize:16,}}
                      titleStyle={styles.title}
                      placeholder='请在这里输入服务名称'
                      clearButtonMode='while-editing'
                      multiline={true}
                      onChangeText={(name) => this.setState({name})}
                      value={this.state.name}
                    />}
                    titleStyle={styles.title}
                    key={1}
                    title='服务'
                  />
                  <ListItem
                    titleStyle={styles.title}
                    rightIcon={<View></View>}
                    key={2}
                    title='价格'
                    textInput={true}
                    textInputOnChangeText={(price) => this.setState({price})}
                    textInputValue={this.state.price}
                  />
                  <ListItem
                    titleStyle={styles.title}
                    rightIcon={<View></View>}
                    key={3}
                    title='单位'
                    textInput={true}
                    textInputOnChangeText={(u) => this.setState({u})}
                    textInputValue={this.state.u}
                  />
            </List>
            <List>
              <ListItem
                titleStyle={styles.title}
                title='线下支付'
                rightIcon={
                  <Switch
                    value={this.state.underline}
                    onValueChange={(underline) => this.setState({underline})}
                    onTintColor='#5c492b'
                  />
                }
              />
              <ListItem
                titleStyle={styles.title}
                title='线上支付'
                rightIcon={
                  <Switch
                    value={this.state.online}
                    onValueChange={(online) => this.setState({online})}
                    onTintColor='#5c492b'
                  />
                }
              />
            </List>
            <List containerStyle={{marginBottom: 0,}}>
              <ListItem
                titleStyle={styles.title}
                title='服务类型'
                rightTitle='请选择'
                rightTitle={this.state.category[this.state.cid].name}
                onPress={() => this.setCategoryModalVisible(true)}
              />
              <ListItem
                titleStyle={styles.title}
                title='我的地址'
                rightTitle={this.state.address? this.state.address:'请选择'}
                onPress={() => this.setAddressModalVisible(true)}
              />
              <ListItem
                titleStyle={styles.title}
                title='联系方式'
                rightTitle={this.state.contact==null?'未编辑':'已编辑'}
                onPress={() => this.setContactModalVisible(true)}
              />
            </List>

            <List>
              <ListItem
                titleStyle={styles.title}
                title='相册'
                rightTitle='去添加'
                onPress={() => this.setAddPhotoModalVisible(true)}
              />
              <ListItem
                titleStyle={styles.title}
                title='详细描述'
                rightTitle={this.state.mark==null?'未编辑':'已编辑'}
                onPress={() => this.setMarkModalVisible(true)}
              />
              <ListItem
                titleStyle={styles.title}
                rightTitle={this.state.deadline==null?'未选择':this.state.deadline}
                onPress={() => this.setDateTimePicker(true)}
                title='有效期限'
              />
            </List>
            <View style={styles.footer}>
              <Text style={styles.footer_text}>
                * 有效期最长为90天
              </Text>
              <CheckBox
                title='我已阅读用户协议并同意'
                textStyle={{fontSize: 12}}
                style={{alignSelf: 'stretch',marginLeft: 10,marginBottom: 5,marginTop: 5}}
                checked={true}
              />
            </View>
        </ScrollView>
        <Button
        buttonStyle={{marginTop:5,marginBottom:5}}
        backgroundColor='#fbe994'
        title='Submit'
        textStyle={{color:'#5c492b',fontWeight:'500'}}
        onPress={() => {
          console.log((this.state.online||this.state.underline));
          if(this.state.img[0]==null||this.state.img[0]==''){
            alert('请添加封面图片');
          }
          else if(this.state.name==null||this.state.name==''){
            alert('请填写名字');
          }
          else if(!isRealNum(this.state.price)){
            alert('请填写正确的价格');
          }
          else if(!(this.state.online||this.state.underline)){
            alert('请选择至少一种交易方式');
          }
          else if (!this.state.cid) {
            alert('请选择服务类型');
          }
          else if(this.state.aid==null||this.state.aid==''){
            alert('请选择地址');
          }
          else if(this.state.deadline==null||this.state.deadline==''){
            alert('请选择有效期限');
          }
          else{
            this.publish();
          }
        }}
        />
        <DateTimePicker
          mode='date'
          isVisible={this.state.isDateTimePickerVisible}
          confirmTextIOS='确定'
          cancelTextIOS='取消'
          onConfirm={this.handleDatePicked}
          onCancel={() => this.setDateTimePicker(false)}
          minimumDate={new Date()}
          //maximumDate={this.addDate(90)}
        />
        {this.renderMarkModal()}
        {this.renderAddressModal()}
        {this.renderContactModal()}
        {this.renderAddPhotoModal()}
        {this.renderCategoryModal()}
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
    backgroundColor: '#f2f2f2',
  },
  StatusBar:  {
      height: 22,
      backgroundColor: '#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
  },
  item_pic: {
    height: 200,
    marginTop: 1,
    width: width,
    //alignItems: 'center',
  },
  img: {
    flex:1,
    height: 200,
    width: '100%',
    //alignSelf: 'center'
  },
  mark_modal_body: {
    height: 3000,
    flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'stretch'
    marginLeft: 5,
    marginRight: 5,
  },
  contact_modal_body: {
    flexDirection: 'column',
    marginLeft: 5,
    marginRight: 5,
  },
  photo_modal_body: {
    flexDirection: 'column',
    marginLeft: 5,
    marginRight: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 16,
    color: '#5c492b',
    fontWeight: '500',
  },
  icon: {
    width: 25,
    height: 25,
  },
  icon_send: {
    width: 25,
    height: 25,
  },
  photo_view: {
    height: 200,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#e1e8e2',
    //alignItems: 'center',
  },
  footer: {
    height: 50,
    marginTop: 10,
    flexDirection: 'column',
  },
  footer_text: {
    marginLeft:10,
    color: '#5c492b',
    fontSize: 12,
    fontWeight: '500',
  }
});
export default publish_Service;
