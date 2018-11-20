<template>
  <Modal v-model="toShow" @on-ok="actionOK" @on-cancel="actionCancel">
    <div slot="header" style="height:50px">
      <div>编辑</div>
      <Row style="height:100%;padding:15px 0 5px 0px" justify="center" align="middle">
        <Col span="12" class="col"><Button :type="wod?'primary':'text'" class="btn" @click="changeClick('WIFI')">WIFI</Button></Col>
        <Col span="12" class="col"><Button :type="wod==false?'primary':'text'" class="btn" @click="changeClick('DEVICE')">DEVICE</Button></Col>
      </Row>
    </div>

    <div v-if="data!=null">
      <Collapse simple accordion v-model="collapse">
        <Panel v-for="(item,index) of data.items" :key='item.name' :name="String(index)">
          {{item.name}}
          <Form v-if="item.items" :label-width="120" slot="content">
            <FormItem v-for="subItem of item.items" :key='subItem.name' :label="subItem.name" class="leaf">
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
    <Spin size="large" fix v-if="isLoading"></Spin>
  </Modal>
</template>

<style scoped>
  .col {
    height: 100%;
  }

  .btn {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center
  }

  .leaf {
    padding-left: 0px;
    margin-bottom: 5px;
  }

  .leafTitle {
    color: rgb(107, 105, 105)
  }

  .leafContent {
    color: dodgerblue;
    font-weight: bold
  }

</style>

<script>
  // function stringToHex(str) {
  //   var val = '';
  //   for (var i = 0; i < str.length; i++) {
  //     if (val === '') {
  //       val = str.charCodeAt(i).toString(16);
  //     } else {
  //       val += ',' + str.charCodeAt(i).toString(16);
  //     }
  //   }
  //   return val;
  // }

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

  export default {
    props: {
      json: Object,
      'show': Boolean,
      'isLoading': Boolean,
      'number': String
    },
    methods: {
      actionOK() {
        this.$emit('action', 'ok', this.data)
        this.wod = 'WIFI'
      },
      actionCancel() {
        this.$emit('action', 'cancel')
        this.wod = 'WIFI'
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
            console.log(`key:${key}  type:${sitem.type}`);
          } else {
            sitem.items = []
            sitem.type = 'node'
            console.log(`key:${key}  type:${sitem.type}`);
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
      data: {
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
                data.DevID = this.json['Edit Items'][key]

                data.Packet = this.json['Cfg Packet'].NodeVal
                data.path = this.json['Cfg Packet'].path
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
