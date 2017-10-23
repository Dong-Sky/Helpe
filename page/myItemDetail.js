import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon  } from 'react-native-elements';
import Service from '../common/service';

 class myItemDetail extends Component {
   constructor(props) {
    super(props);
    this.state = {
      token: null,
      uid: null,
      islogin: null,
      //商品信息
      itemId: null,
      addr: {},
      category: {},
      detail: {},
      img: [],
      item: {},
      //用户信息
    };
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.state.token = params.token;
    this.state.uid = params.uid;
    this.state.islogin = params.islogin;
    this.state.itemId = params.itemId;
    console.log(this.state);
    this.getItemInfo();
  };

  //获取商品详细数据
  getItemInfo = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=item&m=info&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        addr: responseJson.data.addr,
        category: responseJson.data.category,
        detail: responseJson.data.detail,
        img: responseJson.data.img,
        item: responseJson.data.item,
      });
      return responseJson.data.item.uid;
    })
    .then(uid => {
      console.log(uid);
      console.log(this.state);
    })
    .catch(error => console.log(error));
  };

  //定义上架方法
  online = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=itempub&m=online&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert('上架成功!');
      }
      else {
        alert(response.err);
      }
    })
    .then(() => this.getItemInfo())
    .catch(error => console.log(error))
  };

  //定义下架方法
  unline = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=itempub&m=unline&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if(!responseJson.status){
        alert('下架成功!');
      }
      else {
        alert(response.err);
      }
    })
    .then(() => this.getItemInfo())
    .catch(error => console.log(error))
  };

  //定义页面元素
  renderButton = () => {
    if(this.state.item.flag==0){
      return(
        <Button
          style={styles.button}
          backgroundColor='#5c492b'
          onPress={() => this.online()}
          title='立即上架' />
      );
    }
    else{
      return(
        <Button
          style={styles.button}
          backgroundColor='#5c492b'
          onPress={() => this.unline()}
          title='立即下架' />
      );
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        </View>
        <ScrollView>
          <TouchableOpacity style={styles.item_pic}>
          </TouchableOpacity>
          <Text>
            {this.state.detail.t}
          </Text>
        </ScrollView>
        <View style={styles.bottom}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#f2f2f2',
  },
  StatusBar:  {
      height:22,
      backgroundColor:'#fbe994',
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
    backgroundColor: 'red',
  },
  bottom: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch' ,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
  },
  icon: {
     width: 25,
     height: 25,
  },
  button: {
    alignSelf:'center',
    marginTop:15,
    width:280,
    height:50,
  },
});

export default myItemDetail;
