

class BaseData {
    constructor() {
        const now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth() + 1; // 0-11表示1-12月
        this.day = now.getDate();
        this.dateObj = {};
    }
    
    // 补0函数
    addZero(num) {
        num = Math.abs(num)
        return num > 9 ? num : `0${num}`
    }
}

// 年
class LastYear extends BaseData {
    constructor() {
        super();
    }
    getLastYear(m = 1) {
        const {year, month, day, dateObj, addZero} = this;
        dateObj.end = `${year}-${addZero(month)}-${addZero(day)}`; // 拼接当前年月日
        dateObj.start = `${year - m}-${addZero(month + 1)}-${addZero(day)}`;
        return dateObj;
    }
}

// 月
class LastMonth extends BaseData {
    constructor() {
        super();
        this.m12 = 12;
    }
    getLastMonth(m = 1) {
        const {year, month, day, dateObj, addZero, m12} = this;
        dateObj.end = `${year}-${addZero(month)}-${addZero(day)}`; // 拼接当前年月日
        
        if(m > 12) {
            return dateObj.errMsg = '最多支持最近12个月'
        }
        if(month - m == 0) {
            dateObj.start = `${year - 1}-${m12}-${addZero(day)}`;
        } else if(month - m < 0){
            const n = Math.abs(m12 + (month - m)) ? Math.abs(m12 + (month - m)) : m12;
            dateObj.start = `${year - 1}-${addZero(n)}-${addZero(day)}`;
        }else if(month - m > 0){
            dateObj.start = `${year}-${addZero(month - m)}-${addZero(day)}`;
        }
        return dateObj;
    }
}

// 周
class LastWeek extends BaseData {
    constructor(type) {
        super();
        this.type = type;
    }
    getDay(m) {
        const {year, month, day, dateObj, addZero, type} = this;
        const weekDay = type == 'week' ? 6 : 1;
        const lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate(); // 获取上一个月的总天数
        if(m > 3 && type == 'week') {
            dateObj.errMsg = '最多支持最近3周';
            return;
        }
       
        if(day - m * weekDay > 0) {
            dateObj.start = `${year}-${addZero(month)}-${addZero(day - m * weekDay)}`;
        } else {
            if(month - 1 == 0) {
                dateObj.start = `${year -1}-12-${addZero((day + lastMonthDay) - m * weekDay)}`;
            } else if(month - 1 < 0){
                dateObj.start = `${year -1}-${addZero(month -1)}-${addZero((day + lastMonthDay) - m * weekDay)}`;
            } else if(month - 1 > 0){
                dateObj.start = `${year}-${addZero(month -1)}-${addZero((day + lastMonthDay) - m * weekDay)}`;
            }
        }
    }
    getLastWeek(m = 1) {
        const {year, month, day, dateObj, addZero} = this;
        dateObj.end = `${year}-${addZero(month)}-${addZero(day)}`; // 拼接当前年月日
        this.getDay(m)
        return dateObj;
    }
}

const lastYMD = function(obj = {type: 'month', last: 1}) {
    const {type, last} = obj;
    let dateObj;
    switch(type) {
        case 'year':
            dateObj = new LastYear().getLastYear(last);
            break;
        case 'month':
            dateObj = new LastMonth().getLastMonth(last);
            break;
        case 'week':
        case 'day':
            dateObj = new LastWeek(type).getLastWeek(last);
            break;
    }
    return dateObj;
}

export {
    lastYMD
}

