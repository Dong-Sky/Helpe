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
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
import { Button } from 'react-native-elements';
import Service from '../common/service';

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
    const url = Service.BaseUrl+`?a=oauth&v=${Service.version}&username=${username}&password=${password}`;
    console.log(url);
    this.setState({ loading: true });
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ loading: false });

      if(!responseJson.status){
        console.log(responseJson.data);
        storage.save({
      	key: 'loginState',   // Note: Do not use underscore("_") in key!
      	data: {
      		token:responseJson.data.token,
          uid:responseJson.data.uid,
      	},

      	// if not specified, the defaultExpires will be applied instead.
      	// if set to null, then it will never expire.
      	expires: null,
       });
       alert('登录成功');
       this.props.navigation.dispatch(
         NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'main'})
          ]
        })
       );
      }
      else{
        alert('登录失败!\n'+responseJson.err);
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.log(error);
    })
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
          <Text style={{marginLeft:20,color:'#5c492b'}}>
            退出
          </Text>
          <View style={{flex:1,}}>
          </View>
          <Text
            style={{marginRight:20,color:'#5c492b'}}
            onPress={() => this.props.navigation.navigate('register')}>
            注册
          </Text>
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
            style={{ marginTop:4,backgroundColor: '#FFFFFF' }}
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
            backgroundColor='#5c492b'
            title='登録' />
          <View style={styles.other}>
            <TouchableOpacity>
              <Text style={{color:'#5c492b',}}>
                password forget
              </Text>
            </TouchableOpacity>
          </View>
          {this.showLoading()}
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
      height:22,
      backgroundColor:'#fbe994',
  },
  header: {
    height:44,
    alignSelf:'stretch',
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor:'#fbe994',
  },
  body: {
    marginTop:20,
    width:300,
    height:150,
    alignSelf:'center',
    backgroundColor:'#FFFFFF',
    borderWidth:10,
    borderColor:'#FFFFFF',
    borderRadius:20,
  },
  button: {
    alignSelf:'center',
    marginTop:15,
    width:280,
    height:50,
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
