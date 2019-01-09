/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "SplashScreen.h"
#import "RNUMConfigure.h"
#import <UMCommon/UMCommon.h>           // 公共组件是所有友盟产品的基础组件，必选
#import <UMAnalytics/MobClick.h>        // 统计组件
#import <UMPush/UMessage.h>             // Push组件
#import <UserNotifications/UserNotifications.h>  // Push组件必须的系统库

//#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"easygo"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  /*
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  [FBSDKProfile enableUpdatesOnAccessTokenChange:YES];*/
  

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  //umeng common
  [UMConfigure initWithAppkey:@"5a51fe23f29d985618000283" channel:@"App Store"];
  [RNUMConfigure initWithAppkey:@"5a51fe23f29d985618000283" channel:@"App Store"];
  
  [UMConfigure setLogEnabled:YES];
  
  //umeng 统计
  [MobClick setScenarioType:E_UM_NORMAL];
  
  //umeng push
  
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  UMessageRegisterEntity * entity = [[UMessageRegisterEntity alloc] init];
  //type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标等
  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionAlert;
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      // 用户选择了接收Push消息
    }else{
      // 用户拒绝接收Push消息
      
    }
  }];
  
 [SplashScreen show];
  return YES;
}

/*
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                openURL:url
                                                      sourceApplication:sourceApplication
                                                             annotation:annotation
                  ];
  
  // Add any custom logic here.
  
  
  return handled;
}*/

//iOS10以下使用这个方法接收通知
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  //关闭U-Push自带的弹出框
  [UMessage setAutoAlert:NO];
  [UMessage didReceiveRemoteNotification:userInfo];
  
  //    self.userInfo = userInfo;
  //    //定制自定的的弹出框
  //    if([UIApplication sharedApplication].applicationState == UIApplicationStateActive)
  //    {
  //        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"标题"
  //                                                            message:@"Test On ApplicationStateActive"
  //                                                           delegate:self
  //                                                  cancelButtonTitle:@"确定"
  //                                                  otherButtonTitles:nil];
  //
  //        [alertView show];
  //
  //    }
}

//iOS10新增：处理前台收到通知的代理方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //应用处于前台时的远程推送接受
    //关闭U-Push自带的弹出框
    [UMessage setAutoAlert:NO];
    //必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
    
  }else{
    //应用处于前台时的本地推送接受
  }
  //当应用处于前台时提示设置，需要哪个可以设置哪一个
  completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
}

//iOS10新增：处理后台点击通知的代理方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //应用处于后台时的远程推送接受
    //必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
    
  }else{
    //应用处于后台时的本地推送接受
  }
}




@end
