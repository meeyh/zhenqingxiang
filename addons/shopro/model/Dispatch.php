<?php

namespace addons\shopro\model;

use addons\shopro\exception\Exception;
use think\Model;
use traits\model\SoftDelete;
/**
 * 快递模型
 */
class Dispatch extends Model
{
    use SoftDelete;

    protected $name = 'shopro_dispatch';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';
    protected $hidden = ['createtime', 'updatetime', 'deletetime'];

    // 追加属性
    protected $append = [
        
    ];


    // 计算运费
    public static function getDispatch($dispatch_type, $detail, $address, $goods_num)
    {
        // TODO: 1.拿到用户传来的dispatch_type,然后匹配goodsDetail里面的dispatch_type。
        //       2.从goodsDetail里面拿dispatch_ids，遍历匹配dispatch表里的id 如果type和id都对上了 就代表拿到了发货模板

        if (strpos($detail->dispatch_type, $dispatch_type) === false) {
            throw new Exception('当前所选配送方式不支持');
        }

        $dispatch_ids = explode(',', $detail->dispatch_ids);
        $dispatch = Dispatch::where('type', $dispatch_type)->where('id', 'in', $dispatch_ids)->find();

        if (!$dispatch) {
            throw new Exception('配送方式不存在');
        }

        if ($dispatch_type == 'express') {
            // 物流快递
            $dispatch_express_ids = explode(',', $dispatch->type_ids);

            $dispatchExpress = DispatchExpress::where('id', 'in', $dispatch_express_ids)
                                    ->order('weigh', 'desc')->select();

            $finalExpress = null;

            foreach ($dispatchExpress as $key => $express) {
                if (strpos($express->area_ids, strval($address->area_id)) !== false) {
                    $finalExpress = $express;
                    break;
                }

                if (strpos($express->city_ids, strval($address->city_id)) !== false) {
                    $finalExpress = $express;
                    break;
                } 

                if (strpos($express->province_ids, strval($address->province_id)) !== false) {
                    $finalExpress = $express;
                    break;
                } 
            }

            if ($finalExpress) {
                // 初始费用
                $dispatch_fee = $finalExpress->first_price;

                if ($finalExpress['type'] == 'number') {
                    // 按件计算
                    
                    if ($finalExpress->additional_num && $finalExpress->additional_price) {
                        // 首件之后剩余件数
                        $surplus_num = $goods_num - $finalExpress->first_num;
    
                        // 多出的计量
                        $additional_mul = ceil(($surplus_num / $finalExpress->additional_num));
                        if ($additional_mul > 0) {
                            $dispatch_fee += ($additional_mul * $finalExpress->additional_price);
                        }
                    }
                } else {
                    // 按重量计算
    
                    if ($finalExpress->additional_num && $finalExpress->additional_price) {
                        // 首重之后剩余重量
                        $surplus_num = ($detail->current_sku_price->weight * $goods_num) - $finalExpress->first_num;
    
                        // 多出的计量
                        $additional_mul = ceil(($surplus_num / $finalExpress->additional_num));
                        if ($additional_mul > 0) {
                            $dispatch_fee += ($additional_mul * $finalExpress->additional_price);
                        }
                    }
    
                }
            } else {
                throw new Exception('当前地区不在配送范围');
            }

            return $dispatch_fee;
        } else {
            throw new Exception('配送方式暂不支持');
        }
    }

}
