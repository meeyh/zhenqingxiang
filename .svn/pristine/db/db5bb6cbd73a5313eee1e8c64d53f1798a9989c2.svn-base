<?php

namespace app\admin\model\shopro;

use think\Model;
use traits\model\SoftDelete;

class Coupons extends Model
{

    use SoftDelete;
    protected $auto = ['usetimestart', 'usetimeend', 'gettimestart', 'gettimeend'];
    

    // 表名
    protected $name = 'shopro_coupons';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';


    protected function setUsetimestartAttr($value, $data)
    {
        $usetimeArray = explode(' - ', $data['usetime']);
        return strtotime($usetimeArray[0]);
    }
    protected function setUsetimeendAttr($value, $data)
    {
        $usetimeArray = explode(' - ', $data['usetime']);
        return strtotime($usetimeArray[1]);
    }
    protected function setGettimestartAttr($value, $data)
    {
        $gettimeArray = explode(' - ', $data['gettime']);
        return strtotime($gettimeArray[0]);
    }
    protected function setGettimeendAttr($value, $data)
    {
        $gettimeArray = explode(' - ', $data['gettime']);
        return strtotime($gettimeArray[1]);
    }

}
