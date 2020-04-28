/*
能操作分配集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const FpSchema = new mongoose.Schema({
  applty_pop: {type: String}, 
  applty_phone: {type: String}, 
  apply_time: {type: Number,default: Date.now}, 
  fp_time:{type: Number, default: Date.now},
  sale_name:{type: String},
  seehouse_add:{type: String},
  status: {type: Number, default: 0},
})


// 3. 定义Model(与集合对应, 可以操作集合)
const FpModel = mongoose.model('fengpeis', FpSchema)

// 4. 向外暴露Model
module.exports = FpModel