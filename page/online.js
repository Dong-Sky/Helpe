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

class online extends Component{
  constructor(props) {
       super(props);
       this.state = {
         token: null,
         uid: null,
         islogin: false,
         id: null,
         res: {},
       }
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    this.setState({
      token:params.token,
      uid:params.uid,
      islogin:params.islogin,
      res: params.res,
      id: params.res.data.detail.itemid,
    });
  };

  componentDidMount() {

  };

  online = () => {
    const { token,uid,id } = this.state;
    const url = Service.BaseUrl+`?a=itempub&m=online&v=${Service.version}&token=${token}&uid=${uid}&id=${id}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert('上架成功!');
      }
      else {
        alert('上架失败!')
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
          <Text
            style={{marginLeft:20,color:'#5c492b'}}
            onPress={() => this.props.navigation.goBack()}>
            返回
          </Text>
          <View style={{flex:1,}}>
          </View>
          <Text
            style={{marginRight:20,color:'#5c492b'}}
            onPress={() =>  this.props.navigation.dispatch(
                               NavigationActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({ routeName: 'main'})
                                ]
                              })
                            )
                    }>
            完成
          </Text>
        </View>
          <Button
              style={{marginTop: 10}}
              icon={{name: 'code'}}
              backgroundColor='#5c492b'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              onPress={() => this.online()}
              title='立即上架' />
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
    backgroundColor: '#f2f2f2',
  },
  StatusBar:  {
      height: 22,
      backgroundColor: '#fbe994',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
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
