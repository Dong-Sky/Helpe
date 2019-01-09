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
  DeviceEventEmitter
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana,Fumi,Sae } from 'react-native-textinput-effects';
import { Button,Icon } from 'react-native-elements';
import Service from '../common/service';
import Util from '../common/util';
timer = null;

class register extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: null,
            password: null,
            password1: null,
            nickname: null,
            loading: false,
            email: null,
            t: -1,
            wait: false,
            code: null,
      }

    }

  componentWillUnmount(){
    try{
      this.setState({wait: false,t: -1},() => clearInterval(timer));
    }catch(err){

    }
  }
  //定义注册方法
  register = () => {
    const {  password, code, email } = this.state;

    const passlen = password.length?password.length:0;
    /*
    if(passlen<6||passlen>16){
      alert('Incorrect password length.(6~16)');
      return ;
    }*/

    let arr = email.split('@');
    let username = arr[0]?arr[0]:'Helpe_User';

    const url = Service.BaseUrl+Service.v+`/passport/register?username=${username}&password=${password}&email=${email}&auth_token=${code}`;
    console.log(url);

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(!parseInt(responseJson.status)){
        alert(I18n.t('success.register'));
        DeviceEventEmitter.emit('register',{username: username,password: password,email: email});
        this.props.navigation.goBack();
      }
      else{
        alert(I18n.t('error.register_failed')+'\n'+responseJson.err)
      }
    })
    .catch((error) => Util.Error(error))
  }

  sendMail = () => {
    const { email } = this.state;
    if(!/^[a-zA-Z0-9]+([a-zA-Z0-9_-]*)+@([a-zA-Z0-9_-]*)+.([a-zA-Z0-9.-]*)+$/g.test(email)){
      alert('Email format error!');

      return ;
    }
    const url = Service.BaseUrl+Service.v+`/passport/check-email?email=${email}`;
    console.log(url);
    fetch(url)
    .then(res  => res.json())
    .then(res  => {
      console.log(res);
      if(!res.status){
        alert(I18n.t('success.send'));
        this.setState({wait: true,t: 120,code: res.data.auth_token},() => {
          timer = setInterval(() => {
            if(this.state.t>0){
              //console.log(this.state.t);
              this.setState(previousState => {
                return { t: previousState.t-1 };
              });
            }
            else{
              this.setState({wait: false,t: -1},() => clearInterval(timer))
            }
          }, 1000);
        });

      }
      else{
        alert(res.err);
      }
    })
    .catch(err => console.log(err))
  }


  render(){
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#fd568d'
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,}}>
          </View>

          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
            </View>
          </View>
        </View>
        <Image
          style={{height: 72 ,width: 94,marginTop: 30}}
          resizeMode="contain"
          source={require('../icon/login/logo.png')}
        />
        <View style={{width: 280,height: 40,marginTop: 10,flexDirection: 'row',alignItems: 'center'}}>
          <Image
            style={{width: 36,height: 36,marginLeft: 0,marginRight: 0,}}
            source={require('../icon/login/user.png')}
            resizeMode="contain"
          />
          <View style={{height: 40,width: 280-36-15-10,marginLeft: 15,borderBottomWidth: 2,borderColor: '#fd586d',}}>
            <TextInput
              placeholder={I18n.t('register.email')}
              placeholderTextColor ='#999999'
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(email) => this.setState({email})}
              style={{height: 40,width: 280-36-15-10,fontSize: 16,color: '#333333',alignSelf: 'center',padding: 5}}
            />
          </View>
        </View>

        <View style={{width: 280,height: 40,marginTop: 10,flexDirection: 'row',alignItems: 'center'}}>
          <Image
            style={{width: 36,height: 36,marginLeft: 0,marginRight: 0,}}
            source={require('../icon/login/password.png')}
            resizeMode="contain"
          />
          <View style={{height: 40,width: 280-36-15-10,marginLeft: 15,borderBottomWidth: 2,borderColor: '#fd586d',}}>
            <TextInput
              placeholder={I18n.t('register.password')}
              placeholderTextColor ='#999999'
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              style={{height: 40,width: 280-36-15-10,fontSize: 16,color: '#333333',alignSelf: 'center',padding: 5}}
            />
          </View>
        </View>
        <View style={{width: 280,height: 40,marginTop: 10,flexDirection: 'row',alignItems: 'center'}}>
          <Image
            style={{width: 36,height: 36,marginLeft: 0,marginRight: 0,}}
            source={require('../icon/login/password.png')}
            resizeMode="contain"
          />
          <View style={{height: 40,width: 280-36-15-10,marginLeft: 15,borderBottomWidth: 2,borderColor: '#fd586d',}}>
            <TextInput
              placeholder={I18n.t('register.password')}
              placeholderTextColor ='#999999'
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(password1) => this.setState({password1})}
              style={{height: 40,width: 280-36-15-10,fontSize: 16,color: '#333333',alignSelf: 'center',padding: 5}}
            />
          </View>
        </View>

        <View style={{width: 280,height: 40,marginTop: 10,flexDirection: 'row',alignItems: 'center'}}>
          <Image
            style={{width: 36,height: 36,marginLeft: 0,marginRight: 0,}}
            source={require('../icon/login/user.png')}
            resizeMode="contain"
          />
          <View style={{height: 40,width: 280-36-15-10,marginLeft: 15,borderBottomWidth: 2,borderColor: '#fd586d',}}>
            <TextInput
              placeholder={I18n.t('register.code')}
              placeholderTextColor ='#999999'
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(code) => this.setState({code})}
              style={{height: 40,width: 280-36-15-10,fontSize: 16,color: '#333333',alignSelf: 'center',padding: 5}}
            />
          </View>
        </View>
          <Button
            title={this.state.wait?this.state.t+'秒':I18n.t('register.send')}
            style={[styles.button,{marginTop: 20,}]}
            onPress={() => {
              this.sendMail();
            }}
            backgroundColor='#fd586d'
            titleStyle={{color: '#FFFFFF'}}
            borderRadius={20}
            />
            <Button
               title={I18n.t('register.register')}
               style={[styles.button,{marginTop: 10}]}
               onPress={() => {

                 if(this.state.password==null||this.state.password1==null){
                   alert(I18n.t('register.pass_null'));
                 }
                 else if(this.state.password1==''||this.state.password1==''){
                   alert(I18n.t('register.pass_null'));
                 }
                 else if(this.state.password.length<6||this.state.password.lengh>16){

                   alert('Incorrect password length.(6~16)');
                   //alert(I18n.t('register.pass_short'));
                 }
                 else if(this.state.password!=this.state.password1){
                   alert(I18n.t('register.pass1_err'));
                 }
                 else if(this.state.code==null||this.state.code==''||this.state.code.length!=6){
                   alert(I18n.t('register.no_code'));
                 }
                 else{
                   this.register();
                 }
               }}
               backgroundColor='#fd586d'
               titleStyle={{color: '#FFFFFF'}}
               borderRadius={20}
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
    backgroundColor: '#FFFFFF',
  },
  StatusBar:  {
      height: 22,
      backgroundColor:'#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
  },
  body: {
    marginTop:20,
    width:300,
    height:300,
    alignSelf:'center',
    backgroundColor:'#f1a073',
    borderWidth:10,
    borderColor:'#f1a073',
    borderRadius:20,
  },
  button: {
    alignSelf: 'center',
    marginTop: 15,
    width: 280,
    height: 40,
    marginTop: 0,
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
