<?php

namespace app\admin\model\shopro\order;

use think\Model;
use traits\model\SoftDelete;

class OrderItem extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'shopro_order_item';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'dispatch_type_text',
        'dispatch_status_text',
        'aftersale_status_text',
        'comment_status_text',
        'activity_type_text',
        'refund_status_text'
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

    
    public function getDispatchStatusList()
    {
        return ['0' => __('Dispatch_status 0'), '1' => __('Dispatch_status 1'), '2' => __('Dispatch_status 2')];
    }

    public function getAftersaleStatusList()
    {
        return ['0' => __('Aftersale_status 0'), '1' => __('Aftersale_status 1'), '2' => __('Aftersale_status 2')];
    }

    public function getCommentStatusList()
    {
        return ['0' => __('Comment_status 0'), '1' => __('Comment_status 1')];
    }

    public function getRefundStatusList()
    {
        return ['-1' => __('Refund_status -1'), '0' => __('Refund_status 0'), '1' => __('Refund_status 1'), '2' => __('Refund_status 2'), '3' => __('Refund_status 3')];
    }


    public function getDispatchTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['dispatch_type']) ? $data['dispatch_type'] : '');
        $list = (new \app\admin\model\shopro\dispatch\Dispatch)->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getDispatchStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['dispatch_status']) ? $data['dispatch_status'] : '');
        $list = $this->getDispatchStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getAftersaleStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['aftersale_status']) ? $data['aftersale_status'] : '');
        $list = $this->getAftersaleStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function getActivityTypeList()
    {
        return ['seckill' => __('Activity_type seckill'), 'groupon' => __('Activity_type groupon')];
    }

    public function getActivityTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['activity_type']) ? $data['activity_type'] : '');
        $list = $this->getActivityTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function getCommentStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['comment_status']) ? $data['comment_status'] : '');
        $list = $this->getCommentStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getRefundStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['refund_status']) ? $data['refund_status'] : '');
        $list = $this->getRefundStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




}
