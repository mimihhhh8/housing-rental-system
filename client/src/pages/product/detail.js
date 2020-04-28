import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Card,List,Icon,Typography} from 'antd'
import {reqCatagoryList} from 'api'
import _ from 'lodash'
const { Text } = Typography;
const listStyle={fontSize:15,marginRight:'1rem'}
class ProductDetail extends Component {
  state = { 
    flId:'',//分类id
    zflId:'',//子分类id
    flList:[],//分类信息
    zflList:[],//子分类信息
   }
  constructor(){
    super()
    this.title=(
      <Icon type="arrow-left" onClick={this.goBack} style={{fontSize:20}}/>
    )
  }
  goBack=(e)=>{
    this.props.history.goBack()
  }
  componentDidMount(){
    this.getFlData()
  }
  // 获取分类数据--
   getFlData = async ()=>{
     let  flId=this.props.location.state.pCategoryId
     let zflId=this.props.location.state.categoryId
     const {data} = await reqCatagoryList({flId})
     if(flId!=='0'){
      this.setState({flList:data}) //一级列表
    }else{
      this.setState({zflList:data}) //子列表
    }
    // if(flId){
    //   const {data} = await reqCatagoryList({flId})
    //   // 分类名称
    //   let singleFl=_.filter(data,{'_id':flId})[0].name
    // }
    //   const {data} = await reqCatagoryList({zflId})
    //   // 子分类名称
    //   // let singlezFl=_.filter(data,{'_id':zflId})
    
    
  }
  render() {
    const data=this.props.location.state //路由传进来的数据
    const listTitle=[
      '房屋名称','房屋描述','房屋价格','所属分类','房屋图片','房屋详情'
    ]
    return (
      <Card title={this.title}>
      <List
        header={<div>房屋详情</div>}
        bordered
        >
        <List.Item>
            <Text  style={listStyle}>{listTitle[0]}:</Text>{data.name}
        </List.Item>
        <List.Item>
            <Text  style={listStyle}>{listTitle[1]}:</Text>{data.desc}
        </List.Item>
        <List.Item>
            <Text  style={listStyle}>{listTitle[2]}:</Text>{data.price}
        </List.Item>
        <List.Item>
            <Text  style={listStyle}>{listTitle[3]}:</Text>{data.categoryId}-{data.pCategoryId}
        </List.Item>
        <List.Item>
            <Text  style={listStyle}>{listTitle[4]}:</Text>{'图片'}
        </List.Item>
        <List.Item>
            <Text  style={listStyle}>{listTitle[5]}:</Text>{data.detail}
        </List.Item>
        </List>
      </Card>
    ); 
  }
}
export default withRouter(ProductDetail)