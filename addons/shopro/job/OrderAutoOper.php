<?php

namespace addons\shopro\job;

use addons\shopro\model\GoodsComment;
use addons\shopro\model\Order;
use addons\shopro\model\OrderAction;
use addons\shopro\model\OrderItem;
use think\queue\Job;


/**
 * 订单自动操作
 */
class OrderAutoOper extends BaseJob
{

    /**
     * 订单自动关闭
     */
    public function autoClose(Job $job, $data){
        try {
            $order = $data['order'];

            $order = Order::get($order['id']);

            if ($order['status'] == 0) {
                \think\Db::transaction(function () use ($order, $data) {
                    // 订单关闭前
                    \think\Hook::listen('order_close_before', $data);
                    // 执行关闭
                    $order->status = Order::STATUS_INVALID;
                    $order->ext = json_encode($order->setExt($order, ['invalid_time' => time()]));      // 取消时间
                    $order->save();
    
                    OrderAction::operAdd($order, null, null, 'system', '系统自动失效订单');
    
                    // 订单自动关闭之后 行为 返还用户优惠券，积分
                    $data = ['order' => $order];
                    \think\Hook::listen('order_close_after', $data);
                });
            }

            // 删除 job
            $job->delete();
        } catch (\Exception $e) {
            // 队列执行失败
            \think\Log::write('queue-' . get_class() . '-autoClose' . '：执行失败，错误信息：' . $e->getMessage());
        }
    }


    /**
     * 订单自动确认
     */
    public function autoConfirm(Job $job, $data) {
        try {
            $order = $data['order'];
            $item = $data['item'];

            $item = OrderItem::where('id', $item['id'])
                            ->where('dispatch_status', OrderItem::DISPATCH_STATUS_SENDED)
                            ->where('aftersale_status', OrderItem::AFTERSALE_STATUS_NOAFTER)
                            ->where('refund_status', OrderItem::REFUND_STATUS_NOREFUND)
                            ->find();

            if ($item) {
                \think\Db::transaction(function () use ($order, $item, $data) {
                    // 确认收货前
                    \think\Hook::listen('order_confirm_before', $data);

                    $item->dispatch_status = OrderItem::DISPATCH_STATUS_GETED;        // 确认收货
                    $item->save();

                    OrderAction::operAdd($order, $item, null, 'system', '系统自动确认收货');

                    // 订单确认收获之后
                    $data = ['order' => $order, 'item' => $item];
                    \think\Hook::listen('order_confirm_after', $data);
                });
            }

            // 删除 job
            $job->delete();
        } catch (\Exception $e) {
            // 队列执行失败
            \think\Log::write('queue-' . get_class() . '-autoConfirm' . '：执行失败，错误信息：' . $e->getMessage());
        }
    }



    public function autoComment(Job $job, $data) {
        try {
            $order = $data['order'];
            $item = $data['item'];

            $item = OrderItem::where('id', $item['id'])
                ->where('dispatch_status', OrderItem::DISPATCH_STATUS_GETED)
                ->where('comment_status', OrderItem::COMMENT_STATUS_NO)
                ->where('aftersale_status', OrderItem::AFTERSALE_STATUS_NOAFTER)
                ->where('refund_status', OrderItem::REFUND_STATUS_NOREFUND)
                ->find();

            if ($item) {
                \think\Db::transaction(function () use ($order, $item, $data) {
                    // 订单评价前
                    \think\Hook::listen('order_comment_before', $data);
                    
                    GoodsComment::create([
                        'goods_id' => $item['goods_id'],
                        'order_id' => $order['id'],
                        'user_id' => $order['user_id'],
                        'level' => 5,           // 自动好评
                        'content' => '系统自动评价',
                        'images' => '',
                        'status' => 'show'
                    ]);

                    $item->comment_status = OrderItem::COMMENT_STATUS_OK;        // 评价成功
                    $item->save();

                    OrderAction::operAdd($order, $item, null, 'system', '系统自动评价成功');

                    // 订单评价后
                    $data = ['order' => $order, 'item' => $item];
                    \think\Hook::listen('order_comment_after', $data);
                });
            }

            // 删除 job
            $job->delete();
        } catch (\Exception $e) {
            // 队列执行失败
            \think\Log::write('queue-' . get_class() . '-autoComment' . $e->getMessage());
        }
    }
}