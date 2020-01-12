module.exports = {
    baseUrl: 'https://uatbbshop.xsztn.cn',
    publicPath:'./',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'https://uatbbshop.xsztn.cn',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/upfile':{
                target:'https://uatbbclient.xsztn.cn',
                changeOrigin:true,
                pathRewrite:{
                    '/upfile':''
                }
            },
            '/img':{
                target:'https://uatbbimage.xsztn.cn',
                changeOrigin:true,
                pathRewrite:{
                    '/img':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            },
            '/token':{
                target:'http://127.0.0.1:7001',
                changeOrigin:true,
                pathRewrite:{
                    '/token':''
                }
            },
        }
    },
    // assetsDir:"dist
    
 
}