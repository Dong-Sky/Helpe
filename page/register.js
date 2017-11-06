import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana,Fumi,Sae } from 'react-native-textinput-effects';
import { Button } from 'react-native-elements';
import Service from '../common/service';

class register extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: null,
            password: null,
            nickname: null,
            loading: false,
      }

    }
  //定义注册方法
  register = () => {
    const { username, password, nickname } = this.state;
    const url = Service.BaseUrl+`?a=oauth&v=${Service.version}&m=up&username=${username}&password=${password}&nickname=${nickname}`;
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(!responseJson){
        alert('注册成功，请返回登录!');
      }
      else{
        alert('注册失败\n原因: '+responseJson.err)
      }
    })
    .catch((error) => console.log(error))
  }


  render(){
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <Text
            style={{marginLeft:20,color:'#5c492b'}}
            onPress={() => this.props.navigation.goBack()}
            >
            返回
          </Text>
          <View style={{flex:1,}}>
          </View>
        </View>
        <View style={styles.body}>
          <Kohana
            style={{ backgroundColor: '#FFFFFF',borderBottomWidth:1,borderColor:'#e7e7e7' }}
            label={'username'}
            iconClass={FontAwesomeIcon}
            iconName={'user-o'}
            iconColor={'#f4d29a'}
            iconSize={40}
            labelStyle={{ marginTop: 8, color: '#e7e7e7' }}
            inputStyle={{ color: '#91627b' }}
            autoCapitalize='none'
            clearButtonMode='always'
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
          <Kohana
            style={{ marginTop:4,backgroundColor: '#FFFFFF',borderBottomWidth:1,borderColor:'#e7e7e7' }}
            label={'password'}
            iconClass={FontAwesomeIcon}
            iconName={'lock'}
            iconColor={'#ddd'}
            iconColor={'#f4d29a'}
            labelStyle={{ color: '#e7e7e7' }}
            inputStyle={{ color: '#91627b' }}
            autoCapitalize='none'
            clearButtonMode='always'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
         />
         <Kohana
           style={{ marginTop:4,backgroundColor: '#FFFFFF',borderBottomWidth:1,borderColor:'#e7e7e7' }}
           label={'password'}
           iconClass={FontAwesomeIcon}
           iconName={'lock'}
           iconColor={'#ddd'}
           iconColor={'#f4d29a'}
           labelStyle={{ color: '#e7e7e7' }}
           inputStyle={{ color: '#91627b' }}
           autoCapitalize='none'
           clearButtonMode='always'
         />
         <Kohana
           style={{ marginTop:4,backgroundColor: '#FFFFFF' }}
           label={'nickname'}
           iconClass={FontAwesomeIcon}
           iconName={'lock'}
           iconColor={'#ddd'}
           iconColor={'#f4d29a'}
           labelStyle={{ color: '#e7e7e7' }}
           inputStyle={{ color: '#91627b' }}
           autoCapitalize='none'
           clearButtonMode='always'
           onChangeText={(nickname) => this.setState({nickname})}
           value={this.state.nickname}
         />
        </View>

          <Button
            title='注册'
            style={styles.button}
            onPress={() => this.register()}
            backgroundColor='#5c492b'
             />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fbe994',
  },
  StatusBar:  {
      height: 22,
      backgroundColor:'#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#fbe994',
  },
  body: {
    marginTop:20,
    width:300,
    height:300,
    alignSelf:'center',
    backgroundColor:'#FFFFFF',
    borderWidth:10,
    borderColor:'#FFFFFF',
    borderRadius:20,
  },
  button: {
    alignSelf: 'center',
    marginTop: 15,
    width: 280,
    height: 50,
  },
  other:  {
    alignSelf: 'center',
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 5,
    height: 30,
    width: 400,
  }
});

export default register;
