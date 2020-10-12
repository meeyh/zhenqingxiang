<?php

namespace addons\shopro\controller;

use addons\shopro\model\Category as CategoryModel;
use addons\shopro\model\Goods;

/**
 * 分类管理
 *
 * @icon   fa fa-list
 * @remark 用于统一管理网站的所有分类,分类可进行无限级分类,分类类型请在常规管理->系统配置->字典配置中添加
 */

class Category extends Base
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    public function index()
    {
        $data = CategoryModel::getCategoryList();
        $this->success('商城分类', $data);

    }


    public function goods() {
        $params = $this->request->get();

        $categories = CategoryModel::where('pid', 0)->select();

        foreach($categories as $key => $category) {
            $goods = Goods::getGoodsList(array_merge($params, ['category_id' => $category['id']]), false);

            $categories[$key]['goods'] = $goods;
        }

        $this->success('商城分类商品', $categories);
    }
}
