<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:91:"D:\wwwroot\zhenqingxiang.com\public/../application/admin\view\shopro\order\order\index.html";i:1602492255;s:71:"D:\wwwroot\zhenqingxiang.com\application\admin\view\layout\default.html";i:1602492256;s:68:"D:\wwwroot\zhenqingxiang.com\application\admin\view\common\meta.html";i:1602492255;s:70:"D:\wwwroot\zhenqingxiang.com\application\admin\view\common\script.html";i:1602492255;}*/ ?>
<!DOCTYPE html>
<html lang="<?php echo $config['language']; ?>">
    <head>
        <meta charset="utf-8">
<title><?php echo (isset($title) && ($title !== '')?$title:''); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit">

<link rel="shortcut icon" href="/assets/img/favicon.ico" />
<!-- Loading Bootstrap -->
<link href="/assets/css/backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.css?v=<?php echo \think\Config::get('site.version'); ?>" rel="stylesheet">

<!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
<!--[if lt IE 9]>
  <script src="/assets/js/html5shiv.js"></script>
  <script src="/assets/js/respond.min.js"></script>
<![endif]-->
<script type="text/javascript">
    var require = {
        config:  <?php echo json_encode($config); ?>
    };
</script>
    </head>

    <body class="inside-header inside-aside <?php echo defined('IS_DIALOG') && IS_DIALOG ? 'is-dialog' : ''; ?>">
        <div id="main" role="main">
            <div class="tab-content tab-addtabs">
                <div id="content">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <section class="content-header hide">
                                <h1>
                                    <?php echo __('Dashboard'); ?>
                                    <small><?php echo __('Control panel'); ?></small>
                                </h1>
                            </section>
                            <?php if(!IS_DIALOG && !\think\Config::get('fastadmin.multiplenav')): ?>
                            <!-- RIBBON -->
                            <div id="ribbon">
                                <ol class="breadcrumb pull-left">
                                    <li><a href="dashboard" class="addtabsit"><i class="fa fa-dashboard"></i> <?php echo __('Dashboard'); ?></a></li>
                                </ol>
                                <ol class="breadcrumb pull-right">
                                    <?php foreach($breadcrumb as $vo): ?>
                                    <li><a href="javascript:;" data-url="<?php echo $vo['url']; ?>"><?php echo $vo['title']; ?></a></li>
                                    <?php endforeach; ?>
                                </ol>
                            </div>
                            <!-- END RIBBON -->
                            <?php endif; ?>
                            <div class="content">
                                <link rel="stylesheet" href="/assets/addons/shopro/libs/element/element.css">
<style>
    body {
        font-family: Source Han Sans SC;
        font-size: 12px;
        font-weight: 500;

    }

    .font-size-14 {
        font-size: 14px;
    }

    .font-size-12 {
        font-size: 12px;
    }

    .background-white {
        background: #fff;
    }

    .background-7536D0 {
        background: #7536D0;
    }

    .color-666 {
        color: #666;
    }

    .color-444 {
        color: #444;
    }

    .color-999 {
        color: #999;
    }

    .color-active {
        color: #7536D0;
    }

    .color-active-1 {
        color: #FFB333;
    }

    .margin-left-10 {
        margin-left: 10px;
    }

    .margin-right-20 {
        margin-right: 20px;
    }

    .display-flex {
        display: flex;
        align-items: center;
    }

    .display-flex-column {
        flex-direction: column;
    }

    .common-btn {
        width: 80px;
        line-height: 28px;
        height: 30px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        color: #666;
        text-align: center;
        cursor: pointer;
    }

    .common-btn-active {
        color: #fff;
        background: #7536D0;
        border: 1px solid #7536D0;
    }

    .border-right {
        border-right: 1px solid #E6E6E6;

    }

    .border-bottom {
        border-bottom: 1px solid #E6E6E6;

    }

    .cursor-pointer {
        cursor: pointer;
    }

    /* 选择 */
    .screen {
        border-radius: 6px;
        padding: 10px 20px;
        margin-bottom: 6px;
    }

    .screen-title {
        justify-content: space-between;
        width: 100%;
    }

    .screen-con-item {
        height: 50px;
    }

    .screen-con-hide {
        display: none;

    }

    .order-time {
        padding: 0 6px;
        line-height: 30px;
        height: 30px;
        border: 1px solid #DCDFE6;
        border-radius: 4px 0px 0px 4px;
        border-right: none;
    }

    .select-btn {
        background: #7536D0;
        color: #fff;
    }

    .order-table-radio {
        margin-bottom: 15px;
    }

    .order-refresh {
        width: 32px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(153, 153, 153, 1);
        border-radius: 4px;
        margin-right: 30px;
        position: relative;
        top: -3px;
    }

    .order-refresh i {
        /* animation-name:go; */
        animation-duration:2s;
        animation-iteration-count: infinite
    }
    .order-refresh .focusi {
        animation-name:go;

    }

    @keyframes go{
    0% {
    transform: rotateZ(0);
    }
    100% {transform: rotateZ(360deg); }
}

    /* table */
    .order-table {
        padding: 30px 10px 0 10px;

    }

    .item-box {
        margin-bottom: 8px;
        color: #444;
    }

    .item-box-item {
        height: 80px;
        width: 104px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item-box-item-1 {
        width: 653px;
        border-left: 1px solid #E6E6E6;
    }

    .item-box-item-1-box {
        height: 80px;
        border-bottom: 1px solid #E6E6E6;
        padding: 16px 14px 14px;
    }

    .item-box-item-more-margin {
        margin-bottom: 4px;
    }

    .item-box-item-name {
        flex-direction: column;
    }

    .item-box-item-name .el-button {
        padding: 0;
        color: #444;
    }

    .item-box-item-name .popover-item {
        margin-bottom: 13px;
    }

    .popover-item-1 {
        height: 30px;
    }

    .item-box-item-detail {
        flex: 1;
        min-width: 80px;
        text-align: center;
    }

    .table-img {
        width: 50px;
        height: 50px;
        margin-right: 14px;
    }

    .goods-title {
        width: 526px;
    }

    .goods-title-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


    .el-collapse-item__header {
        border: none;
    }

    .el-date-editor--daterange.el-input__inner {
        width: 260px
    }

    .el-date-editor .el-range-input {
        width: 45%;
    }

    .screen .el-input__inner {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 0px 4px 4px 0px;
    }

    .el-range-editor.el-input__inner {
        padding: 0 10px;
    }

    .el-date-editor .el-range__icon,
    .el-icon-search {
        line-height: 28px;
    }

    .el-date-editor .el-range-separator {
        line-height: 28px;
        width: 10%;
    }

    .el-collapse-item__content {
        padding-bottom: 0;
    }

    .el-radio-button__inner:hover {
        color: #666;
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 0;
    }

    .el-table__fixed-right {
        height: 161px;
    }

    .order-table .el-table__header-wrapper {
        border: 1px solid #E6E6E6;
    }

    tr {
        margin-bottom: 8px;
    }

    .order-table .el-table__row {
        background: #F9F9F9 !important;
        height: 30px !important;
    }

    .order-table .el-table--enable-row-hover .el-table__body tr:hover>td {
        background: none;
    }

    .order-table .el-table td {
        padding: 0;
        border-top: 1px solid #E6E6E6;

    }

    .el-table_1_column_1 {
        border-left: 1px solid #E6E6E6;

    }

    .el-table::before {
        height: 0;
    }

    .el-table_1_column_2 .cell {
        text-align: left;
        padding: 0;
    }

    .el-table__fixed-right::before,
    .el-table__fixed::before {

        height: 0;

    }

    .el-pager li.active,
    .el-pager li:hover {
        color: #7536d0;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #7536d0;
        border-color: #7536d0;
    }

    .el-checkbox__inner:hover {
        border-color: #7536d0;
    }

    .el-table_1_column_11 {
        border-right: 1px solid #E6E6E6;
        border-top: 1px solid #E6E6E6;
        /* width: 0; */

    }

    .cell {
        text-align: center;
    }

    .operation-btn {
        width: 26px;
        height: 26px;
        padding: 0;
    }

    .el-table td,
    .el-table th.is-leaf {
        border-bottom: none;
    }

    .delete-btn {
        width: 90px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #F56C6C;
        border-radius: 4px;
        color: #F56C6C;
        text-align: center;
        float: left;
    }

    .pay-type {
        width: 60px;
        height: 20px;
        background: #4ad78d;
        border-radius: 4px;
        line-height: 20px;
        text-align: center;
        display: block;
        color: #fff
    }

    .see-detail {
        width: 70px;
        height: 30px;
        line-height: 30px;
        background: rgba(243, 239, 251, 1);
        border: 1px solid rgba(117, 62, 205, 1);
        border-radius: 18px;
    }

    .popover-item-left {
        width: 50px;
        display: block;
    }

    /*.order-dialog*/
    .order-dialog .cell {
        font-size: 12px;
        color: #666;
        font-weight: 400;
    }

    .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0px;
    }

    .order-dialog .el-form--inline {
        padding-left: 10px;
    }

    .order-dialog .el-dialog__title,
    .el-table thead,
    .has-gutter,
    .order-dialog .el-table,
    .el-form-item__label {
        color: #666;
        font-weight: 400;

    }

    .order-dialog .el-table th {
        background: #F3F3F3;
    }

    .order-dialog .el-table td {
        border-bottom: 1px solid #EBEEF5;
    }

    .order-dialog .el-table_2_column_12 {
        border-left: 1px solid #EBEEF5;
    }

    .order-dialog .el-table_2_column_16 {
        border-right: 1px solid #EBEEF5;

    }

    .order-dialog .el-radio {
        color: #999;
    }

    .el-dialog__footer {
        display: flex;
        justify-content: flex-end;
    }

    .dialog-footer-btn {
        width: 100px;
        height: 36px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 18px;
        color: #999;
        display: flex;
        align-items: center;
        padding: 0;
        justify-content: center;
    }

    .el-button--primary.is-disabled {
        color: #999;
        background: #fff;
        border: 1px solid #999;
    }

    .el-button--primary.is-disabled:hover {
        color: #999;
        background: #fff;
        border: 1px solid #999;
    }

    .el-button--primary:hover,
    .dialog-footer-btn-active:hover {
        background: #753ECD;
        border: none;
        color: #fff;
    }

    .dialog-footer-btn-active {
        background: #753ECD;
        border: none;
        color: #fff;
        cursor: pointer;

    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .skill-item,.groupon-item {
        /* width: 40px; */
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: rgba(254, 147, 135, 1);
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        padding: 0 10px;
    }

    .groupon-item {
        background: #A17BDF;
        cursor: pointer;
    }
    .groupon-item-alone {
        cursor: auto;
    }

    .opt-box .el-table th {
        padding: 5px 0;
    }

    .opt-box .el-dialog__body {
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .opt-box .el-dialog {
        width: 600px;
    }
    .opt-box .el-table td, .opt-box .el-table th.is-leaf{
        border-bottom: 1px solid #e6e6e6;
    }
    .opt-box .el-table--border td, .opt-box .el-table--border th{
        border-right: none;
    }
    .el-dialog__header{
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .el-dialog__body .el-table th {
    padding: 5px 0;
    }
    .el-dialog{
        border-radius: 10px;
    }

    .el-radio-button__inner{
        font-size: 12px;
        padding: 9px 20px;;
    }
    .el-input__inner{
        font-size: 12px;
        height: 32px;
        line-height: 32px;
    }
    .el-input__icon{
        line-height: 32px;
    }
    .margin-right-5{
        margin-right: 5px;
    }
    .el-dialog__title{
        font-size: 14px;
    }
    .el-dialog .el-input__inner{
        height: 34px;
        line-height: 34px;
        font-size: 13px;
    }
    .el-form-item__label,.el-radio__label,.el-form-item__content,.el-select-dropdown__item,.el-table,.el-dialog__body{
        font-size: 13px;
    }
    .el-form-item{
        margin-bottom: 10px;
    }

    [v-cloak] {
        display: none
    }
</style>
<script src="/assets/addons/shopro/libs/vue.js"></script>
<script src="/assets/addons/shopro/libs/element/element.js"></script>
<script src="/assets/addons/shopro/libs/moment.js"></script>
<div id="order-con" v-cloak>
    <div class="screen background-white">
        <div class="display-flex screen-title">
            <div class="display-flex">
                <div class="color-666" style="width: 58px;">筛选条件</div>
                <el-switch class="margin-left-10 margin-right-20" v-model="screenType" active-color="#7536D0"
                    inactive-color="#E9EBEF" @change="changeSwitch">
                </el-switch>
                <div class="display-flex margin-right-20">
                    <div class="color-666 order-time">下单时间</div>
                    <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="common-btn cursor-pointer" @click="goExport">订单导出</div>
            </div>
            <div style="width: 236px;">
                <el-input placeholder="请输入关键字" suffix-icon="el-icon-search" v-model="searchKey">
                </el-input>
            </div>
        </div>
        <div class="screen-con" v-if="screenType">
            <div class="screen-con-item display-flex">
                <div class="color-666">订单来源</div>

                <div class="common-btn margin-left-10" v-for="(item,index) in orderScreenList.platform"
                    @click="changeSelectType('platform',0,index)"
                    :class="item.type==orderSelectType[0]?'common-btn-active':''">
                    {{item.name}}</div>
            </div>
            <div class="screen-con-item display-flex">
                <div class="color-666">配送方式</div>
                <div class="common-btn margin-left-10" v-for="(item,index) in orderScreenList.dispatch_type"
                    @click="changeSelectType('dispatch_type',1,index)"
                    :class="item.type==orderSelectType[1]?'common-btn-active':''">
                    {{item.name}}</div>
            </div>
            <div class="screen-con-item display-flex">
                <div class="color-666">订单类型</div>
                <div class="common-btn margin-left-10" v-for="(item,index) in orderScreenList.type"
                    @click="changeSelectType('type',2,index)"
                    :class="item.type==orderSelectType[2]?'common-btn-active':''">
                    {{item.name}}</div>
            </div>
            <div class="screen-con-item display-flex">
                <div class="color-666">支付方式</div>
                <div class="common-btn margin-left-10" v-for="(item,index) in orderScreenList.pay_type"
                    @click="changeSelectType('pay_type',3,index)"
                    :class="item.type==orderSelectType[3]?'common-btn-active':''">
                    {{item.name}}</div>
            </div>
            <div class="screen-con-item display-flex">
                <div class="color-666">营销类型</div>
                <div class="common-btn margin-left-10" v-for="(item,index) in orderScreenList.activity_type"
                    @click="changeSelectType('activity_type',4,index)"
                    :class="item.type==orderSelectType[4]?'common-btn-active':''">
                    {{item.name}}</div>
            </div>
            <div class="screen-con-item display-flex">
                <div class="common-btn margin-right-20 select-btn" @click="reqOrderList">筛选</div>
                <div class="common-btn" @click="screenEmpty">清空</div>
            </div>
        </div>
    </div>
    <div class="order-table background-white color-666">
        <div class="display-flex order-table-radio">
            <div class="order-refresh" @click="goOrderRefresh">
                <i class="fa fa-refresh" :class="focusi?'focusi':''"></i>
            </div>
            <el-radio-group v-model="tableOrderStatus" fill="#7536D0">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="待付款"></el-radio-button>
                <el-radio-button label="已取消"></el-radio-button>
                <el-radio-button label="已支付"></el-radio-button>
                <el-radio-button label="待发货"></el-radio-button>
                <el-radio-button label="已发货"></el-radio-button>
                <el-radio-button label="已完成"></el-radio-button>
                <el-radio-button label="退款"></el-radio-button>
                <el-radio-button label="售后"></el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="orderList" style="width: 100%" ref="multipleTable" tooltip-effect="dark"
            default-expand-all="true" @selection-change="handleSelectionChange" :span-method="objectSpanMethod">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div class="item-box display-flex">
                        <div class="item-box-item-1 border-right" style="flex-direction: column;">
                            <div class="display-flex item-box-item-1-box" v-for="(item,index) in props.row.item">
                                <img class="table-img" :src="item.goods_image">
                                <div>
                                    <div class="display-flex">
                                        <div class="goods-title goods-title-ellipsis">{{item.goods_title}}</div>
                                    </div>
                                    <div class="color-999 display-flex">
                                        <span>规格：{{item.goods_sku_text}}</span>
                                        <span class="margin-left-10">单价：{{item.goods_price}}元</span>
                                        <span class="margin-left-10">数量：{{item.goods_num}}</span>
                                        <div v-if="item.activity_type">
                                            <!-- 拼团 -->
                                            <div v-if="item.activity_type=='groupon' && props.row.ext_arr.buy_type!='alone'" class="margin-left-10 groupon-item" @click="goGroupon(item.activity_type,props.row.ext_arr.groupon_id)">{{item.activity_type_text}}</div>
                                                <!-- 拼团单独购买 -->
                                                <div v-if="item.activity_type=='groupon' && props.row.ext_arr.buy_type=='alone'" class="margin-left-10 groupon-item groupon-item-alone">拼团-单独购买</div>
                                                <!-- 秒杀 -->
                                            <div v-if="item.activity_type=='seckill'" class="margin-left-10 skill-item">{{item.activity_type_text}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-box-item border-bottom border-right"
                            :class="props.row.status<0?'color-999':'color-444'"
                            :style="{'height': props.row.item.length*80+'px'}" style="width: 94px;">
                            {{props.row.status_text}}
                        </div>
                        <div class="border-right" style="flex-direction: column;">
                            <div class="item-box-item display-flex-column border-bottom"
                                v-for="(item,index) in props.row.item" style="height: 80px;">
                                <div v-if="props.row.status>0">
                                    <div class="color-active cursor-pointer" @click="godeliver(props.row,index)"
                                        v-if="item.dispatch_status==0 && item.refund_status<2">去发货</div>
                                        <div class="color-active cursor-pointer"
                                        v-if="item.dispatch_status==0 && item.refund_status>=2" style="color:#666;cursor: auto;">去发货</div>
                                    <div v-if="item.dispatch_status>0">
                                        {{item.dispatch_status_text?item.dispatch_status_text:'-'}}</div>
                                </div>
                                <div v-if="props.row.status<=0">-</div>
                            </div>
                        </div>
                        <div class="border-right" style="flex-direction: column;">
                            <div class="item-box-item display-flex-column border-bottom"
                                v-for="(item,index) in props.row.item" style="height: 80px;width:136px">
                                <div v-if="props.row.status>0">
                                    <span
                                        :class="item.aftersale_status==0?'color-999':'color-44'">{{item.aftersale_status_text}}</span>
                                    <span
                                        :class="item.refund_status==0?'color-999':'color-44'">-{{item.refund_status_text}}</span>
                                </div>
                                <div v-else>-</div>
                            </div>
                        </div>
                        <div class="item-box-item border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}">
                            <div v-if="props.row.user">
                                <el-popover placement="bottom" width="200" height="80" trigger="hover">
                                    <div class="popover-item-1 display-flex">
                                        <span class="popover-item-left">头像</span><span>:</span>
                                        <img class="margin-left-10" style="width:26px;
                                height:26px;
                                border-radius:50%;" :src="props.row.user.avatar">
                                    </div>
                                    <div class="popover-item-1 display-flex">
                                        <span class="popover-item-left">ID</span><span>:</span><span
                                            class="margin-left-10">{{props.row.user?props.row.user.id:''}}</span>
                                    </div>
                                    <div class="popover-item-1 display-flex"><span
                                            class="popover-item-left">手机号</span><span>:</span><span
                                            class="margin-left-10">
                                            {{props.row.user?props.row.user.mobile:''}}</span>
                                    </div>
                                    <el-button type="text" slot="reference">
                                        <div class="color-666" v-if="props.row.user">
                                            {{props.row.user.nickname.length>4?props.row.user.nickname.substr(0,4)+'...':props.row.user.nickname}}
                                        </div>
                                    </el-button>
                                </el-popover>
                            </div>
                            <div style="color: #F56C6C;" v-else>-</div>
                        </div>
                        <div class="item-box-item item-box-item-name border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}">
                            <el-popover placement="bottom" width="200" height="80" trigger="hover">
                                <div class="popover-item">
                                    <span>收货信息:</span>
                                </div>
                                <div class="popover-item">
                                    {{props.row.city_name}}{{props.row.area_name}}{{props.row.address}}
                                </div>
                                <el-button type="text" slot="reference">

                                    <div class="popover-item color-666">
                                        {{props.row.consignee.length>4?props.row.consignee.substr(0,4)+'...':props.row.consignee}}
                                    </div>
                                    <div class="color-666">{{props.row.phone}}</div>
                                </el-button>
                            </el-popover>
                        </div>
                        <div class="item-box-item border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}">
                            <span
                                v-if="props.row.remark">{{props.row.remark.length>4?props.row.remark.substr(0,4)+'...':props.row.remark}}</span>
                            <span v-else>-</span>

                        </div>
                        <div class="item-box-item border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}">
                            {{props.row.item[0].dispatch_type_text?props.row.item[0].dispatch_type_text:props.row.item[0].dispatch_type}}
                        </div>
                        <div class="item-box-item display-flex-column border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}" style="width: 136px;">
                            <div class="item-box-item-more-margin">{{props.row.total_amount}}元</div>
                            <div v-if="props.row.score_amount>0" class="item-box-item-more-margin">
                                +{{props.row.score_amount}}积分</div>
                            <div class="color-active-1" v-if="props.row.item[0].dispatch_fee>0">
                                (含运费:{{props.row.item[0].dispatch_fee}}元)</div>
                        </div>
                        <div class="item-box-item item-box-item-detail border-bottom border-right"
                            :style="{'height': props.row.item.length*80+'px'}">
                            <div class="color-active cursor-pointer btn-addtabs" @click.stop="goDetail(props.row.id)">查看详情
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column width="605" label="商品信息">
                <template slot-scope="scope">
                    <div class="display-flex">
                        <span class="font-size-12 color-444 margin-left-10">ID:{{scope.row.id}}</span>
                        <span class="font-size-12 color-999 margin-left-10">订单号:{{scope.row.order_sn}}<span
                                class="font-size-12 color-999 margin-left-10"
                                v-if="scope.row.paytime_text">下单时间:{{scope.row.paytime_text}}</span></span>
                        <span
                            class="font-size-12 color-999 margin-left-10">{{scope.row.platform_text}}-{{scope.row.type_text}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="94" label="支付状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.pay_type_text"
                        class="font-size-12 margin-left-10 pay-type">{{scope.row.pay_type_text}}</span>
                </template>
            </el-table-column>
            <el-table-column width="104" label="发货状态">
            </el-table-column>
            <el-table-column width="136" label="售后/退款">
            </el-table-column>
            <el-table-column width="104" label="下单用户">
            </el-table-column>
            <el-table-column width="104" label="收货信息">
                <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column width="104" label="买家备注">
                <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column width="104" label="配送方式">
                <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column width="136" label="实收金额(元)">
                <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <span class="color-active cursor-pointer" @click="optHandle(scope.row.id)">操作日志</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 22px 0;height: 70px;">
            <!-- <div v-if="multipleSelection.length>0" class="delete-btn">
                批量删除
            </div> -->
            <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
        </div>
    </div>
    <el-dialog class="order-dialog" title="订单发货" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div style="padding: 15px 0;">选择商品</div>
        <el-table ref="multipleTable" :data="dispatchListItem" tooltip-effect="dark" style="width: 100%"
            @selection-change="deliverSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="商品" width="287">
                <template slot-scope="scope">
                    <div class=" border-right" style="width: 287px;">
                        <div class="display-flex">
                            <img class="table-img" :src="scope.row.goods_image">
                            <div style="width:196px">
                                <div style="width:196px" class="goods-title-ellipsis font-size-12">
                                    {{scope.row.goods_title}}
                                </div>
                                <div class="color-999 font-size-12" style="text-align: left;padding-left: 2px;">
                                    <span>规格:</span><span>{{scope.row.goods_sku_text}}</span></div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goods_num" label="数量" width="70">
            </el-table-column>
            <el-table-column prop="dispatch_status_text" label="状态" width="70">
            </el-table-column>
            <el-table-column prop="express_no" label="快递单号">
                <template slot-scope="scope">
                    <span v-if="scope.row.express_no">{{scope.row.express_no}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding-top: 40px;">
            <el-form ref="form" :model="deliverForm" label-width="80px">
                <el-form-item label="配送信息">
                    <div>
                        <span>配送方式: </span>
                        <span>{{dispatchList.item?dispatchList.item[0].dispatch_type_text:''}}</span>
                    </div>
                    <div>
                        <span>收货人: </span>
                        <span><span>{{dispatchList.consignee}}</span>
                            <span>{{dispatchList.phone}}</span></span>
                    </div>
                    <div>
                        <span>收货地址: </span>
                        <span>{{dispatchList.city_name}}{{dispatchList.area_name}}{{dispatchList.address}}</span>
                    </div>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="deliverForm" class="demo-form-inline">
                <el-form-item label="快递公司">
                    <el-input v-model.number="deliverForm.express_name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model.number="deliverForm.express_no" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="deliverSubmit" class="dialog-footer-btn" :disabled=true
                v-if="!disabledBtn">立即发货</el-button>
            <div class="dialog-footer-btn dialog-footer-btn-active" @click="deliverSubmit" v-if="disabledBtn">立即发货</div>
        </span>
    </el-dialog>
    <!-- 操作日志 -->
    <div class="opt-box">
        <el-dialog title="操作日志" :visible.sync="dialogOptVisible" width="400" style="padding-bottom: 20px;">
            <el-table :data="optList" border>
                <el-table-column property="remark" label="事件"></el-table-column>
                <el-table-column property="oper.name" label="员工" width="100"></el-table-column>
                <el-table-column property="createtime" width="200" label="时间">
                    <template slot-scope="scope">
                        <span>{{moment(scope.row.createtime*1000).format("YYYY-MM-DD HH:mm:ss")}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>

</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo htmlentities($site['version']); ?>"></script>
    </body>
</html>