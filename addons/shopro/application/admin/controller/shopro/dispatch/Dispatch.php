<?php

namespace app\admin\controller\shopro\dispatch;

use app\common\controller\Backend;

/**
 * 发货设置
 *
 * @icon fa fa-circle-o
 */
class Dispatch extends Backend
{
    protected $noNeedRight = ['typeList','all'];
    /**
     * Dispatch模型对象
     * @var \app\admin\model\shopro\dispatch\Dispatch
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shopro\dispatch\Dispatch;
        $this->view->assign("typeList", $this->model->getTypeList());
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
        //当前是否为关联查询
        $this->relationSearch = false;
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['id','name','type','type_ids','createtime','updatetime']);
                
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }


    /**
     * 获取发货类型
     */
    public function typeList()
    {
        $typeList = $this->model->getTypeList();

        $this->success('获取成功', null, $typeList);
    }

    /**
     * 获取所有发货模板
     */
    public function all() {
        if ($this->request->isAjax()) {
            $type = $this->request->get('type', 'all');

            $sort = $this->request->get("sort", !empty($this->model) && $this->model->getPk() ? $this->model->getPk() : 'id');
            $order = $this->request->get("order", "DESC");
            
            $dispatch = $this->model;
            if ($type != 'all') {
                $dispatch = $dispatch->where('type', 'in', explode(',', $type));
            }

            $dispatch = $dispatch->order($sort, $order)->select();

            $newDispatch = [];
            foreach ($dispatch as $val) {
                $newDispatch[$val['type']]['name'] = $val['type_text'];
                $newDispatch[$val['type']]['options'][] = $val;
            }

            return $this->success('操作成功', null, array_values($newDispatch));
        }
    }
}
