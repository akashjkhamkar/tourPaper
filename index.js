require('dotenv').config()

// API_KEY = "Client-ID H_2-ZGR4A33wOsyCUWmHXNxhkl68Rz8zyINTaYeWj7M"

const axios = require('axios');
const prompt = require('prompt-sync')();
const process = require('process');
const { exit } = require('process');

// dirs
const fs = require('fs');
const homedir = require('os').homedir();
const imgDir = homedir + "/termpaper";

// unsplash
const endpoint = (query) => `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&topics=wallpaper`
let api_key = process.env.API_KEY;

// make sure the folder exists
const setupPersistance = () => {
    if (!fs.existsSync(imgDir)){
        console.log("creating a img directory at " + homedir + " ...");
        fs.mkdirSync(imgDir);
    }

    // check if .env exists, if not , creates it
    fs.open('.env', 'w', function (err, file) {
        if (err) throw err;
    });
}


// check if api_key exists in .env
const checkKey = () => {
    if(api_key){
        return;
    }
    
    api_key = "Client-ID " + prompt('Enter the unsplash api key - ');
    const newData = '\n' + `API_KEY = ${api_key}`;
    fs.appendFile('.env', newData, 'utf8', () => {});
}

// downloads image
const getImage = async (url, filepath) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    .catch(e => {
        console.log("something went wrong while donwloading the image !");
        console.log("check your internet connection , if problem persists, contact the dev on github");
        exit(0);
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


// get the link and call getImage()
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
