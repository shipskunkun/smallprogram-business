import {
    BookModel
} from '../models/book.js'

import {
    promisic
} from 'http-p.js'

const bookModel = new BookModel()

export const test = function () {
    const hotList = bookModel.getHotList()
    const hotKeyword = bookModel.getHotKeyword()
    Promise.all([hotList, hotKeyword])
        .then((res) => {
            console.log(res)
            return promisic(wx.setStorage)({
                key:'promise',
                data:'123'
            })
        })
        .then((res) => {
            console.log(res)
        })
}