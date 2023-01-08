const TelegramApi = require('node-telegram-bot-api');

const token = "5859984210:AAHyV5cJRbMfRj4OJJpPZodbUfZhcQ1tIVw";

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'}
])

bot.on('message', async message => {
    const text = message.text;
    const chatId = message.chat.id;

    if (text === '/start') {
        await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp')
        await bot.sendMessage(chatId, 'Добро пожаловать от бота, которого создал некит1111!')
    }
    if (text === '/info') {
        await bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name} ${message.from.last_name}`)
    }

    // bot.sendMessage(chatId, `Ты отправил мне ${text}`);

})