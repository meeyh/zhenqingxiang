<?php

namespace addons\shopro\model;

use think\Model;
use addons\shopro\exception\Exception;
use traits\model\SoftDelete;

/**
 * 优惠券模型
 */
class Coupons extends Model
{
    use SoftDelete;

    // 表名,不含前缀
    protected $name = 'shopro_coupons';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    protected $hidden = ['createtime', 'updatetime', 'deletetime'];


    // 追加属性
    protected $append = [

    ];
    const COUPONS_CENTER = 0; // 领券中心
    const COUPONS_CAN_USE = 1; // 可使用
    const COUPONS_USED = 2; // 已使用
    const COUPONS_EXPIRED = 3; // 已失效

    public static function getCoupon($id)
    {
        $coupon = self::get($id);
        $user = User::info();
        if (!$coupon) {
            throw  new Exception('未找到优惠券');
        }
        
        if ($coupon['gettimestart'] > time() || $coupon['gettimeend'] < time()) {
            throw  new Exception('优惠券领取已结束');
        }

        $getList = UserCoupons::all([
            'user_id' => $user->id,
            'coupons_id' => $id
        ]);
        if (count($getList) >= $coupon->limit) {
            throw new Exception('您已经领取过');
        }

        if ($coupon->stock <= 0) {
            throw new Exception('优惠券已经被领完了');
        }
        $coupon->stock -= 1;
        $coupon->save();

        $result = UserCoupons::create([
            'user_id' => $user->id,
            'coupons_id' => $id,
        ]);
        return $result;
    }

    public static function getCouponsListByIds($ids)
    {
        $couponsIdsArray = explode(',', $ids);
        $where = [
            'id' => ['in', $couponsIdsArray]
        ];
        $coupons = self::all($where);
        return $coupons;


    }

    public static function getCouponsDetail($id)
    {
        return self::get($id);
    }

    public static function getGoodsByCoupons($id)
    {
        $goodsIds = self::where('id', $id)->value('goods_ids');
        return Goods::getGoodsListByIds($goodsIds);


    }

    public static function getCouponsList($type)
    {
        $user = User::info();
        $couponsList = [];
        switch ($type) {
            case self::COUPONS_CENTER:
                $couponsList = self::all([
                    'gettimestart' => ['elt', time()],
                    'gettimeend' => ['egt', time()]
                ]);
                break;
            case self::COUPONS_CAN_USE:
                $userCoupons = UserCoupons::where(['user_id' => $user->id,'usetime' => null])->select();
                foreach ($userCoupons as $u) {
                    $coupon = self::get($u->coupons_id);
                    if ($coupon && $coupon->usetimestart <= time() && $coupon->usetimeend >= time()) {
                        $coupon->user_coupons_id = $u->id;
                        $couponsList[] = $coupon;
                    }
                }
                
                break;
            case self::COUPONS_USED:
                $userCoupons = UserCoupons::where('user_id', $user->id)->where('usetime', 'not null')->select();
                foreach ($userCoupons as $u) {
                    $coupon = self::get($u->coupons_id);
                    // if ($coupon && $coupon->usetimestart <= time() && $coupon->usetimeend >= time()) {
                    $coupon->user_coupons_id = $u->id;
                    $couponsList[] = $coupon;
                    // }
                }
                break;
            case self::COUPONS_EXPIRED:
                    $userCoupons = UserCoupons::where(['user_id' => $user->id,'usetime' => null])->select();
                    foreach ($userCoupons as $u) {
                        $coupon = self::get($u->coupons_id);
                        if ($coupon && $coupon->usetimeend <= time()) {
                            $coupon->user_coupons_id = $u->id;
                            $couponsList[] = $coupon;
                        }
                    }
                break;
        }

        return $couponsList;

    }

    public function getUsetimeAttr($value, $data)
    {
        $usetimeArray = explode(' - ', $value);
        $usetime['start'] = strtotime($usetimeArray[0]);
        $usetime['end'] = strtotime($usetimeArray[1]);
        return $usetime;
    }

    public function getGettimeAttr($value, $data)
    {
        $gettimeArray = explode(' - ', $value);
        $gettime['start'] = strtotime($gettimeArray[0]);
        $gettime['end'] = strtotime($gettimeArray[1]);
        return $gettime;
    }

    //定义关联方法
    public function userCoupons(){
        //hasMany('租客表名','租客表外键','宿舍主键',['模型别名定义']);
        return $this->hasMany('userCoupons','coupons_id','id');
    }



}
