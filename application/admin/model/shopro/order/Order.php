<?php

namespace app\admin\model\shopro\order;

use addons\shopro\library\Traits\Models\OrderOper;
use addons\shopro\library\Traits\Models\OrderScope;
use think\Model;
use traits\model\SoftDelete;
use think\Log;

class Order extends Model
{

    use OrderOper, OrderScope, SoftDelete;

    

    // 表名
    protected $name = 'shopro_order';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'type_text',
        'status_text',
        'pay_type_text',
        'paytime_text',
        'platform_text',
        'ext_arr'
    ];

    // 订单状态
    const STATUS_INVALID = -2;      // 已失效|交易关闭
    const STATUS_CANCEL = -1;       // 已取消
    const STATUS_NOPAY = 0;         // 未付款
    const STATUS_PAYED = 1;         // 买家已付款
    const STATUS_FINISH = 2;        // 已完成
    
    public function getTypeList()
    {
        return ['goods' => __('Type goods'), 'score' => __('Type score')];
    }

    public function getStatusList()
    {
        return ['-2' => __('Status -2'), '-1' => __('Status -1'), '0' => __('Status 0'), '1' => __('Status 1'), '2' => __('Status 2')];
    }

    public function getPayTypeList()
    {
        return ['wechat' => __('Pay_type wechat'), 'alipay' => __('Pay_type alipay'), 'wallet' => __('Pay_type wallet'), 'score' => __('Pay_type score')];
    }

    public function getPlatformList()
    {
        return ['H5' => __('Platform h5'), 'wxOfficialAccount' => __('Platform wxofficialaccount'), 'wxMiniProgram' => __('Platform wxminiprogram'), 'App' => __('Platform app')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPayTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pay_type']) ? $data['pay_type'] : '');
        $list = $this->getPayTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPaytimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['paytime']) ? $data['paytime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getPlatformTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['platform']) ? $data['platform'] : '');
        $list = $this->getPlatformList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    protected function setPaytimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    public function getExtArrAttr($value, $data)
    {
        return (isset($data['ext']) && $data['ext']) ? json_decode($data['ext'], true) : [];
    }
    
    public function user () 
    {
        return $this->belongsTo(\app\admin\model\User::class, 'user_id');
    }

    public function item()
    {
        return $this->hasMany(\app\admin\model\shopro\order\OrderItem::class, 'order_id');
    }
}
