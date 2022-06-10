//卡号格式化
const formatCard = function (str) {
    var num = '';
    if (typeof str === 'string') {
        str = str.replace(/\s/g, '')
    }
    str.split('').forEach(function (value, index) {
        if ((index + 1) % 4 === 0 && index !== 0 && index !== (str.length - 1)) {
            num += value;
            num += ' ';
        } else {
            num += value;
        }
    });
    return num;
};

// 光标至尾
const set_text_value_position = function (el, spos, cardNo) {
    var tobj = el;
    if (spos < 0)
        spos = cardNo.length;
    if (tobj.setSelectionRange) { //兼容火狐,谷歌
        setTimeout(function () {
            tobj.setSelectionRange(spos, spos);
            tobj.focus();
        }, 0);
    } else if (tobj.createTextRange) { //兼容IE
        var rng = tobj.createTextRange();
        rng.move('character', spos);
        rng.select();
    }
}

const formatCardNo = (target, cardNo) => {
    let oldlen = cardNo.length;
    let oldposStart = target.selectionStart;
    // 优先格式化
    let formatVal = formatCard(cardNo);
    cardNo = formatVal;
    if (oldposStart < oldlen) {
        if ((oldposStart % 5) === 0) {
            set_text_value_position(target, oldposStart + 1, cardNo)
        } else {
            set_text_value_position(target, oldposStart, cardNo);
        }
    } else {
        set_text_value_position(target, -1, cardNo);
    }
    return cardNo
   
}

export default formatCardNo;