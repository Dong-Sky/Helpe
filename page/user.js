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
     isMarkModalVisible: false,
     //用户信息
     user: {},
   };
 };

 componentWillMount(){
   const { params } = this.props.navigation.state;
   this.state.token = params.token;
   this.state.uid = params.uid;
   this.state.uuid = params.uuid;
   this.state.islogin = params.islogin;
   this.getUserInfo();
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
       alert('请求错误\n错误原因: '+responseJson.err);
     }
   })
   .catch(err => alert('网络请求错误\n错误类型: '+err.name+'\n具体内容: '+err.message))
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
           个人简介
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
           title='确定'
           onPress={() => this.setState({isMarkModalVisible: false,})}
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

   console.log(source);
   return source;
 }

 render() {
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;
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
     },
   ]

   const list2 = [
     {
       id: 1,
       title:'职业',
       value: this.state.user.occ==''?'未填写':this.state.user.occ,
       rightIcon: false,
     },
     {
       id: 2,
       title:'学校/工作单位',
       value: this.state.user.work==''?'未填写':this.state.user.work,
       rightIcon: false,

     }
   ]

   const list3 = [
     {
       id: 1,
       title:'手机',
       value: this.state.user.phone==''?'未填写':this.state.user.phone,
       rightIcon: false,
       press: () => {}
     },
     {
       id: 2,
       title:'邮箱',
       value: this.state.user.email==''?'未填写':this.state.user.email,
       rightIcon: false,
       press: () => {}

     },
     {
       id: 3,
       title: '个人简介',
       value: '查看',
       rightIcon: false,
       press: () => this.setState({isMarkModalVisible: true,})
     },
   ];
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
             {this.state.user.name==''?'个人主页':this.state.user.name}
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
                     {text: '确定', onPress: () => {}},
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
           <TouchableOpacity onPress={() => this.ChooseFace()}>
             <Image
               style={styles.avatar}
               source={this.returnAvatarSource()}
             />
           </TouchableOpacity>
         </View>
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
           />
         </View>
       </ScrollView>
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
});
