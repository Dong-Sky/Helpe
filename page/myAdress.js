import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  ScrollView,
  Modal,
  TouchableHighlight,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import ReactNative from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
import MapView, { marker,Callout,} from 'react-native-maps';
import Service from '../common/service';

class myAdress extends Component {

  constructor(props) {
       super(props);
       this.state = {
         //用户登录信息
         token: null,
         uid:null,
         islogin:false,
         //弹出视图控制
         modalVisible: false,
         //用户地址列表
         data: [],
         //地图信息
         region:{
           latitude: 0,
           longitude: 0,
           latitudeDelta: 0.00629157290689264,
           longitudeDelta: 0.004999999999881766,
         },
         locate: true,
         //地址信息
         info: null,
         aid: '39128',
       }
  };

  componentWillMount(){
    this.getLocation();
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.state.token = params.token;
    this.state.uid = params.uid;
    this.state.islogin = params.islogin;
    this.getAddress();
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  };

  getLocation = () => {
     navigator.geolocation.getCurrentPosition(
         location => {
           console.log(location);
           var region = {
             latitude: location.coords.latitude,
             longitude: location.coords.longitude,
             latitudeDelta: 0.00629157290689264,
             longitudeDelta: 0.004999999999881766,
           };
           this.setState({ region });
         },
         error => {
           console.log("获取位置失败："+ error);
         },
     );

  };

  onRegionChange = (region) => {
   this.setState({ region });
  };

  //获取用户地址
  getAddress = () => {
    const {token,uid} = this.state;
    fetch(Service.BaseUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: 'a=addr&token='+token+'&uid='+uid+'&v='+Service.version,
   })
   .then(response => response.json())
   .then(responseJson => {
     console.log(responseJson);
     this.setState({ data: responseJson.data})
   })
   .catch(error => console.log(error))
  };

  //添加地址方法
  addAddress = () => {
    const { token,uid,region,aid,info } = this.state;
    const body = 'a=addr&m=add&v='+Service.version+'&token='+token+'&uid='+uid+'&aid='+aid+'&lat='+region.latitude+'&lng='+region.longitude+'&info='+info;
    fetch(Service.BaseUrl, {
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
       alert('添加成功');
     }
     else {
       alert('添加失败');
     }
   })
   .then(() => this.getAddress())
   .catch(error => console.log(error))
  };

  //删除地址方法
  deleteAddress(id){
    const body = 'a=addr&m=del&v='+Service.version+'&token='+this.state.token+'&uid='+this.state.uid+'&id='+id;
    this.setState({loading: true})
    fetch(Service.BaseUrl,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
    })
    .then(() => this.setState({loading: false}))
    .then(() => this.getAddress())
    .catch(error => console.log(error))
  };

  rendermodal = () => {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
        >
       <View style={styles.container}>
         <View style={styles.StatusBar}>
         </View>
         <View style={styles.header}>
           <Text
             style={{marginLeft:20,color:'#5c492b'}}
             onPress={() => this.setModalVisible(!this.state.modalVisible)}>
             返回
           </Text>
           <View style={{flex:1,}}>
           </View>
           <Text
             style={{marginRight:20,color:'#5c492b'}}
             onPress={() => this.addAddress()}>
             确定
           </Text>
         </View>
         <View style={{flex:1,}}>
           <MapView
               style={styles.map}
               region={this.state.region}
               onRegionChange={this.onRegionChange}
               showsUserLocation={true}
               showsBuildings={true}
               loadingEnabled={true}
               liteMode={true}
               userLocationAnnotationTitle='myLocation'
               //followsUserLocation={this.state.locate}
               showsMyLocationButton={true}
               onRegionChangeComplete={(region) => console.log(region)}
             >
               <MapView.Marker
                 coordinate={this.state.region}
               />
           </MapView>
          </View>
          <View style={styles.modal_body}>
                <TextInput
                  style={{height:50,alignSelf:'stretch'}}
                  placeholder="请输入内容"
                  onChangeText={(info) => this.setState({info})}
                  value={this.state.info}
                  onEndEditing={() => Keyboard.dismiss()}
                />
          </View>
         </View>
      </Modal>
    );
  };

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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
          <View style={{flex:1,}}>
          </View>
          <Text
            style={{marginRight:20,color:'#5c492b'}}
            onPress={() => this.setModalVisible(true)}>
              添加
          </Text>
        </View>
        <List containerStyle={{borderWidth: 1,borderColor: '#e5e5e5',marginTop: 0}}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                title={item.info}
                titleStyle={styles.title}
                containerStyle={styles.listContainerStyle}
                keyExtractor={item => item.id}
                onPress={() => {
                  Alert.alert(
                    '请选择',
                    '',
                    [
                      {text: '修改', onPress: () => console.log('Ask me later pressed')},
                      {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '删除', onPress: () => this.deleteAddress(item.id)},
                    ],
                    { cancelable: false }
                  );
                }}
              />
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </List>

          {this.rendermodal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        alignItems: 'stretch'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  body: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e1e8e2',
  },
  modal_body: {
    flex: 1,
    //flexDirection: 'column',
    //alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
  icon_send: {
    width: 25,
    height: 25,
  },
  title: {
    color: '#333333',
    fontSize: 16,
  },
  listContainerStyle:{
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF'
  },
});
export default myAdress;
