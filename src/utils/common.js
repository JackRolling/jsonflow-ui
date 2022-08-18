import { flowConfig } from '@/config/flow-config.js'

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

// 获取浏览器类型
export const getBrowserType = function(_this) {
  let userAgent = navigator.userAgent;
  let isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return 1;
  }

  if (userAgent.indexOf("Firefox") > -1) {
    return 2;
  }
  if (userAgent.indexOf("Chrome") > -1) {
    return 3;
  }
  if (userAgent.indexOf("Safari") > -1) {
    return 4;
  }
  if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1 &&
    !isOpera
  ) {
    _this.$message.error("IE浏览器支持性较差，推荐使用Firefox或Chrome");
    return 5;
  }
  if (userAgent.indexOf("Trident") > -1) {
    _this.$message.error("Edge浏览器支持性较差，推荐使用Firefox或Chrome");
    return 6;
  }
};

export let utils = {
	seqNo: 1,
	consoleLog: function(strArr) {
		let log = '';
		for (let i = 0, len = strArr.length; i < len; i++) {
			log += strArr[i] + '\n';
		}
	},
	getId: function() {
		let idType = flowConfig.idType;
		if (typeof idType == 'string') {
			if (idType == 'uuid') {
				return this.getUUID();
			} else if (idType == 'time_stamp') {
				return this.getTimeStamp();
			}
		} else if (idType instanceof Array) {
			if (idType[0] == 'sequence') {
				return this.getSequence(idType[1]);
			} else if (idType[0] == 'time_stamp_and_sequence') {
				return this.getTimeStampAndSequence(idType[1]);
			} else if (idType[0] == 'custom') {
				return idType[1]();
			}
		}
	},
	getUUID: function() {
		let s = [];
		let hexDigits = "0123456789abcdef";
		for(let i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		s[8] = s[13] = s[18] = s[23] = "-";

		let uuid = s.join("");
		return uuid.replace(/-/g, '');
	},
	getTimeStamp: function() {
		return new Date().getTime();
	},
	getSequence: function(seqNoLength) {
		let zeroStr = new Array(seqNoLength).fill('0').join('');
		return (zeroStr + (this.seqNo++)).slice(-seqNoLength);
	},
	getTimeStampAndSequence: function(seqNoLength) {
		return this.getTimeStamp() + this.getSequence(seqNoLength);
	},
	add: function(a, b) {
		let c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	},
	sub: function(a, b) {
		let c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	},
	mul: function(a, b) {
		let c = 0, d = a.toString(), e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) {}
		try {
			c += e.split(".")[1].length;
		} catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	},
	div: function(a, b) {
		let c, d, e = 0, f = 0;
		try {
			e = a.toString().split(".")[1].length;
		} catch (g) {}
		try {
			f = b.toString().split(".")[1].length;
		} catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
	}
};

export const getObjType = obj => {
  let toString = Object.prototype.toString;
  let map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  let type = getObjType(data);
  let obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (let key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};

// 表单序列化
export const serialize = data => {
  const list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
};
