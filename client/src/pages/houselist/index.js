import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { Card,Select,Button,Table,Input,message,Typography} from 'antd';
import {reqProductList,reqSearchProduct,reqDeleteProduct,reqProductOrderStatus} from 'api'
import {formatNumber} from '../../utils/common'
import _ from "lodash"
const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 6
const btnStyle={
  marginLeft:'0.5rem'
}
class Product extends Component {
  state = {
    pageNum:1,
    selectValue: '1',
    productListSource:[],
    total:0,
    btnLoading:false,
    tableLoading:false,
    inputPlaceholder:'请输入名称',
    inputValue:'',
    loading:false
  };
  constructor(){
    super()
    const {loading} = this.state
    this.columns = [
      {
        title: '房屋名称',
        dataIndex: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(record)=>(`￥${record}`)
      },
      {
        title: '房屋描述',
        dataIndex: 'desc',
      },
      {
        title: '状态',
        render:(record)=>(<span><Text type={"danger"} >{record.status?'未租':'已租'}</Text><Button size='small' style={btnStyle} loading={loading}
          onClick={()=>this.预约看房(record)}
          type='primary'>预约看房</Button></span>
          )
      },
      {
        title: '操作',
        render:(record)=>(
          <span>
          <Button type="link" onClick={()=>(
            this.productDetail(record)
          )}>详情</Button>
          </span>
        )
      },
    ];
  }
  // 上架
  //  const {productId, status} = req.body
  // 下架 用中文没毛病 维持好就行 0 下架 1上架
 预约看房 = async (product)=>{
    this.setState({loading:true})
    const params={
      productId:product._id,
      seehouse_add:product.name+product.desc,
      yhId:JSON.parse(localStorage.getItem("user_key"))._id,
      applty_pop:JSON.parse(localStorage.getItem("user_key")).username,
      applty_phone:JSON.parse(localStorage.getItem("user_key")).phone,
      orderstatus:1
      
    }
    const res= await reqProductOrderStatus(params)
    if(res.status===0){
      debugger
      this.setState({loading:false})
      message.success('预约成功！')
      this.getProductList(this.pageNum)
    }
  }
  productUpdate= async (record)=>{
    this.props.history.push('/product/add',record)
  }
  productDelete = async (record) =>{
    const res = await reqDeleteProduct({_id:record._id}) 
    if(res.status===0){
      this.getProductList(1)
    }
  }
  // 房屋详情
  productDetail = (data) => {
    // 这种语法只有 BrowserRouter 才支持 HashRouter不支持请注意
    this.props.history.push({
      pathname: '/product/detail',
      state: data
    })
    // 1、HashRouter不支持请注意 可以存到redux进行处理
    // 2、存到内存中（记得在componentWillUnmount进行清除内存中的数据）
  }
  
  // 搜索筛选框
  selectHandleChange = selectValue => {
    this.setState({ selectValue,
      inputPlaceholder:selectValue==='1'?'请输入名称':'请输入描述',
      inputValue:''
    });
  };
  inputValue=(e)=>{
    this.setState({
      inputValue:e.target.value
    })
  }
  // 搜索
  // searchBtn= async (e)=>{
  //   e.stopPropagation();
  //   const {selectValue,inputValue}=this.state
  //   if( !inputValue || !inputValue.trim()){
  //     this.setState({inputValue:null})
  //     message.warning('不能为空')
  //     return
  //   }
  //   this.setState({loading:true})
  //   const params={
  //     pageNum,pageSize:PAGE_SIZE
  //   }
  //   selectValue==='1'?params.productName=inputValue:params.productDesc=inputValue
  //   const res = await reqSearchProduct(params)
  //   const {list,total}=res.data
  //   if(!list[0]){message.warn('搜索结果为空！')}
  //   this.setState({total,productListSource:list,loading:false})
  // }
  // 添加房屋
  addProductBtn=(e)=>{
    e.stopPropagation()
    this.props.history.push('/product/add')
  }
  // 房屋列表
  getProductList= async(pageNum)=>{
    const {inputValue} = this.state
    this.pageNum=pageNum //保存全局，状态更新的时候能够定位到当前页
    this.setState({
      tableLoading:true,
    })
    let res;
    if(inputValue){ //搜索房屋列表
      this.setState({
        btnLoading:true,
      })
       res= await reqSearchProduct({pageNum,pageSize: PAGE_SIZE})
    }else{ //全部房屋列表
       res= await reqProductList({pageNum,pageSize:PAGE_SIZE})
    }
    const {total,list}=res.data
    if (res.status === 0 && list.length > 0) {
      // 格式化金额
      list.forEach(item=>{
        item.price=formatNumber(item.price)
      })
     
      this.setState({
        total,
        productListSource: _.filter(list, function(o) { return !o.orderstatus; }),
        tableLoading:false,
        btnLoading:false
      })
    }
  }
  componentDidMount(){
    this.getProductList(1)
  }
  render() {
    const {tableLoading,productListSource,total,btnLoading,inputPlaceholder,inputValue}=this.state
    const title=()=>{
      return (
       <div>
       <Select defaultValue="1" 
       style={{ width: '7rem' }}
       onChange={this.selectHandleChange}>
       <Option value="1">按名称搜索</Option>
       <Option value="2">按描述搜索</Option>
       </Select>
      <Input style={{width:200,marginLeft:6,marginRight:6}}  placeholder={inputPlaceholder} onChange={this.inputValue} value={inputValue} />
      <Button type='primary' style={{transform:'scale(1)'}} onClick={()=>this.getProductList(1)} loading={btnLoading}>搜索</Button>
       </div>
      )
    }
    const addComponment=()=>(
      <span>
      </span>
    )
    return (
      <Card title={title()} extra={addComponment()}>
       <Table size='small' dataSource={productListSource} columns={this.columns} rowKey={'_id'} bordered 
       loading={tableLoading}
       pagination={{
        current: this.pageNum,
        total,
        defaultPageSize: PAGE_SIZE,
        showQuickJumper: true,
        onChange:this.getProductList,
       }}
       />
      </Card>
    ); 
  }
}
export default withRouter(Product)