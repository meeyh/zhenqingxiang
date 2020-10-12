<?php

namespace app\admin\controller\shopro;

use app\common\controller\Backend;
use think\Db;

/**
 * 商品
 *
 * @icon fa fa-circle-o
 */
class Goods extends Backend
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
        $this->view->assign("typeList", $this->model->getTypeList());
        $this->view->assign("statusList", $this->model->getStatusList());
        $this->view->assign("dispatchTypeList", $this->model->getDispatchTypeList());
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
            // list($where, $sort, $order, $offset, $limit) = $this->buildparams('title');
            $sort = $this->request->get("sort", !empty($this->model) && $this->model->getPk() ? $this->model->getPk() : 'id');
            $sort = $sort == 'price' ? 'convert(`price`, DECIMAL)' : $sort;
            $order = $this->request->get("order", "DESC");
            $offset = $this->request->get("offset", 0);
            $limit = $this->request->get("limit", 0);

            $total = $this->buildSearchOrder()
                ->count();

            $subsql = \app\admin\model\shopro\GoodsSkuPrice::where('status', 'up')->field('sum(stock) as stock, goods_id')->group('goods_id')->buildSql();
            $goodsTableName = $this->model->getQuery()->getTable();

            $list = $this->buildSearchOrder()
                ->join([$subsql => 'w'], $goodsTableName . '.id = w.goods_id', 'left')
                ->orderRaw($sort . ' ' . $order)
                ->limit($offset, $limit)
                ->select();

            foreach ($list as $row) {
                $row->visible(['id', 'type', 'title', 'status', 'weigh', 'category_ids', 'image', 'price', 'likes', 'views', 'sales', 'stock', 'show_sales', 'dispatch_type', 'updatetime']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            if ($this->request->get("page_type") == 'select') {
                return json($result);
            }

            return $this->success('操作成功', null, $result);
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
            $sku = $this->request->post("sku/a");

            if ($params) {
                $params = $this->preExcludeFields($params);

                if (!$params['is_sku']) {
                    // 单规格，price 必须是数字
                    if (!preg_match('/^[0-9]+(.[0-9]{1,8})?$/', $params['price'])) {
                        $this->error("请填写正确的价格");
                    }
                }
                
                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                $result = false;
                Db::startTrans();
                try {
                    $result = $this->model->validate('\app\admin\validate\shopro\Goods.add')->allowField(true)->save($params);
                    if (!$result) {
                        $this->error($this->model->getError());
                    }
                    $this->editSku($this->model, $sku, 'add');


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
                    $this->success("添加成功");
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        return $this->view->fetch();
    }



    /**
     * 查看详情
     */
    public function detail($ids = null) {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $row->append(['category_ids_arr', 'params_arr']);

        $result = [];

        if ($row['is_sku']) {
            $skuList = \app\admin\model\shopro\GoodsSku::all(['pid' => 0, 'goods_id' => $ids]);
            if ($skuList) {
                foreach ($skuList as &$s) {
                    $s->children = \app\admin\model\shopro\GoodsSku::all(['pid' => $s->id, 'goods_id' => $ids]);
                }
            }
            $result['skuList'] = $skuList;
    
            $skuPrice = \app\admin\model\shopro\GoodsSkuPrice::all(['goods_id' => $ids]);
            $result['skuPrice'] = $skuPrice;
        } else {
            // 将单规格的部分数据直接放到 row 上
            $goodsSkuPrice = \app\admin\model\shopro\GoodsSkuPrice::where('goods_id', $ids)->order('id', 'asc')->find();

            $row['stock'] = $goodsSkuPrice['stock'] ?? 0;
            $row['sn'] = $goodsSkuPrice['sn'] ?? "";
            $row['weight'] = $goodsSkuPrice['weight'] ?? 0;

            $result['skuList'] = [];
            $result['skuPrice'] = [];
        }
        $result['detail'] = $row;

        return $this->success('获取成功', null, $result);
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
        $row->updatetime = time();

        $adminIds = $this->getDataLimitAdminIds();
        if (is_array($adminIds)) {
            if (!in_array($row[$this->dataLimitField], $adminIds)) {
                $this->error(__('You have no permission'));
            }
        }
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            $sku = $this->request->post("sku/a");

            if ($params) {
                $this->excludeFields = ['is_sku'];
                $params = $this->preExcludeFields($params);
                $result = false;
                Db::startTrans();
                try {
                    $result = $row->validate('\app\admin\validate\shopro\Goods.edit')->allowField(true)->save($params);
                    if (!$result) {
                        $this->error($row->getError());
                    } else {
                        $this->editSku($row, $sku, 'edit');
                        Db::commit();
                    }
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
                    $this->success("编辑成功");
                } else {
                    $this->error(__('No rows were updated'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $this->view->assign("row", $row);
        $skuList = \app\admin\model\shopro\GoodsSku::all(['pid' => 0, 'goods_id' => $ids]);
        if ($skuList) {
            foreach ($skuList as &$s) {
                $s->children = \app\admin\model\shopro\GoodsSku::all(['pid' => $s->id, 'goods_id' => $ids]);
            }
        }
        $this->assignconfig('skuList', $skuList);
        $skuPrice = \app\admin\model\shopro\GoodsSkuPrice::all(['goods_id' => $ids]);
        $this->assignconfig('skuPrice', $skuPrice);
        return $this->view->fetch();
    }

    public function select()
    {
        return $this->view->fetch();
    }


    public function setStatus($ids, $status) {
        if ($ids) {
            $pk = $this->model->getPk();
            $adminIds = $this->getDataLimitAdminIds();
            if (is_array($adminIds)) {
                $this->model->where($this->dataLimitField, 'in', $adminIds);
            }
            $list = $this->model->where($pk, 'in', $ids)->select();

            $count = 0;
            Db::startTrans();
            try {
                foreach ($list as $k => $v) {
                    $v->status = $status;
                    $count += $v->save();
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
                $this->error(__('No rows were updated'));
            }
        }
        $this->error(__('Parameter %s can not be empty', 'ids'));
    }


    protected function editSku($goods, $sku, $type = 'add')
    {
        if ($goods['is_sku']) {
            // 多规格
            $this->editMultSku($goods, $sku, $type);
        } else {
            $this->editSimSku($goods, $sku, $type);
        }

    }


    /**
     * 添加编辑单规格
     */
    protected function editSimSku($goods, $sku, $type = 'add') {
        $params = $this->request->post("row/a");

        $data = [
            "goods_id" => $goods['id'],
            "stock" => $params['stock'] ?? 0,
            "sn" => $params['sn'] ?? "",
            "weight" => $params['weight'] ?? 0,
            "price" => $params['price'] ?? 0,
            "status" => 'up'
        ];

        if ($type == 'add') {
            $goodsSkuPrice = new \app\admin\model\shopro\GoodsSkuPrice();
        } else {
            // 查询
            $goodsSkuPrice = \app\admin\model\shopro\GoodsSkuPrice::where('goods_id', $goods['id'])->order('id', 'asc')->find();
            if (!$goodsSkuPrice) {
                $goodsSkuPrice = new \app\admin\model\shopro\GoodsSkuPrice();
            }
        }

        $goodsSkuPrice->save($data);
    }


    /**
     * 添加编辑多规格
     */
    protected function editMultSku($goods, $sku, $type = 'add') {
        $skuList = json_decode($sku['listData'], true);
        $skuPrice = json_decode($sku['priceData'], true);
        if (count($skuList) < 1) {
            $this->error('请填写规格列表');
        }
        foreach ($skuList as $key => $sku) {
            if (count($sku['children']) <= 0) {
                $this->error('主规格至少要有一个子规格');
            }
        }

        if (count($skuPrice) < 1) {
            $this->error('请填写规格价格');
        }


        foreach ($skuPrice as &$price) {
            if (empty($price['price']) || $price['price'] == 0) {
                $this->error('请填写规格价格');
            }
            if ($price['stock'] === '') {
                $this->error('请填写规格库存');
            }
            if (empty($price['weight'])) {
                $price['weight'] = 0;
            }
        }

        // 编辑保存规格项
        $allChildrenSku = $this->saveSkuList($goods, $skuList, $type);

        if ($type == 'add') {
            // 创建新产品，添加规格列表和规格价格
            foreach ($skuPrice as $s3 => &$k3) {
                $k3['goods_sku_ids'] = $this->checkRealIds($k3['goods_sku_temp_ids'], $allChildrenSku);
                $k3['goods_id'] = $goods->id;
                $k3['goods_sku_text'] = implode(',', $k3['goods_sku_text']);
                $k3['weight'] = intval($k3['weight']);
                $k3['createtime'] = time();
                $k3['updatetime'] = time();

                unset($k3['id']);
                unset($k3['temp_id']);      // 前端临时 id
                unset($k3['goods_sku_temp_ids']);       // 前端临时规格 id,查找真实 id 用
            }
            $res = \app\admin\model\shopro\GoodsSkuPrice::insertAll($skuPrice);


        } else {
            // 编辑旧商品，先删除老的不用的 skuPrice
            $oldSkuPriceIds = array_column($skuPrice, 'id');
            // 删除当前商品老的除了在基础上修改的skuPrice
            \app\admin\model\shopro\GoodsSkuPrice::where('goods_id', $goods->id)
                            ->where('id', 'not in', $oldSkuPriceIds)->delete();

            foreach ($skuPrice as $s3 => &$k3) {
                $data['goods_sku_ids'] = $this->checkRealIds($k3['goods_sku_temp_ids'], $allChildrenSku);
                $data['goods_id'] = $goods->id;
                $data['goods_sku_text'] = implode(',', $k3['goods_sku_text']);
                $data['weigh'] = $k3['weigh'];
                $data['image'] = $k3['image'];
                $data['stock'] = $k3['stock'];
                $data['sn'] = $k3['sn'];
                $data['weight'] = intval($k3['weight']);
                $data['price'] = $k3['price'];
                $data['status'] = $k3['status'];
                $data['createtime'] = time();
                $data['updatetime'] = time();

                if ($k3['id']) {
                    // 编辑
                    \app\admin\model\shopro\GoodsSkuPrice::where('id', $k3['id'])->update($data);

                } else {
                    // 新增数据
                    \app\admin\model\shopro\GoodsSkuPrice::insert($data);
                }
            }
        }
    }


    // 根据前端临时 temp_id 获取真实的数据库 id
    private function checkRealIds($newGoodsSkuIds, $allChildrenSku)
    {
        $newIdsArray = [];
        foreach ($newGoodsSkuIds as $id) {
            $newIdsArray[] = $allChildrenSku[$id];
        }
        return implode(',', $newIdsArray);

    }


    // 差异更新 规格规格项（多的删除，少的添加）
    private function saveSkuList($goods, $skuList, $type = 'add') {
        $allChildrenSku = [];

        if ($type == 'edit') {
            // 删除无用老规格
            // 拿出需要更新的老规格
            $oldSkuIds = [];
            foreach ($skuList as $key => $sku) {
                $oldSkuIds[] = $sku['id'];

                $childSkuIds = [];
                if ($sku['children']) {
                    // 子项 id
                    $childSkuIds = array_column($sku['children'], 'id');
                }

                $oldSkuIds = array_merge($oldSkuIds, $childSkuIds);
                $oldSkuIds = array_unique($oldSkuIds);
            }

            // 删除老的除了在基础上修改的规格项
            \app\admin\model\shopro\GoodsSku::where('goods_id', $goods->id)->where('id', 'not in', $oldSkuIds)->delete();
        }

        foreach ($skuList as $s1 => &$k1) {
            //添加主规格
            if ($k1['id']) {
                // 编辑
                \app\admin\model\shopro\GoodsSku::where('id', $k1['id'])->update([
                    'name' => $k1['name'],
                ]);

                $skuId[$s1] = $k1['id'];
            } else {
                // 新增
                $skuId[$s1] = \app\admin\model\shopro\GoodsSku::insertGetId([
                    'name' => $k1['name'],
                    'pid' => 0,
                    'goods_id' => $goods->id
                ]);
            }
            $k1['id'] = $skuId[$s1];
            foreach ($k1['children'] as $s2 => &$k2) {
                if ($k2['id']) {
                    // 编辑
                    \app\admin\model\shopro\GoodsSku::where('id', $k2['id'])->update([
                        'name' => $k2['name'],
                    ]);

                    $skuChildrenId[$s1][$s2] = $k2['id'];
                } else {
                    $skuChildrenId[$s1][$s2] = \app\admin\model\shopro\GoodsSku::insertGetId([
                        'name' => $k2['name'],
                        'pid' => $k1['id'],
                        'goods_id' => $goods->id
                    ]);
                }
                
                $allChildrenSku[$k2['temp_id']] = $skuChildrenId[$s1][$s2];
                $k2['id'] = $skuChildrenId[$s1][$s2];
                $k2['pid'] = $k1['id'];
            }
        }

        return $allChildrenSku;
    }



    // 构建查询条件
    private function buildSearchOrder()
    {
        $search = $this->request->get("search", '');        // 关键字
        $status = $this->request->get("status", 'all');

        $name = $this->model->getTable();
        $tableName = $name . '.';

        $goods = $this->model;

        if ($search) {
            // 模糊搜索字段
            $searcharr = ['title'];
            foreach ($searcharr as $k => &$v) {
                $v = stripos($v, ".") === false ? $tableName . $v : $v;
            }
            unset($v);
            $goods = $goods->where(function ($query) use ($searcharr, $search, $tableName) {
                $query->where(implode("|", $searcharr), "LIKE", "%{$search}%");
            });
        }

        // 商品状态
        if ($status != 'all') {
            $goods = $goods->where('status', $status);
        }

        return $goods;
    }
}
