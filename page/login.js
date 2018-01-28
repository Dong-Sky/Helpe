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
import { Button,Icon } from 'react-native-elements';
import { Platform } from 'react-native';
import FBSDK from 'react-native-fbsdk';
import {
  LoginButton,
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import Service from '../common/service';
import Util from '../common/util';

class login extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: null,
            password: null,
            loading: false,
      }
    };



  //定义登录跳转方法
  login = () => {
    const { username, password } = this.state;
    const os = Platform.OS==='ios'?0 : 1;
    const url = Service.BaseUrl+`?a=oauth&v=${Service.version}&username=${username}&password=${password}&os=${os}`;

    this.setState({ loading: true });
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ loading: false });

      if(!responseJson.status){

        storage.save({
      	key: 'loginState',   // Note: Do not use underscore("_") in key!
      	data: {
      		token:responseJson.data.token,
          uid:responseJson.data.uid,
          ws: responseJson.data.ws,
      	},

      	// if not specified, the defaultExpires will be applied instead.
      	// if set to null, then it will never expire.
      	expires: null,
      })
      .then(() => {

        Util.addAlias(responseJson.data.uid);

        alert(I18n.t('success.login'));
        DeviceEventEmitter.emit('login',true);

      })
      .then(() => this.props.navigation.goBack())
      ;

       /*this.props.navigation.dispatch(
         NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'main'})
          ]
        })
      );*/
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
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: '
            +result.grantedPermissions.toString());
            AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  })
        }
      },
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
  };

  showLoading = () => {
    if(!this.state.loading){
      return null;
    }
    else{
      return(
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
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
              color='#f1a073'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,}}>
          </View>

          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
              <Text
                style={{marginRight: 10,color:'#f1a073',fontSize: 16}}
                onPress={() => this.props.navigation.navigate('register')}>
                {I18n.t('login.register')}
              </Text>
            </View>
          </View>

        </View>
        <View style={styles.body}>
          <Kohana
            style={{ backgroundColor: '#f1a073',borderBottomWidth:1,borderColor:'#e5e5e5' }}
            label={I18n.t('login.username')}
            iconClass={FontAwesomeIcon}
            iconName={'user-o'}
            iconColor={'#FFFFFF'}
            iconSize={40}
            labelStyle={{ marginTop: 8, color: '#e5e5e5' }}
            inputStyle={{ color: '#FFFFFF' }}
            autoCapitalize='none'
            clearButtonMode='always'
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}

          />
          <Kohana
            style={{ marginTop:4,backgroundColor: '#f1a073' }}
            label={I18n.t('login.password')}
            iconClass={FontAwesomeIcon}
            iconName={'lock'}
            iconColor={'#FFFFFF'}
            labelStyle={{ color: '#e5e5e5' }}
            inputStyle={{ color: '#FFFFFF' }}
            autoCapitalize='none'
            clearButtonMode='always'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry={true}

         />
          </View>
          <Button
            style={styles.button}
            onPress={() => {
              if(this.state.username==null||this.state.username==''){
                alert('请填写用户名');
              }
              else if(this.state.password==null||this.state.password==''){
                alert('请填写密码');
              }
              else{
                this.login();
              }
            }}
            backgroundColor='#f1a073'
            borderRadius={10}
            //containerStyle={{height: 60,width: 180}}
            titleStyle={{color: 'FFFFFF'}}
            title={I18n.t('login.login')}/>
          <View style={styles.other}>
            <TouchableOpacity>
            </TouchableOpacity>
          </View>
          {this.showLoading()}
          {/*<TouchableOpacity>
            <Text onPress={() => this.fbLogin()}>
              fblogin
            </Text>
          </TouchableOpacity>*/}
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
    width: 240,
    height: 60,

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
