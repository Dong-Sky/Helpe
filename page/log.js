import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Modal,
  Dimensions,
  NativeModules,
  Alert,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import Geolocation from 'Geolocation' ;
import { List, ListItem,Icon,Button,Avatar,SearchBar } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import Service from '../common/service';
import Util from '../common/util';

//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


//时间戳转换字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "/");
}




class log extends Component {
  static navigationOptions = {
    tabBarLabel: 'home',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../icon/tarbar/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  }

  constructor(props) {
    super(props);

    this.state = {
      //用户登录信息
      token: null,
      uid: null ,
      islogin: false,
      //列表控制
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      //
      data: [],
      total: 0,
    };
  };

  componentWillMount() {

    this.getLoginState();
  };

  getLoginState = () => {
    storage.load({
      key: 'loginState',
    })
    .then((ret) => {
        //console.log(ret);
      if(ret.token!=null&ret.uid!=null){
        this.setState({ islogin: true });
      }

      this.setState(
        {
          token: ret.token,
          uid: ret.uid,
          islogin: ret.token!=null&ret.uid!=null?true: false,
          ws: ret.ws,
        },() => this.getLog())
      }
    )
    .catch(error => {
      console.log(error);
    })
  };

  getLog = () => {
    console.log(123);
    const { token,uid,islogin} = this.state;

    if(!islogin){

      return;
    }
    const url = Service.BaseUrl+Service.v+`/mlog?t=${token}&page=1&per-page=${50}`
    this.setState({loading: true});
    fetch(url)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if(!parseInt(res.status)){
        this.setState({

          data: res.data.data,
        })
      }
      else{
        alert(res.err)
      }
    })
    .then(() => this.setState({loading: false}))
    .catch(err => {
      console.log(err);
      this.setState({loading: false});
    })
  };

  componentDidMount() {
  };


  handleRefresh = () => {

  };

  handleLoadMore = () => {

  };



  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
          backgroundColor: "#f2f2f2",
          marginLeft: "5%"
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  returnLogElement = (log) => {

    let result = {
      title: '',
      sub: '',
      next: '',
    };

    let data = JSON.parse(log.data);
    result = Util.log(Number(log.tpid),data);

    return result;
  }

  render() {
    const { navigate } = this.props.navigation;
    //const { params } = this.props.navigation.state;
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
              size={36}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
          </View>
          <View style={{flex:1,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}}>
          </View>
        </View>
        <List containerStyle={{ backgroundColor: '#f2f2f2',borderTopWidth: 1,flex:1 ,marginTop: 0,borderColor: '#e5e5e5',marginLeft: 0,marginRight: 0,}}>

          <FlatList
            style={{marginTop: 0,borderWidth: 0,}}
            data={this.state.data}
            renderItem={({ item }) => (
              <View>
                <ListItem
                  component={TouchableOpacity}
                  roundAvatar
                  key={item.id}
                  title={this.returnLogElement(item).sub}
                  subtitle={formatDate(Number(item.ct))}
                  titleNumberOfLines={3}
                  //rightTitle={formatDate(Number(item.t))}
                  rightIcon={<View></View>}
                  subtitleNumberOfLines={3}
                  titleStyle={{fontSize: 14}}
                  subtitleStyle={{marginTop: 15}}
                  //subtitle={this.returnLogElement(item).sub+'\n('+formatDate(Number(item.ct))+')'}
                  //avatar={require('../icon/person/default_avatar.png')}
                  leftIcon={
                    <Icon
                      name={this.returnLogElement(item).icon}
                      size={20}
                      color='#fd586d'
                      reverse
                    />
                  }
                  avatarContainerStyle={{height:40,width:40}}
                  avatarStyle={{height:40,width:40,tintColor: '#FFFFFF',backgroundColor: '#fd586d'}}
                  containerStyle={{ borderBottomWidth: 0,backgroundColor: '#FFFFFF',borderRadius: 0,marginBottom: 0}}
                  onPress={() => navigate(this.returnLogElement(item).next,{
                    uid: this.state.uid,
                    token: this.state.token,
                    islogin: this.state.islogin,
                    status: '&status=0,10,20,30,40,50,60',
                    title: I18n.t('myOrder.o4'),
                  })}
                />
                {this.renderSeparator(true)}

              </View>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
            //ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            //onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />

        </List>
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
        backgroundColor: '#f2f2f2'
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
  },
  choosebar: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#fbe994',
    width: 120,
  },
  choosebar2: {
    height: 26,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 0,
    backgroundColor: '#f3456d'
  },

  icon: {
     width: 25,
     height: 25,
  },
  navi: {
    width:32,
    height:32,
    alignSelf:'flex-end',
    marginTop:30,
    marginRight:30,
    backgroundColor: 'red'
  },
});
export default log;
