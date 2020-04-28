const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '房源',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '分类管理',
        key: '/category',
        icon: 'bars'
      },
      {
        title: '房源管理',
        key: '/product',
        icon: 'tool'
      },
    ]
  },
  {
    title: '房源列表',
    key: '/houselist',
    icon: 'tool'
  },
  {
    title: '用户管理',
    key: '/user',
    icon: 'user'
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'safety',
  },

  // {
  //   title: '图形图表',
  //   key: '/charts',
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       title: '柱形图',
  //       key: '/charts/bar',
  //       icon: 'bar-chart'
  //     },
  //     {
  //       title: '折线图',
  //       key: '/charts/line',
  //       icon: 'line-chart'
  //     },
  //     {
  //       title: '饼图',
  //       key: '/charts/pie',
  //       icon: 'pie-chart'
  //     },
  //   ]
  // },

  // {
  //   title: '订单管理',
  //   key: '/order',
  //   icon: 'windows',
  // },
  // {
  //   title: 'GitHub',
  //   key: '/github',
  //   icon: 'github',
  // },
  // {
  //   title: '组件拖拽',
  //   key: '/drag',
  //   icon: 'drag',
  // },
  {
    title: '客户管理',
    key: '/hooks',
    icon: 'smile',
    children: [
      {
        title: '人员分配',
        key: '/hooks/slice',
        icon: 'cloud-upload'
      },
      {
        title: '我的分配',
        key: '/hooks/myslice',
        icon: 'cloud-upload'
      },
      {
        title: '我的预约',
        key: '/hooks/myorder',
        icon: 'cloud-upload'
      },
      // {
      //   title: '实践',
      //   key: '/hooks/test',
      //   icon: 'loading'
      // },
    ]
  },
  // {
  //   title: '长列表渲染',
  //   key: '/bigTable',
  //   icon: 'table',
  // },
]

export default menuList