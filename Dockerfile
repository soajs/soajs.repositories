FROM soajsorg/node-slim

RUN mkdir -p /opt/soajs/soajs.repositories/node_modules/
WORKDIR /opt/soajs/soajs.repositories/
COPY . .
RUN npm install

CMD ["/bin/bash"]