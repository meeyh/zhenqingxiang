<?php

namespace addons\shopro\model;

use think\Model;
use addons\shopro\exception\Exception;
use think\Db;
use traits\model\SoftDelete;

/**
 * 订单模型
 */
class OrderItem extends Model
{
    use SoftDelete;

    // 表名,不含前缀
    protected $name = 'shopro_order_item';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    protected $hidden = ['createtime', 'updatetime', 'deletetime'];
    // //列表动态隐藏字段
    // protected static $list_hidden = ['content', 'params', 'images', 'service_ids'];

    protected $append = [
        'status_name',
        'btns'
    ];

    // 发货状态
    const DISPATCH_STATUS_NOSEND = 0;       // 未发货
    const DISPATCH_STATUS_SENDED = 1;       // 已发货
    const DISPATCH_STATUS_GETED = 2;        // 已收货


    // 售后状态
    const AFTERSALE_STATUS_NOAFTER = 0;       // 未申请
    const AFTERSALE_STATUS_AFTERING = 1;       // 申请退款
    const AFTERSALE_STATUS_OK = 2;        // 售后完成
    
    
    // 退款状态
    const REFUND_STATUS_REFUSE = -1;       // 拒绝退款
    const REFUND_STATUS_NOREFUND = 0;       // 退款状态 未申请
    const REFUND_STATUS_ING = 1;       // 申请中
    const REFUND_STATUS_OK = 2;       // 已同意
    const REFUND_STATUS_FINISH = 3;       // 退款完成

    // 评价状态
    const COMMENT_STATUS_NO = 0;       // 待评价
    const COMMENT_STATUS_OK = 1;       // 已评价


    // 获取订单状态
    public function getStatus($data, $type)
    {
        $btns = [];
        $status_name = '';

        $order = Order::where('id', $data['order_id'])->find();
        if (!$order || !in_array($order->status, [Order::STATUS_PAYED, Order::STATUS_FINISH])) {
            return $type == 'status_name' ? $status_name : $btns;
        }

        if (
            $data['aftersale_status'] == self::AFTERSALE_STATUS_NOAFTER
            && $data['refund_status'] == self::REFUND_STATUS_NOREFUND
        ) {
            // 未申请售后，也未申请退款
            switch ($data['dispatch_status']) {
                case self::DISPATCH_STATUS_NOSEND:
                    $status_name = '待发货';
                    $btns[] = 'aftersale';
                    break;
                case self::DISPATCH_STATUS_SENDED:
                    $status_name = '待收货';
                    $btns[] = 'express';        // 查看物流
                    $btns[] = 'get';            // 确认收货
                    break;
                case self::DISPATCH_STATUS_GETED:
                    $btns[] = 'aftersale';
                    $status_name = '已收货';
                    if ($data['comment_status'] == self::COMMENT_STATUS_NO) {
                        $status_name = '待评价';
                        $btns[] = 'comment';
                    } else {
                        $status_name = '已评价';
                        $btns[] = 'buy_again';
                    }
                    break;
            }
        } else {
            // $btns[] = 'after_detail';
            if ($data['refund_status'] != self::REFUND_STATUS_NOREFUND) {
                switch ($data['refund_status']) {
                    case self::REFUND_STATUS_ING:
                        $status_name = '退款处理中';
                        break;
                    case self::REFUND_STATUS_OK:
                        $status_name = '同意退款';
                        break;
                    case self::REFUND_STATUS_FINISH:       // 支付宝微信，回调修改
                        $status_name = '退款完成';
                        break;
                    case self::REFUND_STATUS_REFUSE:
                        $status_name = '拒绝退款';
                        $btns[] = 'reapply_refund';          // 重新申请退款
                        break;
                }
            } else if ($data['aftersale_status'] != self::AFTERSALE_STATUS_NOAFTER) {
                switch ($data['aftersale_status']) {
                    case self::AFTERSALE_STATUS_AFTERING:
                        $status_name = '售后中';
                        $btns[] = 'apply_refund';          // 申请退款
                        break;
                    case self::REFUND_STATUS_OK:
                        $status_name = '售后完成';
                        break;
                }
            }
        }

        return $type == 'status_name' ? $status_name : $btns;
    }



    public function getStatusNameAttr($value, $data) 
    {
        return $this->getStatus($data, 'status_name');
    }

    public function getBtnsAttr($value, $data)
    {
        return $this->getStatus($data, 'btns');
    }


    public function order() {
        $this->belongsTo(\addons\shopro\model\OrderItem::class, 'order_id', 'id');
    }
}
