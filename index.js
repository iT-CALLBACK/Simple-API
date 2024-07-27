// Подключаем модуль express для создания приложения
const express = require('express');

// Создаем экземпляр приложения Express
const app = express();

// Устанавливаем порт, на котором будет запущен сервер
const port = 3000;

// Используем middleware для парсинга JSON в теле запросов
app.use(express.json());

// Подключаем модуль swagger-ui-express для отображения документации API
const swaggerUi = require('swagger-ui-express');

// Подключаем модуль swagger-jsdoc для генерации документации из JSDoc комментариев
const swaggerJsDoc = require('swagger-jsdoc');

// Настройки для генерации документации Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Версия OpenAPI
    info: {
      title: 'Todo API', // Название API
      version: '1.0.0', // Версия API
      description: 'API для управления задачами' // Описание API
    },
    servers: [
      {
        url: `http://localhost:${port}` // URL сервера
      }
    ]
  },
  apis: ['index.js'] // Файл, в котором находятся JSDoc комментарии для Swagger
};

// Генерируем документацию Swagger на основе настроек
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Подключаем middleware для отображения документации по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Инициализируем массив задач
let todos = [
  { id: 1, title: 'Learn Node.js', completed: false }, // Задача 1
  { id: 2, title: 'Build an API', completed: false } // Задача 2
];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Приветственное сообщение
 *     responses:
 *       200:
 *         description: Успешно
 */
// Определяем маршрут для приветственного сообщения
app.get('/', (req, res) => {
  res.send('Привет, мир!'); // Отправляем ответ с текстом "Привет, мир!"
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Получить все задачи
 *     responses:
 *       200:
 *         description: Успешно
 */
// Определяем маршрут для получения всех задач
app.get('/todos', (req, res) => {
  res.json(todos); // Отправляем массив задач в формате JSON
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Получить задачу по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID задачи
 *     responses:
 *       200:
 *         description: Успешно
 *       404:
 *         description: Задача не найдена
 */
// Определяем маршрут для получения задачи по ID
app.get('/todos/:id', (req, res) => {
  // Находим задачу по ID
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  // Если задача не найдена, отправляем статус 404
  if (!todo) return res.status(404).send('Task not found');
  // Если задача найдена, отправляем её в формате JSON
  res.json(todo);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Создать новую задачу
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Задача создана
 */
// Определяем маршрут для создания новой задачи
app.post('/todos', (req, res) => {
  // Проверяем, есть ли в теле запроса поле title
  if (!req.body.title) {
    // Если нет, отправляем статус 400 с сообщением об ошибке
    return res.status(400).send('Title is required');
  }

  // Создаем новую задачу
  const todo = {
    id: todos.length + 1, // Генерируем ID для новой задачи
    title: req.body.title, // Устанавливаем заголовок задачи
    completed: false // Задача по умолчанию не выполнена
  };
  // Добавляем новую задачу в массив задач
  todos.push(todo);
  // Отправляем статус 201 и новую задачу в формате JSON
  res.status(201).json(todo);
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Обновить задачу по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID задачи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Задача обновлена
 *       404:
 *         description: Задача не найдена
 */
// Определяем маршрут для обновления задачи по ID
app.put('/todos/:id', (req, res) => {
  // Находим задачу по ID
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  // Если задача не найдена, отправляем статус 404
  if (!todo) return res.status(404).send('Task not found');

  // Проверяем, есть ли в теле запроса поле title и completed
  if (!req.body.title || typeof req.body.completed !== 'boolean') {
    // Если нет, отправляем статус 400 с сообщением об ошибке
    return res.status(400).send('Invalid data');
  }

  // Обновляем заголовок и статус выполнения задачи
  todo.title = req.body.title;
  todo.completed = req.body.completed;
  // Отправляем обновленную задачу в формате JSON
  res.json(todo);
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Удалить задачу по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID задачи
 *     responses:
 *       200:
 *         description: Задача удалена
 *       404:
 *         description: Задача не найдена
 */
// Определяем маршрут для удаления задачи по ID
app.delete('/todos/:id', (req, res) => {
  // Находим задачу по ID
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  // Если задача не найдена, отправляем статус 404
  if (!todo) return res.status(404).send('Task not found');

  // Находим индекс задачи в массиве
  const index = todos.indexOf(todo);
  // Удаляем задачу из массива
  todos.splice(index, 1);
  // Отправляем удаленную задачу в формате JSON
  res.json(todo);
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  // Выводим стек ошибки в консоль
  console.error(err.stack);
  // Отправляем статус 500 и сообщение об ошибке
  res.status(500).send('Something broke!');
});

// Запускаем сервер и выводим сообщение о том, что сервер запущен
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
