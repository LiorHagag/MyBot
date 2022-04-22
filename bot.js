const qrcode = require('qrcode-terminal');
const request = require('request');
const cheerio = require('cheerio');

const { Client, LocalAuth} = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on( 'message', async msg =>
{

    var str= "wa.me//";

    if(msg.body.startsWith('0') && msg.body.length == 10)
    {
        var newPhoneNumber = "+972" + msg.body.substring(1);
        str += newPhoneNumber;
        msg.reply(str); 
    }
    else if(msg.body.startsWith('+972') && msg.body.length == 13)
    {
        str+=msg.body;  
        msg.reply(str);
    }

    if(msg.body.startsWith("פרש"))
    {
        let sentence = msg.body.substring(4);
        const url = "https://www.morfix.co.il/";
        let arr = sentence.split(" ");
        let URI = encodeURI(sentence);
        // for(let i = 0; i< arr.length-1; i++) // You can do it with encodeURI
        // {
        //     url += arr[i]+ "%20";
        // }
        request(url + URI, function (error, response, body) 
        {
          if(!error && response.statusCode == 200)
            {
                const $ = cheerio.load(body);// holds the html page.
                //Translation_hemin_heToen
                const answer = $(".Translation_hemin_heToen span").text();
                msg.reply(answer);
            }
        }); 

        // the span we need is- Translation_divMiddle_heToen (from morfix)
    }
    if(msg.body.startsWith("תרגם"))
    {
        const url = "https://www.morfix.co.il/";
        let sentence = msg.body.substring(5);
        let arr = sentence.split(" ");
        let URI = encodeURI(sentence);
        // for(let i = 0; i<arr.length-1; i++)
        // {
        //     url += arr[i]+ "%20";
        // }
        var english = /^[A-Za-z0-9]*$/;
        if(english.test(sentence))
        {
            request (url + URI, function(error, respone, body)
            {
              if(!error && respone.statusCode == 200)
              {
                  const $ = cheerio.load(body);
                  const answer = $(".normal_translation_div").text();
                  msg.reply( answer);
              }  
            });
        }
        else
        {
           request(url + URI, function (error, respone, body)
            {
                if(!error && respone.statusCode == 200) // checks if there isnt an error
                {
                    const $ = cheerio.load(body);//  holds the html page.
                    //the div we need is - Translation_divMiddle_heToen (from morfix)
                    const answer = $(".normal_translation_div").text();
                    msg.reply (answer);
                }
            });
        }   
    }
});
