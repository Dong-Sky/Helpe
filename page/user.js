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
  TouchableWithoutFeedback,
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
import ImagePicker from 'react-native-image-picker';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service.js';

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}


//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class user extends Component {
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
     uuid: null,
     //控制窗口
     isDisabled1: false,
     isDisabled2: false,
     isMarkModalVisible: false,
     isItemListModal: false,
     //用户信息
     user: {},
     me: {},
     itemList: [],
     total: 0,

     state: 1,

     loading: false,
   };
 };

 componentWillMount(){
   const { params } = this.props.navigation.state;
   this.state.token = params.token;
   this.state.uid = params.uid;
   this.state.uuid = params.uuid;
   this.state.islogin = params.islogin;
   this.getUserInfo();
   this.getmyInfo();
   this.getItemList();
 };

 componentDidMount(){

   AnalyticsUtil.onEvent('user');


 };



 //查询用户信息
 getUserInfo = () => {
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+Service.v+`/user/get-info-by-id?id=${uuid}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({user: responseJson.data});
     }
     else{
       alert(I18n.t('error.fetch_failed')+'\n: '+responseJson.err);
     }
   })
   .catch(err => console.log(err))
 };

 getmyInfo = () => {
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+Service.v+`/user/info?t=${token}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({me: responseJson.data});
     }
     else{
       alert(I18n.t('error.fetch_failed')+'\n: '+responseJson.err);
     }
   })
   .catch(err => console.log(err))
 };

 //查询用户商品信息
 getItemList = () => {
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+Service.v+`/item?onwer=${uuid}&searchtp=1&page=0&per-page=50&lat=0&lng=0`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {

     if(!parseInt(responseJson.status)){
       this.setState({itemList: responseJson.data.data,total: responseJson.data.data.length});
     }
     else{
       console.log(responseJson.err);
     }
   })
   .catch(err => console.log(err))
 };

 //关注
 follow = () =>{
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+Service.v+`/follow/save?t=${token}`;
   const body = `uid=${uuid}`
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
       alert(I18n.t('success.follow'));
     }
     else{
       alert(I18n.t('error.follow_failed')+'\n'+responseJson.err);
     }
   })
   .then(() => this.setState({loading: false}))
   .catch(err => {console.log(err);this.setState({loading: false})})
 };




 //定义页面元素


 //简介方式页面
 renderMarkModal = () => {
   return(
     <Modalbox
       style={{height: 240,width: 300,alignItems: 'center',}}
       isOpen={this.state.isMarkModalVisible}
       isDisabled={this.state.isDisabled1}
       position='center'
       backdrop={true}
       backButtonClose={true}
       onClosed={() => this.setState({isMarkModalVisible: false})}
       >
         <Text style={{marginTop: 10}}>
           {I18n.t('user.mark')}
         </Text>
         <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
           <TextInput
             style={styles.contactInput}
             autoCapitalize='none'
             multiline = {true}
             underlineColorAndroid="transparent"
             editable={false}
             value={this.state.user.mark}
           />
         </View>
         <Button
           style={styles.button1}
           backgroundColor='#f1a073'
           borderRadius={5}
           title={I18n.t('common.finish')}
           onPress={() => this.setState({isMarkModalVisible: false,})}
         />
     </Modalbox>
   );
 };

 //简介方式页面
 renderItemListModal = () => {

   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;

   return(
     <List containerStyle={{ borderTopWidth: 1,flex:1,backgroundColor: '#FFFFFF' ,marginTop: 0,borderColor: '#e5e5e5'}}>
       <FlatList
         style={{marginTop: 0,borderWidth: 0}}
         data={this.state.itemList}
         renderItem={({ item }) => (
           <ListItem
             component={TouchableOpacity}
             roundAvatar
             key={item.id}
             title={item.name}
             subtitle={formatDate(item.ct)}
             subtitleStyle={{marginTop: 10,fontSize: 10}}
             subtitleNumberOfLines={2}
             rightTitle={parseInt(item.price).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}
             avatar={{ uri:Service.BaseUri+item.img }}
             avatarContainerStyle={{height:60,width:60}}
             avatarStyle={{height:60,width:60}}
             containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF'}}
             onPress={() => {
               const params = {
                 token: this.state.token,
                 uid: this.state.uid,
                 islogin: this.state.islogin,
                 itemId: item.id,
               };
               if(item.type==0){
                 navigate('itemDetail_Service',params);
               }
               else if(item.type==1){
                 navigate('itemDetail_Ask',params);
               }
             }}
           />
         )}
         keyExtractor={item => item.id}
         ItemSeparatorComponent={this.renderSeparator}
         //ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
         onRefresh={this.handleRefresh}
         refreshing={this.state.refreshing}
         onEndReached={this.handleLoadMore}
         onEndReachedThreshold={50}
       />
     </List>
   );
 };

 renderInfoModal = () => {
   const list1 = [
     {
       id: 1,
       title: I18n.t('user.nickname'),
       value: !this.state.user.name?I18n.t('user.none'):this.state.user.name,
       rightIcon: false,
       press: () => {}
     },
     {
       id: 2,
       title: I18n.t('user.sex'),
       value: this.state.user.gender==0?I18n.t('user.male'):I18n.t('user.female'),
       rightIcon: false,
       press: () => {}
     },
     {
       id: 3,
       title: I18n.t('user.city'),
       value: !this.state.user.city?I18n.t('user.none'):this.state.user.city,
       rightIcon: false,
       press: () => {}
     },
     {
       id: 4,
       title:I18n.t('user.work'),
       value: !this.state.user.work?I18n.t('user.none'):this.state.user.work,
       rightIcon: false,
       press: () => {}

     }
   ]

   const list3 = [
     {
       id: 1,
       title: I18n.t('user.mark'),
       value: I18n.t('user.go'),
       rightIcon: false,
       press: () => this.setState({isMarkModalVisible: true,})
     },
     {
       id: 2,
       title:I18n.t('user.pub'),
       value: '('+this.state.total+')',
       rightIcon: false,
       press: () => this.setState({isItemListModal: true,})
     },
   ];
   return (
     <ScrollView style={{flex: 1}} scrollEnabled={height<650}>

      <View style={[styles.list,{marginTop: 0}]}>
         <FlatList
           scrollEnabled={false}
           data={list1}
           renderItem={({ item }) => (
             <ListItem
               key={item.id}
               title={item.title}
               rightTitle={item.value}
               rightTitleStyle={{fontSize: 14}}
               rightIcon={<View></View>}
               titleStyle={styles.title}
               containerStyle={styles.listContainerStyle}
               onPress={() => item.press()}
             />
           )}
           keyExtractor={item => item.id}
           ItemSeparatorComponent={this.renderSeparator}
         />
       </View>
       <TouchableOpacity style={styles.mark}>
         <Text style={{fontSize: 14,fontWeight: '500',alignSelf: 'center',color: '#333333',marginTop: 10}}>
           {I18n.t('user.mark')}
         </Text>
         <Text
           style={{marginLeft: 10,marginRight: 10,marginTop: 10,marginBottom: 20,fontSize: 14,color: '#999999'}}
           numberOfLines={10}>
           {this.state.user.mark?this.state.user.mark:I18n.t('user.none')}
         </Text>
       </TouchableOpacity>

     </ScrollView>
   );
 }

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
   if(!this.state.user.face){

   }
   else{
     source = {uri: Service.BaseUri+this.state.user.face};
   }

  // console.log(source);
   return source;
 };


 render() {
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;






   return (
     <View style={styles.container}>
       <View style={styles.StatusBar}>
       </View>
       <Image style={styles.header} source={require('../icon/account/bg.png')}>
         <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
           <Icon
             style={{marginLeft: 5}}
             name='keyboard-arrow-left'
             color='#FFFFFF'
             size={36}
             onPress={() => this.props.navigation.goBack()}
           />
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
           <Text style={{alignSelf: 'center',color: '#FFFFFF',fontSize: 18}}>
             {this.state.user.username==''?I18n.t('user.user'):this.state.user.username}
           </Text>
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
           <View style={{marginRight: 10}}>
             <Icon
               name='comment'
               type='font-awesome'
               color='#FFFFFF'
               size={28}
               onPress={
                 () => {
                   if(this.state.islogin){
                     navigate('chatroom',
                     {
                       login: this.state.islogin,
                       token: this.state.token,
                       uid: this.state.uid,
                       uuid: this.state.uuid,
                       name: '?&?',
                     })
                   }
                 }
               }

             />
           </View>
         </View>
       </Image>
       <Image source={require('../icon/account/bg.png')} style={styles.banner}>
         <TouchableOpacity style={{alignSelf: 'center',alignItems: 'center',padding: 10}}>
           <Image
             style={styles.avatar}
             source={this.returnAvatarSource()}
           />
         </TouchableOpacity>
       </Image>
       <View style={{height: 30,backgroundColor: '#ffffff',flexDirection: 'row',marginTop: 5,marginBottom: 5,alignItems: 'center',justifyContent: 'center'}}>
         <TouchableOpacity style={[{height: 28,borderColor: '#FFFFFF',alignItems: 'center',borderBottomWidth: 2,marginLeft: 10,marginRight: 10},this.state.state>0?{borderColor: '#fd586d'}:{}]} onPress={() => this.setState({state:-this.state.state})}>
           <Text style={{fontSize: 14,color: this.state.state>0? '#333333':'#999999',marginTop: 5,alignItems: 'center'}}>
             {I18n.t('user.info')}
           </Text>
         </TouchableOpacity>
         <TouchableOpacity style={[{height: 28,borderColor: '#FFFFFF',alignItems: 'center',borderBottomWidth: 2,marginLeft: 10,marginRight: 10},this.state.state<0?{borderColor: '#fd586d'}:{}]} onPress={() => this.setState({state:-this.state.state})}>
           <Text style={{fontSize: 14,color: this.state.state<0? '#333333':'#999999',marginTop: 5,alignItems: 'center'}}>
             {I18n.t('user.pub')}

           </Text>
         </TouchableOpacity>
       </View>

       {
         (() => {
          if(this.state.state>0){
            return this.renderInfoModal();
          }
          else {
            return this.renderItemListModal()
          }
       })()
      }
       <Button
         style={styles.button}
         //containerStyle={styles.buttonContainer}
         backgroundColor='#fd586d'
         borderRadius={5}
         title={I18n.t('user.follow')}
         onPress={() => {
           Alert.alert(
             I18n.t('user.follow'),
             I18n.t('user.is_follow'),
             [
               {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
               {text: I18n.t('common.yes'), onPress: () => this.follow()},
             ],
             { cancelable: false }
           )
         }}
       />

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
      backgroundColor:'#fd586d',
    },
    header: {
      height: 44,
      width: width,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fd586d',
    },
    banner: {
      height: 120,
      width: width,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fd586d',
    },
    avatar: {
      height: 80,
      width: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      alignSelf: 'center',
      backgroundColor: '#FFFFFF'
    },
    title: {
      fontWeight: '500',
      marginLeft: 10,
      marginTop: 5,
      fontSize: 14,
    },
    listContainerStyle:{
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: '#FFFFFF',
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
      borderColor: '#e5e5e5',
      backgroundColor: '#FFFFFF'
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
      padding: 5,
      borderWidth: 1,
      borderColor: '#fd586d',
      alignSelf: 'center',
      color: '#666666',
      fontSize: 14,
    },
    mark: {
      flexDirection: 'column',
      marginTop: 10,
      //height: 500,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#e5e5e5'
    },
});
