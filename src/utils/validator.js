// 身份证
const validIdCard = validItem => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let errMsg = "";
    if (!validItem) {
        errMsg = "证件号不能为空";
    } else {
        errMsg = reg.test(validItem) ? "" : "证件号不正确";
    }
    return errMsg;
};

// 手机号
const validPhone = validItem => {
    const reg = /^(1[3-9][0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    let errMsg = "";
    if (!validItem) {
        errMsg = "手机号不能为空";
    } else {
        errMsg = reg.test(validItem) ? "" : "手机号不正确";
    }
    return errMsg;
};

// 金额校验,首位不为0,最多2位小数
const validMoney = validItem => {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    let errMsg = "";
    if (!validItem) {
        errMsg = "请填写数字";
    } else {
        errMsg = reg.test(validItem) ? "" : "请填写数字,最多2位小数";
    }
    return errMsg;
};

// 短信验证码
const validCode = validItem => {
    const reg = /^[0-9]{6}$/;
    let errMsg = "";
    if (!validItem) {
        errMsg = "短信验证码不能为空";
    } else {
        errMsg = reg.test(validItem) ? "" : "短信验证码必须为数字";
    }
    return errMsg;
};

// 密码验证
const validPass = validItem => {
    const reg = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/;
    let errMsg = "";
    if (!validItem) {
        errMsg = "密码不能为空";
    } else {
        errMsg = reg.test(validItem) ? "" : "密码8到16位数字字母组成";
    }
    return errMsg;
};

// 不为空验证
const validNotNull = (validItem, validName) => {
    const reg = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/;
    let errMsg = "";
    errMsg = validItem ? "" : `${validName}不能为空`;
    return errMsg;
};
export {
    validIdCard,
    validPhone,
    validMoney,
    validCode,
    validPass,
    validNotNull
};
