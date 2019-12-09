# Creative-Coding-Final-Project


LIBRARIES USED
_________________________________________________________________
Codebird: https://github.com/jublo/codebird-js
    - Used to make querying to Twitter simpler. It handles a lot of the complex authentication and allows you to make calls to Twitter specifying queries

NPM dotenv package (node project manager): https://github.com/motdotla/dotenv
    - imported the dotenv functionality that lets you read environmental variables so I can hide my API keys


# Instructions on running the code

You will need to download the codebird library locally
You will need a Twitter API key. The process for getting one is a bit extensive. 
1. First, you need to have a twitter account, this will be the account that you register the API key from.
2. You need to register an app as well as give a brief description as to what your app does as well as its functionality
3. That request for the app is reviewed (they look at your writeups to the answers), and then if approved, you will be given an API keys.
4. Then, once you have your API key and API secret keys, place both values respectively into line 7
    cb.setConsumerKey("API_KEY","API_SECRET_KEY")