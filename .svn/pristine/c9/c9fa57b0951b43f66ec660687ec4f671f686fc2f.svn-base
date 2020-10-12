<?php

namespace addons\shopro\model;

use think\Model;
use addons\shopro\exception\Exception;

/**
 * 购物车模型
 */
class Share extends Model
{

    // 表名,不含前缀
    protected $name = 'shopro_share';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = false;
    protected $deleteTime = false;

    protected $hidden = ['createtime'];

    // 追加属性
    protected $append = [
    ];


    public static function add($params)
    {

        $user = User::info();
        $url = $params['url'];
        if (!empty($url)) {
            $type = explode('-', $url);
        }else{
            $type = ['index', 0];
        }
        self::create([
            'user_id' => $user->id,
            'share_id' => $params['share_id'],
            'type' => $type[0],
            'type_id' => $type[1],
            'platform' => $params['platform'],
            'createtime' => time(),
        ]);

        return true;


    }




}
