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
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
import { Button,Icon,FormInput } from 'react-native-elements';
import { Platform } from 'react-native';
import FBSDK from 'react-native-fbsdk';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import Service from '../common/service';
import Util from '../common/util';

class login extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: null,
            password: null,
            email: null,
            loading: false,
      }
  };

  componentDidMount(){
    this.subscription = DeviceEventEmitter.addListener('register',(data) => {
      this.setState({ username: data.username,password: data.password,email: data.email },this.login)
    });

  }

  componentWillUnmount(){
    this.subscription.remove()
  }




  //定义登录跳转方法
  login = () => {
    const { username, password, email} = this.state;
    const os = Platform.OS==='ios'?0 : 1;
    const url = Service.BaseUrl+Service.v+`/passport/login?type=1&email=${email}&password=${password}&os=${os}`;
    console.log(url);
    this.setState({ loading: true });

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ loading: false });

      if(!responseJson.status){
        console.log(responseJson);
        storage.save({
      	key: 'loginState',   // Note: Do not use underscore("_") in key!
      	data: {
      		token:responseJson.data.access_token,
          uid:responseJson.data.id,
          //ws: responseJson.data.ws,
      	},

      	// if not specified, the defaultExpires will be applied instead.
      	// if set to null, then it will never expire.
      	expires: null,
      })
      .then(() => {

       let user = String(responseJson.data.id);

       console.log(user);



        Util.addAlias(user,'Helpe');

        alert(I18n.t('success.login'));
        DeviceEventEmitter.emit('login',true);

      })
      .then(() => this.props.navigation.goBack())
      ;

      }
      else{
        alert(I18n.t('error.login_failed')+'\n'+responseJson.err);
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.log(error);
    })
  };

  fbLogin = () => {
    LoginManager.logInWithReadPermissions(['public_profile','user_birthday','user_about_me']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: '
            +result.grantedPermissions.toString());
            AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data);
                  })
        }
      },
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
  };

  _responseInfoCallback(error: ?Object, result: ?Object) {
  if (error) {
    alert('Error fetching data: ' + error.toString());
    } else {
    alert('Success fetching data: ' + result.toString());
    }
  };

  showLoading = () => {
    if(!this.state.loading){
      return (
        <Image
          style={{height: 72 ,width: 94,marginTop: 30}}
          resizeMode="contain"
          source={require('../icon/login/logo.png')}
        />
      );
    }
    else{
      return(
        <View
          style={{
            marginTop: 30,
            height: 72 ,
            width: 94,
          }}
        >
          <ActivityIndicator animating size="large" color='#fd586d' />
        </View>
      );
    }
  };

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
              color='#fd586d'
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,}}>
          </View>

          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
              <Text
                style={{marginRight: 10,color:'#fd586d',fontSize: 16}}
                onPress={() => this.props.navigation.navigate('register')}>
                {I18n.t('login.register')}
              </Text>
            </View>
          </View>

        </View>

        {this.showLoading()}
        <View style={{width: 280,height: 40,marginTop: 30,flexDirection: 'row',alignItems: 'center',}}>
          <Image
            style={{width: 36,height: 36,marginLeft: 0,marginRight: 0,}}
            source={require('../icon/login/user.png')}
            resizeMode="contain"
          />
          <View style={{height: 40,width: 280-36-15-10,marginLeft: 15,borderBottomWidth: 2,borderColor: '#fd586d',}}>
            <TextInput
              placeholder={I18n.t('register.username')}
              placeholderTextColor ='#999999'
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.email}
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
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              style={{height: 40,width: 280-36-15-10,fontSize: 16,color: '#333333',alignSelf: 'center',padding: 5}}
            />
          </View>
        </View>
          <Button
            style={styles.button}
            onPress={() => {
              if(this.state.email==null||this.state.email==''){
                alert('no username');
              }
              else if(this.state.password==null||this.state.password==''){
                alert('no password');
              }
              else if(this.state.password.length<6){
                alert('length of password is too short');
              }
              else{
                this.login();
              }
            }}
            backgroundColor='#fd586d'
            borderRadius={20}
            //containerStyle={{height: 60,width: 180}}
            titleStyle={{color: 'FFFFFF'}}
            title={I18n.t('login.login')}/>
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
      height:22,
      backgroundColor:'#FFFFFF',
  },
  header: {
    height:44,
    alignSelf:'stretch',
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor:'#FFFFFF',
  },
  body: {
    marginTop: 50,
    width:300,
    height:150,
    alignSelf:'center',
    backgroundColor:'#f1a073',
    borderWidth:10,
    borderColor:'#f1a073',
    borderRadius: 20,
  },
  button: {
    alignSelf: 'center',
    marginTop: 20,
    width: 280,
    height: 80,

  },
  other:  {
    alignSelf:'center',
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'stretch',
    marginTop:5,
    height:30,
    width:400,
  }
});

export default login;
