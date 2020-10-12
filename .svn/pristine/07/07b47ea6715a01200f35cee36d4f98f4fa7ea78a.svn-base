<?php

namespace app\admin\controller\shopro;

use app\common\controller\Backend;

/**
 * 微信管理
 *
 * @icon fa fa-circle-o
 */
class Wechat extends Backend
{

    /**
     * Wechat模型对象
     * @var \app\admin\model\shopro\Wechat
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shopro\Wechat;

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

            foreach ($list as $row) {
                $row->visible(['id', 'type', 'name', 'content', 'createtime', 'updatetime']);

            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    public function menu($id = 0, $act = '')
    {
        //预留后期多菜单管理
        if ($id == 0) {
            $wechatMenu = $this->model->where('type', 'menu')->select();
        } else {
            $wechatMenu = $this->model->get($id);
        }
        if ($this->request->isAjax()) {
            //菜单详情
            if ($act === '') {
                $this->success($wechatMenu->name, '', $wechatMenu);
            }
            $content = $this->request->post('content');
            //保存菜单
            if ($act === 'save') {
                $wechatMenu->content = $content;
                $wechatMenu->save();
                $this->success('保存成功', '', $wechatMenu);
            }
            //保存并发布菜单
            if ($act === 'publish') {
                $wechatMenu->content = $content;
                $wechatMenu->save();
                $wechat = new \addons\shopro\library\Wechat('wxOfficialAccount');
                try {
                    $res = $wechat->menu('create', json_decode($content, true));
                } catch (\Exception $e) {  //如书写为（Exception $e）将无效
                    if (strpos($e->getMessage(), 'ip')) {
                        $this->error('请将当前IP地址加入公众号后台IP白名单');

                    }
                }

                if ($res['errcode'] !== 0) {
                    $this->error('格式不正确');
                }
                $this->success('发布成功', '', $wechatMenu);
            }
        }
        $shopro = json_decode(\app\admin\model\shopro\Config::get(['name' => 'shopro'])->value, true);
        $wxMiniProgram = json_decode(\app\admin\model\shopro\Config::get(['name' => 'wxMiniProgram'])->value, true);
        $this->assignconfig('shopro', $shopro);
        $this->assignconfig('wxMiniProgram', $wxMiniProgram);
        return $this->view->fetch();
    }

    //粉丝管理
    public function fans()
    {
        $params = $this->request->param();
        extract($params);
        $wechatFans = new \app\admin\model\shopro\WechatFans;

        if ($this->request->isAjax()) {
            if (!class_exists(\think\Queue::class)) {
                $this->error('请安装 topthink/think-queue:v1.1.6 队列扩展');
            }
            //同步粉丝使用异步方法
            if (isset($act) && $act == 'async') {
                //批量更新粉色关注状态为未关注
                $wechatFans->where('subscribe', 1)->update(['subscribe' => 0]);
                $wechat = new \addons\shopro\library\Wechat('wxOfficialAccount');
                try {
                    $res = $wechat->asyncFans();
                } catch (\Exception $e) {  //如书写为（Exception $e）将无效
                    if (strpos($e->getMessage(), 'ip')) {
                        $this->error('请将当前IP地址加入公众号后台IP白名单');
                    }
                }
                $this->success($res['msg']);
            } else {
                $fansData = $wechatFans->where('id|nickname|country|province|city', 'like', "%$searchKey%")->page($page)->paginate($limit);
                $this->success('粉丝数据', '', $fansData);
            }
        }

        return $this->view->fetch();
    }

    public function fans_user()
    {
        $get = $this->request->get();
        $user = \think\Db::name('shopro_user_oauth')->where([
            'platform' => 'wxOfficialAccount',
            'openid' => $get['openid'],
        ])->find();
        if ($user) {
            $user_id = $user['user_id'];
            $this->redirect('user/user/index?id=' . $user_id);
        } else {
            $this->error('未找到用户');
        }
    }

}
