import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem, } from 'react-native-elements';
import Service from '../common/service';

 class payment extends Component {
   constructor(props) {
    super(props);
    this.state = { text: '1' };
  }
  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const users = [
 {
    name: params.name,
    avatar: Service.BaseUri+params.item.img,
 },
    // more users here
];

    return (
      <Card
        title='Payment'
        image={{ uri:Service.BaseUri+params.item.img }}>
        <Text style={{marginBottom: 10}}>
          how to pay?
        </Text>
        <Button
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10}}
          title='cash' />
        <Button
          backgroundColor='#542bac'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10}}
          title='Paypal' />
        <Button
          backgroundColor='#d0d921'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10}}
          title='easygo' />
          <Button
            backgroundColor='#c87121'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10}}
            title='cancel' />
        </Card>

    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
  header: {
        height: 250,
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
 icon_send: {
  width: 25,
  height: 25,
},
});
export default payment;
