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
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';
<<<<<<< Updated upstream

=======
import { I18n } from '../common/I18n';
>>>>>>> Stashed changes
//获取屏幕宽高
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

//图片选择器参数设置
var options = {
<<<<<<< Updated upstream
  title: '请选择图片来源',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'相册图片',
=======
  title: I18n.t('publish.txt6'),
  cancelButtonTitle:I18n.t('common.cancel'),
  takePhotoButtonTitle:I18n.t('publish.take'),
  chooseFromLibraryButtonTitle:I18n.t('publish.from_album'),
>>>>>>> Stashed changes
  /*customButtons: [
    {name: 'hangge', title: 'hangge.com图片'},
  ],*/
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
<<<<<<< Updated upstream
  maxWidth: 2400,
  maxHeight: 1600,
=======
  maxWidth: 600,
  maxHeight: 600,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
         data: [],
         category: [{id:'0' ,name: '请选择',parent: '0'}],
=======
         isInfoModalVisible: false,
         isDisabled: false,
         isDisabled1: false,
         data: [],
         category: [{id:'0' ,name: I18n.t('publish.choose'),parent: '0'}],
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
         offline: false,
         online: false,
=======
>>>>>>> Stashed changes
         defaultImgSouce: null,
         img: [ null,null,null,null,null,null],
         online: false,
         underline: false,
         deadline: null,
         //
         loading: false,
<<<<<<< Updated upstream
=======
         isCheck: true,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
    this.getAddress();
>>>>>>> Stashed changes
  };

  //打开详情描述窗口
  setMarkModalVisible(visible){
    this.setState({markModalVisible: visible});

  };

  //打开地址选择窗口
  setAddressModalVisible(visible){
<<<<<<< Updated upstream
    this.getAddress();
=======
    //this.getAddress();
>>>>>>> Stashed changes
    this.setState({addressModalVisible: visible});
  };

  //打开地址添加窗口
  setNewAddressModalVisible(visible){
<<<<<<< Updated upstream
    this.setState({newAddressModalVisible: visible});
=======
    this.setState({newAddressModalVisible: visible,info: null,});
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('cancel!');
=======


      if (response.didCancel) {

>>>>>>> Stashed changes
      }
      else if (response.error) {
        alert("ImagePickerError: " + response.error);
      }
      else if (response.customButton) {
        alert("customButton: " + response.customButton);
      }
      else {
<<<<<<< Updated upstream
        console.log(response);
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('cancel！');
=======


      if (response.didCancel) {

>>>>>>> Stashed changes
      }
      else if (response.error) {
        alert("ImagePickerError:" + response.error);
      }
      else if (response.customButton) {
        alert("customButton:" + response.customButton);
      }
      else {
<<<<<<< Updated upstream
        console.log(response);
=======

>>>>>>> Stashed changes
        let source = { uri: response.uri };
        var img = this.state.img;
        img[i] = response.uri;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({img: img});
<<<<<<< Updated upstream
        console.log(this.state.img);
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           console.log("获取位置失败："+ error);
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        alert('请求错误');
=======
        alert(I18n.t('error.fetch_failed'));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
       alert('添加成功');
     }
     else {
       alert('添加失败');
=======
       alert(I18n.t('success.add'));
     }
     else {
       alert(I18n.t('error.add_failed'));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      console.log(formData);
=======

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      console.log(formData);

=======
>>>>>>> Stashed changes
      fetch(url,{
          method:'POST',
          headers:{
              'Content-Type':'multipart/form-data',
          },
          body: formData,
        })
        .then(response => response.json())
        .then(responseJson => {
<<<<<<< Updated upstream
          console.log(responseJson);
          this.setState({ loading: false });
          if(!responseJson.status){
            alert('发布成功!');
=======

          this.setState({ loading: false });
          if(!responseJson.status){
            alert(I18n.t('success.publish'));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            alert('发布失败!');
          }
        })
        .catch(error => console.log(error))
=======
            alert(I18n.t('error.add_failed'));
          }
        })
        .catch(error => {console.log(error);this.setState({loading: false})})
>>>>>>> Stashed changes
  };


  //以下定义页面元素
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
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#e5e5e5"
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
<<<<<<< Updated upstream
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
=======
             <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
               <Icon
                 style={{marginLeft: 5}}
                 name='keyboard-arrow-left'
                 color='#f1a073'
                 size={32}
                 onPress={() => {
                   this.setAddressModalVisible(!this.state.addressModalVisible);
                 }}
               />
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
               <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                 {I18n.t('publish.myAddress')}
               </Text>
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
               <View style={{marginRight: 10}}>
                 <Icon
                   name='add'
                   color='#f1a073'
                   size={28}
                   onPress={() => this.setState({newAddressModalVisible: true},this.getLocation)}
                 />
               </View>
             </View>
           </View>
           <View style={{flex: 1,marginTop: 0,backgroundColor: '#FFFFFF'}}>
>>>>>>> Stashed changes
             <FlatList
               data={this.state.data}
                   renderItem={({ item }) => (
                     <CheckBox
<<<<<<< Updated upstream
                       containerStyle={{ borderBottomWidth: 0,borderWidth: 0,borderColor: '#FFFFFF',alignSelf: 'stretch' }}
=======
                       containerStyle={{backgroundColor: '#FFFFFF',borderColor: '#FFFFFF',borderWidth: 0,marginTop: 0,marginBottom: 0}}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
               keyExtractor={item => item.id}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
           <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
             <Icon
               style={{marginLeft: 5}}
               name='keyboard-arrow-left'
               color='#f1a073'
               size={32}
               onPress={() => {
                 this.setNewAddressModalVisible(!this.state.newAddressModalVisible);
               }}
             />
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
             <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
               {I18n.t('publish.new')}
             </Text>
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
           </View>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
               <TouchableOpacity style={{height: 50,width: 50,}} onPress={() => this.getLocation()}>
                 <Image
                   source={require('../icon/tarbar/locate.png')}
                   style={{height: 50,width: 50}}
                 />
               </TouchableOpacity>
>>>>>>> Stashed changes
               <MapView.Marker
                 coordinate={this.state.region}
               />
           </MapView>
          </View>
<<<<<<< Updated upstream
          <View style={{flex:1,}}>
                <TextInput
                  style={{height:50,alignSelf:'stretch'}}
                  placeholder="请输入内容"
                  onChangeText={(info) => this.setState({info})}
                  value={this.state.info}
                  onEndEditing={() => Keyboard.dismiss()}
                />
          </View>
=======
          <View style={{height: 1,backgroundColor: '#e5e5e5'}}></View>
          <View style={styles.modal_body}>
            <ListItem
              key={1}
              title={I18n.t('publish.info')}
              titleStyle={styles.title}
              rightTitle={this.state.info==''?I18n.t('publish.no_edit'):this.state.info}
              containerStyle={styles.listContainerStyle}
              rightTitleNumberOfLines={3}
              onPress={() => this.setState({isInfoModalVisible: true})}
            />
          </View>
          <Button
            style={styles.button}
            buttonStyle={{marginTop:5,marginBottom:5,}}
            borderRadius={5}
            backgroundColor='#f1a073'
            onPress={() => {
              if(this.state.info==null){
                alert(I18n.t('publish.no_info'));
              }
              else{
                this.addAddress();
              }
            }}
            title={I18n.t('publish.add_address')} />
            {this.renderInfoModal()}
>>>>>>> Stashed changes
         </View>
      </Modal>
    );
  };

<<<<<<< Updated upstream
=======
  //地址名页面
  renderInfoModal = () => {
    return(
      <Modalbox
        style={{height: 220,width: 300,alignItems: 'center',}}
        isOpen={this.state.isInfoModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({isInfoModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('publish.info')}
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
              placeholder={I18n.t('publish.txt1')}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.submit')}
            onPress={() => this.setState({isInfoModalVisible: false,})}
          />
      </Modalbox>
    );
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
             <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
               <Icon
                 style={{marginLeft: 5}}
                 name='keyboard-arrow-left'
                 color='#f1a073'
                 size={32}
                 onPress={() => {
                   this.setCategoryModalVisible(!this.state.categoryMoalVisible);
                 }}
               />
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
               <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                 {I18n.t('publish.S_cate')}
               </Text>
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
             </View>
           </View>
           <View style={{flex: 1,marginTop: 0,backgroundColor: '#FFFFFF'}}>
>>>>>>> Stashed changes
             <FlatList
               data={this.state.category.slice(1)}
               renderItem={({ item }) => (
                 <CheckBox
<<<<<<< Updated upstream
                   containerStyle={{backgroundColor: '#FFFFFF'}}
=======
                   containerStyle={{backgroundColor: '#FFFFFF',borderColor: '#FFFFFF',borderWidth: 0,marginTop: 0,marginBottom: 0,}}
>>>>>>> Stashed changes
                   title={item.name}
                   iconRight={true}
                   right={false}
                   textStyle={styles.title}
                   checked={this.state.cid==item.id? true:false}
                   onPress={() => this.setState({cid: item.id})}
                  />
               )}
<<<<<<< Updated upstream
               //ItemSeparatorComponent={this.renderSeparator}
=======
               ItemSeparatorComponent={this.renderSeparator}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
             <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
               <Icon
                 style={{marginLeft: 5}}
                 name='chevron-left'
                 color='#f1a073'
                 size={32}
                 onPress={() => this.setMarkModalVisible(!this.state.markModalVisible)}
               />
             </View>
             <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
               <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                 {I18n.t('publish.mark')}
               </Text>
             </View>
             <View style={{flex: 1,flexDirection: 'column',justifyContent: 'flex-end'}} >
             </View>
>>>>>>> Stashed changes
           </View>
           <ScrollView
             style={styles.contact_modal_body}
             showsVerticalScrollIndicator={true}
             >
             <TextInput
               style={{flex: 1,height: 1500,fontSize: 16,fontWeight: '500'}}
               autoCapitalize='none'
<<<<<<< Updated upstream
               placeholder='请详细描述您的服务'
=======
               placeholder={I18n.t('publish.txt2')}
>>>>>>> Stashed changes
               multiline={true}
               onChangeText={(mark) => this.setState({mark})}
               value={this.state.mark}
             />
<<<<<<< Updated upstream
             <Text style={{ marginTop: 10,marginBottom: 10,height: 40,fontSize: 12,fontWeight: '500',alignSelf: 'center'}}>
               不能再添加更多内容
=======
             <View style={{height: 1,backgroundColor: '#e5e5e5',marginLeft: 10,marginRight: 10}}>
             </View>
             <Text style={{ marginTop: 10,marginBottom: 10,height: 40,fontSize: 12,fontWeight: '500',alignSelf: 'center'}}>
               {I18n.t('publish.txt3')}
>>>>>>> Stashed changes
             </Text>
           </ScrollView>
           </View>
        </Modal>
      );
  };

<<<<<<< Updated upstream
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
=======

  //联系方式
  renderContactModal = () => {
    return(
      <Modalbox
        style={{height: 240,width: 300,alignItems: 'center',}}
        isOpen={this.state.contactModalVisible}
        isDisabled={this.state.isDisabled}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({contactModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('publish.contact')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.contactInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              autoCapitalize='none'
              maxLength={100}
              placeholder={I18n.t('publish.contact')}
              editable={true}
              onChangeText={(contact) => this.setState({contact})}
              value={this.state.contact}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.finish')}
            onPress={() => this.setState({contactModalVisible: false,})}
          />
      </Modalbox>
    );
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           <Text
             style={{marginLeft:20,color:'#5c492b'}}
             onPress={() => {
               this.setAddPhotoModalVisible(!this.state.addPhotoModalVisible);
             }}>
             返回
           </Text>
=======
           <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
             <Icon
               style={{marginLeft: 5}}
               name='keyboard-arrow-left'
               color='#f1a073'
               size={32}
               onPress={() => {
                 this.setAddPhotoModalVisible(!this.state.addPhotoModalVisible);
               }}
             />
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
             <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
               {I18n.t('publish.add_photo')}
             </Text>
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
           </View>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                 至多添加6张图片
=======
                 {I18n.t('publish.txt5')}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          style={{height: 200}}
=======
          style={{height: 200,width: '100%',marginLeft: 1,marginRight: 1}}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          style={{height: 200 }}
          onPress={() => {
            Alert.alert(
              '请选择',
              '',
              [
                {
                  text: '修改',
=======
          style={{height: 200,width: '100%',marginLeft: 1,marginRight: 1 }}
          onPress={() => {
            Alert.alert(
              I18n.t('publish.choose'),
              '',
              [
                {
                  text: I18n.t('common.update'),
>>>>>>> Stashed changes
                  onPress: () => {
                    this.addPhoto(i);
                  }
                },
                {
<<<<<<< Updated upstream
                  text: '删除',
=======
                  text: I18n.t('common.delete'),
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            resizeMode='center'
=======
            resizeMode='cover'
>>>>>>> Stashed changes
          />
        </TouchableOpacity>
      );
    }
  }

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

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={styles.header}>
<<<<<<< Updated upstream
=======
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
                {I18n.t('publish.S_title')}
              </Text>
            </View>
            <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            </View>
>>>>>>> Stashed changes
          </View>
          <ScrollView>
            <TouchableOpacity
              style={styles.item_pic}
              >
              {this.returnPhoto(0)}
            </TouchableOpacity>
            <List containerStyle={[styles.list,{marginTop: 0}]}>
<<<<<<< Updated upstream
                  <ListItem
                    rightIcon={
                      <TextInput
                          style={{ marginLeft:0,flex:1,fontSize:16}}
                          titleStyle={styles.title}
                          placeholder='请在这里输入服务名称'
=======
                <ListItem
                    rightIcon={
                      <TextInput
                          style={{ marginLeft:0,flex:1,fontSize:16,color: '#333333'}}
                          placeholderTextColor='#999999'
                          titleStyle={styles.title}
                          placeholder={I18n.t('publish.txt5')}
>>>>>>> Stashed changes
                          clearButtonMode='while-editing'
                          multiline={true}
                          onChangeText={(name) => this.setState({name})}
                          value={this.state.name}
                      />
                    }
                    titleStyle={styles.title}
                    key={1}
<<<<<<< Updated upstream
                    title='服务'
=======
                    title={I18n.t('publish.Service')}
>>>>>>> Stashed changes
                    containerStyle={styles.listContainerStyle}
                  />
                  {this.renderSeparator()}
                  <ListItem
                    titleStyle={styles.title}
                    rightIcon={<View></View>}
                    key={2}
<<<<<<< Updated upstream
                    title='价格'
=======
                    title={I18n.t('publish.price')}
>>>>>>> Stashed changes
                    textInput={true}
                    textInputOnChangeText={(price) => this.setState({price})}
                    textInputValue={this.state.price}
                    containerStyle={styles.listContainerStyle}
                  />
                  {this.renderSeparator()}
                  <ListItem
                    titleStyle={styles.title}
                    rightIcon={<View></View>}
                    key={3}
<<<<<<< Updated upstream
                    title='单位'
=======
                    title={I18n.t('publish.u')}
>>>>>>> Stashed changes
                    textInput={true}
                    textInputOnChangeText={(u) => this.setState({u})}
                    textInputValue={this.state.u}
                    containerStyle={styles.listContainerStyle}
                  />
            </List>
            <List containerStyle={styles.list}>
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='线下支付'
=======
                title={I18n.t('publish.underline')}
>>>>>>> Stashed changes
                rightIcon={
                  <Switch
                    value={this.state.underline}
                    onValueChange={(underline) => this.setState({underline})}
<<<<<<< Updated upstream
                    onTintColor='#5c492b'
=======
                    onTintColor='#f1a073'
>>>>>>> Stashed changes
                  />
                }
                containerStyle={styles.listContainerStyle}
              />
              {this.renderSeparator()}
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='线上支付'
=======
                title={I18n.t('publish.online')}
>>>>>>> Stashed changes
                rightIcon={
                  <Switch
                    value={this.state.online}
                    onValueChange={(online) => this.setState({online})}
<<<<<<< Updated upstream
                    onTintColor='#5c492b'
=======
                    onTintColor='#f1a073'
>>>>>>> Stashed changes
                  />
                }
                containerStyle={styles.listContainerStyle}
              />
            </List>
            <List containerStyle={styles.list}>
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='服务类型'
                rightTitle='请选择'
=======
                title={I18n.t('publish.S_cate')}
>>>>>>> Stashed changes
                rightTitle={this.state.category[this.state.cid].name}
                onPress={() => this.setCategoryModalVisible(true)}
                containerStyle={styles.listContainerStyle}
              />
              {this.renderSeparator()}
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='我的地址'
                rightTitle={this.state.address? this.state.address:'请选择'}
=======
                title={I18n.t('publish.myAddress')}
                rightTitle={this.state.address? this.state.address:I18n.t('publish.choose')}
>>>>>>> Stashed changes
                onPress={() => this.setAddressModalVisible(true)}
                containerStyle={styles.listContainerStyle}
              />
              {this.renderSeparator()}
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='联系方式'
                rightTitle={this.state.contact==null?'未编辑':'已编辑'}
=======
                title={I18n.t('publish.contact')}
                rightTitle={this.state.contact==null?I18n.t('publish.is_edit'):I18n.t('publish.no_edit')}
>>>>>>> Stashed changes
                onPress={() => this.setContactModalVisible(true)}
                containerStyle={styles.listContainerStyle}
              />
            </List>
            <List containerStyle={styles.list}>
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='相册'
                rightTitle='去添加'
=======
                title={I18n.t('publish.album')}
                rightTitle={I18n.t('publish.add')}
>>>>>>> Stashed changes
                onPress={() => this.setAddPhotoModalVisible(true)}
                containerStyle={styles.listContainerStyle}
              />
              {this.renderSeparator()}
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                title='详细描述'
                rightTitle={this.state.mark==null?'未编辑':'已编辑'}
=======
                title={I18n.t('publish.mark')}
                rightTitle={this.state.mark==null?I18n.t('publish.is_edit'):I18n.t('publish.no_edit')}
>>>>>>> Stashed changes
                onPress={() => this.setMarkModalVisible(true)}
                containerStyle={styles.listContainerStyle}
              />
              {this.renderSeparator()}
              <ListItem
                titleStyle={styles.title}
<<<<<<< Updated upstream
                rightTitle={this.state.deadline==null?'未选择':this.state.deadline}
                onPress={() => this.setDateTimePicker(true)}
                containerStyle={styles.listContainerStyle}
                title='有效期限'
              />
            </List>
            <View style={styles.footer}>
              <Text style={styles.footer_text}>
                * 有效期最长为90天
              </Text>
              <CheckBox
=======
                rightTitle={I18n.t('publish.t90')}
                containerStyle={styles.listContainerStyle}
                title={I18n.t('publish.deadline')}
              />
            </List>
            <View style={styles.footer}>
            {/*  <CheckBox
>>>>>>> Stashed changes
                title='我已阅读用户协议并同意'
                textStyle={{fontSize: 12}}
                style={{alignSelf: 'stretch',marginLeft: 10,marginBottom: 5,marginTop: 5,backgroundColor: '#f2f2f2'}}
                containerStyle={{backgroundColor: '#f2f2f2'}}
<<<<<<< Updated upstream
                checked={true}
              />
            </View>
=======
                checked={this.state.isCheck}
                onPress={() => this.setState({isCheck: !this.state.isCheck})}
              />*/}
            </View>
            {this.showLoading()}
>>>>>>> Stashed changes
        </ScrollView>
        <Button
        style={styles.button}
        backgroundColor='#f1a073'
        borderRadius={5}
<<<<<<< Updated upstream
        title='Submit'
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
=======
        title={I18n.t('common.submit')}
        onPress={() => {
          console.log((this.state.online||this.state.underline));
          if(this.state.img[0]==null||this.state.img[0]==''){
            alert(I18n.t('publish.no_img'));
          }
          else if(this.state.name==null||this.state.name==''){
            alert(I18n.t('publish.no_name'));
          }
          else if(!isRealNum(this.state.price)){
            alert(I18n.t('publish.no_pirce'));
          }
          else if(!(this.state.online||this.state.underline)){
            alert(I18n.t('publish.no_paytp'));
          }
          else if (!this.state.cid) {
            alert(I18n.t('publish.no_cate'));
          }
          else if(this.state.aid==null||this.state.aid==''){
            alert(I18n.t('publish.no_addr'));
>>>>>>> Stashed changes
          }
          else{
            this.publish();
          }
        }}
        />
        <DateTimePicker
          mode='date'
          isVisible={this.state.isDateTimePickerVisible}
<<<<<<< Updated upstream
          confirmTextIOS='确定'
          cancelTextIOS='取消'
=======
          confirmTextIOS={I18n.t('common.confirm')}
          cancelTextIOS={I18n.t('common.cancel')}
>>>>>>> Stashed changes
          onConfirm={this.handleDatePicked}
          onCancel={() => this.setDateTimePicker(false)}
          minimumDate={new Date()}
          maximumDate={this.addDate(90)}
        />
        {this.renderMarkModal()}
        {this.renderAddressModal()}
        {this.renderContactModal()}
        {this.renderAddPhotoModal()}
        {this.renderCategoryModal()}
<<<<<<< Updated upstream
        {this.showLoading()}
=======

>>>>>>> Stashed changes
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
      backgroundColor: '#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< Updated upstream
=======
    borderColor: '#e5e5e5',
    borderBottomWidth: 1,
>>>>>>> Stashed changes
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
<<<<<<< Updated upstream
    fontWeight: '500',
=======
>>>>>>> Stashed changes
  },
  list: {
    borderColor: '#e5e5e5',
    borderWidth: 1,
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
<<<<<<< Updated upstream
    borderColor: '#e1e8e2',
=======
    borderColor: '#e5e5e5',
>>>>>>> Stashed changes
    //alignItems: 'center',
  },
  footer: {
    height: 50,
    marginTop: 10,
    flexDirection: 'column',
  },
  footer_text: {
    marginLeft:10,
<<<<<<< Updated upstream
    color: '#5c492b',
=======
    color: '#da695c',
>>>>>>> Stashed changes
    fontSize: 12,
    fontWeight: '500',
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF'
  },
  button: {
    alignSelf: 'center',
    marginTop :5,
    width: 280,
    height: 50,
  },
<<<<<<< Updated upstream

=======
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
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  modal_body: {
    flex: 1,
    backgroundColor: '#f2f2f2'
    //flexDirection: 'column',
    //alignItems: 'center',
  },
  markInput:{
    width: 260,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
>>>>>>> Stashed changes
});
export default publish_Service;
