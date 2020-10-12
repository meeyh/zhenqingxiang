<?php

namespace addons\shopro\listener\order;

use addons\shopro\exception\Exception;
use addons\shopro\model\ActivityGoodsSkuPrice;
use addons\shopro\model\Config;
use addons\shopro\model\Goods;
use addons\shopro\model\GoodsSkuPrice;
use addons\shopro\model\User;
use addons\shopro\model\UserCoupons;

/**
 * 订单发货
 */
class Send
{
    // 订单发货之后行为
    public function orderSendAfter(&$params)
    {
        $order = $params['order'];
        $item = $params['item'];

        // 更新订单发货时间
        $order->ext = json_encode($order->setExt($order, ['send_time' => time()]));
        $order->save();

        // 发送发货通知
        $user = User::where('id', $order['user_id'])->find();
        $user->notify(
            new \addons\shopro\notifications\Order([
                'order' => $order,
                'item' => $item,
                'event' => 'order_sended'
            ])
        );

        // 添加自动确认收货队列
        $config = Config::where('name', 'order')->cache(300)->find();        // 读取配置自动缓存 5 分钟
        $config = isset($config) ? json_decode($config['value'], true) : [];
        $close_days = (isset($config['order_auto_confirm']) && $config['order_auto_confirm'] > 0) 
                            ? $config['order_auto_confirm'] : 10;       // 单位天 
                            
        \think\Queue::later(($close_days * 86400), '\addons\shopro\job\OrderAutoOper@autoConfirm', $params, 'shopro');
    }
}
