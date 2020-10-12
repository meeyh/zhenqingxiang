<?php

namespace app\admin\controller\shopro\dispatch;

use app\common\controller\Backend;
use app\admin\model\shopro\Area;
use think\Db;

/**
 * 运费模板
 *
 * @icon fa fa-circle-o
 */
class Express extends Backend
{

    /**
     * Express模型对象
     * @var \app\admin\model\shopro\dispatch\Express
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shopro\dispatch\Express;


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
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
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


            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    /**
     * 添加
     */
    public function add()
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
                        $this->model->validateFailException(true)->validate($validate);
                    }
                    $areaData = $params['area_data'];
                    $areaArray = json_decode($areaData, true);
                    foreach ($areaArray as $area) {
                        if ($area['name'] === 'province') {
                            $params['province_ids'] = implode(',', $area['value']);
                        }
                        if ($area['name'] === 'city') {
                            $params['city_ids'] = implode(',', $area['value']);
                        }
                        if ($area['name'] === 'area') {
                            $params['area_ids'] = implode(',', $area['value']);
                        }
                    }
                    $result = $this->model->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }

        $area = Db::name('shopro_area')->select();
        $pca = [];
        foreach ($area as $k => &$a) {
            $a['flagLeft'] = 1;
            $a['flagRight'] = 0;
            switch ($a['level']) {
                case 1:
                    $pca[$a['id']] = $a;
                    break;

                case 2:
                    $pca[$a['pid']]['city'][$a['id']] = $a;
                    break;
                case 3:
                    $pid = intval(substr($a['id'], 0, 2) . '0000');


                    $pca[$pid]['city'][$a['pid']]['area'][$a['id']] = $a;
            }
        }
        $newPca = array_values($pca);
        foreach ($newPca as $k => &$c) {
            if (!isset($c['city'])) {
                continue;
            }
            $c['city'] = array_values($c['city']);
            foreach ($newPca[$k]['city'] as &$t) {
                if (!isset($t['area'])) {
                    continue;
                }
                $t['area'] = array_values($t['area']);
            }
        }
        $this->assignconfig('pca', $newPca);

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
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.edit' : $name) : $this->modelValidate;
                        $row->validateFailException(true)->validate($validate);
                    }
                    $areaData = $params['area_data'];
                    $areaArray = json_decode($areaData, true);
                    foreach ($areaArray as $area) {
                        if ($area['name'] === 'province') {
                            $params['province_ids'] = implode(',', $area['value']);
                        }
                        if ($area['name'] === 'city') {
                            $params['city_ids'] = implode(',', $area['value']);
                        }
                        if ($area['name'] === 'area') {
                            $params['area_ids'] = implode(',', $area['value']);
                        }
                    }
                    $result = $row->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were updated'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }

        $area = Db::name('shopro_area')->select();
        $pca = [];
        foreach ($area as $k => &$a) {
            $a['flagLeft'] = 1;
            $a['flagRight'] = 0;
            switch ($a['level']) {
                case 1:
                    $pca[$a['id']] = $a;
                    break;

                case 2:
                    $pca[$a['pid']]['city'][$a['id']] = $a;
                    break;
                case 3:
                    $pid = intval(substr($a['id'], 0, 2) . '0000');


                    $pca[$pid]['city'][$a['pid']]['area'][$a['id']] = $a;
            }
        }
        $newPca = array_values($pca);
        foreach ($newPca as $k => &$c) {
            if (in_array($c['id'], explode(',', $row['province_ids']))) {
                $c['flagLeft'] = 0;
                $c['flagRight'] = 1;
            }
            $c['city'] = array_values($c['city']);
            foreach ($newPca[$k]['city'] as &$t) {
                if (in_array($t['id'], explode(',', $row['city_ids']))) {
                    $t['flagLeft'] = 0;
                    $t['flagRight'] = 1;
                    $c['flagRight'] = 1;
                }
                if ($c['flagRight'] === 1) {
                    $t['flagLeft'] = 0;
                    $t['flagRight'] = 1;
                }
                $t['area'] = array_values($t['area']);
                foreach ($t['area'] as &$a) {
                    if (in_array($a['id'], explode(',', $row['area_ids']))) {
                        $a['flagLeft'] = 0;
                        $a['flagRight'] = 1;
                        $t['flagRight'] = 1;
                        $c['flagRight'] = 1;
                    }
                    if ($t['flagRight'] === 1) {
                        $a['flagLeft'] = 0;
                        $a['flagRight'] = 1;
                    }
                }
            }
        }
        $this->assignconfig('pca', $newPca);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

   
}
