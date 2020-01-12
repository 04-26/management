export function TMap() {
    return new Promise(function(resolve, reject) {
      window.init = function() {
        resolve(qq)
      }
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=CVDBZ-EIC33-HXD3D-3HPR6-B2JLJ-2YB7H'
      script.onerror = reject
      document.head.appendChild(script)
    })
  }