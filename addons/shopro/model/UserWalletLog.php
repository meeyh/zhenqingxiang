<?php

namespace addons\shopro\model;

use think\Model;
use addons\shopro\exception\Exception;
use think\Db;

/**
 * 钱包
 */
class UserWalletLog extends Model
{

    // 表名,不含前缀
    protected $name = 'shopro_user_wallet_log';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    protected $hidden = ['deletetime'];


    // 追加属性
    protected $append = [
        'type_name'
    ];

    public static $typeAll = [
        // money
        'wallet_pay' => ['code' => 'wallet_pay', 'name' => '余额付款'],
        'recharge' => ['code' => 'recharge', 'name' => '充值'],
        'cash' => ['code' => 'cash', 'name' => '提现'],
        'cash_error' => ['code' => 'cash_error', 'name' => '提现驳回'],
        'wallet_refund' => ['code' => 'wallet_refund', 'name' => '余额退款'],

        // score
        'sign' => ['code' => 'sign', 'name' => '签到'],
        'score_pay' => ['code' => 'score_pay', 'name' => '积分付款'],
        'score_back_order' => ['code' => 'score_back_order', 'name' => '取消订单退回'],
    ];

    public function scopeMoney($query)
    {
        return $query->where('wallet_type', 'money');
    }

    public function scopeScore($query)
    {
        return $query->where('wallet_type', 'score');
    }

    public function scopeAdd($query)
    {
        return $query->where('is_add', 1);
    }

    public function scopeReduce($query)
    {
        return $query->where('is_add', 0);
    }


    public static function doAdd($user, $wallet, $type, $item_id, $wallet_type, $is_add = 0, $ext = [])
    {
        // $self = new self();

        // $self->user_id = $user->id;
        // $self->wallet = $wallet;
        // $self->type = $type;                     // 这个字段受到  model type 影响
        // $self->item_id = $item_id;
        // $self->wallet_type = $wallet_type;
        // $self->is_add = $is_add;
        // $self->ext = json_encode($ext);
        // $self->save();

        $self = self::create([
            "user_id" => $user->id,
            "wallet" => $wallet,
            "type" => $type,
            "item_id" => $item_id,
            "wallet_type" => $wallet_type,
            "is_add" => $is_add,
            "ext" => json_encode($ext)
        ]);

        return $self;
    }


    public static function getList($wallet_type, $status = 'all')
    {
        $user = User::info();

        $walletLogs = self::{$wallet_type}();

        if ($status != 'all') {
            $walletLogs = $walletLogs->{$status}();
        }

        $walletLogs = $walletLogs->where(['user_id' => $user->id])
            ->order('id', 'DESC')->paginate(10);
        foreach ($walletLogs as $w) {
            switch ($w['type']) {
                case 'wallet_pay':
                case 'wallet_refund':
                    $item = OrderItem::get($w->item_id);
                    $w->avatar = $item->goods_image;
                    $w->title = $item->goods_title;
                    break;
                case 'cash':
                case 'cash_error':
                    $apply = json_decode(UserWalletApply::get($w->item_id)->bank_info, true);
                    $user = User::info();
                    $w->avatar = $user->avatar;
                    $w->title = $apply['bank_name'];
                    break;
            }
        }
        return $walletLogs;
    }


    public static function getTypeName($type)
    {
        return isset(self::$typeAll[$type]) ? self::$typeAll[$type]['name'] : '';
    }


    public function getTypeNameAttr($value, $data)
    {
        return self::getTypeName($data['type']);
    }


    public function getWalletAttr($value, $data)
    {
        return $data['wallet_type'] == 'score' ? intval($value) : $value;
    }
}
