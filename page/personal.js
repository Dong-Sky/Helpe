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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';

export default class compass extends Component {
  static navigationOptions = {
   title: '个人信息',
   headerTitleStyle:{color:'#5c492b',fontWeight:'bold'}
 }
 render() {
   const { navigate } = this.props.navigation;
   const { params } = this.props.navigation.state;
   const list1 = [
     {
       title: '昵称',
       rightTitle:'竹天',
       press(){alert('hi');},
     },
     {
       title: '性别',
       rightTitle:'男',
       press(){alert('hi');},
     },
     {
       title: '生日',
       rightTitle:'2017-01-01',
       press(){alert('hi');},
     },
     {
       title: '所在城市',
       rightTitle:'???',
       press(){alert('hi');},
     },
   ]

   const list2 = [
     {
       title:'职业',
     },
     {
       title:'学校',
     },
     {
       title:'工作单位',
     }
   ]

   const list3 = [
     {
       title:'手机',
     },
     {
       title:'邮箱',
     },
     {
       title: '个人简介',
     },
   ]
   return (
     <View style={styles.container}>
       <ScrollView style={{flex: 1,}}>
         <View style={{backgroundColor:'#fbe994',height:150,}}>
           {/*头部*/}
         </View>
         <List containerStyle={{marginTop:0,}}>
           {
            list1.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                rightTitle={item.rightTitle}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                titleStyle={styles.listTitleStyle}
                rightTitleStyle={styles.listRightTitleStyle}
                onPress={() => item.press()}
              />
            ))
          }
         </List>
         <List containerStyle={{marginTop:10,}}>
           {
            list2.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                titleStyle={styles.listTitleStyle}
                rightTitleStyle={styles.listRightTitleStyle}
                onPress={() => item.press()}
              />
            ))
          }
         </List>
         <List  containerStyle={{marginTop:10,}}>
           {
            list3.map((item, i) => (
              <ListItem
                component={TouchableOpacity}
                key={i}
                title={item.title}
                rightIcon={{name: 'chevron-right',color:'#5c492b',}}
                titleStyle={styles.listTitleStyle}
                rightTitleStyle={styles.listRightTitleStyle}
                onPress={() => item.press()}
              />
            ))
          }
         </List>
       </ScrollView>
     </View>

   );
 }
}
const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
  header: {
        height: 200,
        backgroundColor: '#e1e8e2',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderWidth:1,
        borderBottomWidth:3,
        borderColor: '#e1e8e2',
    },
    //header内元素
  user: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderColor:'#e1e8e2',
    },
    order: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    //
  body: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e1e8e2',
    },
  tarbar_bottom: {
      position:'relative',
      borderWidth: 1,
      borderColor:'#d8dfd6',
      height: 49,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems:'center',
    },
  welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
  instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
  icon: {
   width: 25,
   height: 25,
 },
  listTitleStyle: {
   color:'#5c492b',
   fontWeight:'400',
   fontSize:18,
 },
 listRightTitleStyle: {
   color:'#5c492b',
   fontWeight:'400',
   fontSize:18,
 },

});
