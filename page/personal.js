import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Modal,
  Alert,
  CameraRoll,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem, Avatar} from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Modalbox from 'react-native-modalbox';
import ImagePicker from 'react-native-image-picker';
import Service from '../common/service.js';
import { I18n } from '../common/I18n';
//图片选择器参数设置
var options = {
  title: I18n.t('user.nickname'),
  cancelButtonTitle:  I18n.t('common.cancel'),
  takePhotoButtonTitle: I18n.t('user.pick_photo'),
  chooseFromLibraryButtonTitle: I18n.t('user.album'),
  customButtons: [
    {name: 'look', title: I18n.t('user.look')},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  maxWidth: 600,
  maxHeight: 600,
};

//图片选择器参数设置
var options = {
  title: '请选择',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍摄头像',
  chooseFromLibraryButtonTitle:'从相册中选择',
  customButtons: [
    {name: 'default', title: '默认头像'},
    {name: 'look', title: '查看头像'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  maxWidth: 2400,
  maxHeight: 1600,
};


export default class personal extends Component {
  static navigationOptions = {
   title: '个人信息',
   headerTitleStyle:{color:'#333333',fontWeight:'bold'}
 }

 constructor(props){
   super(props);
   this.state = {
     token: null,
     uid: null,
     islogin: null,
     //控制窗口
     UpdateInfoModalVisible: false,
     isDateTimePickerVisible: false,
     isMarkModalVisible: false,
     isDisabled: false,
     //用户信息
     user: {},
     //修改用户信息
     Update: {
       title: '修改信息',
       name: 'prop',
       value: null,
     },

     loading: false,
   };
 };

 componentWillMount(){
   const { params } = this.props.navigation.state;
   this.state.token = params.token;
   this.state.uid = params.uid;
   this.state.islogin = params.islogin;
   this.getUserInfo();
 };

 componentDidMount(){

 };

 setDateTimePicker(visible){
   this.setState({isDateTimePickerVisible: visible});
 };

 //查询用户信息
 getUserInfo = () => {
   const { token,uid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=info&token=${token}&uid=${uid}&id=${uid}&v=${Service.version}`;

   this.setState({loading: true,});
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({user: responseJson.data.user});
     }
     else{
       alert(I18n.t('error.fetch_failed')+'\n'+responseJson.err);
     }
   })
   .then(() => this.setState({loading: false},))
   .catch(err => {
     console.log(err);
     this.setState({loading: false});
   })
 };



 //修改用户信息
 UpdateInfo = () => {
   const { name,value } = this.state.Update;
   const { token ,uid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&${name}=${value}`;

   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert(I18n.t('success.update'));
     }
     else{
       alert(I18n.t('error.update_failed')+'\n'+responseJson.err);
     }
   })
   .then(() => this.getUserInfo())
   .then(() => {DeviceEventEmitter.emit('update_user');})
   .catch(err =>  console.log(err))
 };

 UpdateSex = () => {
   const { name,value } = this.state.Update;
   const { token ,uid } = this.state;
   const gender = this.state.user.gender==0? 1:0;
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&gender=${gender}`;

   fetch(url)
   .then(response => response.json())
   .then(responseJson => {

     if(!responseJson.status){
       alert(I18n.t('success.update'));
     }
     else{
       alert(I18n.t('success.update_failed')+'\n'+responseJson.err);
     }
   })
   .then(() => this.getUserInfo())
   .then(() => {DeviceEventEmitter.emit('update_user');})
   .catch(err =>  console.log(err))
 };

 ChooseFace = () => {
   ImagePicker.showImagePicker(options, (response) => {
     console.log('Response = ', response);

     if (response.didCancel) {

     }
     else if (response.error) {
       alert("ImagePickerError: " + response.error);
     }
     else if (response.customButton=='look') {
       alert(I18n.t('user.look'));
     }
     else {

       let file = {uri: response.uri, type: 'multipart/form-data', name: 'face'};
       this.updateFace(file);
     }
   });
 };


 updateFace = (file) => {


   const { token,uid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=face&v=${Service.version}&token=${token}&uid=${uid}`;

   let formData = new FormData();
   formData.append('face',file);

   this.setState({loading: true,})
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
         alert(I18n.t('success.update'));
       }
       else {
         alert(I18n.t('error.update_failed'));
       }
     })
     .then(() => this.setState({loading: false}))
     .then(() => this.getUserInfo())
     .then(() => {DeviceEventEmitter.emit('update_user');})
     .catch(error => console.log(error));


 };

 ChooseFace = () => {
   ImagePicker.showImagePicker(options, (response) => {
     console.log('Response = ', response);

     if (response.didCancel) {
       console.log('cancel!');
     }
     else if (response.error) {
       alert("ImagePickerError: " + response.error);
     }
     else if (response.customButton=='look') {
       alert('查看头像');
     }
     else if (response.customButton=='default') {
       this.saveImg(Service.BaseUri+this.state.user.face);
     }
     else {
       console.log(response);
       let file = {uri: response.uri, type: 'multipart/form-data', name: 'face'};
       this.updateFace(file);
     }
   });
 };


 updateFace = (file) => {
   console.log(file);

   const { token,uid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=face&v=${Service.version}&token=${token}&uid=${uid}`;

   let formData = new FormData();
   formData.append('face',file);
   console.log(formData);
   this.setState({loading: true,})
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
         alert('上传成功!');
       }
       else {
         alert('上传失败!');
       }
     })
     .then(() => this.setState({loading: false}))
     .then(() => this.getUserInfo())
     .catch(error => alert('发生错误: '+err.name+'\n详情: '+err.message));


 };

 //修改生日
 handleDatePicked = (date) => {
   this.setState({isDateTimePickerVisible: false})
   const { token ,uid } = this.state;

   const birthdate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&birthdate=${birthdate}`;


   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert(I18n.t('success.update'));

     }
     else{
       alert(I18n.t('error.update_failed')+'\n'+responseJson.err);
     }

   })
   .then(() =>  this.getUserInfo())
   .catch(err =>  console.log(error))
 };

 //定义页面元素

 //定义修改用户信息的页面
 renderUpdateInfoModal = () => {

   return(
     <Modal
       animationType={"slide"}
       transparent={false}
       visible={this.state.UpdateInfoModalVisible}
       onRequestClose={() => {console.log("Modal has been closed.")}}
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
              onPress={() => {
                this.setState({
                  UpdateInfoModalVisible: false,
                  Update: {
                    title: I18n.t('user.update'),
                    name: 'prop',
                    value: null,
                  },
                })
              }
            }
            />
          </View>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
              {this.state.Update.title}
            </Text>
          </View>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'flex-end',marginRight: 5}}>
            <Icon
              style={{alignSelf: 'center'}}
              name='mode-edit'
              color='#f1a073'
              size={28}
              onPress={() => this.UpdateInfo()}
            />
          </View>
        </View>
        <View style={{height: 40,marginRight: 5,marginLeft: 5, borderColor: '#f1a073', borderBottomWidth: 1,padding: 0}}>
          <TextInput
            style={{flex: 1}}
            onChangeText={(value) => {
              var Update1 = this.state.Update;
              Update1.value = value;
              this.setState({Update: Update1});
            }}
            value={this.state.Update.value}
          />
        </View>
        </View>
    </Modal>
   );
 };

 renderMarkModal = () => {
   return(
     <Modalbox
       style={{height: 240,width: 300,alignItems: 'center',}}
       isOpen={this.state.isMarkModalVisible}
       isDisabled={this.state.isDisabled}
       position='center'
       backdrop={true}
       backButtonClose={true}
       onClosed={() => {
         this.setState({
           isMarkModalVisible: false,
           Update: {
             title: I18n.t('user.update'),
             name: 'prop',
             value: null,
           },
         })
       }
     }>

         <Text style={{marginTop: 10}}>
           {I18n.t('user.mark')}
         </Text>
         <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
           <TextInput
             style={styles.markInput}
             autoCapitalize='none'
             multiline = {true}
             underlineColorAndroid="transparent"
             editable={true}
             maxLength={280}
             placeholder={I18n.t('user.txt1')}
             value={this.state.Update.value}
             onChangeText={(value) => {
               var Update1 = this.state.Update;
               Update1.value = value;
               this.setState({Update: Update1});
             }}
           />
         </View>
         <Button
           style={styles.button1}
           backgroundColor='#f1a073'
           borderRadius={5}
           title={I18n.t('common.submit')}
           onPress={() => this.UpdateInfo()}
         />
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

 returnAvatarSource = () => {
   var source = require('../icon/person/default_avatar.png');
   if(this.state.user.face==''||this.state.user.face==null){

   }
   else{
     source = {uri: Service.BaseUri+this.state.user.face};
   }


   return source;
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
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;
   console.log(this.state);
   const list1 = [
     {
       id: 1,
       title: I18n.t('user.nickname'),
       value: this.state.user.name==''?I18n.t('user.none'):this.state.user.name,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.nickname'),name: 'name',value: this.state.user.name};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title: I18n.t('user.sex'),
       value: this.state.user.gender==0?I18n.t('user.male'):I18n.t('user.female'),
       rightIcon: false,
       press: () => {
         Alert.alert(
            I18n.t('user.txt2'),
            '',
            [

              {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: I18n.t('common.yes'), onPress: () => this.UpdateSex()},
            ],
            { cancelable: false }
          );
       }
     },
     {
       id: 3,
       title: I18n.t('user.birthdate'),
       value: this.state.user.birthdate==''?I18n.t('user.none'):this.state.user.birthdate,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.birthdate'),name: 'birthdate',value: this.state.user.birthdate};
         this.setState({Update: Update, isDateTimePickerVisible: true});
       }
     }
   ]

   const list2 = [
     {
       id: 1,
       title: I18n.t('user.city'),
       value: this.state.user.city==''?I18n.t('user.none'):this.state.user.city,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.city'),name: 'city',value: this.state.user.city};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title:I18n.t('user.occ'),
       value: this.state.user.occ==''?I18n.t('user.none'):this.state.user.occ,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.occ'),name: 'occ',value: this.state.user.occ};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 3,
       title:I18n.t('user.work'),
       value: this.state.user.work==''?I18n.t('user.none'):this.state.user.work,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.work'),name: 'work',value: this.state.user.work};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     }
   ]

   const list3 = [
     {
       id: 1,
       title:I18n.t('user.phone'),
       value: this.state.user.phone==''?I18n.t('user.none'):this.state.user.phone,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.phone'),name: 'phone',value: this.state.user.phone};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title:I18n.t('user.mail'),
       value: this.state.user.email==''?I18n.t('user.none'):this.state.user.email,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.none'),name: 'email',value: this.state.user.email};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 3,
       title: I18n.t('user.mark'),
       value: I18n.t('user.go'),
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.mark'),name: 'mark',value: this.state.user.mark};
         this.setState({Update: Update, isMarkModalVisible: true});
       }
     },
   ];
   return (
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
           onPress={() => this.props.navigation.goBack()}
         />
       </View>
       <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
         <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
           {I18n.t('user.user')}
         </Text>
       </View>
       <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
       </View>
     </View>
     <ScrollView>
       <View style={styles.banner}>
         <TouchableOpacity onPress={() => this.ChooseFace()}>
           <Image
             style={styles.avatar}
             source={this.returnAvatarSource()}
           />
         </TouchableOpacity>
       </View>
       <List containerStyle={[styles.list,{marginTop: 0}]}>
         <FlatList
           roundAvatar
           data={list1}
           style={{marginTop: 0,borderWidth: 0}}
           renderItem={({ item }) => (
             <ListItem
               component={TouchableOpacity}
               key={item.id}
               title={item.title}
               rightTitle={item.value}
               titleStyle={styles.title}
               containerStyle={styles.listContainerStyle}
               onPress={() => item.press()}
             />
           )}
           keyExtractor={item => item.id}
           ItemSeparatorComponent={this.renderSeparator}
         />
       </List>
       <List containerStyle={styles.list}>
         <FlatList
           data={list2}
           renderItem={({ item }) => (
             <ListItem
               component={TouchableOpacity}
               key={item.id}
               title={item.title}
               rightTitle={item.value}
               titleStyle={styles.title}
               containerStyle={styles.listContainerStyle}
               onPress={() => item.press()}
             />
           )}
           keyExtractor={item => item.id}
           ItemSeparatorComponent={this.renderSeparator}
         />
       </List>
       <List containerStyle={styles.list}>
         <FlatList
           data={list3}
           renderItem={({ item }) => (
             <ListItem
               component={TouchableOpacity}
               key={item.id}
               title={item.title}
               rightTitle={item.value}
               titleStyle={styles.title}
               containerStyle={styles.listContainerStyle}
               onPress={() => item.press()}
             />
           )}
           keyExtractor={item => item.id}
           ItemSeparatorComponent={this.renderSeparator}
         />
       </List>
     </ScrollView>
     <DateTimePicker
       mode='date'
       isVisible={this.state.isDateTimePickerVisible}
       confirmTextIOS={I18n.t('common.confirm')}
       cancelTextIOS={I18n.t('common.cancel')}
       onConfirm={this.handleDatePicked}
       onCancel={() => this.setState({isDateTimePickerVisible: false})}
     />
     {this.renderUpdateInfoModal()}
     {this.renderMarkModal()}

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
      height:22,
      backgroundColor:'#FFFFFF',
    },
    header: {
      height: 44,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    banner: {
      height: 120,
      alignSelf: 'stretch',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f1a073',
    },
    avatar: {
      height: 80,
      width: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    title: {
      fontWeight: '500',
      marginLeft: 10,
      marginTop: 5,
    },
    listContainerStyle:{
      borderBottomWidth: 0,
      backgroundColor: '#FFFFFF'
    },
    button: {
      alignSelf: 'center',
      marginTop: 5,
      width: 280,
      height: 50,
    },
    list: {
      marginTop:10,
      borderWidth: 1,
      borderColor: '#e5e5e5'
    },
    markInput:{
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
