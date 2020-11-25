let count = 0;
module.exports = function createAPI(app) {
    const list = [
        {
            id: 1,
            name: '测试-01',
            author: 'XCJ',
            description: '测试-01描述'
        },
        {
            id: 2,
            name: '测试-02',
            author: 'XCJ',

            description: '测试-02描述'
        },
        {
            id: 3,
            name: '测试-03',
            author: 'XCJ',

            description: '测试-03描述'
        },
        {
            id: 4,
            name: '测试-04',
            author: 'XCJ',

            description: '测试-04描述'
        },
        {
            id: 5,
            name: '测试-05',
            author: '炒粉纪',

            description: '测试-05描述'
        },
        {
            id: 6,
            name: '测试-06',
            author: 'XCJ',

            description: '测试-06描述'
        },
        {
            id: 7,
            name: '测试-07',
            author: 'XCJ',

            description: '测试-07描述'
        },
        {
            id: 8,
            name: '测试-08',
            author: '炒粉纪',

            description: '测试-08描述'
        },
        {
            id: 9,
            name: '测试-09',
            author: 'XCJ',
            description: '测试-09描述'
        },
        {
            id: 10,
            name: '测试-10',
            author: 'XCJ',
            description: '测试-10描述'
        }
    ]
    
    app.get('/api/main/getList', (req, res) => {
        ++count
        console.log('count', count)
        res.send({
            code: '0000',
            data: list
        })
    })

    app.get('/api/main/getDetail', (req, res) => {
        let id = req.query.id
        let cont = {}
        for (let key in list) {
            let item = list[key] || {}
            if (item.id === +id) {
                cont = item
                break
            }
        }
        console.log('id', req.query.id)
        console.log('content', cont)
        res.send({
            code: '0000',
            data: cont
        })
    })
}