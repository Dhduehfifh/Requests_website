<?php
//这只是一个示例代码，使用的namespace为 App/api
//文件路径：bcakend/api
//主要负责向前端返回信息

namespace App\api ;

//引用数据库api
require_once __DIR__ . 'db/api.php';
$api = new DbApi();
