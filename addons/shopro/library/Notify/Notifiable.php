<?php

namespace addons\shopro\library\Notify;

use addons\shopro\exception\Exception;
use think\queue\ShouldQueue;
/**
 * 消息通知 trait
 */

trait Notifiable
{
    public function notify ($notification) {
        return \addons\shopro\library\Notify\Notify::send([$this], $notification);
    }
    
}
