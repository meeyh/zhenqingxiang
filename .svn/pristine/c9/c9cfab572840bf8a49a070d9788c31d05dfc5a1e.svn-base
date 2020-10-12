<?php

namespace addons\shopro\listener\activity;

use addons\shopro\exception\Exception;
use addons\shopro\model\User;
use addons\shopro\model\Goods;
use addons\shopro\library\Traits\ActivityCache;
use addons\shopro\model\Activity;
use addons\shopro\model\ActivityGrouponLog;

/**
* 成团事件
*/
class Groupon
{

    // 拼团成功
    public function activityGrouponFinish(&$params) {
        $groupon = $params['groupon'];
        $goods = Goods::where('id', $groupon['goods_id'])->find();

        // 查询所有参与该团的真实用户 users & grouponLogs & grouponLeader
        extract($this->getActivityGrouponUsers($groupon));

        if ($users) {
            \addons\shopro\library\Notify\Notify::send(
                $users, 
                new \addons\shopro\notifications\Groupon([
                    'groupon' => $groupon, 
                    'grouponLogs' => $grouponLogs, 
                    'grouponLeader' => $grouponLeader, 
                    'goods' => $goods, 
                    'event' => 'groupon_success'
                ])
            );
        }
    }

    
    // 拼团失败
    public function activityGrouponFail(&$params) {
        $groupon = $params['groupon'];
        $goods = Goods::where('id', $groupon['goods_id'])->find();

        // 查询所有参与该团的真实用户 users & grouponLogs & grouponLeader
        extract($this->getActivityGrouponUsers($groupon));

        if ($users) {
            \addons\shopro\library\Notify\Notify::send(
                $users,
                new \addons\shopro\notifications\Groupon([
                    'groupon' => $groupon,
                    'grouponLogs' => $grouponLogs, 
                    'grouponLeader' => $grouponLeader, 
                    'goods' => $goods, 
                    'event' => 'groupon_fail'
                ])
            );
        }
    }


    // 查询所有参与该团的真实用户
    private function getActivityGrouponUsers($groupon) {
        $grouponLogs = ActivityGrouponLog::where('groupon_id', $groupon['id'])->where('is_fictitious', 0)->select();
        $user_ids = array_column($grouponLogs, 'user_id');

        // 所有用户
        $users = User::where('id', 'in', $user_ids)->select();

        // 团长
        $grouponLeader = null;
        foreach ($users as $key => $user) {
            if ($user['id'] == $groupon['user_id']) {
                $grouponLeader = $user;
                break;
            }
        }

        return compact("users", "grouponLogs", "grouponLeader");
    }
    
}
