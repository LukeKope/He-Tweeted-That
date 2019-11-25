//Using the NPM dotenv package to allow me to process my environmental variables with my API keys: https://github.com/motdotla/dotenv
//require('dotenv').config();


//Authentication using the CodeBird library: https://github.com/jublo/codebird-js
var cb = new Codebird;
//cb.setConsumerKey(process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET_KEY); //using the NPM dotenv package to process these tokens
cb.setConsumerKey();//Placeholder until I get .env to work!;


//Global Vars
var leftElementIsClicked = false; //var that tracks the state of the leftCard
var rightElementIsClicked = false; //var that tracks the state of the rightCard

/*SEARCH PARAMETERS 
________________________________________________________________________________________________________________*/
var real_acct_search_parameters = { //Specify search params for querying real Trump account
  screen_name: "@realDonaldTrump", //key word to search with,
  result_type: "popular", //specify when you want to search
  exclude_replies: "true", //excludes tweets that are replies to other tweets (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  count: 5 //specify how many results you want to return
};

var fake_acct_search_parameters = { //Specify search params for querying fake Trump
  screen_name: "@RealDonalDrumpf", //key word to search with,
  result_type: "popular", //specify when you want to search
  exclude_replies: "true", //excludes tweets that are replies to other tweets (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  count: 5 //specify how many results you want to return
};
//_______________________________________________________________________________________________________________________

function preload() {
  //Loading display image to show onLoad()
  loadingImage = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user187892/visual799637/h93fee237a67c9d6e82ff36ab736549c5/trump-twitter-icon.png');
}

function setup() {
  createCanvas(1920, 1080);

  //maybe have an intro animation play here?
  image(loadingImage, 775, 350, loadingImage.width / 8, loadingImage.height / 8);

  queryRealTweet(); //Making initial call to query tweets
  queryFakeTweet();
  

}

/* Comment out to not make unneccesary queries when working on styling*/
function queryRealTweet() {

  cb.__call( //Method from Codebird that makes API query
    "statuses/userTimeline", //specifying what kind of query we want to make
    real_acct_search_parameters, //specifying the parameters we set above
    function (reply) { //what to do with the reply/the data
      console.log(reply);
      tweet_text = reply[0].text
      document.getElementById("left_tweet_p").innerHTML = tweet_text;
    }
  )
}

function queryFakeTweet() {

  cb.__call( //Method from Codebird that makes API query
    "statuses/userTimeline", //specifying what kind of query we want to make
    fake_acct_search_parameters, //specifying the parameters we set above
    function (reply) { //what to do with the reply/the data
      console.log(reply);
      for(i = 0; i<reply.length; i++){
        fake_acct_array = reply[i].text; //map the data from the reply into an array
        console.log(fake_acct_array);
        
      }
      tweet_text = reply[3].text
      document.getElementById("right_tweet_p").innerHTML = tweet_text;
      return fake_acct_array;
    }
    
  )

}


function checkVictoryCondition(){
  //Code referenced from StackOverflow: https://stackoverflow.com/questions/22018136/how-do-i-detect-if-something-is-being-clicked-in-javascript-without-using-jque
  
  /*LEFT CARD*/
  /* Check if card was clicked by adding event handler for the div containing the correct card*/
  function leftClickHandler(){ //this function updates the state onClick
    leftElementIsClicked = true; //update the element to be true
    document.getElementById("correct_pick").innerHTML = "Correct!" //update text within correct card
  }

  var left_card = document.getElementsByClassName('card left'); // set var to be the element you want to listen for click on
  left_card.addEventListener('click', leftClickHandler); //link the function that listens for click to the left_card

  /*RIGHT CARD*/
  function rightClickHandler(){ //this function updates the state onClick
    rightElementIsClicked = true; //update the element to be true
    document.getElementById("incorrect_pick").innerHTML = "Incorrect!" //update text within correct card
  }

  var right_card = document.getElementsByClassName('card right'); // set var to be the element you want to listen for click on
  right_card.addEventListener('click', rightClickHandler); //link the function that listens for click to the left_card

}


function draw() {
  //Data viz comes here
  //Imagining two squares, each displays a tweet, then you click a button to select which tweet is the actual trump tweet

  if(leftElementIsClicked == false && rightElementIsClicked == false){
    checkVictoryCondition();
  }
  




}