<template>
  <Modal v-model="toShow" @on-cancel="actionCancel">
    <div slot="header" style="height:50px">
      <div>编辑:{{number}} : {{wod}}</div>
      <Row style="height:100%;padding:15px 0 5px 0px" justify="center" align="middle">
        <Col span="12" class="col"><Button :type="wod?'primary':'text'" class="btn" @click="changeClick('WIFI')">WIFI</Button></Col>
        <Col span="12" class="col"><Button :type="wod==false?'primary':'text'" class="btn" @click="changeClick('DEVICE')">DEVICE</Button></Col>
      </Row>
    </div>

    <div v-if="nodes!=null">
      <Collapse simple accordion v-model="collapse">
        <Panel v-for="(item,index) of nodes.items" :key='item.name' :name="String(index)">
          {{$t(item.name)}}
          <Form v-if="item.items" :label-width="120" slot="content">
            <FormItem v-for="subItem of item.items" :key='subItem.name' :label="$t(subItem.name)" class="leaf">
              <Input v-if="subItem.dataType == 'string'" v-model="subItem.value" placeholder=""></Input>
              <Input v-else-if="subItem.dataType == 'value'" v-model="subItem.value" placeholder=""></Input>
              <Input v-else-if="subItem.dataType == 'data'" v-model="subItem.value" placeholder=""></Input>
              <Select v-else-if="subItem.dataType == 'list'" v-model="subItem.value">
                <Option v-for="o in subItem.list" :value="o.index" :key="o.index">{{o.label}}</Option>
              </Select>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
    </div>
    <p v-else>获取失败</p>
    <div slot="footer">
      <Button type="text" @click="actionCancel">取消</Button>
      <Button type="primary" @click="actionOK">设置</Button>
    </div>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </Modal>
</template>

<script>
  import './configView.less'
  import {
    submitJob
  } from '@/api/info'
  /* eslint-disable */
  String.prototype.StrCut2Arr = function (n) {
    var str = this;
    var arr = [];
    var len = Math.ceil(str.length / n);
    for (var i = 0; i < len; i++) {
      if (str.length >= n) {
        var strCut = str.substring(0, n);
        arr.push(strCut);
        str = str.substring(n);
      } else {
        arr.push(str);
      }
    }
    return arr;
  }

  function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  export default {
    name: 'ConfigView',
    props: {
      json: Object,
      'show': Boolean,
      'isLoading': Boolean,
      'number': String
    },
    methods: {
      async actionOK() {
        this.$emit('action', 'ok', true)
        console.info(this.nodes);
        let datas = '';

        if (!(this.nodes && this.nodes.items.length)) {
          this.$Message.error({
            content: '数据为空,不能设置'
          })
          this.$emit('action', 'ok', false)
          return
        }
        datas += `Cfg Packet=${this.nodes['Cfg Packet']};DevID=${this.nodes['DevID']};`
        this.nodes.items.forEach(node => {

          if (node.type === 'node') {
            let nodeName = node.name
            for (let index = 0; index < node.items.length; index++) {
              const subNode = node.items[index];
              const name = nodeName === 'Others' ? subNode.name : nodeName + '.' + subNode.name
              const value = subNode.value;
              //如果是IP等格式
              if (subNode.dataType === 'data') {
                value = ''
                subNode.value.split('.').forEach(e => {
                  let num = parseInt(e, 10).toString(16)
                  num = PrefixInteger(num, 2)
                  value += num
                })
              }
              datas += `${name}=${value};`
            };
          } else {
            const value = node.value;
            //如果是IP等格式
            if (node.dataType === 'data') {
              value = ''
              node.value.split('.').forEach(e => {
                let num = parseInt(e, 10).toString(16)
                num = PrefixInteger(num, 2)
                value += num
              })
            }
            datas += `${node.name}=${value}`;
          }
        });

        let sendData = {
          dataFmt: 'text',
          datas: datas,
          devType: this.wod ? 'wifi' : 'device',
          encodeType: 'string',
          imgH: -1,
          imgH: -1,
          jobType: 'config',
          number: this.number,
          orgX: 0,
          orgY: 0
        };
        console.log(sendData);
        await submitJob(sendData).then(res => {
          console.log('set config success');
          this.$Message.info({
            content: `设置成功`
          });
        }).catch(err => {
          console.log('set config fail');
          this.$Message.error({
            content: `设置失败,错误:${err}`
          });
        })

        this.$emit('action', 'ok', false)
      },
      actionCancel() {
        this.$emit('action', 'cancel')
        this.wod = true
      },
      changeClick(type) {
        this.$emit('get-config', type)
        this.wod = type === 'WIFI'
      },
      getItems(key, obj) {
        let sitem = {}
        if (typeof (obj[key]) === 'object') {
          sitem.name = key

          if (obj[key]['DataType']) {
            let currObject = obj[key]

            let dataType = currObject['DataType']
            sitem.type = 'leaf'
            sitem.dataType = dataType
            sitem.value = currObject['NodeVal']

            if (dataType === 'list') {
              sitem.value = parseInt(sitem.value)
              sitem.list = currObject['ListVal'].split(';').map((value, index) => {
                return {
                  index: index,
                  label: value
                }
              })
            } else if (dataType === 'data') {
              sitem.value = sitem.value.StrCut2Arr(2).map(v => {
                return parseInt(v, 16)
              }).join('.')
            }
            // console.log(`key:${key}  type:${sitem.type}`);
          } else {
            sitem.items = []
            sitem.type = 'node'
            // console.log(`key:${key}  type:${sitem.type}`);
            for (const subKey in obj[key]) {
              sitem.items.push(this.getItems(subKey, obj[key]))
            }
          }
          return sitem
        }
      }
    },
    computed: {
      toShow: {
        set(value) {
          console.log(this.show);
        },
        get: function () {
          return this.show
        }
      },
      nodes: {
        set(value) {
          console.log(value);
          this.collapse = '0'
        },
        get: function () {
          if (this.json) {
            let data = {}
            data.items = []

            for (const key in this.json['Edit Items']) {
              if (key === 'DevID') {
                // console.log(`id : ${key}`);
                data['DevID'] = this.json['Edit Items'][key]
                data['Cfg Packet'] = this.json['Cfg Packet'].NodeVal

              } else {
                data.items.push(this.getItems(key, this.json['Edit Items']))
              }
            }

            let others = data.items.filter(item => {
              return !item.items
            })

            data.items = data.items.filter(item => {
              return item.items && item.items.length > 0
            })

            if (others.length) {
              let othersItem = {}
              othersItem.name = 'Others'
              othersItem.items = others
              othersItem.type = 'node'
              data.items.push(othersItem)
            }
            return data
          } else {
            return null
          }
        }
      }
    },
    data() {
      return {
        op: 0,
        wod: true,
        collapse: '0'
      }
    }

  }

</script>
