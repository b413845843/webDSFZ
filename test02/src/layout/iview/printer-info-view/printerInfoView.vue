<template>
  <Card id="printerInfo">
    <Row style="padding-bottom:10px">
      <Select v-model="searchKey" style="width:100px">
        <Option v-for="col in tableCols" :value="col.key" :key="col.key" v-if="col.search">{{col.title}}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" style="width:200px;margin-left:4px" v-model="searchValue"/>
      <Button type="info" @click="handleSearch" style="margin-left:2px"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      <Button type="info" @click="fetchData" style="margin-left:4px">
        <Icon type="md-refresh" size=16 /> 刷新列表
      </Button>

      <Poptip placement="left" @on-popper-show="fetchVersion" style="float:right;margin-right:10px;">
        <Button type="text">
          <Icon type="md-information-circle" size=14 /> 版本信息</Button>
        <div v-if="version" class="versionSpan" slot="content">
          <p>webVer : {{webVersion}}</p>
          <p> dsPrnService : {{version.dsPrnService.Ver}} </p>
          <p>libdsDevJsLib.so : {{version.DevLib['libdsDevJsLib.so'].Ver}} </p>
          <p>libdsDevBmp.so : {{version.DevLib['libdsDevBmp.so'].Ver}} </p>
        </div>
        <p v-else slot="content">获取数据...</p>
        <Spin size="large" fix v-if="versonFetching"></Spin>
      </Poptip>
    </Row>

    <Table stripe :columns="tableCols" :data="insideTableData" :loading="tableLoading">
    </Table>

    <Row>
      <Page :total="tableData.length" size="small" show-elevator show-sizer style="margin-top:10px" />
    </Row>

    <node-view-modal :toShow="infoModal" :nodes='infoNodes' @action='infoModalAction' :number="currentNumber"></node-view-modal>

    <config-view :show="showConfig" :isLoading="isConfigLoading" @action="configAction" @get-config="fetchConfig" :json="configJson"
      :number="currentNumber"></config-view>

    <print-view :show="showPrint" @action="printAction" :number="currentNumber"></print-view>
  </Card>
</template>

<script>
  import './printerInfoView.less'
  import {
    deepClone
  } from '@/tools/copy';
  import {
    getPrinterList,
    getPrinterInfo,
    addPrinter,
    editPrinter,
    getVersion,
    getConfig
  } from '@/api/info';
  import {
    parseNode2
  } from '@/tools/parseJsonToNode';

  const status = ['Ready', 'Busy', 'Warn', 'Error', 'None', 'Dead'];

  function defaultInfo() {
    return {
      Number: Math.floor(Math.random() * 20000 + 1),
      Model: 'DL-210',
      Status: status[Math.floor(Math.random() * 4 + 1)],
      Received: 1234,
      Jobs: Math.floor(Math.random() * 255 + 1),
      Ticks: Math.floor(Math.random() * 50 + 1)
    };
  }

  export default {
    name: 'PrinterInfoView',
    data() {
      return {
        tableCols: [{
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('more-info-row', {
                props: {
                  row: params.row
                }
              });
            }
          },
          {
            title: '设备编码',
            key: 'Number',
            search: true,
            sortable: true,
            render: (h, params) => {
              return h(
                'a', {
                  on: {
                    click: () => {
                      console.log(`请求info 0 ${params.row.Number}`);

                      this.fetchInfo(params.row.Number, 0);
                    }
                  }
                },
                params.row.Number.toUpperCase()
              );
            }
          },
          {
            title: '型号',
            key: 'Model',
            search: true,
            sortable: true,
            render: (h, params) => {
              return h(
                'a', {
                  on: {
                    click: () => {
                      console.log(`请求info 1 ${params.row.Number}`);

                      this.fetchInfo(params.row.Number, 1);
                    }
                  }
                },
                params.row.Model
              );
            }
          },
          {
            title: '网络/状态',
            key: 'Status',
            sortable: true,
            search: true,
            minWidth: 80,
            render: (h, params) => {
              // const color = params.row.Status === 'Ready'?'success':'error'
              // const type = params.row.Net === 'Online'?'Ready':'Error'

              return h(
                'dot-link', {
                  props: {
                    click: () => {
                      console.log(`请求info 2 ${params.row.Number}`);

                      this.fetchInfo(params.row.Number, 2);
                    },
                    text: params.row.Status,
                    type: params.row.Net
                  }
                }
              );
            }
          },
          {
            title: '接收缓存',
            key: 'Received',
            sortable: true
          },
          {
            title: '作业数',
            key: 'Jobs',
            sortable: true
          },
          {
            title: '心跳数',
            key: 'Ticks',
            sortable: true
          },
          {
            title: '操作',
            render: function (h, params) {
              return h('div', [
                h(
                  'a', {
                    style: {
                      marginRight: '20px',
                      color: '#000'
                    },
                    on: {
                      click: () => {
                        console.log(
                          `index ${params.index} number ${params.row.Number}`
                        );
                        this.showPrint = true;
                        this.currentNumber = params.row.Number;
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'md-print',
                        size: 16
                      }
                    })
                  ]
                ),
                h(
                  'a', {
                    style: {
                      marginRight: '20px',
                      color: '#000'
                      // border:0,
                      // backgroundColor: 'transparent'
                    },
                    on: {
                      click: () => {
                        console.log(
                          `index ${params.index} number ${params.row.Number}`
                        );
                        this.currentNumber = params.row.Number;
                        this.fetchConfig('WIFI');
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'md-hammer',
                        size: 16
                      }
                    })
                  ]
                )
              ]);
            }.bind(this)
          }
        ],
        infoRules: {
          Number: [{
            required: true,
            message: 's',
            trigger: 'blur'
          }],
          Model: [{
            required: true,
            message: 's',
            trigger: 'blur'
          }],
          Status: [{
              required: true,
              message: 's',
              trigger: 'blur'
            },
            {
              type: 'enum',
              enum: ['Ready', 'Busy', 'None'],
              trigger: 'blur'
            }
          ],
          Received: [{
            required: true,
            message: 's',
            trigger: 'blur'
          }],
          Jobs: [{
            required: true,
            message: 's',
            trigger: 'blur'
          }],
          Ticks: [{
            required: true,
            message: 's',
            trigger: 'blur'
          }]
        },
        tableData: [],
        insideTableData: [],
        tableLoading: true,
        deleteModel: false,
        editeModel: false,
        addModel: false,
        newInfo: {
          Number: '',
          Model: '',
          Status: '',
          Received: 0,
          Jobs: 0,
          Ticks: 0
        },
        type: '',
        status: status,
        version: null,
        versonFetching: false,
        showConfig: false,
        isConfigLoading: false,
        configJson: {},
        currentNumber: '',
        showPrint: false,
        isGettingPrinting: false,
        filterValue: [],
        infoModal: false,
        infoNodes: [],
        webVersion: '1.12.10.1',
        searchKey: '',
        searchValue: ''
      }
    },
    mounted() {
      this.fetchData();
    },
    watch: {
      tableData (val) {
        this.insideTableData = val.map(item => {
          return item
        })
        this.handleSearch()
      }
    },
    methods: {
      configAction(action, status) {
        if (action === 'cancel') {
          this.showConfig = false;
        } else {
          this.isConfigLoading = status
        }
      },
      printAction(action) {
        if (action === 'cancel') {
          this.showPrint = false;
        }
      },
      infoModalAction() {
        this.infoModal = false
      },
      async fetchVersion() {
        this.versonFetching = true;
        this.version = null;
        await getVersion('json')
          .then(res => {
            this.version = res.data;
            console.log(res.data);
          })
          .catch(err => {
            console.log(`catch ${err}`);
          });

        this.versonFetching = false;
      },
      async fetchConfig(type) {
        this.showConfig = true;
        this.isConfigLoading = true;
        this.configJson = null;
        await getConfig(this.currentNumber, type)
          .then(res => {
            this.configJson = res.data;
          })
          .catch(err => {
            console.log(err);
            this.$Message.error({
              content: `错误 : ${err}`
            });
          });
        console.log('stop loading');
        setTimeout(() => {
          this.isConfigLoading = false;
        }, 50);
      },
      async fetchData() {
        this.tableLoading = true;
        this.tableData = [];
        console.log('start fetch data');
        await getPrinterList()
          .then(res => {
            this.tableData = res.data;
          })
          .catch(err => {
            console.log(err);
            this.$Message.error({
              content: `错误 : ${err}`
            });
            this.tableData = [];
          });

        this.tableLoading = false;
      },
      async fetchInfo(number, type) {
        await getPrinterInfo(number, type)
          .then(res => {
            let nodes = parseNode2(res.data)
            this.currentNumber = number
            this.infoNodes = nodes
            this.infoModal = true
          })
          .catch(err => {
            console.log(err);
            this.$Message.error({
              content: `错误 : ${err}`
            })
          })

        this.tableLoading = false
      },
      showDeleteModal(row) {
        this.deleteModel = true
      },
      showAddModal() {
        this.newInfo = defaultInfo()
        this.type = 'add'
        this.addModel = true
      },
      showEditModal(row) {
        this.newInfo = deepClone(row)
        this.type = 'edit'
        this.addModel = true
      },
      handleSubmit(name) {
        this.$refs[name].validate(
          async function (valid) {
            if (valid) {
              this.$Message.info({
                content: '验证成功'
              })

              let res
              if (this.type === 'add') {
                res = await addPrinter(this.newInfo);
              } else {
                res = await editPrinter(this.newInfo);
              }
              let message = this.type === 'add' ? '添加' : '编辑';
              if (res.data === undefined) {
                this.$Message.error({
                  content: `错误`
                })
              } else {
                this.$Message.success({
                  content: `${message}成功`
                })

                this.fetchData()
              }

              this.addModel = false
            } else {
              this.$Message.error({
                content: '验证失败'
              })
            }
          }.bind(this)
        )
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      handleClear (e) {
        if (e.target.value === '') {
          this.insideTableData = this.tableData.map(item => {
          return item
        })
        }
      },
      handleSearch () {
        this.insideTableData = this.tableData.filter(item => {
          if (item[this.searchKey] && this.searchValue) {
            const source = item[this.searchKey].toUpperCase()
            const search = this.searchValue.toUpperCase()
            return source.indexOf(search) > -1
          } else {
            return 1;
          }
        })
      }
    }
  };

</script>
