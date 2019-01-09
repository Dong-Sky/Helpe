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
  NativeModules,
  Alert,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
  AsyncStorage,
} from 'react-navigation';
import { List, ListItem, FormLabel, FormInput } from 'react-native-elements';
import { Icon,Button } from 'react-native-elements';
import Storage from 'react-native-storage';
import util from '../common/util';
import DeviceStorage from '../common/DeviceStorage';
import Modalbox from 'react-native-modalbox';
import Service from '../common/service';
import Util from '../common/util';

export default class setting extends Component{
  constructor(props) {
    super(props);

    this.state = {
      token:null,
      uid:null,
      islogin:false,
      //
      pub: {
        v: '0',
      },
      v: '0',
      HttpCache: 0,

      //
      modalVisible: false,
      isDisabled: false,
      //
      old_pass: null,
      new_pass: null,
      new_pass1: null,
      //
      loading: false,
    };
  }

  componentWillMount() {
    this.getLoginState();
    this.getPub();
  }

  componentDidMount() {
    this.getHttpCache();
  }

  getHttpCache = () => {
    NativeModules.HttpCache.getHttpCacheSize()
    .then((value) => {
      let size = Math.round((value / 1024 / 1024) * 100) / 100 ;
      this.setState({HttpCache: size})

    }
  )
  .catch(err => console.log(err))
  };

  clearCache = () => {
    this.setState({loading: true});
    NativeModules.HttpCache.clearCache()
    .then(() => {
        alert(I18n.t('success.clear'));
    }
  )
  .then(() => this.setState({loading: false}))
  .then(() => this.getHttpCache())
  .catch(err => {console.log(err);this.setState({loading: true})})
  }

  getPub = () => {
    const url = Service.BaseUrl+Service.v+`/server/info`;


    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      let pub = {
        v: 0
      };
      if(!responseJson.status){
        pub.v = responseJson.data.version;
      }
      else if(responseJson.status==5){
        alert(I18n.t('error.v_err'));
        pub.v = responseJson.data.version;
      }
      else{
        alert(I18n.t('error.fetch_failed')+'\n'+responseJson.errr);
      }
      this.setState({
        v: Service.v,
        pub: pub,
      })
    })
    .catch(err => console.log(err))
  }

  getLoginState = () => {
    storage.load({
      key: 'loginState',
    })
    .then((ret) => {
      if(ret.token!=null&ret.uid!=null){
        this.setState({
          islogin:true,
        })
      }
      this.setState({
      token:ret.token,
      uid:ret.uid,
        });

      }
    )
    .catch(error => {
      console.log(error);
    })
  };



  //登出方法
  out = () => {
    const {params} = this.props.navigation.state;
    const { uid,token } = this.state;
    const url = Service.BaseUrl+Service.v+`/passport/logout?t=${token}`;
    /*
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(true){
        storage.remove({
          key:'loginState',
        })
        .then(() => {

          console.log(uid);
          let user = uid.toString()
          Util.deleteAlias(user,'Helpe');

          alert(I18n.t('success.out'));
          DeviceEventEmitter.emit('login',false);

        })
        .then(() => this.props.navigation.goBack())
      }
      else{
        alert(I18n.t('error.out_failed'));
      }
    })
    .catch((error) => console.log(error))*/

    if(true){
      storage.remove({
        key:'loginState',
      })
      .then(() => {

        console.log(uid);
        let user = uid.toString()
        Util.deleteAlias(user,'Helpe');

        alert(I18n.t('success.out'));
        DeviceEventEmitter.emit('login',false);

      })
      .then(() => this.props.navigation.goBack())
    }
    else{
      alert(I18n.t('error.out_failed'));
    }

  };

  update_pass = () => {
    const { token,uid,new_pass,new_pass1,old_pass } = this.state;
    const url = Service.BaseUrl+Service.v+`/reset-password?t=${token}`;
    const body = `old_password=${ord_pass}&new_password=${new_pass}`;
    console.log(url);
    this.setState({loading: true})
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: body,
    })
    .then(response => response.json())
    .then(responseJson => {
      if(!responseJson.status){
        alert(I18n.t('success.update'));
        this.setState({modalVisible: false,new_pass: null,new_pass1: null})
      }
      else{
        alert(I18n.t('success.update_failed'));
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {
      console.log(err);
      this.setState({loading: false,})
    })
  };

  //以下定义页面元素
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

  renderHeader = () => {
      return (<View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "0%"
                  }}>
              </View>
          );
  };

  showLoading = () => {
    return(
      <Modalbox
        style={{height: 60, width: 60,backgroundColor: '#FFFFFF',opacity: 0.4,}}
        position='center'
        isOpen={this.state.loading}
        backdropOpacity={0}
        backdropPressToClose={false}
        swipeToClose={false}
        swipeThreshold={200}
        swipeArea={0}
        animationDuration={0}
        backdropColor='#FFFFFF'
        >
          <ActivityIndicator
            animating={true}
            style={{alignSelf: 'center',height: 50}}
            color='#333333'
            size="large" />
      </Modalbox>
    );
  };

  returnModal = () => {
    return (
      <Modalbox
        style={{height: 230, width: 300}}
        isOpen={this.state.modalVisible}
        isDisabled={this.state.isDisabled}
        position='center'
        backdrop={true}
        backButtonClose={false}
        swipeToClose={true}
        borderRadius={5}
        onClosed={() => this.setState({modalVisible: false,new_pass: null,new_pass1: null})}
        >
          <View>
            <FormLabel>{I18n.t('setting.old_pass')}</FormLabel>
            <FormInput

              value={this.state.old_pass}
              onChangeText={(old_pass) => this.setState({old_pass})}
              //placeholder = {I18n.t('setting.txt1')}
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyTyp='done'
              secureTextEntry={true}
            />
            <FormLabel>{I18n.t('setting.new_pass')}</FormLabel>
            <FormInput
              value={this.state.new_pass1}
              onChangeText={(new_pass) => this.setState({new_pass})}
              //placeholder = {I18n.t('setting.txt2')}
              clearButtonMode='always'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyTyp='done'
              secureTextEntry={true}
            />

            <Button
              title={I18n.t('common.submit')}
              backgroundColor='#f1a073'
              style={{marginTop: 20,height: 50}}
              containerStyle={{height: 50,width: 200}}
              onPress={() => {
                if(this.state.new_pass==null||this.state.new_pass1==null){
                  alert(I18n.t('setting.pass_null'));
                }
                else if(this.state.new_pass==''||this.state.new_pass1==''){
                  alert(I18n.t('setting.pass_null'));
                }
                else if(this.state.new_pass!=this.state.new_pass1){
                  alert(I18n.t('setting.pass1_err'));
                }
                else{
                  this.update_pass();
                }
              }}
            />
          </View>
      </Modalbox>
    );
  }


  //end
  render(){

    const {params} = this.props.navigation.state;
    const {navigate} = this.props.navigation;

    return(
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        <View style={{flex: 1,flexDirection: 'row',alignSelf: 'stretch',alignItems: 'center',}}>
          <Icon
            style={{marginLeft: 5}}
            name='chevron-left'
            color='#fd586d'
            size={36}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
          <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
            {I18n.t('setting.setting')}
          </Text>
        </View>
        <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center'}}>
        </View>
      </View>
      <View style={{flex: 1}}>
        <List containerStyle={styles.list}>
          <ListItem
            titleStyle={styles.title}
            title={I18n.t('setting.update_pass')}
            containerStyle={styles.listContainerStyle}
            onPress={() => this.setState({modalVisible: true})}
          />
          {this.renderSeparator()}
          <ListItem
            titleStyle={styles.title}
            title={I18n.t('setting.v')}
            rightTitle={this.state.v}
            containerStyle={styles.listContainerStyle}
          />
          {this.renderSeparator()}
          <ListItem
            titleStyle={styles.title}
            title={I18n.t('setting.max_v')}
            rightTitle={this.state.pub.v}
            containerStyle={styles.listContainerStyle}
          />
        </List>
        <List containerStyle={styles.list}>
          <ListItem
            titleStyle={styles.title}
            title={I18n.t('setting.clear_cache')}
            rightTitle={this.state.HttpCache+'M'}
            containerStyle={styles.listContainerStyle}
            onPress={() => {
              Alert.alert(
                I18n.t('setting.clear_cache'),
                I18n.t('setting.txt3'),
                [
                  {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.yes'), onPress: () => this.clearCache()},
                ],
                { cancelable: false }
              )
            }}
          />
          {this.renderSeparator()}
          <ListItem
            titleStyle={styles.title}
            title={I18n.t('setting.record')}
            containerStyle={styles.listContainerStyle}
          />
          {this.showLoading()}
        </List>
        <TouchableOpacity
          style={{height: 40,width: '100%',marginTop: 10,flexDirection: 'column',justifyContent: 'center',backgroundColor: '#FFFFFF',borderWidth: 1,borderColor: '#e5e5e5'}}
          onPress={() => {
            if(this.state.islogin){
              Alert.alert(
                I18n.t('setting.out'),
                I18n.t('setting.txt4'),
                [
                  {text: I18n.t('common.no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: I18n.t('common.yes'), onPress: () => this.out()},
                ],
                { cancelable: false }
              );
            }
            else{
              alert(I18n.t('setting.not_login'));
            }
          }}
          >
          <Text
            style={{alignSelf: 'center',fontSize: 16,color: '#fd586d'}}

            >
            {I18n.t('setting.out')}
          </Text>
        </TouchableOpacity>
      </View>
      {this.returnModal()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        //alignItems: 'stretch',
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
  list: {
   borderColor: '#e5e5e5',
   borderWidth: 1,
  },
  listContainerStyle:{
   borderBottomWidth: 0,
   backgroundColor: '#FFFFFF'
  },
});
