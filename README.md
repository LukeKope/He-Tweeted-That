# Creative-Coding-Final-Project


*LIBRARIES USED*
_________________________________________________________________
Codebird: https://github.com/jublo/codebird-js
    - Used to make querying to Twitter simpler. It handles a lot of the complex authentication and allows you to make calls to Twitter specifying queries


*See the documentation folder for screenshots of the program at various stages as well as a video file that depicts me using the program. Please note that the video is .webm which is compatible with VLC*
_________________________________________________________________
Within each documentation folder, there is a more detailed read me describing the contents of each. 

*GENERAL NOTES*
_________________________________________________________________
1. Codebird documentation isn't great, BUT what you basically need to do is look at the js file. This has all of the GET and POST requests you can make (which match the Twitter docs)
2. In order to make the get request that you want/need, you need to check the twitter docs to see the parameters you need and the name of the GET request. 
    E.g. for the statuses_user_timeline query you need the parameter screen_name, so you need to add that to your params var. So, we used Twitter API docs to provide Codebird
    with the parameters it needed to make the proper query!
3. Note that for the names of the GET requests, if there's an underline in there (like user_timeline), you need to use camelCase (userTimeline)


*Instructions on running the code*
_________________________________________________________________
You will need to download the codebird library locally from here: https://github.com/jublo/codebird-js
You will need a Twitter API key. The process for getting one is a bit extensive. 
1. First, you need to have a twitter account, this will be the account that you register the API key from.
2. You need to register an app as well as give a brief description as to what your app does as well as its functionality
3. That request for the app is reviewed (they look at your writeups to the answers), and then if approved, you will be given an API keys.
4. Then, once you have your API key and API secret keys, place both values respectively into line 7
    cb.setConsumerKey("API_KEY","API_SECRET_KEY")

# Notes
_________________________________________________________________
Due to the nature of relying on an API for the data queries, sometimes the data will not come through properly, especially for the real account. 
I have had multiple occasions when testing where the data will come in properly on one try, then with the exact same code I will refresh the data and re-query the tweets, and only one or no tweets will come through the real account query. From what I've found, this is an error from the twitter API or from the codebird library, as the queries to the parody account work just fine consistently. I believe that the issue may be related to the fact that the real account has much more data associated with it.