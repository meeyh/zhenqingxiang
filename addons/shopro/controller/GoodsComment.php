<?php

namespace addons\shopro\controller;


class GoodsComment extends Base
{

    protected $noNeedLogin = ['index', 'type'];
    protected $noNeedRight = ['*'];


    public function index()
    {
        $params = $this->request->get();
        
        $goodsComments = \addons\shopro\model\GoodsComment::getList($params);
        
        $this->success('评价详情', $goodsComments);
    }


    public function type() {
        $this->success('筛选类型', array_values(\addons\shopro\model\GoodsComment::$typeAll));
    }
}
