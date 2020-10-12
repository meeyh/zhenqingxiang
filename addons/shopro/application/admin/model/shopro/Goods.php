<?php

namespace app\admin\model\shopro;

use think\Model;
use traits\model\SoftDelete;
use fast\Tree;

class Goods extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'shopro_goods';
    
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
        'dispatch_type_text',
        'service_ids_arr',
        'dispatch_type_arr',
        'dispatch_ids_arr'
    ];
    

    protected static function init()
    {
        // self::afterInsert(function ($row) {
        //     $pk = $row->getPk();
        //     $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        // });
    }

    
    public function getTypeList()
    {
        return ['normal' => __('Type normal'), 'virtual' => __('Type virtual')];
    }

    public function getStatusList()
    {
        return ['up' => __('Status up'), 'hidden' => __('Status hidden'), 'down' => __('Status down')];
    }

    public function getDispatchTypeList()
    {
        return ['express' => __('Dispatch_type express'), 'selfetch' => __('Dispatch_type selfetch'), 'store' => __('Dispatch_type store'), 'autosend' => __('Dispatch_type autosend')];
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


    public function getDispatchTypeArrAttr($value, $data)
    {
        $value = isset($data['dispatch_type']) ? $data['dispatch_type'] : '';
        $valueArr = explode(',', $value);
        return $valueArr;
    }

    public function getDispatchTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['dispatch_type']) ? $data['dispatch_type'] : '');
        $valueArr = explode(',', $value);
        $list = $this->getDispatchTypeList();
        return implode(',', array_intersect_key($list, array_flip($valueArr)));
    }


    public function getCategoryIdsArrAttr($value, $data)
    {
        $arr = $data['category_ids'] ? explode(',', $data['category_ids']) : [];

        $category_ids_arr = [];
        if ($arr) {
            $tree = Tree::instance();
            $tree->init(collection(Category::order('weigh desc,id desc')->select())->toArray(), 'pid');

            foreach ($arr as $key => $id) {
                $category_ids_arr[] = $tree->getParentsIds($id, true);
            }
        }

        return $category_ids_arr;
    }

    public function getServiceIdsArrAttr($value, $data)
    {
        return (isset($data['service_ids']) && $data['service_ids']) ? explode(',', $data['service_ids']) : [];
    }

    public function getDispatchIdsArrAttr($value, $data)
    {
        return (isset($data['dispatch_ids']) && $data['dispatch_ids']) ? explode(',', $data['dispatch_ids']) : [];
    }

    public function getParamsArrAttr($value, $data)
    {
        return (isset($data['params']) && $data['params']) ? json_decode($data['params'], true) : [];
    }

    protected function setDispatchTypeAttr($value)
    {
        return is_array($value) ? implode(',', $value) : $value;
    }



}
