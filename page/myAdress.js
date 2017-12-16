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
<<<<<<< Updated upstream
=======
  TouchableOpacity,
>>>>>>> Stashed changes
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
import Modalbox from 'react-native-modalbox';
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
         isInfoModalVisible: false,
         mapModalVisible: false,
         isDisabled: false,
         isDisabled1: false,
         //用户地址列表
         data: [],
         //地图信息
         region:{
           latitude: 0,
           longitude: 0,
           latitudeDelta: 0.00629157290689264,
           longitudeDelta: 0.004999999999881766,
         },
         addr: {
           latitude: 0,
           longitude: 0,
           latitudeDelta: 0.00629157290689264,
           longitudeDelta: 0.004999999999881766,
           info: '我的位置',
         },
         locate: true,
         //地址信息
         info: null,
         aid: '0',
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

     if(!responseJson.status){
       alert(I18n.t('success.add'));
     }
     else {
       alert(I18n.t('success.add_failed'));
     }
   })
   .then(() => this.getAddress())
   .catch(error => {console.log(error);})
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
        onRequestClose={() => {console.log("Modal has been closed.")}}
        >
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
               onPress={() => this.setState({modalVisible: false,info: null,})}
             />
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
             <Text style={{alignSelf: 'center',fontSize: 18,color: '#333333'}}>
               {I18n.t('myAddress.new')}
             </Text>
           </View>
           <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
           </View>
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
               <TouchableOpacity style={{height: 50,width: 50,}} onPress={() => this.getLocation()}>
                 <Image
                   source={require('../icon/tarbar/locate.png')}
                   style={{height: 50,width: 50}}
                 />
               </TouchableOpacity>
               <MapView.Marker
                 coordinate={this.state.region}
               />
           </MapView>
          </View>
          <View style={{height: 1,backgroundColor: '#e5e5e5'}}></View>
          <View style={styles.modal_body}>
            <ListItem
              title={I18n.t('myAddress.info')}
              titleStyle={styles.title}
              rightTitle={this.state.info==''?I18n.t('myAddress.no_info'):this.state.info}
              containerStyle={styles.listContainerStyle}
              rightTitleNumberOfLines={3}
              onPress={() => this.setState({isInfoModalVisible: true})}
            />
          </View>
          <Button
            style={styles.button}
            buttonStyle={{marginTop:5,marginBottom:5,}}
            borderRadius={5}
            backgroundColor='#f1a073'
            onPress={() => {
              if(this.state.info==null||this.state.info==''){
                alert(I18n.t('myAddress.no_info'));
              }
              else{
                this.addAddress();
              }
            }}
            title={I18n.t('myAddress.no_info')} />
            {this.renderInfoModal()}
         </View>
      </Modal>
    );
  };

<<<<<<< Updated upstream
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
=======
  //地址名页面
  renderInfoModal = () => {
    return(
      <Modalbox
        style={{height: 220,width: 300,alignItems: 'center',}}
        isOpen={this.state.isInfoModalVisible}
        isDisabled={this.state.isDisabled}
        position='center'
        backdrop={true}
        backButtonClose={true}
        onClosed={() => this.setState({isInfoModalVisible: false})}
        >
          <Text style={{marginTop: 10}}>
            {I18n.t('myAddress.no_info')}
          </Text>
          <View style={{flex: 1,marginTop: 10, alignSelf: 'stretch'}}>
            <TextInput
              style={styles.markInput}
              autoCapitalize='none'
              multiline = {true}
              underlineColorAndroid="transparent"
              editable={true}
              value={this.state.info}
              onChangeText={(info) => this.setState({info})}
              maxLength={50}
              placeholder={I18n.t('myAddress.txt1')}
            />
          </View>
          <Button
            style={styles.button1}
            backgroundColor='#f1a073'
            borderRadius={5}
            title={I18n.t('common.submit')}
            onPress={() => this.setState({isInfoModalVisible: false,})}
          />
      </Modalbox>
    );
  };

  //地图页面
  renderMapModal = () => {
    return(
      <Modalbox
        style={{height: 300,width: 300,alignItems: 'center',}}
        isOpen={this.state.mapModalVisible}
        isDisabled={this.state.isDisabled1}
        position='center'
        backdrop={true}
        swipeToClose={false}
        backButtonClose={true}
        onClosed={() => this.setState({mapModalVisible: false})}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: this.state.addr.latitude/1,
              longitude: this.state.addr.longitude/1,
              latitudeDelta: 0.00629157290689264,
              longitudeDelta: 0.004999999999881766,
            }}
          >
            <MapView.Marker coordinate={{
              latitude: this.state.addr.latitude/1,
              longitude: this.state.addr.longitude/1,
            }}>
              <MapView.Callout>
                <Text style={{color: '#333333',fontSize: 14}}>
                  {I18n.t('myAddress.myAddress')}
                </Text>
              </MapView.Callout>
            </MapView.Marker>
        </MapView>
      </Modalbox>
    );
>>>>>>> Stashed changes
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
          <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <Icon
              style={{marginLeft: 5}}
              name='keyboard-arrow-left'
              color='#f1a073'
              size={32}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center',color: '#333333',fontSize: 18}}>
              {I18n.t('myAddress.myAddress')}
            </Text>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
            <View style={{marginRight: 10}}>
              <Icon
                name='add'
                color='#f1a073'
                size={28}
                onPress={() => this.setState({modalVisible: true},this.getLocation)}
              />
            </View>
          </View>
        </View>
        <List containerStyle={{borderWidth: 1,borderColor: '#e5e5e5',marginTop: 0}}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                title={item.info}
                titleStyle={styles.title}
                containerStyle={styles.listContainerStyle}
<<<<<<< Updated upstream
                keyExtractor={item => item.id}
                onPress={() => {
                  Alert.alert(
                    '请选择',
                    '',
                    [
                      {text: '修改', onPress: () => console.log('Ask me later pressed')},
                      {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: '删除', onPress: () => this.deleteAddress(item.id)},
=======
                titleNumberOfLines={3}
                keyExtractor={item => item.id}
                onPress={() => {
                  Alert.alert(
                    I18n.t('myAddress.choose'),
                    '',
                    [
                      {
                        text: I18n.t('myAddress.go'),
                        onPress: () => {
                          var addr = {
                            latitude: item.lat/1,
                            longitude: item.lng/1,
                            latitudeDelta: 0.00629157290689264,
                            longitudeDelta: 0.004999999999881766,
                            info: item.info,
                          };
                          console.log(addr);
                          this.setState({addr: addr,mapModalVisible: true,});
                        }
                      },
                      {text: I18n.t('common.cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: I18n.t('common.delete'), onPress: () => this.deleteAddress(item.id)},
>>>>>>> Stashed changes
                    ],
                    { cancelable: false }
                  );
                }}
              />
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </List>
<<<<<<< Updated upstream

=======
          {this.renderMapModal()}
>>>>>>> Stashed changes
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
    backgroundColor:'#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
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
    backgroundColor: '#f2f2f2'
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
<<<<<<< Updated upstream
=======
  button1: {
    alignSelf: 'center',
    marginTop : 5,
    width: 240,
    height: 50,
  },
  contactInput:{
    width: 260,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
  markInput:{
    width: 260,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1a073',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    padding: 5,
  },
>>>>>>> Stashed changes
});
export default myAdress;
