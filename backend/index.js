const express = require('express')
const app = express()
const port = 5000
const mongoDB = require('./db')

mongoDB()

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-Width,Content-Type,Accept"
    )
    next();
})

app.use(express.json())
app.use('/api', require("./Routes/UserInfo"))
app.use('/api', require("./Routes/FoodItemRoute"))
app.use('/api', require("./Routes/OrderData"))
app.use('/api', require("./Routes/CheckoutSession"))

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
})