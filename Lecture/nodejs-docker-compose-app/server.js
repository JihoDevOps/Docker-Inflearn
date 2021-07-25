const express = require("express");
const redis = require("redis");

// Redis client
const client = redis.createClient({
    host: "redis-server",
    port: 6379
});

const app = express();

// 숫자는 0부터 시작
client.set("number", 0);

app.get('/', (req, res) => {
    client.get("number", (err, number) => {
        // 현재 숫자를 가져온 후 1씩 증가
        client.set("number", parseInt(number) + 1);
        res.send("숫자가 1씩 증가한다. 숫자: " + number);
    })
})

app.listen(8080);
console.log("server is running...");