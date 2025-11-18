# Base com Node LTS
FROM node:18

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código do projeto
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o NestJS
CMD ["npm", "run", "start:dev"]
