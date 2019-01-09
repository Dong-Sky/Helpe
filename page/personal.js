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
  Dimensions
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
import Util from '../common/util';

//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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


function dataURLtoFile(dataurl, filename) {
    console.log(dataurl);
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

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
   const url = Service.BaseUrl+Service.v+`/user/info?t=${token}`;

   this.setState({loading: true,});
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({user: responseJson.data});
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
   const url = Service.BaseUrl+Service.v+`/user/update?t=${token}`;
   const body = `${name}=${value}`;
   console.log(body);
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
       alert(I18n.t('success.update'));
       //this.setState({UpdateInfoModalVisible: false},() => this.getUserInfo())
       this.getUserInfo()
     }
     else{
       alert(I18n.t('error.update_failed')+'\n'+responseJson.err);
     }
   })
   //.then(() => this.getUserInfo())
   .then(() => {DeviceEventEmitter.emit('update_user');})
   .catch(err =>  Util.Error(err))
 };

 UpdateSex = () => {
   const { name,value } = this.state.Update;
   const { token ,uid } = this.state;
   const gender = this.state.user.gender==0? 1:0;
   const url = Service.BaseUrl+Service.v+`/user/update?t=${token}`;
   const body = `gender=${gender}`

   fetch(url,{
     method: 'POST',
     headers: {
       'Content-Type':'application/x-www-form-urlencoded',
     },
     body: body,
   })
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
     console.log(options);
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
       let file = {uri: response.uri, type: 'multipart/form-data', name: 'face.jpg'};
       this.updateFace(file);
     }
   });
 };


 updateFace = (file) => {
   var form = new FormData();
   form.append('face',file);

   console.log(form);
   const { token,uid } = this.state;
   const url = Service.BaseUrl+Service.v+`/user/avatar?t=${token}`;

   this.setState({loading: true,})
   fetch(url,{
       method:'POST',
       headers:{
         'Content-Type':'multipart/form-data',
         'Content-disposition': 'form-data;name=face;filename='+file.name
       },
       body: form,
     })
     .then(res => console.log(res))
     /*
     .then(responseJson => {
       console.log(responseJson);
       this.setState({ loading: false });
       if(!responseJson.status){
         alert('上传成功!');
       }
       else {
         alert('上传失败!');
       }
     })*/
     .then(() => this.setState({loading: false}))
     .then(() => this.getUserInfo())
     .catch(error => alert('发生错误: '+error.name+'\n详情: '+error.message));


 };

 //修改生日
 handleDatePicked = (date) => {
   this.setState({isDateTimePickerVisible: false})
   const { token ,uid } = this.state;

   const birthdate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
   const url = Service.BaseUrl+Service.v+`user/update?t=${token}`;
   const body = `birthday=${birthdate}`;

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
     <Modalbox
       isDisabled={false}
       //animationType={"slide"}
       //transparent={false}
       isOpen={this.state.UpdateInfoModalVisible}
       onClosed={() => {
         this.setState({
           UpdateInfoModalVisible: false
         })}}
       //onRequestClose={() => {console.log("Modal has been closed.")}}
      >
        <View style={styles.container}>
          <View style={styles.StatusBar}>
          </View>
          <View style={styles.header}>
          <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
            <Icon
              style={{marginLeft: 5}}
              name='chevron-left'
              color='#fd586d'
              size={36}
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
              color='#fd586d'
              size={28}
              onPress={() => this.UpdateInfo()}
            />
          </View>
        </View>
        <View style={{height: 40,marginRight: 5,marginLeft: 5, borderColor: '#fd586d', borderBottomWidth: 1,padding: 0}}>
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
    </Modalbox>
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
           backgroundColor='#fd586d'
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
   //console.log(this.state);
   const list1 = [
     {
       id: 1,
       title: I18n.t('user.nickname'),
       value: this.state.user.username==''?I18n.t('user.none'):this.state.user.username,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.nickname'),name: 'username',value: this.state.user.username};
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
     /*
     {
       id: 3,
       title: I18n.t('user.birthdate'),
       value: this.state.user.birthday==''?I18n.t('user.none'):this.state.user.birthday,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.birthdate'),name: 'birthday',value: this.state.user.birthday};
         this.setState({Update: Update, isDateTimePickerVisible: true});
       }
     }*/
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
       value: this.state.user.occ==''?I18n.t('user.none'):this.state.user.career,
       rightIcon: false,
       press: () => {
         var Update = {title: I18n.t('user.occ'),name: 'career',value: this.state.user.career};
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
       title:I18n.t('user.mail'),
       value: this.state.user.email==''?I18n.t('user.none'):this.state.user.email,
       rightIcon: false,
       press: () => {
         /*var Update = {title: I18n.t('user.none'),name: 'email',value: this.state.user.email};
         this.setState({Update: Update, UpdateInfoModalVisible: true});*/
       }
     },
     {
       id: 2,
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
       <View style={[styles.StatusBar,{backgroundColor: '#fd586d'}]}>
       </View>

     <Image style={styles.banner} source={require('../icon/account/bg.png')}>
        <View style={styles.header1}>
         <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',}}>
           <Icon
             style={{marginLeft: 5}}
             name='chevron-left'
             color='#FFFFFF'
             size={36}
             onPress={() => this.props.navigation.goBack()}
           />
         </View>
         <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
           <Text style={{alignSelf: 'center',fontSize: 18,color: '#FFFFFF'}}>
             {I18n.t('user.user')}
           </Text>
         </View>
         <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
         </View>
       </View>
       <TouchableOpacity onPress={() => this.ChooseFace()}>
         <Image
           style={styles.avatar}
           source={this.returnAvatarSource()}
         />
      </TouchableOpacity>
     </Image>
     <ScrollView>
       <List containerStyle={[styles.list,{marginTop: 10}]}>
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
               rightIcon={<View></View>}
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
        backgroundColor: '#f3f3f3',
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
    header1: {
      height: 36,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      //backgroundColor: '#FFFFFF',
      marginBottom: 8,
    },
    banner: {
      height: 164,
      width: width,
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fd586d',
    },
    avatar: {
      height: 74,
      width: 74,
      borderRadius: 37,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
    },
    title: {
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
});
