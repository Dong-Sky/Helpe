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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem, Avatar} from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Service from '../common/service.js';


export default class compass extends Component {
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
     //用户信息
     user: {},
     //修改用户信息
     Update: {
       title: '修改信息',
       name: 'prop',
       value: null,
     },
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

 //修改用户信息
 UpdateInfo = () => {
   const { name,value } = this.state.Update;
   const { token ,uid } = this.state;
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&${name}=${value}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert('修改成功');
     }
     else{
       alert('请求错误\n错误原因: '+responseJson.err);
     }
   })
   .then(() => this.getUserInfo())
   .then(() => {})
   .catch(err =>  alert('网络请求错误\n错误类型: '+err.name+'\n具体内容: '+err.message))
 };

 UpdateSex = () => {
   const { name,value } = this.state.Update;
   const { token ,uid } = this.state;
   const gender = this.state.user.gender==0? 1:0;
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&gender=${gender}`;
   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert('修改成功');
     }
     else{
       alert('请求错误\n错误原因: '+responseJson.err);
     }
   })
   .then(() => this.getUserInfo())
   .then(() => {})
   .catch(err =>  alert('网络请求错误\n错误类型: '+err.name+'\n具体内容: '+err.message))
 };

 //修改生日
 handleDatePicked = (date) => {
   console.log('A date has been picked: ', date);
   const { token ,uid } = this.state;
   console.log(date.getFullYear());
   console.log(date.getMonth());
   console.log(date.getDate());
   const birthdate = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
   const url = Service.BaseUrl+`?a=user&m=update&token=${token}&uid=${uid}&v=${Service.version}&birthdate=${birthdate}`;

   console.log(url);
   fetch(url)
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     if(!responseJson.status){
       alert('修改成功');
     }
     else{
       alert('请求错误\n错误原因: '+responseJson.err);
     }
   })
   .then(() => this.getUserInfo())
   .catch(err =>  alert('网络请求错误\n错误类型: '+err.name+'\n具体内容: '+err.message))
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
            <Text
              style={{marginLeft: 10}}
              onPress={() => {
                this.setState({UpdateInfoModalVisible: false,new: {title: '修改信息',name: 'prop'}})
            }}>
              返回
            </Text>
            <View style={{flex: 1,alignItems: 'center',alignSelf: 'center'}}>
              <Text>
                {this.state.Update.title}
              </Text>
            </View>
            <Text
              style={{marginRight: 15}}
              onPress={() => this.UpdateInfo()}>
              修改
            </Text>
          </View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1,}}
            onChangeText={(value) => {
              var Update1 = this.state.Update;
              Update1.value = value;
              this.setState({Update: Update1});
            }}
            value={this.state.Update.value}
          />
        </View>
    </Modal>
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

 render() {
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;
   console.log(this.state);
   const list1 = [
     {
       id: 1,
       title: '昵称',
       value: this.state.user.name==''?'未填写':this.state.user.name,
       rightIcon: false,
       press: () => {
         var Update = {title: '昵称',name: 'name',value: this.state.user.name};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title: '性别',
       value: this.state.user.gender==0?'男':'女',
       rightIcon: false,
       press: () => {
         Alert.alert(
            '修改性别?',
            '',
            [

              {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '确定', onPress: () => this.UpdateSex()},
            ],
            { cancelable: false }
          );
       }
     },
     {
       id: 3,
       title: '生日',
       value: this.state.user.birthdate==''?'未填写':this.state.user.birthdate,
       rightIcon: false,
       press: () => {
         var Update = {title: '生日',name: 'birthdate',value: this.state.user.birthdate};
         this.setState({Update: Update, isDateTimePickerVisible: true});
       }
     },
     {
       id: 4,
       title: '所在城市',
       value: this.state.user.city==''?'未填写':this.state.user.city,
       rightIcon: false,
       press: () => {
         var Update = {title: '所在城市',name: 'city',value: this.state.user.city};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
   ]

   const list2 = [
     {
       id: 1,
       title:'职业',
       value: this.state.user.occ==''?'未填写':this.state.user.occ,
       rightIcon: false,
       press: () => {
         var Update = {title: '职业',name: 'occ',value: this.state.user.occ};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title:'学校',
       value: this.state.user.school==''?'未填写':this.state.user.school,
       rightIcon: false,
       press: () => {
         var Update = {title: '学校',name: 'school',value: this.state.user.school};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 3,
       title:'工作单位',
       value: this.state.user.work==''?'未填写':this.state.user.work,
       rightIcon: false,
       press: () => {
         var Update = {title: '工作单位',name: 'work',value: this.state.user.work};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     }
   ]

   const list3 = [
     {
       id: 1,
       title:'手机',
       value: this.state.user.phone==''?'未填写':this.state.user.phone,
       rightIcon: false,
       press: () => {
         var Update = {title: '手机',name: 'phone',value: this.state.user.phone};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 2,
       title:'邮箱',
       value: this.state.user.email==''?'未填写':this.state.user.email,
       rightIcon: false,
       press: () => {
         var Update = {title: '邮箱',name: 'email',value: this.state.user.email};
         this.setState({Update: Update, UpdateInfoModalVisible: true});
       }
     },
     {
       id: 3,
       title: '个人简介',
       value: '查看',
       rightIcon: false,
     },
   ]
   return (
     <View style={styles.container}>
       <View style={styles.StatusBar}>
       </View>
       <View style={styles.header}>
       </View>
       <ScrollView>
         <View style={styles.banner}>
           <TouchableOpacity>
             <Image
               style={styles.avatar}
               source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"}}
             />
           </TouchableOpacity>
         </View>
         <List containerStyle={{ borderTopWidth: 0,flex:1,backgroundColor: '#FFFFFF' ,marginTop: 0}}>
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
         <List>
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
         <List>
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
         confirmTextIOS='确定'
         cancelTextIOS='取消'
         onConfirm={this.handleDatePicked}
         onCancel={() => this.setState({isDateTimePickerVisible: false})}
       />
       {this.renderUpdateInfoModal()}
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
      backgroundColor:'#f3456d',
    },
    header: {
      height: 44,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f3456d',
    },
    banner: {
      height: 120,
      alignSelf: 'stretch',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4eede',
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
});
