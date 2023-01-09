const TelegramApi = require('node-telegram-bot-api');

const {gameOptions, againOptions} = require('./options')

const token = "5859984210:AAHyV5cJRbMfRj4OJJpPZodbUfZhcQ1tIVw";

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю число от 0 до 9, а ты должен угадать!');
    const randomNumber = String(Math.floor(Math.random() * 10));
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай :3', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Начать игру'}
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp')
            return bot.sendMessage(chatId, `Привет ${message.from.first_name}!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name} ${message.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю -_____-')
    })

    bot.on('callback_query', async message => {
        const data = message.data;
        const chatId = message.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}!`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К твоему сожалению я загадал ${chats[chatId]}!`, againOptions)}
    })
}

start()