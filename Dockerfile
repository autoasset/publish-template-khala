# 使用官方 Node.js 镜像作为基础镜像
FROM node:21-alpine

# 设置工作目录
WORKDIR /usr/src/app
RUN npm install -g typescript
# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./
# 使用 Yarn 2 安装依赖
RUN yarn install
# 复制项目文件到工作目录
COPY . .
RUN tsc -p .

# 设置入口点为 Khala CLI
ENTRYPOINT ["yarn", "node", "./lib/cli-main.js"]

# 默认命令，可根据需要修改或覆盖
CMD ["--help"]