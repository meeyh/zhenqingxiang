<?php

namespace app\admin\controller\shopro;

use app\common\controller\Backend;
use app\admin\model\shopro\Category as CategoryModel;
use fast\Tree;

/**
 * 分类管理
 *
 * @icon   fa fa-list
 * @remark 用于统一管理网站的所有分类,分类可进行无限级分类,分类类型请在常规管理->系统配置->字典配置中添加
 */
class Category extends Backend
{
    /**
     * @var \app\admin\model\shopro\Category
     */
    protected $model = null;
    protected $categorylist = [];
    protected $noNeedRight = ['selectpage', 'gettree'];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('app\admin\model\shopro\Category');

        $this->tree = Tree::instance();
        $this->tree->init(collection($this->model->order('weigh desc,id desc')->select())->toArray(), 'pid');
        $this->categorylist = $this->tree->getTreeList($this->tree->getTreeArray(0), 'name');
        $categorydata = [0 => ['type' => 'all', 'name' => __('None')]];
        foreach ($this->categorylist as $k => $v) {
            $categorydata[$v['id']] = $v;
        }
        $typeList = CategoryModel::getTypeList();
        $this->view->assign("flagList", $this->model->getFlagList());
        $this->view->assign("typeList", $typeList);
        $this->view->assign("parentList", $categorydata);
        $this->assignconfig('typeList', $typeList);
    }

    /**
     * 选择商品组
     */
    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }

    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $search = $this->request->request("search");
            $type = $this->request->request("type");

            //构造父类select列表选项数据
            $list = [];

            foreach ($this->categorylist as $k => $v) {
                if ($search) {
                    if ($v['type'] == $type && stripos($v['name'], $search) !== false || stripos($v['nickname'], $search) !== false) {
                        if ($type == "all" || $type == null) {
                            $list = $this->categorylist;
                        } else {
                            $list[] = $v;
                        }
                    }
                } else {
                    if ($type == "all" || $type == null) {
                        $list = $this->categorylist;
                    } elseif ($v['type'] == $type) {
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
     * 编辑
     */
    public function edit($ids = null)
    {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $adminIds = $this->getDataLimitAdminIds();
        if (is_array($adminIds)) {
            if (!in_array($row[$this->dataLimitField], $adminIds)) {
                $this->error(__('You have no permission'));
            }
        }
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($params['pid'] != $row['pid']) {
                    $childrenIds = Tree::instance()->init(collection(\app\common\model\Category::select())->toArray())->getChildrenIds($row['id'], true);
                    if (in_array($params['pid'], $childrenIds)) {
                        $this->error(__('Can not change the parent to child or itself'));
                    }
                }

                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.edit' : $name) : $this->modelValidate;
                        $row->validate($validate);
                    }
                    $result = $row->allowField(true)->save($params);
                    if ($result !== false) {
                        $this->success();
                    } else {
                        $this->error($row->getError());
                    }
                } catch (\think\exception\PDOException $e) {
                    $this->error($e->getMessage());
                } catch (\think\Exception $e) {
                    $this->error($e->getMessage());
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }



    /**
     * 获取树形分类
     */
    public function gettree() {
        $category = $this->tree->getTreeArray(0);

        $this->success('获取成功', null, $category);
    }



    /**
     * 【即将废弃】 Selectpage搜索，老的商品添加选择分类
     *
     * @internal
     */
    public function selectpage()
    {

        $searchValue = $this->request->post("searchValue", "");
        $searchValue = array_filter(explode(',', $searchValue));
        $word = array_filter((array) $this->request->request("q_word/a"));

        $categorylist = [];
        if ($searchValue) {
            // 编辑的时候选中
            foreach ($this->categorylist as $key => $list) {
                if (in_array($list['id'], $searchValue)) {
                    $categorylist[] = $list;
                }
            }
        } else if ($word) {
            // 搜索关键字，关键字为数组
            foreach ($this->categorylist as $key => $list) {
                foreach ($word as $w) {
                    if (strpos($list['name'], $w) !== false) {
                        $categorylist[] = $list;
                    }
                }
            }
        } else {
            $categorylist = $this->categorylist;
        }
        // return parent::selectpage();
        return json(['list' => $categorylist, 'total' => count($categorylist)]);
    }
}
