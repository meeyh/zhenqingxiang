<?php

namespace app\admin\controller\shopro;

use app\common\controller\Backend;
use app\admin\model\shopro\Link as LinkModel;

/**
 * 页面链接
 *
 * @icon fa fa-circle-o
 */
class Link extends Backend
{
    
    /**
     * Link模型对象
     * @var \app\admin\model\shopro\Link
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shopro\Link;
        $groupList = LinkModel::getGroupList();
        $this->linklist = collection($this->model->select())->toArray();
        $this->view->assign("groupList", $groupList);

        $this->assignconfig('groupList', $groupList);


    }
    
    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */
    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $search = $this->request->request("search");
            $group = $this->request->request("group");

            //构造父类select列表选项数据
            $list = [];

            foreach ($this->linklist as $k => $v) {
                if ($search) {
                    if ($v['group'] == $group && stripos($v['name'], $search) !== false || stripos($v['name'], $search) !== false) {
                        if ($group == "all" || $group == null) {
                            $list = $this->linklist;
                        } else {
                            $list[] = $v;
                        }
                    }
                } else {
                    if ($group == "all" || $group == null) {
                        $list = $this->linklist;
                    } elseif ($v['group'] == $group) {
                        $list[] = $v;
                    }
                }
            }

            $total = count($list);
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }
    /**
     * 选择链接
     */
    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }

}
