
  import React, { Component } from 'react';
  import {
    AppRegistry,
    StyleSheet,
    Text,
    View
  } from 'react-native';
  import { getLanguages } from 'react-native-i18n';

export default{
/*
请求方法postRequest
url为请求地址，param为参数字段，
successCallback为请求成功的回调函数，failedCallback为请求失败的回调函数
*/
postRequest(url,param,successCallback,failedCallback){
  fetch(url, {
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body:param,
  })
  .then((response) => response.json())
  .then((responseJson) => successCallback(responseJson))
  .catch((error) => failedCallback(error))
},

/*
请求方法getRequest
url为请求地址，param为参数字段，
successCallback为请求成功的回调函数，failedCallback为请求失败的回调函数
*/
getRequest(url,param,successCallback,failedCallback){
  fetch(url, {
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body:param,
  })
  .then((response) => response.json())
  .then((responseJson) => successCallback(responseJson))
  .catch((error) => failedCallback(error))
},

log(id,data){
  console.log(I18n.t('language'));
  if(I18n.t('language')=='zh'){
    return this.log_zh(id,data);
  }


  return this.log_ja(id,data);
},

log_zh(id,data){
  result = {
    title: '',
    sub: '',
    next: '',
  }

  switch(id){
    case 1:
      return {
        title: '新的订单',
        sub: data.username+'想要购买您的服务「'+data.itemname+'」,赶快去查看详情!',
        next: 'mySale_Service',
      };
      break;
    case 2:
      return {
        title: '求助响应',
        sub: data.username+'想要接受您的求助「'+data.itemname+'」,赶快去查看详情！',
        next: 'mySale_Ask',
      };
      break;
    case 3:
      return {
        title: '订单已接受',
        sub:  '您的订单已被对方接受(「'+data.itemname+'」)。',
        next: 'myOrder_Service',
      };
      break;
    case 4:
      return {
        title: '申请已接受',
        sub: data.username+'接受了您的申请，快去帮助他/她！',
        next: 'myOrder_Ask',
      };
      break;
    case 5:
      return {
        title: '订单完成',
        sub: data.username+'已确认服务完成，订单结束(「'+data.itemname+'」)!',
        next: 'mySale_Service',
      };
      break;
    case 6:
      return {
        title: '求助完成',
        sub: '您的求助「'+data.itemname+'」已解决,快去评价对方吧!',
        next: 'mySale_Ask',
      };
      break;
    case 7:
      return {
        title: '订单完成',
        sub: '服务「'+data.itemname+'」已完成,赶快去添加评价吧!',
        next: 'myOrder_Service',
      };
      break;
    case 8:
      return {
        title: '求助完成',
        sub: '求助「'+data.itemname+'」已解决,感谢您的帮助！',
        next: 'myOrder_Ask',
      };
      break;
    case 9:
      return {
        title: '新的关注',
        sub: '您有一个新的关注,来自用户「'+data.username+'」。',
        next: 'personal',
      };
      break;
    case 10:
      return {
        title: '新的评价',
        sub: data.username+'添加了对您的评价，关于「'+data.itemname+'」,赶快去查看吧!',
        next: 'myFeedback',
      };
      break;
    case 11:
      return {
        title: '拒绝订单',
        sub: '已拒绝来自用户「'+data.username+'」的订单。',
        next: 'mySale_Service',
      };
      break;
    case 12:
      return {
        title: '订单被拒绝',
        sub: data.username+'拒绝了您的订单。',
        next: 'myOrder_Service',
      };
      break;
    case 13:
      return {
        title: '拒绝帮助申请',
        sub: '您已拒绝了来自用户「'+data.username+'」的申请。',
        next: 'mySale_Ask',
      };
      break;
    case 14:
      return {
        title: '申请被拒绝',
        sub: data.username+'拒绝了您关于求助「'+data.username+'」的申请',
        next: 'myOrder_Ask',
      };
      break;
    case 15:
      return {
        title: '订单已取消',
        sub: '很遗憾,服务「'+data.itemname+'」已被中止,订单结束!',
        next: 'mySale_Service',
      };
      break;
    case 16:
      return {
        title: '订单已取消',
        sub: '很遗憾,服务「'+data.itemname+'」已被中止,订单结束!',
        next: 'myOrder_Service',
      };
      break;
    case 17:
      return {
        title: '求助已取消',
        sub: '很遗憾,求助「'+data.itemname+'」已被取消!',
        next: 'mySale_Ask',
      };
      break;
    case 18:
      return {
        title: '求助已取消',
        sub: '很遗憾,求助「'+data.itemname+'」已被取消!',
        next: 'mySale_Ask',
      }
  }

  return result;
},

log_ja(id,data){
  result = {
    title: '',
    sub: '',
    next: '',
  }

  switch(id){
    case 1:
      return {
        title: '新しい申込',
        sub: data.username+'さんはあなたのサービス「'+data.itemname+'」を申し込みました。',
        next: 'mySale_Service',
      };
      break;
    case 2:
      return {
        title: '新しい応募',
        sub: data.username+'さんはあなたのリクエスト「'+data.itemname+'」に応募しました。',
        next: 'mySale_Ask',
      };
      break;
    case 3:
      return {
        title: 'オーダーが受け入れた',
        sub: data.username+'さんはこれからあなたに「'+data.itemname+'」のサービスを提供します。',
        next: 'myOrder_Service',
      };
      break;
    case 4:
      return {
        title: 'リクエストが受け入れた',
        sub: data.username+'さんは「'+data.itemname+'」のリクエストを受け取りました。',
        next: 'myOrder_Ask',
      };
      break;
    case 5:
      return {
        title: 'やりとりが完成した',
        sub: data.username+'さんとの「'+data.itemname+'」のやりとりが完成しました。',
        next: 'mySale_Service',
      };
      break;
    case 6:
      return {
        title: 'やりとりが完成した',
        sub: data.username+'さんとの「'+data.itemname+'」のやりとりが完成しました。一言でコメントしよう！',
        next: 'mySale_Ask',
      };
      break;
    case 7:
      return {
        title: 'やりとりが完成した',
        sub: data.username+'さんとの「'+data.itemname+'」のやりとりが完成しました。一言でコメントしよう！',
        next: 'myOrder_Service',
      };
      break;
    case 8:
      return {
        title: 'やりとりが完成した',
        sub: data.username+'さんとの「'+data.itemname+'」のやりとりが完成しました。',
        next: 'myOrder_Ask',
      };
      break;
    case 9:
      return {
        title: '新しいフォロー',
        sub: data.username+'さんはあなたをフォローしました。',
        next: 'personal',
      };
      break;
    case 10:
      return {
        title: '新しいレビュー',
        sub: data.username+'さんはあなたを評価しました。',
        next: 'myFeedback',
      };
      break;
    case 11:
      return {
        title: 'オーダーが拒否された',
        sub: data.username+'さんへの「'+data.itemname+'」の販売を断りました。',
        next: 'mySale_Service',
      };
      break;
    case 12:
      return {
        title: 'オーダーが拒否された',
        sub: data.username+'さん販売の「'+data.itemname+'」の購入は、残念ながら断られてしまいました。',
        next: 'myOrder_Service',
      };
      break;
    case 13:
      return {
        title: 'オーダーが拒否された请',
        sub: data.username+'さん依頼の「'+data.itemname+'」への提供は、残念ながら断られてしまいました。',
        next: 'mySale_Ask',
      };
      break;
    case 14:
      return {
        title: 'オーダーが拒否された',
        sub: data.username+'さんからの「'+data.itemname+'」の提供を断りました。',
        next: 'myOrder_Ask',
      };
      break;
    case 15:
      return {
        title: 'オーダーがキャンセルした',
        sub:  data.username+'さんは「'+data.itemname+'」の購入を残念ながらキャンセルしました。',
        next: 'mySale_Service',
      };
      break;
    case 16:
      return {
        title: 'オーダーがキャンセルした',
        sub: data.username+'さんの「'+data.itemname+'」の購入をキャンセルしました。',
        next: 'myOrder_Service',
      };
      break;
    case 17:
      return {
        title: 'オーダーがキャンセルした',
        sub: data.username+'さんの「'+data.itemname+'」への提供をキャンセルしました。',
        next: 'mySale_Ask',
      };
      break;
    case 18:
      return {
        title: 'オーダーがキャンセルした',
        sub: data.username+'さんは「'+data.itemname+'」への提供を残念ながらキャンセルしました。',
        next: 'mySale_Ask',
      }
  }

  return result;
},



}
