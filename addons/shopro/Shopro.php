<?php

namespace addons\shopro;

use addons\shopro\library\Hook;
use app\admin\model\AuthRule;
use app\common\library\Menu;
use think\Addons;
use think\Exception;
use think\exception\PDOException;


/**
 * 插件
 */
class Shopro extends Addons
{

    /**
     * 插件安装方法
     * @return bool
     */
    public function install()
    {
        $menu = self::getMenu();
        self::menuCreateOrUpdate($menu['new'], $menu['old']);
        return true;
    }

    /**
     * 插件卸载方法
     * @return bool
     */
    public function uninstall()
    {
        Menu::delete('shopro');
        return true;
    }

    /**
     * 插件启用方法
     */
    public function enable()
    {
        $menu = self::getMenu();
        self::menuCreateOrUpdate($menu['new'], $menu['old']);
        Menu::enable('shopro');
        return true;
    }

    /**
     * 插件禁用方法
     */
    public function disable()
    {
        Menu::disable('shopro');
        return true;
    }


    /**
     * 应用初始化
     */
    public function appInit()
    {
        \think\Loader::addNamespace('Yansongda\Pay', ADDON_PATH . 'shopro' . DS . 'library' . DS . 'Yansongda' . DS);
        \think\Loader::addNamespace('Yansongda\Supports', ADDON_PATH . 'shopro' . DS . 'library' . DS . 'Supports' . DS);

        // 全局注册行为事件
        Hook::register();
    }

    private static function getMenu()
    {
        $newMenu = [];
        $config_file = ADDON_PATH . "shopro" . DS . 'config' . DS . "menu.php";
        if (is_file($config_file)) {
            $newMenu = include $config_file;
        }
        $oldMenu = AuthRule::where('name','like',"shopro%")->select();
        $oldMenu = array_column($oldMenu, null, 'name');
        return ['new' => $newMenu, 'old' => $oldMenu];
    }

    private static function menuCreateOrUpdate($newMenu, $oldMenu, $parent = 0)
    {
        if (!is_numeric($parent)) {
            $parentRule = AuthRule::getByName($parent);
            $pid = $parentRule ? $parentRule['id'] : 0;
        } else {
            $pid = $parent;
        }
        $allow = array_flip(['file', 'name', 'title', 'icon', 'condition', 'remark', 'ismenu', 'weigh']);
        foreach ($newMenu as $k => $v) {
            $hasChild = isset($v['sublist']) && $v['sublist'] ? true : false;
            $data = array_intersect_key($v, $allow);
            $data['ismenu'] = isset($data['ismenu']) ? $data['ismenu'] : ($hasChild ? 1 : 0);
            $data['icon'] = isset($data['icon']) ? $data['icon'] : ($hasChild ? 'fa fa-list' : 'fa fa-circle-o');
            $data['pid'] = $pid;
            $data['status'] = 'normal';
            try {
                if (!isset($oldMenu[$data['name']])) {
                    $menu = AuthRule::create($data);
                }else{
                    $menu = $oldMenu[$data['name']];
                }
                if ($hasChild) {
                    self::menuCreateOrUpdate($v['sublist'], $oldMenu, $menu['id']);
                }
            } catch (PDOException $e) {
                throw new Exception($e->getMessage());
            }
        }
    }

}
