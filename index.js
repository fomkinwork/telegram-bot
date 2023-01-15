const TelegramApi = require('node-telegram-bot-api');

require('cross-fetch/polyfill');

const {gameOptions, againOptions} = require('./options')

const token = "5859984210:AAHyV5cJRbMfRj4OJJpPZodbUfZhcQ1tIVw";

const bot = new TelegramApi(token, {polling: true})

const chats = {}

function getRandomIntInclusive() {
    const min = 1;
    const max = 49;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю число от 0 до 9, а ты должен угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай :3', gameOptions)
}

const getCompliment = async () => {
    try {
        const res = await fetch('https://complimentr.com/api');

        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }

        const compl = await res.json();
        return JSON.stringify(compl.compliment).slice(1, -1);

    } catch (err) {
        console.error(err);
    }
}




const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/gachitime', description: 'TIME TO GACHI'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Начать игру'},
        {command: '/compliment', description: 'Получить комплимент'}
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId,`https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp`)
            return bot.sendMessage(chatId, `Привет ${message.from.first_name}!`)
        }
        if (text === '/gachitime') {
            await bot.sendSticker(chatId,`https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/${getRandomIntInclusive()}.webp`)
            return bot.sendMessage(chatId, `GACHITIME!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name} ${message.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text === '/compliment') {
            const compl = await getCompliment()
            return bot.sendMessage(chatId, `${compl}`)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю -_____-')
    })

    bot.on('callback_query', async message => {
        const data = message.data;
        const chatId = message.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}!`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К твоему сожалению я загадал ${chats[chatId]}!`, againOptions)}
    })
}


start()