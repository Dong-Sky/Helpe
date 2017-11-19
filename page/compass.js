import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Tile,Card,Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

 class compass extends Component {
   static navigationOptions = {
     tabBarLabel: 'compass',
     tabBarIcon: ({ tintColor }) => (
       <Image
         source={require('../icon/tarbar/compass.png')}
         style={[styles.icon, {tintColor: tintColor}]}
       />
     ),
   };

   constructor(props) {
     super(props);

     this.state = {
       token:null,
       uid:null,
       islogin:false,
     }
   };
   componentWillMount(){
     this.getLoginState();
   };

   componentDidMount() {

   };

   getLoginState = () => {
     storage.load({
       key: 'loginState',
     })
     .then((ret) => {
       console.log(ret);
       if(ret.token!=null&ret.uid!=null){
         this.setState({ islogin: true });
       }
       this.state.token = ret.token;
       this.state.uid = ret.uid;
         console.log(ret);
       }
     )
     .catch(error => {
       console.log(error);
     })
   };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.StatusBar}>
        </View>
        <ScrollView>
          <Swiper style={styles.wrapper} showsButtons={true} height={200}>
            <View>
              <Image
                 source={require('../icon/other/kfc.jpg')}
                 resizeMode='contain'
              />
            </View>
            <View>
              <Image
                source={require('../icon/other/mc.jpg')}
                resizeMode='contain'
              />
            </View>
            <Image
              source={require('../icon/other/mc.jpg')}
              resizeMode='contain'
            />
          </Swiper>
          <Card
            title='HELLO WORLD'
            image={require('../icon/other/kfc.jpg')}>
            <Text style={{marginBottom: 10}}>
              The idea with React Native Elements is more about component structure than actual design.
            </Text>
            <Button
              icon={{name: 'code'}}
              backgroundColor='#f1a073'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='VIEW NOW' />
          </Card>
          <Card
            title='HELLO WORLD'
            image={require('../icon/other/mc.jpg')}>
            <Text style={{marginBottom: 10}}>
              The idea with React Native Elements is more about component structure than actual design.
            </Text>
            <Button
              icon={{name: 'code'}}
              backgroundColor='#f1a073'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='VIEW NOW' />
          </Card>
        </ScrollView>

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
  StatusBar: {
        height:22,
        backgroundColor:'#FFFFFF',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbe994',
  },
  instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
  },
  icon: {
     width: 25,
     height: 25,
   },
});
export default compass;
