// import Api from '../lib/Api'
import Api from 'api-mock-js'

// import pop from '../lib/popUp'
import Apidefine from './interface'

//if(Boolean(Number(window.GD.URLparams.useMock))){
//	import('./interface.js').then(e => {
//		console.log('mock ready')
//	})
//}

const throttle = (delay, action) => {
    let last = 0
    return function () {
        let curr = +new Date()
        if (curr - last > delay) {
            action.apply(this, arguments)
            last = curr
        }
    }
}

const userAgent = navigator.userAgent.toLowerCase()

const isMobile = /mobile/i.test(userAgent)

const isAndroid = /android/i.test(userAgent)

const isIOS = /iphone|ipad|ipod/i.test(userAgent)

const systemVersion = isMobile && parseInt(navigator.userAgent.toLowerCase().match(/(os|android).\d/g)[0].slice(-1))

const isLowAndroid = isAndroid ? systemVersion < 5 : false

const isLowIOS = isIOS ? (systemVersion > 4 && systemVersion < 9) : false

const isWX = /micromessenger/i.test(userAgent)

const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

const getLocal = key => JSON.parse(localStorage.getItem(key) || '{}')
const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const removeLocal = key => localStorage.removeItem(key)

const getSession = key => JSON.parse(sessionStorage.getItem(key) || '{}')
const saveSession = (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
const removeSession = key => sessionStorage.removeItem(key)

let params = window.GD.URLparams

Api.config({
    methods: 'GET', // GET POST ...
    dataType: 'jsonp', //json || jsonp
    domain: window.domain,
    useMock: Number(params.useMock) || false,
    urlModel: 1,
    debug: Number(params.debug) || false,
    jsonpCallback: "json_callback",
    filter(obj) {
        //		console.log('use filter', (new Date()).getTime())
        const deal = obj => {
            let signature = ''
            let keys = ['ct', 'ac', 'from_id', '_t'].sort()
            keys.forEach(key => signature += '&' + key + '=' + obj[key])
            signature = signature.replace('&', '')
            signature += '3kwan_wechat_!@#$%^&*'
            return {
                ...obj,
                'signature': md5(signature).toLocaleUpperCase()
            }
        }
        return deal({
            ...obj,
            _t: (new Date()).getTime()
        })
    }
})

let fromGame = {
    'from_id': params.from || '0', //来源渠道id
    // 'game_id': params.game_id || localData.game_id || '',
    'param': params.hd || 'test',
    'pf': isAndroid ? 1 : (isIOS ? 2 : 3), //1/2/3 =>安卓/ios/其他
    //	'type': !isMobile ? 1 : (isWX ? 2 : 3) //1PC2微信3移动端
}


let _alert = window.alert
let lazyAlert = msg => {
    alert(msg)
    window.alert = () => { }
    setTimeout(() => {
        window.alert = _alert
    }, 1000)
}

const showTip = msg => {
    return new pop.popError(2, '', msg, 1500)
}

const showError = (title, msg) => {
    return new pop.popError(1, title, msg)
}



let scrollTop
const addFixed = () => {
    scrollTop = document.body.scrollTop;
    document.body.style.position = "fixed";
    document.body.style.top = -scrollTop + 'px';
}

const removeFixed = () => {
    document.body.style.position = "relative";
    document.body.style.top = '0px'
    window.scrollTo(0, scrollTop)
}

const checkResCode = (res) => {
    console.log('checkcode', res)
    alert(res.msg)
}


const ajax = (...arg) => {
    return new Promise((resolve, reject) => {
        Api.require(...arg).then(res => {
            if (res.code != 0) {
                checkResCode(res)
            }
            resolve(res)
        }).catch(e => {
            console.log('now error:', e)
        })
    })
}

const count = () => {
    Api.require('count', {
        'ct': 'tf-project',
        'ac': 'downLog'
    })
}

const download = () => {
    if (window.GD.plan) {
        // 用户界面时跳转

        // 先发送下载日志
        let plan_id = window.GD.URLparams['plan_id']
        let w = window.GD.URLparams['w']
        if (plan_id && w) {

            ajax('log', {
                ct: 'log',
                ac: 'downLog',
                plan_id,
                w
            },{
                domain: window.ENV == 'production' ? 'http://g.kkk5.com/' : 'http://gdemo.3kwan.com:82/'
            })

        }

        let download_android = decodeURIComponent(window.GD.plan.download_android)
        let download_ios = decodeURIComponent(window.GD.plan.download_ios)

        if (download_android && download_ios) {
            if (isIOS) {
                window.location.href = download_ios
            } else {
                window.location.href = download_android
            }
        } else {
            if (download_android) {
                window.location.href = download_android
            } else if (download_ios) {
                window.location.href = download_ios
            } else {
                alert('暂无下载链接')
            }
        }

       


    } else {
        // 配置界面弹出弹窗代替
        alert('download')
    }
}

import setDefaultValue from "../lib/setDefaultValue"
export default {
    setDefaultValue,
    addFixed,
    removeFixed,
    showError,
    showTip,
    count,
    ajax,
    isAndroid,
    isIOS,
    isLowAndroid,
    isLowIOS,
    isWX,
    sleep,
    getLocal,
    saveLocal,
    removeLocal,
    getSession,
    saveSession,
    removeSession,
    fromGame,
    checkResCode,
    md5,
    WX,
    setTitle,
    download
}