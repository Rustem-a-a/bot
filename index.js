import TelegramBot from 'node-telegram-bot-api'

const token = '6091989661:AAGm1GGlSvqp6LhXOzOeINZq7TwYVYMCP-4'

const bot = new TelegramBot(token, {polling: true})

const gameData = {}

const gameOptions = {
    reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
                [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
                [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                [{text: '0', callback_data: '0'}]
            ]
        }
    )
}
const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Играть еще раз', callback_data: '/again'}]]
    })
}
const fooRandom = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю число от 1 до 10,а ты попробуй его отгадать')
    const randomForGame = Math.floor(Math.random() * 10)
    gameData[chatId] = randomForGame
    console.log(gameData)
    await bot.sendMessage(chatId, 'Отгадывай,у тебя одна попытка', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Ваше имя'},
        {command: '/game', description: 'Сыграй в игру и угадай число'},
    ])
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        const userName = msg.chat.first_name
        console.log(1)
        console.log(msg)
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/09a/ef2/09aef250-2252-34d0-876f-5b3b1e08869d/192/1.webp')
            return bot.sendMessage(chatId, 'Привет!')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Тебя зовут ' + userName)
        }
        if (text === '/game') {
            return fooRandom(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понял')
    })
    bot.on('callback_query', async msg => {
            const chatId = msg.message.chat.id
            const data = msg.data
            console.log(data)
            if ('/again' === data) {
                return fooRandom(chatId)
            }
            if (gameData[chatId] == data) {
                await bot.sendMessage(chatId, 'Ты отгадал')
                await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/571/59b/57159b97-c35e-4d71-ae4b-a36aeb51166a/192/17.webp')
                await bot.sendMessage(chatId, 'Хочешь еще раз сыграть?', againOptions)
            } else {
                bot.sendMessage(chatId, 'Ты не отгадал')
            }

        }
    )
}
start()