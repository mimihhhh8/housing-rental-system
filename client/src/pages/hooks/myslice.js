import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Card, Select, Button, Table, Input, Modal, Typography, Radio,message } from 'antd';
import { reqFpList, reqSearchProduct, handlecancleApi,addfenpei } from 'api'
import act_type from "../../config/type"
import moment from 'moment'
import _ from "lodash"
const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 10
const btnStyle = {
  marginLeft: '0.5rem'
}
class Product extends Component {
  state = {
    apply_id:"",//当前列表某一行对应的id
    pageNum: 1,
    selectValue: '1',
    productListSource: [],
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
      }
    ];
  }
  componentDidMount() {
    this.getProductList(1)
  }

  /* 
    @params "5e917f955bdf781de46e6cff"
  */
  // 分配
  handleCancle =async  (record) => {
    let res = await handlecancleApi({_id:record._id,yyfw_id:act_type.yyfw_id})
    if(res.status===0){
      message.success('成功！')
      this.getProductList(1)
    }
  }
 
  inputValue = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  // 房屋列表
  getProductList = async (pageNum) => {
    this.pageNum = pageNum //保存全局，状态更新的时候能够定位到当前页
    this.setState({
      tableLoading: true,
    })
    let res;
      res = await reqFpList({ pageNum, pageSize: PAGE_SIZE })
      const { total, list } = res.data
          this.setState({
            total,
            productListSource: _.filter(list, function(o) { return o.sale_name===act_type.sale_name;}),
            tableLoading: false,
            btnLoading: false
          })
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
  render() {
    const { tableLoading, productListSource } = this.state
    return (
      <Card>
        <Table size='small' dataSource={productListSource} columns={this.columns} rowKey={'_id'} bordered
          loading={tableLoading}
        />
      </Card>
    );
  }
}
export default withRouter(Product)