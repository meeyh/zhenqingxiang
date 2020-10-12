<?php

namespace addons\shopro\model;

use think\Model;
use addons\shopro\exception\Exception;
use addons\shopro\library\Traits\Models\OrderScope;
use think\Db;
use think\Queue;
use traits\model\SoftDelete;
use addons\shopro\library\Traits\Models\OrderOper;

/**
 * 订单模型
 */
class Order extends Model
{
    use SoftDelete, OrderOper, OrderScope;

    // 表名,不含前缀
    protected $name = 'shopro_order';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    protected $hidden = ['updatetime', 'deletetime'];
    // //列表动态隐藏字段
    // protected static $list_hidden = ['content', 'params', 'images', 'service_ids'];

    // // 追加属性
    protected $append = [
        'status_name',
        'status_desc',
        'btns',
        'ext_arr'
        // 'sku',
        // 'coupons'

    ];

    // 订单状态
    const STATUS_INVALID = -2;
    const STATUS_CANCEL = -1;
    const STATUS_NOPAY = 0;
    const STATUS_PAYED = 1;
    const STATUS_FINISH = 2;


    /* -------------------------- 访问器 ------------------------ */

    public function getExtArrAttr($value, $data)
    {
        return (isset($data['ext']) && $data['ext']) ? json_decode($data['ext'], true) : [];
    }

    public function getStatusNameAttr($value, $data)
    {
        return $this->getStatus($data, 'status_name');
    }

    public function getStatusDescAttr($value, $data)
    {
        return $this->getStatus($data, 'status_desc');
    }


    public function getBtnsAttr($value, $data)
    {
        return $this->getStatus($data, 'btns');
    }

    // 获取订单状态
    private function getStatus($data, $type)
    {
        $btns = [];
        $status_name = '';
        $status_desc = '';

        switch ($data['status']) {
            case Order::STATUS_NOPAY:
                $status_name = '等待买家付款';
                $status_desc = '';
                $btns[] = 'cancel';     // 取消订单
                $btns[] = 'pay';        // 支付
                break;
            case Order::STATUS_PAYED:
                $status_name = '买家已付款';
                $status_desc = '';
                $ext_arr = json_decode($data['ext'], true);

                // 是拼团订单
                if (strpos($data['activity_type'], 'groupon') !== false && 
                    isset($ext_arr['groupon_id']) && $ext_arr['groupon_id']) {

                    $btns[] = 'groupon';    // 拼团详情
                }
                break;
            case Order::STATUS_FINISH:
                $status_name = '交易完成';
                $status_desc = '';
                $ext_arr = json_decode($data['ext'], true);

                // 是拼团订单
                if (strpos($data['activity_type'], 'groupon') !== false &&
                    isset($ext_arr['groupon_id']) && $ext_arr['groupon_id']) {

                    $btns[] = 'groupon';    // 拼团详情
                }
                break;
            case Order::STATUS_CANCEL:
                $status_name = '已取消';
                $status_desc = '';
                break;
            case Order::STATUS_INVALID:
                $status_name = '交易关闭';
                $status_desc = '';
                break;
        }

        return $type == 'status_name' ? $status_name : ($type == 'btns' ? $btns : $status_desc);
    }

    /* -------------------------- 访问器 ------------------------ */



    /* -------------------------- 模型关联 ------------------------ */

    public function item()
    {
        return $this->hasMany(\addons\shopro\model\OrderItem::class, 'order_id', 'id');
    }

    // 拼团只有一个商品，可以使用这个
    public function firstItem()
    {
        return $this->hasOne(\addons\shopro\model\OrderItem::class, 'order_id', 'id');
    }
    /* -------------------------- 模型关联 ------------------------ */
}
