1. nginx 配置
upstream nodenuxt {
    server 127.0.0.1:3002; #nuxt项目 监听端口
    keepalive 64;
}

server {
    listen 80;
    server_name mysite.com;
    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;  
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_cache_bypass $http_upgrade;
        proxy_pass http://nodenuxt; #反向代理
    }
}



2. 项目在本地完成后，npm run build 打包应用,
打包完之后把
.nuxt
static
nuxt.config.js
package.json
server
传到服务器上去

3. 运行npm install 安装package里的依赖


4. pm2开启进程守护
pm2 start npm --name "my-nuxt" -- run start
其中 my-nuxt的名称是 我们在package中的项目名称
执行完pm2的启动命令后，我们用 pm2 list 查看一下进程列表，我截一下我个人服务器的pm2列表