// import express from 'express';
// import {Request, Response} from "express";
import TelegramApi from 'node-telegram-bot-api';
// import cors from 'cors';
// import axios from 'axios';
// import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {GoogleSpreadsheet} from 'google-spreadsheet';

dotenv.config()

const doc = new GoogleSpreadsheet('1pUVZF8COsRBrzhfK2IIX6oSnQxyurD8BWhQfTFzX5Ow')
const bot = new TelegramApi(`${process.env.TELEGRAM_API_TOKEN}`, {polling: true})
const foo = process.env.GOOGLE_PRIVATE_KEY
async function start() {
    try {

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
            private_key: foo!.replace(/\\n/g, '\n'),
        })
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        //console.log(sheet.title);
        //console.log(sheet.gridProperties);
        const rows = await sheet.getRows();
        // console.log(await sheet.getRows());

        console.log(rows[1].date)
        const birthday = rows[1].date
        console.log('birthday', birthday.substring(0,5))
        const today = new Date().toLocaleDateString()
        console.log('today', today.substring(0,5))
        if(birthday.substring(0,5) === today.substring(0,5)) {
            const year = Number(Number(today.substring(6)) - Number(birthday.substring(6)))
            console.log('year', year)

        }

    } catch (error) {
        console.log(error)
    }

        bot.on('message', async msg => {
            const text: string | undefined = msg.text;
            const chatId: number = msg.chat.id;
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/a6f/1ae/a6f1ae15-7c57-3212-8269-f1a0231ad8c2/1.webp');
                await bot.sendMessage(chatId, `Привет ${msg.from?.username}`)
                return
            }
            if (text === '/hello') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/a6f/1ae/a6f1ae15-7c57-3212-8269-f1a0231ad8c2/27.webp');
                await bot.sendMessage(chatId, `Этот бот пока умеет только так, ${msg.from?.username}`)
                return
            }
            console.log(msg)
        })

}
start()

