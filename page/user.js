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

<<<<<<< Updated upstream

=======
//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}
>>>>>>> Stashed changes



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
<<<<<<< Updated upstream
     isMarkModalVisible: false,
     //用户信息
     user: {},
=======
     isDisabled2: false,
     isMarkModalVisible: false,
     isItemListModal: false,
     //用户信息
     user: {},
     me: {},
     itemList: [],
     total: 0,

     loading: false,
>>>>>>> Stashed changes
   };
 };

 componentWillMount(){
   const { params } = this.props.navigation.state;
   this.state.token = params.token;
   this.state.uid = params.uid;
   this.state.uuid = params.uuid;
   this.state.islogin = params.islogin;
   this.getUserInfo();
<<<<<<< Updated upstream
=======
   this.getmyInfo();
   this.getItemList();
>>>>>>> Stashed changes
 };

 componentDidMount(){

 };



 //查询用户信息
 getUserInfo = () => {
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=info&token=${token}&uid=${uid}&id=${uuid}&v=${Service.version}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({user: responseJson.data.user});
     }
     else{
<<<<<<< Updated upstream
       alert('请求错误\n错误原因: '+responseJson.err);
     }
   })
   .catch(err => alert('网络请求错误\n错误类型: '+err.name+'\n具体内容: '+err.message))
=======
       alert(I18n.t('error.fetch_failed')+'\n: '+responseJson.err);
     }
   })
   .catch(err => console.log(err))
 };

 getmyInfo = () => {
   const { token,uid,uuid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=info&token=${token}&uid=${uid}&id=${uid}&v=${Service.version}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({me: responseJson.data.user});
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
   const url = Service.BaseUrl+`?a=item&owner=${uuid}&v=${Service.version}`;

   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     if(!responseJson.status){
       this.setState({itemList: responseJson.data.data,total: responseJson.data.total});
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
   const url = Service.BaseUrl+`?a=follow&m=save&token=${token}&uid=${uid}&id=${uuid}&v=${Service.version}`;

   this.setState({loading: true})
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {

     if(!responseJson.status){
       alert(I18n.t('success.follow'));
     }
     else{
       alert(I18n.t('error.follow_failed')+'\n'+responseJson.err);
     }
   })
   .then(() => this.setState({loading: false}))
   .catch(err => {console.log(err);this.setState({loading: false})})
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           个人简介
=======
           {I18n.t('user.mark')}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           title='确定'
=======
           title={I18n.t('common.finish')}
>>>>>>> Stashed changes
           onPress={() => this.setState({isMarkModalVisible: false,})}
         />
     </Modalbox>
   );
 };

<<<<<<< Updated upstream
=======
 //简介方式页面
 renderItemListModal = () => {

   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;

   return(
     <Modalbox
       isOpen={this.state.isItemListModal}
       isDisabled={this.state.isDisabled2}
       position='center'
       backdrop={true}
       backButtonClose={false}
       onClosed={() => this.setState({isItemListModal: false})}
       >
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
                 onPress={() => this.setState({isItemListModal: false,})}
               />
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
               <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
                 {I18n.t('user.pub')}
               </Text>
             </View>
             <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
             </View>
           </View>
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
                   subtitle={(item.tp==0?I18n.t('user.tp1'):I18n.t('user.tp2'))+'\n '+I18n.t('user.start')+";"+formatDate(item.t)}
                   subtitleNumberOfLines={2}
                   rightTitle={item.u=='""'||item.u==null? '￥'+item.price:'￥'+item.price+'/'+item.u}
                   avatar={{ uri:Service.BaseUri+item.img  }}
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
                     if(item.tp==0){
                       navigate('itemDetail_Service',params);
                     }
                     else if(item.tp==1){
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
         </View>
     </Modalbox>
   );
 };

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
   console.log(source);
   return source;
 }
=======
  // console.log(source);
   return source;
 };

>>>>>>> Stashed changes

 render() {
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;
<<<<<<< Updated upstream
   const list1 = [
     {
       id: 1,
       title: '昵称',
       value: this.state.user.name==''?'未填写':this.state.user.name,
       rightIcon: false,
     },
     {
       id: 2,
       title: '性别',
       value: this.state.user.gender==0?'男':'女',
       rightIcon: false,
     },
     {
       id: 3,
       title: '生日',
       value: this.state.user.birthdate==''?'未填写':this.state.user.birthdate,
       rightIcon: false,

     },
     {
       id: 4,
       title: '所在城市',
       value: this.state.user.city==''?'未填写':this.state.user.city,
       rightIcon: false,
=======

   const list1 = [
     {
       id: 1,
       title: I18n.t('user.nickname'),
       value: this.state.user.name==''?I18n.t('user.none'):this.state.user.name,
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
       title: I18n.t('user.birthdate'),
       value: this.state.user.birthdate==''?I18n.t('user.none'):this.state.user.birthdate,
       rightIcon: false,
       press: () => {}
>>>>>>> Stashed changes
     },
   ]

   const list2 = [
     {
       id: 1,
<<<<<<< Updated upstream
       title:'职业',
       value: this.state.user.occ==''?'未填写':this.state.user.occ,
       rightIcon: false,
     },
     {
       id: 2,
       title:'学校/工作单位',
       value: this.state.user.work==''?'未填写':this.state.user.work,
       rightIcon: false,
=======
       title: I18n.t('user.city'),
       value: this.state.user.city==''?I18n.t('user.none'):this.state.user.city,
       rightIcon: false,
       press: () => {}
     },
     {
       id: 2,
       title:I18n.t('user.occ'),
       value: this.state.user.occ==''?I18n.t('user.none'):this.state.user.occ,
       rightIcon: false,
       press: () => {}
     },
     {
       id: 3,
       title:I18n.t('user.work'),
       value: this.state.user.work==''?I18n.t('user.none'):this.state.user.work,
       rightIcon: false,
       press: () => {}
>>>>>>> Stashed changes

     }
   ]

   const list3 = [
     {
       id: 1,
<<<<<<< Updated upstream
       title:'手机',
       value: this.state.user.phone==''?'未填写':this.state.user.phone,
=======
       title:I18n.t('user.phone'),
       value: this.state.user.phone==''?I18n.t('user.none'):this.state.user.phone,
>>>>>>> Stashed changes
       rightIcon: false,
       press: () => {}
     },
     {
       id: 2,
<<<<<<< Updated upstream
       title:'邮箱',
       value: this.state.user.email==''?'未填写':this.state.user.email,
=======
       title:I18n.t('user.mail'),
       value: this.state.user.email==''?I18n.t('user.none'):this.state.user.email,
>>>>>>> Stashed changes
       rightIcon: false,
       press: () => {}

     },
     {
       id: 3,
<<<<<<< Updated upstream
       title: '个人简介',
       value: '查看',
=======
       title: I18n.t('user.mark'),
       value: I18n.t('user.go'),
>>>>>>> Stashed changes
       rightIcon: false,
       press: () => this.setState({isMarkModalVisible: true,})
     },
   ];
<<<<<<< Updated upstream
=======
   const list4 = [
     {
       id: 1,
       title:I18n.t('user.pub'),
       value: '('+this.state.total+')',
       rightIcon: false,
       press: () => this.setState({isItemListModal: true,})
     },
   ];



>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           <Text style={{alignSelf: 'center',color: '#333333',fontSize: 16}}>
             {this.state.user.name==''?'个人主页':this.state.user.name}
=======
           <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
             {this.state.user.name==''?I18n.t('user.user'):this.state.user.name}
>>>>>>> Stashed changes
           </Text>
         </View>
         <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
           <View style={{marginRight: 10}}>
             <Icon
<<<<<<< Updated upstream
               name='favorite-border'
=======
               name='playlist-add'
>>>>>>> Stashed changes
               color='#f1a073'
               size={28}
               onPress={() => {
                 Alert.alert(
<<<<<<< Updated upstream
                   '收藏',
                   '是否要收藏?',
                   [
                     {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                     {text: '确定', onPress: () => {}},
=======
                   I18n.t('user.follow'),
                   I18n.t('user.is_follow'),
                   [
                     {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                     {text: I18n.t('common.yes'), onPress: () => this.follow()},
>>>>>>> Stashed changes
                   ],
                   { cancelable: false }
                 )
               }}
             />
           </View>
         </View>
       </View>
       <ScrollView style={{flex: 1}}>
         <View style={styles.banner}>
<<<<<<< Updated upstream
           <TouchableOpacity onPress={() => this.ChooseFace()}>
=======
           <TouchableOpacity onPress={() => {}}>
>>>>>>> Stashed changes
             <Image
               style={styles.avatar}
               source={this.returnAvatarSource()}
             />
           </TouchableOpacity>
         </View>
<<<<<<< Updated upstream
         <View style={{marginBottom: 0,borderTopWidth: 1,marginTop:0,borderColor: '#e5e5e5'}}>
           <ListItem
             key={list1[0].id}
             title={list1[0].title}
             rightTitle={list1[0].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />
           {this.renderSeparator()}
         </View>
         <View style={{marginBottom: 0,marginTop:0,borderTopWidth: 0,borderColor: '#e5e5e5'}}>
           <ListItem
             key={list1[1].id}
             title={list1[1].title}
             rightTitle={list1[1].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />
           {this.renderSeparator()}
           <ListItem
             key={list1[2].id}
             title={list1[2].title}
             rightTitle={list1[2].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />
           {this.renderSeparator()}
           <ListItem
             key={list1[3].id}
             title={list1[3].title}
             rightTitle={list1[3].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />
         </View>
         <View style={styles.list}>
           <ListItem
             key={list2[0].id}
             title={list2[0].title}
             rightTitle={list2[0].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
           />
           {this.renderSeparator()}
           <ListItem
             key={list2[1].id}
             title={list2[1].title}
             rightTitle={list2[1].value}
             titleStyle={styles.title}
             containerStyle={styles.listContainerStyle}
=======
         <View style={[styles.list,{marginTop: 0}]}>
           <FlatList
             data={list1}
             renderItem={({ item }) => (
               <ListItem
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
         </View>
         <View style={styles.list}>
           <FlatList
             data={list2}
             renderItem={({ item }) => (
               <ListItem
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
         </View>
         <View style={styles.list}>
           <FlatList
             data={list3}
             renderItem={({ item }) => (
               <ListItem
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
>>>>>>> Stashed changes
           />
         </View>
         <View style={styles.list}>
           <FlatList
<<<<<<< Updated upstream
             data={list3}
=======
             data={list4}
>>>>>>> Stashed changes
             renderItem={({ item }) => (
               <ListItem
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
         </View>
       </ScrollView>
<<<<<<< Updated upstream
       {this.renderMarkModal()}
=======
       <Button
         style={styles.button}
         //containerStyle={styles.buttonContainer}
         backgroundColor='#f1a073'
         borderRadius={5}
         title={I18n.t('user.send')}
         onPress={
           () => {
             if(this.state.islogin){
               navigate('chatroom',
               {

                 token: this.state.token,
                 uid: this.state.uid,
                 user: this.state.me,
                 uuid: this.state.uuid,
                 islogin: this.state.islogin,
                 uuface: this.state.user.face?this.state.user.face: '',
                 uuname: this.state.user.name?this.state.user.name: '?',
               })
             }
           }
         }
       />
       {this.renderMarkModal()}
       {this.renderItemListModal()}
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
<<<<<<< Updated upstream
      borderBottomWidth: 0,
      backgroundColor: '#FFFFFF'
=======
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: '#FFFFFF',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      borderColor: '#e5e5e5'
=======
      borderColor: '#e5e5e5',
      backgroundColor: '#FFFFFF'
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      padding: 0,
=======
      padding: 5,
>>>>>>> Stashed changes
      borderWidth: 1,
      borderColor: '#f1a073',
      alignSelf: 'center',
      color: '#666666',
      fontSize: 14,
    },
});
