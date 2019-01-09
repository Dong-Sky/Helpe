import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Picker,
  ScrollView,
  Modal,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import { Icon,Button,Avatar,Card } from 'react-native-elements';
import Service from '../common/service';

//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}

class online extends Component{
  constructor(props) {
       super(props);
       this.state = {
         token: null,
         uid: null,
         islogin: false,
         id: null,
         res: {},
         isOnline: false,
       }
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    this.setState({
      token:params.token,
      uid:params.uid,
      islogin:params.islogin,
      res: params.res,
      id: params.res.data.id,
    });
  };

  componentDidMount() {

  };

  online = () => {
    const { token,uid,id } = this.state;
    const url = Service.BaseUrl+Service.v+`/item/online?t=${token}`;
    const body = `id=${id}&token=${token}&uid=${uid}`;
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        let pet = responseJson.data.pet? responseJson.data.pet: 0;
        alert(I18n.t('success.online')+'\n'+I18n.t('online.t')+': '+formatDate(pet));
        this.setState({isOnline: true});
      }
      else {
        alert(I18n.t('error.online_failed'))
      }
    })
    .catch(error => console.log(error))
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#fd586d'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
              {I18n.t('online.title')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',marginRight: 10,}}>
            <Text
               style={{fontSize: 16,color: '#fd586d'}}
               onPress={() =>  this.props.navigation.dispatch(
                                  NavigationActions.reset({
                                   index: 0,
                                   actions: [
                                     NavigationActions.navigate({ routeName: 'main'})
                                   ]
                                 })
                               )
                       }
               >
              {I18n.t('common.finish')}
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Card
            style={{marginTop: 100}}
            title={I18n.t('success.publish')}
            //image={require('../images/pic2.jpg')}
            >
            <Text style={{marginBottom: 10}}>
              {'\t'+I18n.t('online.txt1')}
            </Text>
            <Text style={{marginBottom: 10}}>
              {'\t'+I18n.t('online.txt2')}
            </Text>
            <Button
              onPress={() => {
                if(this.state.isOnline){
                  alert(I18n.t('online.is_online'));
                }
                else{
                  this.online();
                }
              }}
              backgroundColor='#fd586d'
              borderRadius={5}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
              title={this.state.isOnline?I18n.t('online.is_online'):I18n.t('online.go_online')}
            />
          </Card>
        </View>
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
    backgroundColor: '#f3f3f3',
  },
  StatusBar:  {
      height: 22,
      backgroundColor: '#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  item_pic: {
    height: 200,
    marginTop: 1,
  },
  img: {
    flex:1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 16,
    color: '#333333',
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

export default online;
