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
import { Button,Icon } from 'react-native-elements';
import Service from '../common/service';

class register extends Component{
  constructor(props) {
      super(props);
      this.state = {
            username: null,
            password: null,
            password1: null,
            nickname: null,
            loading: false,
      }

    }
  //定义注册方法
  register = () => {
    const { username, password, nickname } = this.state;
    const url = Service.BaseUrl+`?a=oauth&v=${Service.version}&m=up&username=${username}&password=${password}&nickname=${nickname}`;

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(!responseJson.status){
        alert(I18n.t('success.register_failed'));
        this.props.navigation.goBack();
      }
      else{
        alert(I18n.t('error.register')+'\n'+responseJson.err)
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
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <Kohana
            style={{ backgroundColor: '#f1a073',borderBottomWidth:1,borderColor:'#e5e5e5' }}
            label={I18n.t('register.username')}
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
            style={{ marginTop:4,backgroundColor: '#f1a073',borderBottomWidth:1,borderColor:'#e5e5e5' }}
            label={I18n.t('register.password')}
            iconClass={FontAwesomeIcon}
            iconName={'lock'}
            iconColor={'#FFFFFF'}
            labelStyle={{ color: '#e5e5e5' }}
            inputStyle={{ color: '#FFFFFF' }}
            autoCapitalize='none'
            clearButtonMode='always'
            returnKeyTyp='done'
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
         />
         <Kohana
           style={{ marginTop:4,backgroundColor: '#f1a073',borderBottomWidth:1,borderColor:'#e5e5e5' }}
           label={I18n.t('register.password1')}
           iconClass={FontAwesomeIcon}
           iconName={'lock'}
           iconColor={'#FFFFFF'}
           labelStyle={{ color: '#e5e5e5' }}
           inputStyle={{ color: '#FFFFFF' }}
           autoCapitalize='none'
           clearButtonMode='always'
           returnKeyTyp='done'
           secureTextEntry={true}
           onChangeText={(password1) => this.setState({password1})}
           value={this.state.password1}
         />
         <Kohana
           style={{ marginTop:4,backgroundColor: '#f1a073' }}
           label={I18n.t('register.nickname')}
           iconClass={FontAwesomeIcon}
           iconName={'lock'}
           iconColor={'#FFFFFF'}
           labelStyle={{ color: '#e5e5e5' }}
           inputStyle={{ color: '#FFFFFF' }}
           autoCapitalize='none'
           clearButtonMode='always'
           onChangeText={(nickname) => this.setState({nickname})}
           value={this.state.nickname}
         />
        </View>

          <Button
            title={I18n.t('register.register')}
            style={styles.button}
            onPress={() => {
              if(this.state.password==null||this.state.password1==null){
                alert(I18n.t('register.pass_null'));
              }
              else if(this.state.password1==''||this.state.password1==''){
                alert(I18n.t('register.pass_null'));
              }
              else if(this.state.password!=this.state.password1){
                alert(I18n.t('pass1_err'));
              }
              else{
                this.register();
              }
            }}
            backgroundColor='#f1a073'
            titleStyle={{color: '#FFFFFF'}}
            borderRadius={10}
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
    width: 240,
    height: 60,
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
