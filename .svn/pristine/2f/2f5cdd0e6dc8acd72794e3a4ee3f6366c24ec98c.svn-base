<?php

namespace app\admin\model\shopro;

use think\Model;
use traits\model\SoftDelete;

class GoodsSkuPrice extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'shopro_goods_sku_price';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'goods_sku_text'
    ];
    

    protected static function init()
    {
        // self::afterInsert(function ($row) {
        //     $pk = $row->getPk();
        //     $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        // });
    }

    public function getImageAttr($value, $data)
    {
        if (!empty($value)) return cdnurl($value, true);
        return $value;

    }



    public function getGoodsSkuTextAttr($value, $data)
    {
        return array_filter(explode(',', $value));
    }




}
