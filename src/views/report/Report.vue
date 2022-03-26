<template>
  <div class="report-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图列表展示区域 -->
    <el-card class="box-card" shadow='hover'>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="chart-user" style="width:70%; height:500px"></div>

    </el-card>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import _ from 'lodash'
  export default {
    name: 'Report',
    data() {
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            boundaryGap: false
          }],
          yAxis: [{
            type: 'value'
          }]
        }
      }
    },
    created() {

    },
    mounted() {
      this.echartsInit();
    },
    methods: {
      /* 获取数据 */


      /*echartsInit  */
      async echartsInit() {
        const {
          data: res
        } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.a = res.data;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart-user'));
        // 指定图表的配置项和数据
        const result = _.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
      }
    },
  }

</script>

<style lang="less" scoped>
  .report-container {
    height: 100%;
    width: 100%;
  }

</style>
