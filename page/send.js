import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button } from 'react-native-elements';
import Modalbox from 'react-native-modalbox';


//获取屏幕尺寸
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class send extends Component {
   static navigationOptions = {
     tabBarLabel: ' ',
     tabBarIcon: ({ tintColor }) => (
       <Image
         source={require('../icon/tarbar/send.png')}
         style={[styles.icon]}
       />
     )
   };


   constructor(props) {
       super(props);
       this.state = {
         token:null,
         uid:null,
         islogin:false,

         modalVisible: false,
         isDisabled: false,
       }
   };

   componentWillMount(){
     this.getLoginState();

     this.subscription0 = DeviceEventEmitter.addListener('login',
     (e) => {

       //e==0登录,e!=0登出
       if(e){
         this.getLoginState();
       }
       else{
         this.setState({
           token: null,
           uid: null,
           islogin: false,
         })
       }
      });

   };

   componentDidMount() {

   };

   componentWillUnmount() {
     console.log('clear');
     try{
       this.subscription0.remove();

     }catch(e){
       console.log(e);
     }
   };

   getLoginState = () => {
     storage.load({
       key: 'loginState',
     })
     .then((ret) => {

       if(ret.token!=null&ret.uid!=null){
         this.setState({ islogin: true });
       }
       this.state.token = ret.token;
       this.state.uid = ret.uid;

       }
     )
     .catch(error => {
       console.log(error);
     })
   };

   returnModal = () => {
     const { navigate } = this.props.navigation;


     return (
       <Modalbox
         style={{width:0.96*width,height: 200,marginTop: -100,borderWidth: 1,borderColor: '#e5e5e5',borderRadius: 20 }}
         isOpen={true}
         position='bottom'
         backdrop={true}
         backButtonClose={false}
         swipeToClose={false}
         backdropPressToClose={false}
         //backdropOpacity={0.5}
         //backdropColor='#FFFFFF'
         onClosed={() => this.setState({modalVisible: false})}
         >
           <View style={styles.modal}>
             <View style={{flex: 1,}}>
               <TouchableOpacity
                 style={[styles.touch,{marginRight: 15}]}
                 onPress={() => {
                   if(this.state.islogin){
                     this.props.navigation.navigate('publish_Service',{
                       token:this.state.token,
                       uid:this.state.uid,
                       islogin:this.state.islogin,
                     })
                   }
                   else {
                     alert(I18n.t('send.not_login'));
                   }
                 }}

                 >
                 <Icon
                   name='store'
                   color='#ffdee2'
                   size={70}
                 />
                 <Text style={{fontSize: 18,color: '#333333',marginTop: 20}}>
                   {I18n.t('send.publish_Service')}
                 </Text>
               </TouchableOpacity>
             </View>
             <View style={{flex: 1,}}>
               <TouchableOpacity
                  style={[styles.touch,{marginLeft: 15}]}
                  onPress={() => {
                    if(this.state.islogin){
                      this.props.navigation.navigate('publish_Ask',{
                        token:this.state.token,
                        uid:this.state.uid,
                        islogin:this.state.islogin,
                      })
                    }
                    else {
                      alert(I18n.t('send.not_login'));
                    }
                  }}
                  >
                 <Icon
                   name='help'
                   color='#ffdee2'
                   size={70}
                 />
                 <Text style={{fontSize: 18,color: '#333333',marginTop: 20}}>
                   {I18n.t('send.publish_Ask')}
                 </Text>
               </TouchableOpacity>
             </View>
           </View>
       </Modalbox>
     );
   }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <View style={styles.header}>
        </View>
      {/*  <Button
        title={I18n.t('send.publish_Service')}
        onPress={() => {
          if(this.state.islogin){
            this.props.navigation.navigate('publish_Service',{
              token:this.state.token,
              uid:this.state.uid,
              islogin:this.state.islogin,
            })
          }
          else {
            alert(I18n.t('send.not_login'));
          }
        }}
      />
        <Button
        title={I18n.t('send.publish_Ask')}
        onPress={() => {
          if(this.state.islogin){
            this.props.navigation.navigate('publish_Ask',{
              token:this.state.token,
              uid:this.state.uid,
              islogin:this.state.islogin,
            })
          }
          else {
            alert(I18n.t('send.not_login'));
          }
        }}
      />*/}
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
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF'
  },
  modal:{
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 20,
  },
  touch:{
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: '#e5e5e5',
  },
  welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
  },
  instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#fd586d',
  },
  icon_send: {
    width: 25,
    height: 25,
  },
});
export default send;
