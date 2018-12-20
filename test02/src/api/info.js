import service from '@/tools/request.js';

const pBaseUrl = 'http://120.197.55.79:30003/api'

const pDeviceList = pBaseUrl + '/DeviceList'
const pDeviceInfo = pBaseUrl + '/DeviceInfo'
const pVersion = pBaseUrl + '/Version'
const pConfig = pBaseUrl + '/DeviceCfg'
const pSubmitJob = pBaseUrl + '/SubmitJob'

export function submitJob(data) {
  return service({
    url: `${pSubmitJob}`,
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

export function getPrinterInfo(number, type, deviceType) {
  return service({
    url: `${pDeviceInfo}?number=${number}&infoType=${type}&devType=${deviceType}`,
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
