<?php

namespace addons\shopro\notifications;

use think\queue\ShouldQueue;
use addons\shopro\model\Config;
use addons\shopro\model\UserOauth;

/**
 * 订单通知
 */
class Order extends Notification implements ShouldQueue
{
    // 队列延迟时间，必须继承 ShouldQueue 接口
    public $delay = 0;

    // 发送类型 复合型消息类动态传值 当前类支持的发送类型: order_sended: 订单发货成功
    public $event = 'order_sended';

    // 额外数据
    public $data = [];

    // 返回的字段列表
    public static $returnField = [
        'order_sended' => [
            'name' => '订单发货通知',
            'fields' => [
                ['name' => '订单号', 'field' => 'order_sn'],
                ['name' => '订单金额', 'field' => 'order_amount'],
                ['name' => '发货时间', 'field' => 'dispatch_time'],
                ['name' => '商品名称', 'field' => 'goods_title'],
                ['name' => '商品规格', 'field' => 'goods_sku_text'],
                ['name' => '商品价格', 'field' => 'goods_price'],
                ['name' => '购买数量', 'field' => 'goods_num'],
                ['name' => '快递公司', 'field' => 'express_name'],
                ['name' => '快递单号', 'field' => 'express_no'],
                ['name' => '收件信息', 'field' => 'consignee']
            ]
        ]
    ];


    public function __construct($data = [])
    {
        $this->data = $data;
        $this->event = $data['event'] ?? '';
        
        $this->initConfig();
    }


    public function toDatabase($notifiable) {
        $data = $this->data;
        $order = $data['order'];
        $item = $data['item'] ?? [];

        $params = [];
        $params['order'] = $order;
        $params['item'] = $item;

        // 获取消息data
        $this->paramsData($params, $notifiable, $order, $item);

        return $params;
    }


    public function toSms($notifiable) {
        $event = $this->event;
        $data = $this->data;
        $order = $data['order'];
        $item = $data['item'] ?? [];

        $phone = $notifiable['mobile'] ? $notifiable['mobile'] : '';
        $params = [];
        $params['phone'] = $phone;
      
        // 获取消息data
        $this->paramsData($params, $notifiable, $order, $item);

        return $this->formatParams($params, 'sms');
    }


    public function toWxOfficeAccount($notifiable) {
        $event = $this->event;
        $data = $this->data;
        $order = $data['order'];
        $item = $data['item'] ?? [];

        $params = [];

        $oauth = UserOauth::where('user_id', $notifiable['id'])
                        ->where('provider', 'Wechat')
                        ->where('platform', 'wxOfficialAccount')->find();

        if ($oauth && $oauth->openid) {
            // 查询商城配置获取 h5 网址，并缓存 5 分钟
            $config = Config::where('name', 'shopro')->cache(300)->find();
            if ($config && $cv = json_decode($config['value'], true)) {
                $domain = isset($cv['domain']) ? $cv['domain'] : '';
            }

            $url = '';
            if (isset($domain) && $domain) {
                $domain = rtrim($domain, '/');
                $url = $domain . "/pages/order/detail?id=" . $order['id'];
            }

            $params['openid'] = $oauth->openid;
            $params['url'] = $url;

            // 获取消息data
            $this->paramsData($params, $notifiable, $order, $item);
        }

        return $this->formatParams($params, 'wxOfficialAccount');
    }


    public function toWxMiniProgram($notifiable) {
        $event = $this->event;
        $data = $this->data;
        $order = $data['order'];
        $item = $data['item'] ?? [];

        $params = [];

        $oauth = UserOauth::where('user_id', $notifiable['id'])
                        ->where('provider', 'Wechat')
                        ->where('platform', 'wxMiniProgram')->find();

        if ($oauth && $oauth->openid) {
            $params['openid'] = $oauth->openid;
            $params['page'] = "pages/order/detail?id=" . $order['id'];

            // 获取消息data
            $this->paramsData($params, $notifiable, $order, $item);
        }

        return $this->formatParams($params, 'wxMiniProgram');
    }



    private function paramsData(&$params, $notifiable, $order, $item) {
        $params['data'] = [];
        
        switch ($this->event) {
            case 'order_sended':
                $params['data'] = array_merge($params['data'], $this->orderSendedData($notifiable, $order, $item));
                break;
            default:
                $params = [];
        }
    }


    private function orderSendedData($notifiable, $order, $item) {
        $data['order_sn'] = $order['order_sn'];
        $data['order_amount'] = '￥' . $order['total_amount'];
        $data['dispatch_time'] = ($order['ext_arr'] && isset($order['ext_arr']['send_time']))?date('Y-m-d H:i:s', $order['ext_arr']['send_time']) : date('Y-m-d H:i:s');
        $data['goods_title'] = $item['goods_title'];
        $data['goods_sku_text'] = $item['goods_sku_text'];
        $data['goods_price'] = '￥' . $item['goods_price'];
        $data['goods_num'] = $item['goods_num'];
        $data['express_name'] = $item['express_name'];
        $data['express_no'] = $item['express_no'];
        //$data['consignee'] = $order['consignee'] ? ($order['consignee'] . '-' . $order['phone']) : '';
		$data['consignee'] = "福建省 福州市 上街镇高新区 山亚国际中心 陈峰淡13665929233";
        return $data;
    }
}
