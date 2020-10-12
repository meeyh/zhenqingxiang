<?php

namespace addons\shopro\library\traits\models;

use addons\shopro\library\Wechat;
use addons\shopro\model\Order;
use addons\shopro\model\OrderItem;
use think\Cache;

trait OrderScope
{
    // 已失效
    public function scopeInvalid($query, $is_with = true)
    {
        return $query->where('status', Order::STATUS_INVALID);
    }

    // 已取消
    public function scopeCancel($query, $is_with = true)
    {
        return $query->where('status', Order::STATUS_CANCEL);
    }

    // 未支付
    public function scopeNopay($query, $is_with = true)
    {
        return $query->where('status', Order::STATUS_NOPAY);
    }

    // 未发货
    public function scopeNosend($query, $is_with = true)
    {
        $where = [
            'dispatch_status' => OrderItem::DISPATCH_STATUS_NOSEND,
            'aftersale_status' => OrderItem::AFTERSALE_STATUS_NOAFTER,
            'refund_status' => OrderItem::REFUND_STATUS_NOREFUND
        ];

        if ($is_with) {
            $query = $query->with(['item' => function ($query) use ($where) {
                $query->where($where);
            }]);
        }

        return $query->whereExists(function ($query) use ($where) {
            $order_table_name = (new Order())->getQuery()->getTable();
            $table_name = (new OrderItem())->getQuery()->getTable();
            $query->table($table_name)->where('order_id=' . $order_table_name . '.id')->where($where);
        });
    }

    // 待收货
    public function scopeNoget($query, $is_with = true)
    {
        $where = [
            'dispatch_status' => OrderItem::DISPATCH_STATUS_SENDED,
            'aftersale_status' => OrderItem::AFTERSALE_STATUS_NOAFTER,
            'refund_status' => OrderItem::REFUND_STATUS_NOREFUND
        ];

        if ($is_with) {
            $query = $query->with(['item' => function ($query) use ($where) {
                $query->where($where);
            }]);
        }

        return $query->whereExists(function ($query) use ($where) {
            $order_table_name = (new Order())->getQuery()->getTable();
            $table_name = (new OrderItem())->getQuery()->getTable();
            $query->table($table_name)->where('order_id=' . $order_table_name . '.id')->where($where);
        });
    }


    // 待评价
    public function scopeNocomment($query, $is_with = true)
    {
        $where = [
            'dispatch_status' => OrderItem::DISPATCH_STATUS_GETED,
            'aftersale_status' => OrderItem::AFTERSALE_STATUS_NOAFTER,
            'refund_status' => OrderItem::REFUND_STATUS_NOREFUND,
            'comment_status' => OrderItem::COMMENT_STATUS_NO
        ];

        if ($is_with) {
            $query = $query->with(['item' => function ($query) use ($where) {
                $query->where($where);
            }]);
        }

        return $query->whereExists(function ($query) use ($where) {
            $order_table_name = (new Order())->getQuery()->getTable();
            $table_name = (new OrderItem())->getQuery()->getTable();
            $query->table($table_name)->where('order_id=' . $order_table_name . '.id')->where($where);
        });
    }

    // 售后
    public function scopeAftersale($query, $is_with = true)
    {
        $where = [
            'aftersale_status' => ['>', OrderItem::AFTERSALE_STATUS_NOAFTER],
        ];

        if ($is_with) {
            $query = $query->with(['item' => function ($query) use ($where) {
                $query->where($where);
            }]);
        }

        return $query->whereExists(function ($query) use ($where) {
            $order_table_name = (new Order())->getQuery()->getTable();
            $table_name = (new OrderItem())->getQuery()->getTable();
            $query->table($table_name)->where('order_id=' . $order_table_name . '.id')->where($where);
        });
    }

    // 退款
    public function scopeRefundStatus($query, $is_with = true)
    {
        $where = [
            'refund_status' => ['>', OrderItem::REFUND_STATUS_NOREFUND],
        ];

        if ($is_with) {
            $query = $query->with(['item' => function ($query) use ($where) {
                $query->where($where);
            }]);
        }

        return $query->whereExists(function ($query) use ($where) {
            $order_table_name = (new Order())->getQuery()->getTable();
            $table_name = (new OrderItem())->getQuery()->getTable();
            $query->table($table_name)->where('order_id=' . $order_table_name . '.id')->where($where);
        });
    }


    // 已支付
    public function scopePayed($query, $is_with = true)
    {
        return $query->where('status', Order::STATUS_PAYED);
    }

    // 已完成
    public function scopeFinish($query, $is_with = true)
    {
        return $query->where('status', Order::STATUS_FINISH);
    }

    public function scopeCanAftersale($query, $is_with = true)
    {
        $query->where('status', 'in', [Order::STATUS_PAYED, Order::STATUS_FINISH]);
    }
}
