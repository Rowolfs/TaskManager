# Используем официальный Node.js образ в качестве базового
FROM node:18

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package*.json ./

RUN npm cache clean --force

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Открываем порт для сервера (по умолчанию 3000)
EXPOSE 3000

# Запускаем сервер
CMD ["node", "server.js"]
