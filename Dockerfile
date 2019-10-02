FROM node:10.12.0
ADD index.js /
ENTRYPOINT ["node", "/index.js"]
