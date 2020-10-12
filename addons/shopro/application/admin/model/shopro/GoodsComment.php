<?php

namespace app\admin\model\shopro;

use think\Model;
use traits\model\SoftDelete;

class GoodsComment extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'shopro_goods_comment';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'status_text',
        'replytime_text'
    ];
    

    
    public function getStatusList()
    {
        return ['show' => __('Status show'), 'hidden' => __('Status hidden')];
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getReplytimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['replytime']) ? $data['replytime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }

    protected function setReplytimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


    public function shoprogoods()
    {
        return $this->belongsTo('app\admin\model\shopro\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
