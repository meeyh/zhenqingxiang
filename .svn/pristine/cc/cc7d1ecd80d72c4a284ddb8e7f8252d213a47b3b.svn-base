<?php

namespace addons\shopro\controller;

use addons\shopro\library\Wechat as LibraryWechat;
use addons\shopro\model\Config;

/**
 * 微信接口
 */
class Wechat extends Base
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    public $app = null;

    /**
     * 微信公众号服务端API对接
     */
    public function index()
    {
        $wechat = new LibraryWechat('wxOfficialAccount');
        $app = $wechat->getApp();
        $app->server->push(function ($message) {
            switch ($message['MsgType']) {
                case 'event':
                    return '收到事件消息';
                    break;
                case 'text':
                    return '收到文字消息';
                    break;
                case 'image':
                    return '收到图片消息';
                    break;
                case 'voice':
                    return '收到语音消息';
                    break;
                case 'video':
                    return '收到视频消息';
                    break;
                case 'location':
                    return '收到坐标消息';
                    break;
                case 'link':
                    return '收到链接消息';
                    break;
                case 'file':
                    return '收到文件消息';
                // ... 其它消息
                default:
                    return '收到其它消息';
                    break;
            }
        });
        $response = $app->server->serve();
        // 将响应输出
        $response->send();
    }

    public function jssdk()
    {
        $params = $this->request->post();
        $apis = [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'getLocation',//获取位置
            'openLocation',//打开位置
            'scanQRCode',//扫一扫接口
            'chooseWXPay',//微信支付
            'chooseImage',//拍照或从手机相册中选图接口
            'previewImage',//预览图片接口
            'uploadImage'//上传图片
        ];
        $uri = urldecode($params['uri']);

        $wechat = new LibraryWechat('wxOfficialAccount');

        $res = $wechat->getApp()->jssdk->setUrl($uri)->buildConfig($apis, $debug = false, $beta = false, $json = false);
        $this->success('sdk', $res);


    }


    public function wxacode ()
    {
        $scene = $this->request->get('scene', '');
        $path = $this->request->get('path', '');

        if (empty($path)) {
            $path = 'pages/index/index';
        }

        $wechat = new LibraryWechat('wxMiniProgram');
        $content = $wechat->getApp()->app_code->getUnlimit($scene, [
            'page' => $path,
            'is_hyaline' => true,
        ]);

        if ($content instanceof \EasyWeChat\Kernel\Http\StreamResponse) {
            return response($content->getBody(), 200, ['Content-Length' => strlen($content)])->contentType('image/png');
        } else {
            // 小程序码获取失败
            $msg = isset($content['errcode']) ? $content['errcode'] : '-';
            $msg .= isset($content['errmsg']) ? $content['errmsg'] : '';
            \think\Log::write('wxacode-error' . $msg);
            
            $this->error('获取失败', $msg);
        }
    }

    /**
     * 登录回调
     */
    public function callback()
    {

    }


}