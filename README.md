# tourPaper

tourpaper is a command line tool for downloading wallpapers from unsplash.

## usage
````
$ tourpaper [name1] [name2] ....
````

## setup
unsplash api requires the api key, first get the key from https://unsplash.com/developers

1. install the package globally in order for it to work from anywhere
````
$ npm i tourpaper -g
````

2. run the tourpaper with some subject for initial setup, for eg.
````
$ tourpaper snow
````

3. now it will ask for the key, enter the key you got from unsplash
````
Enter the unsplash api key -
````

and you are ready to go ! 
key will be stored in the .env of tourpaper folder in home directory
along with the downloaded images.

## examples

for eg. downloading a photo of yosemite national park
````
$ tourpaper yosemite
````
or photos of flowers, city, dog and a lightbulb

````
$ tourpaper flowers newyork doge bulb
````
