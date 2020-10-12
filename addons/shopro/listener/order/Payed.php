<?php

namespace addons\shopro\listener\order;

use addons\shopro\exception\Exception;
use addons\shopro\model\Cart;
use addons\shopro\model\Config;
use addons\shopro\model\Order;
use addons\shopro\model\User;

/**
 * 支付成功
 */
class Payed
{

    // 订单支付成功
    public function orderPayedAfter(&$params) {
        $order = $params['order'];

        // 订单支付成功
    }

}
