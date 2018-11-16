import service from '@/tools/request.js';

const pBaseUrl = 'http://192.168.11.222:30003/api'

const pDeviceList = pBaseUrl + '/DeviceList'
const pDeviceInfo = pBaseUrl + '/DeviceInfo'
const pVersion = pBaseUrl + '/Version'
const pConfig = pBaseUrl + '/DeviceCfg'
const pPrint = pBaseUrl + '/SubmitJob'

const dDeviceList = 'http://localhost:3000/printerInfo'
export function postPrint(data) {
    return service({
        url: `${pPrint}`,
        method: 'post',
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        dataType: "json",
    });
}

export function getVersion(type) {
    return service({
        url: `${pVersion}?type=${type}`,
        method: 'get'
    });
}

export function getConfig(number, type) {
    return service({
        url: `${pConfig}?number=${number}&type=${type}`,
        method: 'get'
    });
}

export function getPrinterList() {
    return service({
        url: pDeviceList,
        method: 'get'
    });
}

export function getPrinterInfo(number, type) {
    return service({
        url: `${pDeviceInfo}?number=${number}&type=${type}`,
        method: 'get'
    });

    // return [{ "WIFI.Generic.*": { "Datas": { "DataType": "multiString", "NodeVal": "Device Type=41;Device model=UW11_W;Serial Number=0004BE7350025A00;Protocol Ver=01.01.01.01;Firmware Ver=02.00.00.02;Motherboard number=STM32F4-QCA4;MAC Address=BC9DA5089079", "Length": 0 }, "LogInfo": { "DataType": "multiString", "NodeVal": "Type=41;Model=UW11_W;Number=0004BE7350025A00", "Length": 0 }, "SEP": { "DataType": "value", "NodeVal": 59, "Min": 0, "Max": 255 } } }, { "Device.Generic.*": { "Datas": { "DataType": "multiString", "NodeVal": "Device Type=11;Device model= DL-210;Serial Number=405616310000;Protocol Ver=01.01.01.01;Firmware Ver=41.01.22.00;Motherboard number=DLPC1820-001-01", "Length": 0 }, "SEP": { "DataType": "value", "NodeVal": 59, "Min": 0, "Max": 255 } } }]
}

export function addPrinter(printer) {
    return service({
        url: 'http://localhost:3000/printerInfo',
        method: 'post',
        data: printer
    })
}

export function deletePrinter(id) {
    console.log('返回')
    return service({
        url: `http://localhost:3000/printerInfo/${id}`,
        method: 'delete'
    })
}

export function editPrinter(info) {
    return service({
        url: `http://localhost:3000/printerInfo/${info.id}`,
        method: 'put',
        data: info
    })
}

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}