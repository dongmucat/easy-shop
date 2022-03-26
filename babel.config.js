/* 项目发布阶段使用的插件 */
const productionPlugins = []
if (process.env.NODE_ENV === 'production') {
  productionPlugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    /* 发布产品时候的插件数据 */
    ...productionPlugins,
    // 剥离除 “en” 以外的所有语言环境。
  ]
}
