FROM node:10.12.0
ADD index.js /
ENV HTTPS_REDIRECT_PORT 8888
ENTRYPOINT ["node", "/index.js"]
