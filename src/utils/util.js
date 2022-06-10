const md5 = require("md5");
const timestamp = new Date().getTime(); // 当前时间戳

// 加签
const signMd5 = obj => {
    const res = obj;
    const arr = Object.keys(obj).sort();
    let str = "";

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "sign") {
            str += "";
        } else {
            let val = obj[arr[i]];
            if (typeof val == "object") {
                val = JSON.stringify(val);
            } else if (val || typeof val == "number") {
                str += `&${arr[i]}=${val}`;
            }
        }
    }
    str = str.substring(1);
    res.sign = md5(`${str}${htmlConfig.strRandom}`).toLowerCase();
    return res;
};

// 生成随机串的长度
const nonceStr = (len = 16) => {
    const chars = "eqwefdsdewrewfwefwefefrferfr";
    const maxStr = chars.length;
    let str = "";
    for (let i = 0; i < len; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * maxStr));
    }
    return str;
};

// 手机号掩码
const phoneMask = phone => {
    const reg = /^(\d{3})\d{4}(\d{4})$/;
    return phone.replace(reg, "$1****$2");
};

// 卡号掩码
const cardMask = cardNo => {
    const bankNo = cardNo.replace(/\s+/g, "");
    const reg = /^(\d{4})\d+(\d{4})$/;
    return bankNo.replace(reg, "$1****$2");
};

// 时间格式话
const formatTime = (date, format = "yyyy-MM-dd hh:mm:ss") => {
    let o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (let k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return format;
};

// 获取url参数
const GetURL = name => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    let r = "";
    r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
};

// 日期格式化
const formatDate = function(date) {
    if (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    }
};

// 日期格式化
const addYear = function(date, num = 1) {
    if (date) {
        var y = date.getFullYear() + num;
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return new Date(y + "-" + m + "-" + d);
    }
};

const passDate = diffValue => {
    var minute = 60000;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var nowTime = new Date().getTime(); //获取当前时间戳
    var ShiJianCha = nowTime - diffValue;
    var monthC = ShiJianCha / month;
    var weekC = ShiJianCha / (7 * day);
    var dayC = ShiJianCha / day;
    var hourC = ShiJianCha / hour;
    var minC = ShiJianCha / minute;
    var res = "";

    if (monthC >= 12) {
        oldTime = nowTime - diffValue; // 获取记录的时间戳
        var date = new Date(oldTime);
        res =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
    } else if (monthC >= 1) {
        res = parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        res = parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        res = parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        res = parseInt(hourC) + "个小时前";
    } else if (minC >= 1) {
        res = parseInt(minC) + "分钟前";
    } else {
        res = "刚刚";
    }
    return res;
};
const isAndr = () => {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    // const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isAndroid ? true : false;
};
export {
    signMd5,
    nonceStr,
    timestamp,
    phoneMask,
    cardMask,
    formatTime,
    GetURL,
    formatDate,
    addYear,
    passDate,
    isAndr
};
