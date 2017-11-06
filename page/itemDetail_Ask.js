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
  ActivityIndicator
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
} from 'react-navigation';
import { Icon,Button,Card, ListItem,SocialIcon,List  } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import ViewPager from 'react-native-viewpager';
import Service from '../common/service';


//时间转化成字符
function formatDate(t){
  return new Date(parseInt(t) * 1000).toLocaleDateString().replace(/\//g, "-");
}

 class itemDetail extends Component {
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
      slide: [],
      Swiper: [],
      item: {},
      //
      loading: false,
    };
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      token: params.token,
      uid: params.uid,
      islogin: params.uid,
      itemId: params.itemId,
    });
  };

  componentDidMount() {
    console.log(this.state);
    this.getItemInfo();
  };

  //获取商品详细数据
  getItemInfo = () => {
    const { token,uid,itemId } = this.state;
    const url = Service.BaseUrl+`?a=item&m=info&v=${Service.version}&token=${token}&uid=${uid}&id=${itemId}`;
    this.setState({loading: true})
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);

      if(!responseJson.status){
        this.setState({
          addr: responseJson.data.addr,
          category: responseJson.data.category,
          detail: responseJson.data.detail,
          img: responseJson.data.img,
          item: responseJson.data.item,
        });
      }
      else{
        alert(responseJson.err);
      }
      return responseJson.data.img;
    })
    .then(img => {
      for(i=0;i<=img.length;i++){
        var slide1 = this.state.slide;
        var newImg = (
          <TouchableOpacity style={styles.slide} key={i}>
            <Image
              style={styles.slide}
              source={{uri: Service.BaseUri+img[i].url}}
              resizeMode='cover'
            />
          </TouchableOpacity>
        );
        slide1.push(newImg);
        this.setState({slide: slide1,loading: false});
      }
    })
    .catch(error => console.log(error));
  };

  //以下定义页面元素

  //虽然看上去很傻，但这是本页最精髓的函数，我花了2天，2天！！！做到了!！穷举万岁！无任何播放问题!睡觉!
  returnSwiper = () =>{
    const { slide } = this.state;
    var Swiper = [];
    if(slide.length==1){
     Swiper = [slide[0]];
    }
    else if(slide.length==2){
      Swiper = [slide[0],slide[1]];
    }
    else if(slide.length==3){
      Swiper = [slide[0],slide[1],slide[2]];
    }
    else if(slide.length==4){
      Swiper = [slide[0],slide[1],slide[2],slide[3]];
    }
    else if(slide.length==5){
     Swiper = [slide[0],slide[1],slide[2],slide[3],slide[4]];
    }
    else{
     Swiper = [slide[0],slide[1],slide[2],slide[3],slide[4],slide[5]];
    }
    return Swiper;
  };

  //加载器
  showLoading = () => {
    if(!this.state.loading){
      return null;
    }
    else{
      return(
        <View

        >
          <ActivityIndicator animating size="large" />
        </View>
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
        {this.showLoading()}
        <ScrollView>
          <View style={styles.item_pic}>
            <Swiper style={styles.wrapper} autoplay={true}>
              {this.returnSwiper()}
            </Swiper>
          </View>
          <View  style={styles.user}>
          </View>
          <TouchableOpacity style={styles.item}>
            <Text style={[styles.title,{fontSize: 16,marginTop: 10,color: '#666666'}]}>
              {this.state.item.name}
            </Text>
            <Text style={[styles.title,{fontSize: 14,color: '#fbe994'}]}>
              {this.state.item.u? this.state.item.price+'圆/'+this.state.item.u:this.state.item.price+'圆'}
            </Text>
            <Text style={[styles.title,{fontSize: 14,color: '#666666',marginBottom: 5}]}>
              {'已成交: '+this.state.item.salenum+'次'}
            </Text>
            <View style={{height: 1,backgroundColor: '#e5e5e5'}}>
            </View>
            <Text style={[styles.title,styles.sub]}>
              {'服务类型: '+this.state.category.name}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {'支付方式: '}
            </Text>
            <Text style={[styles.title,styles.sub]}>
              {this.state.item.pt?'截止时间: '+formatDate(this.state.item.pt):null}
            </Text>
            <Text style={[styles.title,styles.sub,{marginBottom: 10}]}>
              {'我的地址: '+this.state.addr.info}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mark}>
            <Text style={{fontSize: 16,fontWeight: '500',alignSelf: 'center',color: '#333333',marginTop: 10}}>
              求助内容
            </Text>
            <Text
              style={{marginLeft: 10,marginRight: 10,marginTop: 10,marginBottom: 10,fontSize: 12,color: '#999999'}}
              numberOfLines={20}>
              {this.state.detail.mark}
            </Text>
            <Text style={{fontSize: 12,fontWeight: '500',alignSelf: 'center',color: '#333333',marginBottom: 10,marginTop: 5}}>
              点击文本查看全部详情
            </Text>
          </TouchableOpacity>
          <List>
            <ListItem
              titleStyle={styles.title}
              title='联系方式'
            />
            <ListItem
              titleStyle={styles.title}
              title='相册'
            />
          </List>
          <List>
            <ListItem
              titleStyle={styles.title}
              title='评价'
            />
          </List>
        </ScrollView>
          <Button
            style={styles.button}
            buttonStyle={{marginTop:5,marginBottom:5,}}
            backgroundColor='#f3456d'
            onPress={() => navigate('buy',{
              token: this.state.token,
              uid: this.state.uid,
              islogin: this.state.islogin,
              itemId: this.state.itemId,
            })}
            title='立即下单' />
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
      backgroundColor:'#f3456d',
  },
  header: {
    height: 44,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3456d',
  },
  item_pic: {
    height: 200,

    //marginTop: 1,
  },
  user: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  item: {
    marginTop: 10,
    //height: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
  },
  mark: {
    flexDirection: 'column',
    marginTop: 10,
    //height: 500,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e5e5'
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
  album: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  comment: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
     width: 25,
     height: 25,
  },
  button: {
    alignSelf:'center',
    //marginTop:15,
    width:280,
    height:50,
  },
  wrapper: {
  },
  slide: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%'
    //backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 5,
  },
  sub: {
    fontSize: 14,
    color: '#666666',
  }
});

export default itemDetail;
