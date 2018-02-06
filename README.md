----
入口文件：
```php
<?php
##
# 入口文件
##
// define('__DEBUG__', true);
define('__ROOT__', dirname(__DIR__));
// 载入引导文件
require __ROOT__ . '/src/bootstrap.php';

```
----
引导文件：
```php
<?php
// 设置区时
date_default_timezone_set("PRC");
// 调试模式
defined('__DEBUG__') or define('__DEBUG__', false);
// 定义根目录
defined('__ROOT__') or define('__ROOT__', dirname(__DIR__));
// 数据存储目录
defined('__DATA__') or define('__DATA__', __ROOT__ . '/data');

// 获取请求参数
function req($name, $default = null)
{
    return isset($_REQUEST[$name]) ? $_REQUEST[$name] : $default;
}

// 生成json数据
function jsonEncode($data)
{
    return json_encode($data, JSON_UNESCAPED_UNICODE);
}

// json数据转换为array
function jsonDecode($data, $is_array = true)
{
    $val = null;
    if (is_string($data)) {
        $val = json_decode(trim($data), $is_array);
        if (json_last_error() == JSON_ERROR_NONE) {
            return $val;
        } else {
            return false;
        }
    }
    return $val;
}

// 结果输出
function display($content = '', $code = 0)
{
    header("Content-type: application/json; charset=utf-8");
    $result['code'] = $code;
    if ($code > 0) {
        $result['data']  = [];
        $result['error'] = $content;
    } else {
        $result['data']  = $content;
        $result['error'] = '';
    }
    echo jsonEncode($result);
    exit;
}

// 导出txt文件
function export_txt($filename, $content)
{
    header("Content-Type:application/octet-stream");
    header("Content-Disposition:attachment;filename={$filename}");
    header("Accept-ranges:bytes");
    header("Accept-Length:" . strlen($content));
    echo $content;
    exit;
}


// 判断文件数据是否存在
function hasData($file, $path = __DATA__)
{
    $filename = $path . '/' . $file;
    return is_file($filename);
}
// 读取文件数据
function readData($file, $path = __DATA__)
{
    $filename = $path . '/' . $file;
    if (!is_file($filename)) {
        return [];
    }
    return jsonDecode(file_get_contents($filename));
}
// 写入文件数据
function putData($data, $file, $path = __DATA__)
{
    $filename    = $path . '/' . $file;
    $bakFilename = $path . '/bak/tmp/' . $file . '_' . date('YmdHis');
    if (is_file($filename)) {
        $bakPath = dirname($bakFilename);
        if (!is_dir($bakPath)) {
            mkdir($bakPath, 0755, true);
        }
        copy($filename, $bakFilename);
    }

    return file_put_contents($filename, jsonEncode($data));
}
// 删除data目录下的文件
function delData($file, $path = __DATA__)
{
    $filename = $path . '/' . $file;
    if (!is_file($filename)) {
        return false;
    }
    unlink($filename);
    return true;
}
// 获取抽奖接口名称
$ac = req('ac', 'index');

// 输出源码
if ($ac == 'dump') {
    require __DIR__ . '/dump.php';
    exit;
}

// 抽奖逻辑
require __DIR__ . '/lottery.php';
$l = new Lottery;
// 执行接口方法
if (method_exists($l, $ac)) {
    call_user_func([$l, $ac]);
    exit;
}

display('not found!', 404);

```
----
抽奖文件：
```php
<?php
/**
 * 抽奖
 */
class Lottery
{
    private $_allList        = '/public/test.json'; // 员工信息
    private $_winnersList    = 'winners%s.json'; // 中奖列表
    private $_notwinnersList = 'notwinners%s.json'; // 未中奖

    private $_config = 'config.json'; // 配置信息

    private $_ip = ''; // 当前抽奖的客户端ip

    // 构造方法
    public function __construct()
    {
        if (empty($_SERVER['REMOTE_ADDR'])) {
            display('未法请求', 400);
        }

        // 客户端ip
        $this->_ip = $_SERVER['REMOTE_ADDR'];
        $config    = readData($this->_config);
        // 本机默认允许
        $serverIp = empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_NAME'] : $_SERVER['SERVER_ADDR'];
        array_push($config['ip_whitelist'], $serverIp);

        // 正式抽奖时，只允许白名单机器进行抽奖
        if (!__DEBUG__ && !in_array($this->_ip, array_unique($config['ip_whitelist']))) {
            display('不允许操作', 401);
        }
        $this->_winnersList    = sprintf($this->_winnersList, $this->_ip);
        $this->_notwinnersList = sprintf($this->_notwinnersList, $this->_ip);

        // 初始化信息
        if (!hasData($this->_winnersList)) {
            putData([], $this->_winnersList);
        }

        if (!hasData($this->_notwinnersList)) {
            $dataTmp  = readData($this->_allList, __ROOT__);
            $notWData = array_column($dataTmp, 'workCard');
            putData($notWData, $this->_notwinnersList);
        }
    }

    public function index()
    {
        echo file_get_contents(__ROOT__ . '/public/index.html');
    }

    // 奖品列表
    public function prize_list()
    {
        $config = readData($this->_config);

        display($config['prize_list']);
    }

    // 开始抽奖接口
    public function start()
    {
        $num  = (int) req('num', 0);
        $type = (int) req('type', 0);
        if ($num <= 0) {
            display('抽奖人数小于或等于0', 100);
        }

        if ($type <= 0) {
            display('找不到奖品', 101);
        }
        $config = readData($this->_config);
        if (empty($config['prize_list'])) {
            display('未配置奖品', 102);
        }
        $typeInfo = [];
        foreach ((array) $config['prize_list'] as $types) {
            if ($types['id'] == $type) {
                $typeInfo = $types;
                break;
            }
        }
        if (empty($typeInfo)) {
            display('奖品不存在', 103);
        }
        // 未中奖用户
        $notWData    = readData($this->_notwinnersList);
        $notWDataNum = count($notWData);
        if ($notWDataNum < $num) {
            display('抽奖人数不足', 104);
        } else {
            $allWData = readData($this->_winnersList);
            // 未中奖人数大于抽奖人数
            if ($notWDataNum > $num) {
                shuffle($notWData); // 打乱数组顺序
                $tData = (array) array_rand($notWData, $num); // 随机取出对应条数的结果
                foreach ($tData as $key) {
                    $wData[] = $notWData[$key];
                    unset($notWData[$key]); // 剔除中奖用户
                }
            } else {
                $wData    = array_values($notWData);
                $notWData = [];
            }
            // 存储信息
            $allWData[$type] = isset($allWData[$type]) ? array_merge($allWData[$type], $wData) : $wData;
            putData($allWData, $this->_winnersList);
            putData(array_values($notWData), $this->_notwinnersList);
        }
        // 补全中奖者信息
        $allDataList = readData($this->_allList, __ROOT__);
        $result      = [];
        foreach ($wData as $key => $value) {
            // 员工信息列表
            foreach ($allDataList as $vv) {
                if ($vv['workCard'] == $value) {
                    $result[$key] = $vv;
                    break;
                }
            }
        }
        display($result);
    }
    // 中奖人数统计
    public function count()
    {
        $wData = readData($this->_winnersList);
        $wNum  = 0;
        foreach ($wData as $value) {
            $wNum += count($value);
        }
        display([
            'data_num'    => count(readData($this->_allList, __ROOT__)),
            'winners_num' => $wNum,
        ]);
    }

    // 重置抽奖
    public function reset()
    {
        // 默认备份上次抽奖的结果
        $saveResult = req('save', 1);
        if (boolval($saveResult)) {
            $zipname = __DATA__ . '/bak/ly_' . $this->_ip . '_' . time() . '.zip';
            $zip     = new ZipArchive;
            $zip->open($zipname, ZipArchive::CREATE);
            $zip->addFile(__DATA__ . '/' . $this->_winnersList);
            $zip->addFile(__DATA__ . '/' . $this->_notwinnersList);
            $zip->close();
        }

        // 删除抽奖的结果
        delData($this->_winnersList);
        delData($this->_notwinnersList);
        // 删除所有临时备份
        $bakFile = glob(__DATA__ . '/bak/tmp/*.json_*');
        foreach ($bakFile as $file) {
            delData('bak/tmp/' . basename($file));
        }
        display('ok');
    }

    // 中奖者信息
    public function winners()
    {
        $isDown    = (bool) req('down', 0);
        $data      = readData($this->_allList, __ROOT__);
        $wData     = readData($this->_winnersList);
        $config    = readData($this->_config);
        $prizeList = array_column($config['prize_list'], 'name', 'id');
        $result    = [];
        foreach ($wData as $type => $value) {
            $result[$type]['name'] = $prizeList[$type]; // 奖品
            foreach ($value as $v) {
                // 员工列表
                foreach ($data as $kk => $vv) {
                    if ($vv['workCard'] == $v) {
                        $result[$type]['list'][] = $vv;
                        break;
                    }
                }
            }
        }
        // 导出数据
        if ($isDown) {
            $str = '';
            foreach ($result as $value) {
                $str .= $value['name'] . "\t\n";
                foreach ($value['list'] as $v) {
                    $str .= $v['branch'] . "\t" . $v['name'] . "\n";
                }
                $str .= "\t\t\n";
            }
            export_txt('中奖者名单.txt', $str);
            return;
        }

        display($result);
    }

    // 未中奖者信息
    public function not_winners()
    {
        $isDown   = (bool) req('down', 0);
        $data     = readData($this->_allList, __ROOT__);
        $notWData = readData($this->_notwinnersList);

        $result = [];
        foreach ($notWData as $v) {
            foreach ($data as $kk => $vv) {
                if ($vv['workCard'] == $v) {
                    $result[] = $vv;
                    break;
                }
            }
        }
        // 导出数据
        if ($isDown) {
            $str = '';
            foreach ($result as $value) {
                $str .= $value['branch'] . "\t" . $value['name'] . "\n";
            }
            export_txt('未中奖者名单.txt', $str);
            return;
        }
        display($result);
    }
}

```