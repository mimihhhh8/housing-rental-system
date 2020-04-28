import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Card, Select, Button, Table, Input, Modal, Typography, Radio,message } from 'antd';
import { reqFpList, reqSearchProduct, getFpData,addfenpei } from 'api'
import { formatNumber } from '../../utils/common'
import act_type from "../../config/type"
import moment from 'moment'
import _ from "lodash"
const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 6
class Product extends Component {
  state = {
    apply_id:"",//当前列表某一行对应的id
    pageNum: 1,
    selectValue: '1',
    productListSource: [],
    saleList:[],
    total: 0,
    btnLoading: false,
    tableLoading: false,
    inputPlaceholder: '请输入名称',
    inputValue: '',
    loading: false,
    visible: false,
    sale_name:'',
  };
  constructor() {
    super()
    this.handleSaleName=this.handleSaleName.bind(this)
    const { loading } = this.state
    this.columns = [
      {
        title: '申请人',
        dataIndex: 'applty_pop',
      },
      {
        title: '申请人联系方式',
        dataIndex: 'applty_phone',
      },
      {
        title: '申请时间',
        dataIndex: 'apply_time',
          render:(apply_time)=>(moment(apply_time).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: '分配时间',
        dataIndex: 'fp_time',
        render:(fp_time)=>(moment(fp_time).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: '销售名称',
        dataIndex: 'sale_name',
      },
      {
        title: '看房地址',
        dataIndex: 'seehouse_add',
      },
      {
        title: '状态',
        render: (record) => (<span><Text type={"danger"} >{record.status ? '已分配' : '未分配'}</Text></span>
        )
      },
      {
        title: '操作',
        render: (record) => (
          <Button type="link"
            // disabled={record.status}
            onClick={() => (
              this.productDetail(record)
            )}>分配</Button>
        )
      },
    ];
  }

  /* 
    @params "5e917f955bdf781de46e6cff"
  */
  // 分配
  productDetail =async  (data) => {
    this.setState({
      apply_id:data._id
    })
    let res = await getFpData()
    this.setState({
      saleList:_.filter(res.data, function(o) { return o.role_id===act_type.sale_id;})
    })
    this.setState({
      visible: true
    })
  }

  // 搜索筛选框
  selectHandleChange = selectValue => {
    this.setState({
      selectValue,
      inputPlaceholder: selectValue === '1' ? '请输入名称' : '请输入描述',
      inputValue: ''
    });
  };
  inputValue = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  // 房屋列表
  getProductList = async (pageNum) => {
    const { inputValue } = this.state
    this.pageNum = pageNum //保存全局，状态更新的时候能够定位到当前页
    this.setState({
      tableLoading: true,
    })
    let res;
    if (inputValue) { //搜索房屋列表
      this.setState({
        btnLoading: true,
      })
      res = await reqSearchProduct({ pageNum, pageSize: PAGE_SIZE })
    } else { //全部房屋列表
      res = await reqFpList({ pageNum, pageSize: PAGE_SIZE })
    }
    const { total, list } = res.data
    if (res.status === 0 && list.length > 0) {
      // 格式化金额
      list.forEach(item => {
        item.price = formatNumber(item.price)
      })

      this.setState({
        total,
        productListSource: list,
        tableLoading: false,
        btnLoading: false
      })
    }
  }
  // 模态框--分配销售员
  handleOk = async e => {
    // 发一条请求
    const res=await addfenpei({id:this.state.apply_id,name:this.state.sale_name})
    if(res.status===0){
      message.success('分配成功！')
    }
    this.setState({
      visible: false,
    });

    this.getProductList(1)
  };
  // 获得销售员名字
  handleSaleName(e){
    this.setState({
      sale_name:e.target.value
    })
  }
  componentDidMount() {
    this.getProductList(1)
  }
  render() {
    const { tableLoading, productListSource, total, btnLoading, inputPlaceholder, inputValue } = this.state
    const title = () => {
      return (
        <div>
          <Select defaultValue="1"
            style={{ width: '7rem' }}
            onChange={this.selectHandleChange}>
            <Option value="1">按名称搜索</Option>
            <Option value="2">按描述搜索</Option>
          </Select>
          <Input style={{ width: 200, marginLeft: 6, marginRight: 6 }} placeholder={inputPlaceholder} onChange={this.inputValue} value={inputValue} />
          <Button type='primary' style={{ transform: 'scale(1)' }} onClick={() => this.getProductList(1)} loading={btnLoading}>搜索</Button>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.handleSaleName}>
              {this.state.saleList.map((item,index)=>(
              <Radio.Button value={item.username} key={index}>{item.username}</Radio.Button>
              ))}
            </Radio.Group>
          </Modal>
        </div>
      )
    }
    const addComponment = () => (
      <span>
      </span>
    )

    return (
      <Card title={title()} extra={addComponment()}>
        <Table size='small' dataSource={productListSource} columns={this.columns} rowKey={'_id'} bordered
          // loading={tableLoading}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProductList,
          }}
        />
      </Card>
    );
  }
}
export default withRouter(Product)