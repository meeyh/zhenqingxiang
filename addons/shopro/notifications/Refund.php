<?php

namespace addons\shopro\notifications;

use think\queue\ShouldQueue;
use addons\shopro\model\Config;
use addons\shopro\model\UserOauth;

/**
 * 退款通知
 */
class Refund extends Notification implements ShouldQueue
{
    // 队列延迟时间，必须继承 ShouldQueue 接口
    public $delay = 0;

    // 发送类型 复合型消息类动态传值 当前类支持的发送类型: refund_agree: 退款同意, refund_refuse: 退款拒绝
    public $event = '';

    // 额外数据
    public $data = [];

    // 返回的字段列表
    public static $returnField = [
        'refund_agree' => [
            'name' => '退款成功通知',
            'fields' => [
                ['name' => '订单号', 'field' => 'order_sn'],
                ['name' => '订单金额', 'field' => 'order_amount'],
                ['name' => '用户昵称', 'field' => 'nickname'],
                ['name' => '商品名称', 'field' => 'goods_title'],
                ['name' => '商品规格', 'field' => 'goods_sku_text'],
                ['name' => '商品价格', 'field' => 'goods_price'],
                ['name' => '购买数量', 'field' => 'goods_num'],
                ['name' => '退款金额', 'field' => 'refund_money']
            ]
        ],
        'refund_refuse' => [
            'name' => '退款拒绝通知',
            'fields' => [
                ['name' => '订单号', 'field' => 'order_sn'],
                ['name' => '订单金额', 'field' => 'order_amount'],
                ['name' => '用户昵称', 'field' => 'nickname'],
                ['name' => '商品名称', 'field' => 'goods_title'],
                ['name' => '商品规格', 'field' => 'goods_sku_text'],
                ['name' => '商品价格', 'field' => 'goods_price'],
                ['name' => '购买数量', 'field' => 'goods_num'],
                ['name' => '拒绝原因', 'field' => 'refund_msg'],
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
        $item = $data['item'];

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
            case 'refund_agree':
                $params['data'] = array_merge($params['data'], $this->refundAgreeData($notifiable, $order, $item));
                break;
            case 'refund_refuse':
                $params['data'] = array_merge($params['data'], $this->refundRefuseData($notifiable, $order, $item));
                break;
            default:
                $params = [];
        }
    }


    private function refundAgreeData($notifiable, $order, $item) {
        $data['order_sn'] = $order['order_sn'];
        $data['order_amount'] = '￥' . $order['total_amount'];
        $data['nickname'] = $notifiable['nickname'];
        $data['goods_title'] = $item['goods_title'];
        $data['goods_sku_text'] = $item['goods_sku_text'];
        $data['goods_price'] = '￥' . $item['goods_price'];
        $data['goods_num'] = $item['goods_num'];
        $data['refund_money'] = '￥' . $item['refund_fee'];

        return $data;
    }


    private function refundRefuseData($notifiable, $order, $item) {
        $data['order_sn'] = $order['order_sn'];
        $data['order_amount'] = '￥' . $order['total_amount'];
        $data['nickname'] = $notifiable['nickname'];
        $data['goods_title'] = $item['goods_title'];
        $data['goods_sku_text'] = $item['goods_sku_text'];
        $data['goods_price'] = '￥' . $item['goods_price'];
        $data['goods_num'] = $item['goods_num'];
        $data['refund_msg'] = $item['refund_msg'];

        return $data;
    }
}
