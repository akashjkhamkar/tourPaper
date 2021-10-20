require('dotenv').config()

// API_KEY = "Client-ID H_2-ZGR4A33wOsyCUWmHXNxhkl68Rz8zyINTaYeWj7M"

const axios = require('axios');
const prompt = require('prompt-sync')();
const process = require('process');

const homedir = require('os').homedir();
const fs = require('fs');
const { exit } = require('process');
const imgDir = homedir + "/termpaper";

const endpoint = (query) => `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&topics=wallpaper`
let api_key = process.env.API_KEY;

const setupPersistance = () => {
    if (!fs.existsSync(imgDir)){
        console.log("creating a img directory at " + homedir + " ...");
        fs.mkdirSync(imgDir);
    }
}

const checkKey = () => {
    if(api_key){
        return;
    }
    
    api_key = "Client-ID " + prompt('Enter the unsplash api key - ');
    const newData = '\n' + `API_KEY = ${api_key}`;
    fs.appendFile('.env', newData, 'utf8', () => {});
}

const getImage = async (url, filepath) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filepath);
        response.data.pipe(writeStream);
        writeStream.on("finish", () => { 
            writeStream.close()
            resolve(true)
         });
         writeStream.on("error", reject);
    });
}

const download = async (args) => {
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
     
        const response = await axios.get(endpoint(arg), {
            headers: {
                "Authorization": api_key
            }
        })
        .catch(e => {
            if(e.response.status == 401){
                console.log("invalid access token !");
                fs.truncateSync(".env", 0, () => {})
            }else{
                console.log("something went wrong, check you internet connection !");
            }
            exit(0);
        })

        console.log("downloading " + arg + " ...");
        const data = response.data;
        await getImage(data.urls.full, imgDir + "/" + data.id + ".jpg");
    }
    console.log("done !")
}

const driver = async () => {
    checkKey();
    setupPersistance();
    await download(process.argv.slice(2));
    exit(0);
}

driver();
