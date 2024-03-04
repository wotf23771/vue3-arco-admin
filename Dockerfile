FROM nginx:latest

# 复制网站静态文件到 Nginx 默认的 HTML 目录
COPY ./dist /usr/share/nginx/html

# 暴露端口 80，Nginx 默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
