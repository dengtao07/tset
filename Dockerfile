FROM csbase.registry.cmbchina.cn/paas/cmb-nginx-1.9.7:latest

COPY ./dist ${DEPLOYMENTS_DIR}
COPY ./BuildScript/nginx.conf ${NGINX_HOME}/conf/nginx.conf

EXPOSE 8080

CMD ["/opt/nginx/sbin/nginx","-p","/opt/nginx","-c","/opt/nginx/conf/nginx.conf"]