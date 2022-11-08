const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')

const path = require('path')
const app = express();
const PORT = 5020;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.sendFile(__dirname +'/views/signup.html')

})

app.post('/', (req, res) => {
   const firstName= req.body.firstName
   const lastName= req.body.lastName
   const email= req.body.email
   
    const data = {
        members:[
            {
                email_address: email, 
                status: 'subscribed',
                merge_field: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
            
        ]

    }
    const authorization = process.env.AUTH
    const jsonData = JSON.stringify(data)
    const option = {
        method: "POST",
        auth: `${authorization}`

    }
    const API_KEY= process.env.API_SECRET
    const URL = `https://us17.api.mailchimp.com/3.0/lists/${API_KEY}`

    const request = https.request(URL, option, function(response) {
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/views/success.html")
        } else {
            res.sendFile(__dirname + "/views/failure.html")
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
// b2f01e2560dbe32ddcf02b04a899c661-us17