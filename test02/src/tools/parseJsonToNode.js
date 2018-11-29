/* eslint-disable */
const mock = [{
  "WIFI.Generic.*": {
    "Datas": {
      "DataType": "multiString",
      "NodeVal": "Device Type=41;Device model=UW11_W;Serial Number=0004BE7350025A00;Protocol Ver=01.01.01.01;Firmware Ver=02.00.00.02;Motherboard number=STM32F4-QCA4;MAC Address=BC9DA5089079",
      "Length": 0
    },
    "LogInfo": {
      "DataType": "multiString",
      "NodeVal": "Type=41;Model=UW11_W;Number=0004BE7350025A00",
      "Length": 0
    },
    "SEP": {
      "DataType": "value",
      "NodeVal": 59,
      "Min": 0,
      "Max": 255
    }
  }
}, {
  "Device.Generic.*": {
    "Datas": {
      "DataType": "multiString",
      "NodeVal": "Device Type=11;Device model= DL-210;Serial Number=405616310000;Protocol Ver=01.01.01.01;Firmware Ver=41.01.22.00;Motherboard number=DLPC1820-001-01",
      "Length": 0
    },
    "SEP": {
      "DataType": "value",
      "NodeVal": 59,
      "Min": 0,
      "Max": 255
    }
  }
}]

Node.prototype.log = function() {
  let logStr = '> '
  for (let i = 0; i < this.index; i++) {
    logStr += '> '
  }

  if (this.type == 'item') {
    console.log(logStr + this.type + ' ' + this.name);
    this.nodes.forEach(node => {
      node.log()
    });
  } else {
    console.log(logStr + 'leaf ' + this.name);

  }
}

export function parseNode2(obj, index, nodes) {

  let res
  if (Array.isArray(obj)) {

    res = []
    obj.forEach(element => {
      let node = parseNode2(element, index, '')

      res.push(node)
    });

  } else {
    if (typeof obj == 'object') {
      //2

      if (obj['DataType'] == undefined) {
        //不是属性节点

        let type
        let name

        for (const key in obj) {


          if (obj[key]['DataType']) {
            type = 'leaf'
          } else {
            type = 'item'
            name = key
          }
        }

        if (type === 'item') {
          // console.log('本身是item');
          // console.log(name);
          res = {}
          res.index = index
          res.type = 'item'
          res.name = name
          res.nodes = []
          parseNode2(obj[name], index + 1, res.nodes)
        } else {
          for (const key in obj) {
            // console.log('本身是leaf');
            // console.log(key);
            res = {}
            res.type = 'leaf'
            res.index = index
            res.name = key
            res.dataType = obj[key]['DataType']
            const value = obj[key]['NodeVal']
            if (obj[key]['DataType'] === 'list') {
              const list = obj[key]['ListVal'].split(';')
              res.value = list[value]
            } else {
              res.value = value
            }

            nodes.push(res)
          }
        }
        return res
      }
    }
  }
  return res;

}