var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

var routes = {
    '/music.json':function(req, resp){
        // resp.setHeader('Content-Type','text/js;charset=utf-8')
        // resp.end(JSON.stringify(req.query))
        
        fs.readFile(path.join(__dirname, '/music.json'), 'utf8', function(err, content){
            if(err){
                resp.writeHead(404, 'not found')
                resp.end('not found')
            }else{
                resp.setHeader('Content-Type','text/plain;charset=utf-8')
                resp.writeHead(200, 'success')
                resp.write(content)
                resp.end()
            }
        })
    }
}

http.createServer(function(request, response){
    if(url.parse(request.url).pathname === '/favicon.ico'){
        response.end()
    }else{
        rootPath(request,response)
    }   
}).listen(8080)

function rootPath(request, response){
    var pathObj = url.parse(request.url)
    var routeFn = routes[pathObj.pathname]
    if(routeFn){
        //get数据
        request.query = pathObj.query

        //post数据
        var body = ''
        request.on('data',function(chunk){
            body += chunk
        }).on('end', function(){
            request.body = parseBody(body)
            routeFn(request, response)
        })


    }else{
        rootStatic(request, response)
    }
}

function parseBody(body){
    var bodyObj = {}
    body.split('&').forEach(function(cont){
        bodyObj[cont.split('=')[0]] = cont.split('=')[1]
    })
    return bodyObj
}


function rootStatic(request, response){
    var pathName = url.parse(request.url).pathname

    if(pathName === '/'){
        pathName += 'index.html'
    }

    // pathName = path.join('static',pathName)
    var filePath = path.join(__dirname, pathName)
    // console.log(filePath)
    fs.readFile(filePath, 'binary', function(err, content){
        if(err){
            response.writeHead(404, "not found")
            response.end('not found')
        }else{
            var ctype = ''
            switch(true){
                case /(.js)$/g.test(pathName): 
                    ctype = 'text/js;charset=utf-8'
                    break
                case /(.css)$/g.test(pathName): 
                    ctype = 'text/css;charset=utf-8'
                    break
                case /(.html)$/g.test(pathName): 
                    ctype = 'text/html'
                    break
                default:
                    ctype = 'text/plain;charset=utf-8'
            }

            response.setHeader('Content-type', ctype)
            response.writeHead(200, 'success yes')
            response.write(content,'binary')
            response.end()
        }
    })
}   