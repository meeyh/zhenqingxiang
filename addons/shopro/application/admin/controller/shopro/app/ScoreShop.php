<?php

namespace app\admin\controller\shopro\app;

use app\common\controller\Backend;
use think\Db;

/**
 * 积分商品
 *
 * @icon fa fa-circle-o
 */
class ScoreShop extends Backend
{

    /**
     * Goods模型对象
     * @var \app\admin\model\shopro\Goods
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shopro\Goods;
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
        $scoreGoodsIds = array_column(\app\admin\model\shopro\app\ScoreSkuPrice::group('goods_id')->field('goods_id')->select(), 'goods_id');
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->where(['id' => ['in', $scoreGoodsIds]])
                ->where($where)
                ->order($sort, $order)
                ->count();

            $list = $this->model
                ->where(['id' => ['in', $scoreGoodsIds]])
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();

            foreach ($list as $row) {
                $row->visible(['id', 'title', 'status', 'weigh', 'image']);

            }
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
                    $result = $this->createOrUpdateSku($params['goodsList']);

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
        return $this->view->fetch();
    }

    /**
     * 删除
     */
    public function del($ids = "")
    {
        if ($ids) {
            $pk = $this->model->getPk();
            $adminIds = $this->getDataLimitAdminIds();
            if (is_array($adminIds)) {
                $this->model->where($this->dataLimitField, 'in', $adminIds);
            }
            $score = new \app\admin\model\shopro\app\ScoreSkuPrice;
            $list = $score->where('goods_id', 'in', $ids)->select();

            $count = 0;
            Db::startTrans();
            try {
                foreach ($list as $k => $v) {
                    $count += $v->delete();
                }
                Db::commit();
            } catch (PDOException $e) {
                Db::rollback();
                $this->error($e->getMessage());
            } catch (Exception $e) {
                Db::rollback();
                $this->error($e->getMessage());
            }
            if ($count) {
                $this->success();
            } else {
                $this->error(__('No rows were deleted'));
            }
        }
        $this->error(__('Parameter %s can not be empty', 'ids'));
    }


    /**
     * 编辑
     */
    public function edit($ids = null)
    {
        //编辑
        $row = \app\admin\model\shopro\Goods::field('id,title,image')->where('id', $ids)->find();
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $goodsList = [];
        foreach ([$row->id] as $k => $g) {
            $goods[$k] = \app\admin\model\shopro\Goods::field('id,title,image')->where('id', $g)->find();
            $goods[$k]['actSkuPrice'] = json_encode(\app\admin\model\shopro\app\ScoreSkuPrice::all(['goods_id' => $g,'deletetime' => null]));

            $goods[$k]['opt'] = 1;
            $goodsList[] = $goods[$k];
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


                    $result = $this->createOrUpdateSku($params['goodsList']);
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
        $this->assignconfig("goodsList", $goodsList);
        $this->assignconfig('id', $ids);
        return $this->view->fetch();
    }

    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }

    public function createOrUpdateSku($goodsList)
    {
        $goodsList = json_decode($goodsList, true);
        $list = [];
        foreach ($goodsList as $k => $g) {
            $actSkuPrice[$k] = json_decode($g['actSkuPrice'], true);
//            halt($actSkuPrice[$k]);
            if (!$actSkuPrice[$k]) {
                $this->error('请完善完整规格');
            }
            \app\admin\model\shopro\app\ScoreSkuPrice::where(['goods_id' => $g['id']])->update(['status' => 'down']);


            foreach ($actSkuPrice[$k] as $a => $c) {
                if ($c['id'] == 0) {
                    unset($c['id']);
                }
                unset($c['sales']);  //不更新销量
                $c['goods_id'] = $g['id'];
                $list[] = $c;
            }
        }
        $score = new \app\admin\model\shopro\app\ScoreSkuPrice;
        $score->allowField(true)->saveAll($list);
    }

    public function sku($goods_id,$id =1)
    {
        if ($id == 0) {
            $scoreGoods = \app\admin\model\shopro\app\ScoreSkuPrice::where([
                'goods_id' => $goods_id,
                'status' => 'up',
                'deletetime' => null,
            ])->find();
            if ($scoreGoods) {
                $this->error('该商品已参与积分换购');
            }
        }

        $skuList = \app\admin\model\shopro\GoodsSku::all(['pid' => 0, 'goods_id' => $goods_id]);
        if ($skuList) {
            foreach ($skuList as &$s) {
                $s->children = \app\admin\model\shopro\GoodsSku::all(['pid' => $s->id, 'goods_id' => $goods_id]);
            }
        }
        $skuPrice = \app\admin\model\shopro\GoodsSkuPrice::all(['goods_id' => $goods_id]);


        //编辑
        foreach ($skuPrice as $k => &$p) {
            $actSkuPrice[$k] = \app\admin\model\shopro\app\ScoreSkuPrice::get(['sku_price_id' => $p['id']]);

            if (!$actSkuPrice[$k]) {

                $actSkuPrice[$k]['id'] = 0;
                $actSkuPrice[$k]['status'] = 'down';
                $actSkuPrice[$k]['price'] = '';
                $actSkuPrice[$k]['score'] = '';
                $actSkuPrice[$k]['stock'] = '';
                $actSkuPrice[$k]['sales'] = '0';
                $actSkuPrice[$k]['sku_price_id'] = $p['id'];

            }
        }

        $this->assignconfig('skuList', $skuList);

        $this->assignconfig('skuPrice', $skuPrice);
        $this->assignconfig('actSkuPrice', $actSkuPrice);

        return $this->view->fetch();

    }
}
