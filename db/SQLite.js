import React,{Component} from 'react';
import{
  ToastAndroid,
} from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
var database_name = "User.db";//数据库文件
var database_version = "1.0";//版本号
var database_displayname = "MySQLite";
var database_size = -1;//-1应该是表示无限制
var db;
const TABLE_MSG = "MSG";

export default class SQLite extends Component{
    componentWillUnmount(){
    if(db){
        this._successCB('close');
        db.close();
    }else {
        console.log("SQLiteStorage not open");
    }
  }

  open(){
    db = SQLiteStorage.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      ()=>{
          this._successCB('open');
      },
      (err)=>{
          this._errorCB('open',err);
      });
    return db;
  }

  createTable(){
    if (!db) {
        this.open();
    }
    //创建用户表
    db.transaction((tx)=> {
      tx.executeSql('CREATE TABLE IF NOT EXISTS '+TABLE_MSG+'(' +
          'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
          'uid INTEGER,'+
          'uuid INTEGER,' +
          'uuface VARCHAR,' +
          'uuname VARCHAR,' +
          't INTEGER,' +
          'tp INTEGER,' +
          'flag INTEGER,' +
          'msg VARCHAR)'
          , [], ()=> {
              this._successCB('executeSql');
          }, (err)=> {
              this._errorCB('executeSql', err);
        });
    }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
        this._errorCB('transaction', err);
    }, () => {
        this._successCB('transaction');
    })
  }

  deleteAllData(){
    if (!db) {
        this.open();
    }
    db.transaction((tx)=>{
      tx.executeSql('delete from '+TABLE_MSG,[],()=>{
        this._successCB('executeSql');
      }, (err) => {
        this._errorCB('executeSql', err);
      });
    },(err) => {
      this._errorCB('transaction', err);
    },() => {
      this._successCB('transaction');
    });
  }

  dropTable(){
    db.transaction((tx)=>{
      tx.executeSql('drop table '+TABLE_MSG,[],()=>{

      });
    },(err)=>{
      this._errorCB('transaction', err);
    },()=>{
      this._successCB('transaction');
    });
  }

  insertUserData(userData){
    let len = userData.length;
    if (!db) {
        this.open();
    }

    db.transaction((tx)=>{
       for(let i=0; i<len; i++){
        var data = userData[i];
        var uid = data.uid;
        let uuid = data.uuid;
        let uuface = data.uuface;
        let uuname = data.uuname;
        let t = data.t;
        let tp = data.tp;
        let flag = data.flag;
        let msg = data.msg;
        let sql = "INSERT INTO "+TABLE_MSG+" (uid,uuid,uuface,uuname,t,tp,flag,msg)"+
        "values(?,?,?,?,?,?,?,?)";
        tx.executeSql(sql,[uid,uuid,uuface,uuname,t,tp,flag,msg],()=>{

          },(err)=>{
            console.log(err);
          }
        );
      }
    },(error)=>{
      this._errorCB('transaction', error);
    },()=>{
      this._successCB('transaction insert data');
    });
  }

  SelectAll(){
    if (!db) {
        this.open();
    }


    db.transaction((tx)=>{
    tx.executeSql("select * from "+TABLE_MSG, [],(tx,results)=>{
      var len = results.rows.length;
      for(let i=0; i<len; i++){
        var u = results.rows.item(i);
        //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
        console.log(u);
      }
    });
    },(error)=>{//打印异常信息
      console.log(error);
    });
  }

  SelectByUser(uid,uuid){
    if (!db) {
        this.open();
    }

    var data = [];

    db.transaction((tx)=>{
    tx.executeSql("select * from "+TABLE_MSG+" Where uid = "+uid+" AND uuid = "+uuid+" Order By t DESC", [],(tx,results)=>{
      var len = results.rows.length;

      for(let i=0; i<len; i++){
        var u = results.rows.item(i);
        //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
        data.push(u)
      }
    });
    },(error)=>{//打印异常信息
      console.log(error);
    });
    return data;
  }

  SelectNearAndGroup(uid){



    if (!db) {
        this.open();
    }


    db.transaction((tx)=>{
    tx.executeSql("select *,COUNT(*) from "+TABLE_MSG+" Where uid="+uid+" Group By uuid Order by t DESC", [],(tx,results)=>{
      var len = results.rows.length;

      var data = [];
      for(let i=0; i<len; i++){
        var u = results.rows.item(i);
        //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
        data.push(u);

      }
      return data;
    });
    },(error)=>{//打印异常信息
      console.log(error);
      return [];
    })
    console.log(data);

  }

  close(){
      if(db){
          this._successCB('close');
          db.close();
      }else {
          console.log("SQLiteStorage not open");
      }
      db = null;
  }
  _successCB(name){
    console.log("SQLiteStorage "+name+" success");
  }
  _errorCB(name, err){
    console.log("SQLiteStorage "+name);
    console.log(err);
  }
    render(){
        return null;
    }
};
