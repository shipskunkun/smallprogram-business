import {
    config
} from '../config.js'

const tips = {
    1: '抱歉，出现了一个错误',
    1005: 'appkey无效，请前往www.7yue.pro申请',
    3000: '期刊不存在'
}


class HTTP {
    request({url, data={}, method='GET'}) {
        console.log(url)
        return new Promise((resolve, reject) => {
            const args = Object.assign(arguments[0], {resolve})
            this._request(args)
        })
    }

    _request({url, resolve, data={}, method='GET'}) {
        wx.request({
            url: `${config.api_base_url}${url}`,
            method: method,
            data: data,
            header: {
                'content-type': 'application/json',
                'appkey': config.appkey
            },
            success: (res) => {
                let code = res.statusCode.toString()
                if (code.startsWith('2')) {
                     resolve(res.data)
                } else {
                    let error_code = res.data.error_code
                    this._show_error(error_code)
                }
            },
            fail: (err) => {
                this._show_error(1)
            }
        })

    }

    _show_error(error_code) {
        if (!error_code) {
            error_code = 1
        }
        wx.showToast({
            title: tips[error_code],
            icon: 'none',
            duration: 2000
        })
    }


}

export {
    HTTP,
    promisic
}