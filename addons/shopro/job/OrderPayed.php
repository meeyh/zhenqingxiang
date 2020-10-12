<?php

namespace addons\shopro\job;

use addons\shopro\library\Traits\ActivityCache;
use addons\shopro\library\Traits\Groupon;
use addons\shopro\library\Traits\StockSale;
use addons\shopro\model\GoodsComment;
use addons\shopro\model\Order;
use addons\shopro\model\OrderAction;
use addons\shopro\model\OrderItem;
use think\queue\Job;

/**
 * 订单支付完成
 */
class OrderPayed extends BaseJob
{
    use StockSale, ActivityCache, Groupon;

    /**
     * 订单支付完成
     */
    public function payed(Job $job, $data){
		
		
		\think\Log::write('调用模板消息');
		
        try {
            $order = $data['order'];
            $user = $data['user'];

            $order = Order::with('item')->where('id', $order['id'])->find();

            \think\Db::transaction(function () use ($order, $user, $data) {
                // 订单减库存
                $this->realForwardStockSale($order);

                // 判断，如果是拼团 真实加入团
                if (strpos($order['activity_type'], 'groupon') !== false) {
                    $this->joinGroupon($order, $user);
                }

                // 触发订单支付完成事件
                $data = ['order' => $order];
                \think\Hook::listen('order_payed_after', $data);


                // 判断订单是否自动发货，如果是，直接将订单改为确认收货，并且执行 相应行为
                foreach ($order->item as $key => $orderItem) {
                    // 如果是自动发货，则直接修改订单 item 收货状态
                    if ($orderItem->dispatch_type == 'autosend') {
                        // 订单确认收货前
                        $data = ['order' => $order, 'item' => $orderItem];
                        \think\Hook::listen('order_confirm_before', $data);
    
                        $orderItem->dispatch_status = OrderItem::DISPATCH_STATUS_GETED;        // 确认收货
                        $orderItem->save();
    
                        OrderAction::operAdd($order, $orderItem, $user, 'user', '系统自动确认收货');
    
                        // 订单确认收货后
                        $data = ['order' => $order, 'item' => $orderItem];
                        \think\Hook::listen('order_confirm_after', $data);
                    }
                }
            });
            
            // 删除 job
            $job->delete();
        } catch (\Exception $e) {
            // 队列执行失败
            \think\Log::write('queue-' . get_class() . '-payed' . '：执行失败，错误信息：' . $e->getMessage());
        }
    }
}