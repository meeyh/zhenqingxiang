<?php

namespace addons\shopro\controller;

use addons\shopro\exception\Exception;

class Goods extends Base
{

    protected $noNeedLogin = ['index', 'detail', 'lists', 'activity', 'seckillList', 'grouponList'];
    protected $noNeedRight = ['*'];

    public function index()
    {

        // $sss = new \addons\shopro\listener\activity\Groupon();
        // $groupon = \addons\shopro\model\ActivityGroupon::where('id', 34)->find();
        // $params = ['groupon' => $groupon];
        // $sss->activityGrouponFail($params);


        // $user = \addons\shopro\model\User::where('id', 57)->find();
        // $order = \addons\shopro\model\Order::where('id', 101)->find();
        // \addons\shopro\library\Notify\Notify::send([$user], (new \addons\shopro\notifications\Order(['order' => $order, 'item' => $order->firstItem, 'event' => 'order_sended'])));

        // $user->notify(
        //     (new \addons\shopro\notifications\Refund([
        //         'order' => $order, 
        //         'item' => $order->firstItem, 
        //         'event' => 'refund_agree'
        //     ]))
        // );
        // exit;

    }

    public function detail()
    {
        $id = $this->request->get('id');
        $detail = \addons\shopro\model\Goods::getGoodsDetail($id);
        
        // 记录足记
        \addons\shopro\model\UserView::addView($detail);

        $sku_price = $detail['sku_price'];      // 处理过的规格
        // tp bug json_encode 或者 toArray 的时候 sku_price 会重新查询数据库，导致被处理过的规格又还原回去了
        $detail = json_decode(json_encode($detail), true);
        $detail['sku_price'] = $sku_price;

        $this->success('商品详情', $detail);
    }

    public function lists()
    {
        $params = $this->request->get();
        $data = \addons\shopro\model\Goods::getGoodsList($params);

        $this->success('商品列表', $data);

    }


    // 秒杀列表
    public function seckillList() {
        $params = $this->request->get();

        $this->success('秒杀商品列表', \addons\shopro\model\Goods::getSeckillGoodsList($params));
    }


    // 拼团列表
    public function grouponList() {
        $params = $this->request->get();

        $this->success('拼团商品列表', \addons\shopro\model\Goods::getGrouponGoodsList($params));
    }


    public function activity()
    {
        $activity_id = $this->request->get('activity_id');
        $activity = \addons\shopro\model\Activity::get($activity_id);
        if (!$activity) {
            throw new Exception('活动不存在', -1);
        }
        
        $goods = \addons\shopro\model\Goods::getGoodsList(['goods_ids' => $activity->goods_ids]);
        $activity->goods = $goods;
        
        $this->success('活动列表', $activity);
    }

    public function favorite()
    {
        $params = $this->request->post();
        $result = \addons\shopro\model\UserFavorite::edit($params);
        $this->success($result ? '收藏成功' : '取消收藏', $result);
    }

    public function favoriteList()
    {
        $data = \addons\shopro\model\UserFavorite::getGoodsList();
        $this->success('商品收藏列表', $data);
    }


    public function viewDelete()
    {
        $params = $this->request->post();
        $result = \addons\shopro\model\UserView::del($params);
        $this->success('删除成功', $result);
    }


    public function viewList()
    {
        $data = \addons\shopro\model\UserView::getGoodsList();
        $this->success('商品浏览列表', $data);
    }



}
