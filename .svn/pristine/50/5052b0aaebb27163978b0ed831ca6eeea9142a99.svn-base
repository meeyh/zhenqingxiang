<?php

namespace addons\shopro\controller;

use addons\epay\library\Service;
use fast\Random;
use think\addons\Controller;
use addons\shopro\exception\Exception;
use addons\shopro\model\Order;
use addons\shopro\model\User;
use think\Db;
use think\Log;

class Pay extends Base
{

    protected $noNeedLogin = ['prepay', 'notifyx', 'notifyr', 'alipay'];
    protected $noNeedRight = ['*'];


    /**
     * 支付宝网页支付
     */
    public function alipay()
    {
        $order_sn = $this->request->get('order_sn');
        $order = Order::where('order_sn', $order_sn)->find();

        try {
            if (!$order) {
                throw new \Exception("订单不存在");
            }
            if ($order->status > 0) {
                throw new \Exception("订单已支付");
            }
            if ($order->status < 0) {
                throw new \Exception("订单已失效");
            }
    
            $notify_url = $this->request->root(true) . '/addons/shopro/pay/notifyx/payment/alipay/platform/H5';
            $pay = new \addons\shopro\library\PayService('alipay', 'url', $notify_url);
    
            $order_data = [
                'out_trade_no' => $order->order_sn,
                'total_fee' => $order->total_fee,
                'subject' => '商城订单支付',
            ];
    
            $result = $pay->create($order_data);

            $result = $result->getContent();
            
	        echo $result;
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        // $this->assign('result', $result);

        // return $this->view->fetch();
    }


    /**
     * 拉起支付
     */
    public function prepay()
    {
        $order_sn = $this->request->post('order_sn');
        $payment = $this->request->post('payment');
        $openid = $this->request->post('openid', '');
        $platform = request()->header('platform');
        
        $order = Order::nopay()->where('order_sn', $order_sn)->find();

        if (!$order) {
            throw new Exception("订单不存在");
        }

        if (!$payment || !in_array($payment, ['wechat', 'alipay', 'wallet'])) {
            throw new Exception("支付类型不能为空");
        }

        if ($payment == 'wallet') {
            // 余额支付
            $this->walletPay($order, $payment, $platform);
        }

        $order_data = [
            'out_trade_no' => $order->order_sn,
            'total_fee' => $order->total_fee,
        ];

        // 微信公众号，小程序支付，必须有 openid
        if ($payment == 'wechat') {
            if (in_array($platform, ['wxOfficialAccount', 'wxMiniProgram'])) {
                if (isset($openid) && $openid) {
                    // 如果传的有 openid
                    $order_data['openid'] = $openid;
                } else {
                    // 没有 openid 默认拿下单人的 openid
                    $oauth = \addons\shopro\model\UserOauth::where([
                        'user_id' => $order->user_id,
                        'provider' => 'Wechat',
                        'platform' => $platform
                    ])->find();
        
                    $order_data['openid'] = $oauth ? $oauth->openid : '';
                }
    
                if (empty($order_data['openid'])) {
                    // 缺少 openid
                    return $this->success('缺少 openid', 'no_openid');
                }
            }

            $order_data['body'] = '商城订单支付';
        } else {
            $order_data['subject'] = '商城订单支付';
        }

        $notify_url = $this->request->root(true) . '/addons/shopro/pay/notifyx/payment/' . $payment . '/platform/' . $platform;
        $pay = new \addons\shopro\library\PayService($payment, $platform, $notify_url);

        $result = $pay->create($order_data);
        if ($platform == 'App') {
            $result = $result->getContent();
        }
        if ($platform == 'H5' && $payment == 'wechat') {
            $result = $result->getContent();
        }

        return $this->success('获取预付款成功', [
            'pay_data' => $result,
            'pay_action' => $pay->method,
        ]);
    }



    // 余额支付
    public function walletPay ($order, $type, $method) {
        $order = Db::transaction(function () use ($order, $type, $method) {
            $total_fee = $order->total_fee;

            // 扣除余额
            $user = User::info();

            if (is_null($user)) {
                // 没有登录，请登录
                $this->error(__('Please login first'), null, 401);
            }

            User::moneyReduce($user->id, $total_fee, 'wallet_pay', $order->id, [
                'order_id' => $order->id,
                'order_sn' => $order->order_sn,
            ]);

            // 支付后流程
            $notify = [
                'order_sn' => $order['order_sn'],
                'transaction_id' => '',
                'notify_time' => date('Y-m-d H:i:s'),
                'buyer_email' => $user->id,
                'pay_fee' => $order->total_fee,
                'pay_type' => 'wallet'             // 支付方式
            ];
            $notify['payment_json'] = json_encode($notify);
            $order->paymentProcess($order, $notify);

            return $order;
        });

        $this->success('支付成功', $order);
    }


    /**
     * 支付成功回调
     */
    public function notifyx()
    {
        Log::write('notifyx-comein:');

        $payment = $this->request->param('payment');
        $platform = $this->request->param('platform');

        $pay = new \addons\shopro\library\PayService($payment, $platform);

        $result = $pay->notify(function ($data, $pay) use ($payment, $platform) {
            Log::write('payok-result:'. json_encode($data));
            // {    // 微信回调参数
            //     "appid":"wx39cd0799d4567dd0",
            //     "bank_type":"OTHERS",
            //     "cash_fee":"1",
            //     "fee_type":"CNY",
            //     "is_subscribe":"N",
            //     "mch_id":"1481069012",
            //     "nonce_str":"dPpcZ6AzCDU8daNC",
            //     "openid":"oD9ko4x7QMDQPZEuN8V5jtZjie3g",
            //     "out_trade_no":"202010240834057843002700",
            //     "result_code":"SUCCESS",
            //     "return_code":"SUCCESS",
            //     "sign":"3103B6D06F13D2B3959C5B3F7F1FD61C",
            //     "time_end":"20200407102424",
            //     "total_fee":"1",
            //     "trade_type":"JSAPI",
            //     "transaction_id":"4200000479202004070804485027"
            // }

            // {    // 支付宝回调参数
            //     "gmt_create":"2020-04-10 19:15:00",
            //     "charset":"utf-8",
            //     "seller_email":"xptech@qq.com",
            //     "subject":"\u5546\u57ce\u8ba2\u5355\u652f\u4ed8",
            //     "sign":"AOiYZ1a2mEMOuIbHFCi6V6A0LJ97UMiHsCWgNdSU9dlzKFl15Ts8b0mL\/tN+Hhskl+94S3OUiNTBD3dD0Kv923SqaTWxNdj533PCdo2GDKsZIZgKbavnOvaccSKUdmQRE9KtmePPq9V9lFzEQvdUkKq1M8KAWO5K9LTy2iT2y5CUynpiu\/04GVzsTL9PqY+LDwqj6K+w7MgceWm1BWaFWg27AXIRw7wvsFckr3k9GGajgE2fufhoCYGYtGFbhGOp6ExtqS5RXBuPODOyRhBLpD8mwpOX38Oy0X+R4YQIrOi02dhqwPpvw79YjnvgXY3qZEQ66EdUsrT7EBdcPHK0Gw==",
            //     "buyer_id":"2088902485164146",
            //     "invoice_amount":"0.01",
            //     "notify_id":"2020041000222191501064141414240102",
            //     "fund_bill_list":"[{\"amount\":\"0.01\",\"fundChannel\":\"PCREDIT\"}]",
            //     "notify_type":"trade_status_sync",
            //     "trade_status":"TRADE_SUCCESS",
            //     "receipt_amount":"0.01",
            //     "buyer_pay_amount":"0.01",
            //     "app_id":"2021001114666742",
            //     "sign_type":"RSA2",
            //     "seller_id":"2088721922277739",
            //     "gmt_payment":"2020-04-10 19:15:00",
            //     "notify_time":"2020-04-10 19:15:01",
            //     "version":"1.0",
            //     "out_trade_no":"202007144778322770017000",
            //     "total_amount":"0.01",
            //     "trade_no":"2020041022001464141443020240",
            //     "auth_app_id":"2021001114666742",
            //     "buyer_logon_id":"157***@163.com",
            //     "point_amount":"0.00"
            // }


            try {
                $pay_fee = $payment == 'alipay' ? $data['total_amount'] : $data['total_fee'] / 100;
                $out_trade_no = $data['out_trade_no'];

                //你可以在此编写订单逻辑
                $order = Order::where('order_sn', $out_trade_no)->find();

                if (!$order || $order->status > 0) {
                    // 订单不存在，或者订单已支付
                    return $pay->success()->send();
                }

                Db::transaction(function () use ($order, $data, $payment, $platform, $pay_fee) {
                    $notify = [
                        'order_sn' => $data['out_trade_no'],
                        'transaction_id' => $payment == 'alipay' ? $data['trade_no'] : $data['transaction_id'],
                        'notify_time' => date('Y-m-d H:i:s', strtotime($data['time_end'])),
                        'buyer_email' => $payment == 'alipay' ? $data['buyer_logon_id'] : $data['openid'],
                        'payment_json' => json_encode($data->all()),
                        'pay_fee' => $pay_fee,
                        'pay_type' => $payment              // 支付方式
                    ];
                    $order->paymentProcess($order, $notify);
                });

                return $pay->success()->send();
            } catch (\Exception $e) {
                Log::write('payok-error:' . json_encode($e->getMessage()));
            }
        });

        return $result;
    }


    /**
     * 退款成功回调
     */
    public function notifyr()
    {
        Log::write('notifyreturn-comein:');

        $payment = $this->request->param('payment');
        $platform = $this->request->param('platform');

        $pay = new \addons\shopro\library\PayService($payment, $platform);

        $result = $pay->notifyRefund(function ($data, $pay) use ($payment, $platform) {
            Log::write('notifyr-result:' . json_encode($data));
            try {
                $out_refund_no = $data['out_refund_no'];
                $out_trade_no = $data['out_trade_no'];

                // 编写退款逻辑
                $order = Order::where('order_sn', $out_trade_no)->find();
                $refundLog = \app\admin\model\shopro\order\RefundLog::where('refund_sn', $out_refund_no)->find();
                
                if (!$order || !$refundLog || $refundLog->status != 0) {
                    // 订单不存在，或者订单已支付
                    return $pay->success()->send();
                }
                
                $item = \app\admin\model\shopro\order\OrderItem::where('id', $refundLog->order_item_id)->find();

                Db::transaction(function () use ($order, $item, $refundLog) {
                    \app\admin\model\shopro\order\Order::refundFinish($order, $item, $refundLog);
                });
                
                return $pay->success()->send();
            } catch (\Exception $e) {
                Log::write('notifyreturn-error:' . json_encode($e->getMessage()));
            }
        });

        return $result;
    }

    
}
