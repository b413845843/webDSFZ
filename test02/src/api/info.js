import service from '@/tools/request.js';

const pBaseUrl = 'http://120.197.55.79:30003/api'

const pDeviceList = pBaseUrl + '/DeviceList'
const pDeviceInfo = pBaseUrl + '/DeviceInfo'
const pVersion = pBaseUrl + '/Version'
const pConfig = pBaseUrl + '/DeviceCfg'
const pPrint = pBaseUrl + '/SubmitJob'

/* eslint-disable */
const dDeviceList = 'http://localhost:3000/printerInfo'

export function postPrint(data) {
  return service({
    url: `${pPrint}`,
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    dataType: 'json'
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

/* eslint-disable */
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) {
      return;
    }
  }
}