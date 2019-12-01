//Using the NPM dotenv package to allow me to process my environmental variables with my API keys: https://github.com/motdotla/dotenv
//require('dotenv').config();


//Authentication using the CodeBird library: https://github.com/jublo/codebird-js
var cb = new Codebird;
//cb.setConsumerKey(process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET_KEY); //using the NPM dotenv package to process these tokens
cb.setConsumerKey("", "");


//Global Vars
var leftElementIsClicked = false; //var that tracks the state of the leftCard
var rightElementIsClicked = false; //var that tracks the state of the rightCard
let leftText = "Correct!" //set initial text to the left card
let rightText = "Incorrect!" //set initial text to the right card
let roundNumber; //keep track of which round we're on
let real_acct_array = []; //array to store real tweets in
let fake_acct_array = []; //array to store fake tweets in

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
  roundNumber = 1;

  queryRealTweets();
  queryFakeTweets();
  console.log('real:', real_acct_array);
  console.log('fake:', fake_acct_array);

  document.getElementById("left_tweet_p").innerHTML = "Welcome to He tweeted that?!";
  document.getElementById("right_tweet_p").innerHTML = "Click a card to continue!";

}

/* Comment out to not make unneccesary queries when working on styling*/
function queryRealTweets() {
  cb.__call( //Method from Codebird that makes API query to real tweets
    "statuses/userTimeline", //specifying what kind of query we want to make
    real_acct_search_parameters, //specifying the parameters we set above
    function (reply) { //what to do with the reply/the data
      console.log(reply);
      for (i = 0; i < reply.length; i++) {
        real_acct_array.push(reply[i].text);
      }
      //
    }
  )
}

function queryFakeTweets() {
  cb.__call( //Method from Codebird that makes API query to fake tweets
    "statuses/userTimeline", //specifying what kind of query we want to make
    fake_acct_search_parameters, //specifying the parameters we set above
    function (reply) { //what to do with the reply/the data
      console.log(reply);
      for (i = 0; i < reply.length; i++) {
        fake_acct_array.push(reply[i].text); //map the data from the reply into an array        
      }
      //document.getElementById("right_tweet_p").innerHTML = fake_acct_array[0];
    }

  )

}

//Need to allow this function to be able to say which element is correct RANDOMLY, not just left and right card
//Idea: rather than just having the innerHTML change to "correct" or "incorrect", have it update to a global var that we can set then update in the updateTweets!
function checkVictoryCondition() {
  //Code for right card referenced from StackOverflow: https://stackoverflow.com/questions/22018136/how-do-i-detect-if-something-is-being-clicked-in-javascript-without-using-jque
  //Code for left card referenced from MDN: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event


  //NOTE: the left card and right card functionalities below do the same thing, it's just two different ways to do the same thing. Left card has arrow function rather than the handler
  //Right card has a handler that the event listener calls on click (both do the same thing! The event => just executes the code of the handler in right card)

  /*LEFT CARD*/
  /* Check if card was clicked by adding event listener for the div containing the correct card*/

  var left_card = document.getElementById('left_card'); // set var to be the element you want to listen for click on
  left_card.addEventListener('click', event => { //on click, execute this code below
    leftElementIsClicked = true; //update the element to be true
    document.getElementById("left_pick").innerHTML = leftText //update text within correct card
  }); //link the function that listens for click to the left_card

  /*RIGHT CARD*/
  function rightClickHandler() { //this function updates the state onClick
    rightElementIsClicked = true; //update the element to be true
    document.getElementById("right_pick").innerHTML = rightText //update text within correct card
  }

  var right_card = document.getElementById('right_card'); // set var to be the element you want to listen for click on
  right_card.addEventListener('click', rightClickHandler); //link the function that listens for click to the left_card

}


function updateTweets() {
  if (!(leftElementIsClicked == false && rightElementIsClicked == false)) { //If user clicked one of the answers
    //update the tweets
    let card_decider = random(1, 10); //Have conditional here to set to left if random number is odd or right if random number is even
    if (card_decider % 2 == 0) { //if random number is even, display real tweet to left. else display it to right
      leftText = "Correct!";
      rightText = "Incorrect!";
      document.getElementById("left_tweet_p").innerHTML = real_acct_array[roundNumber]; //set tweets to cards
      document.getElementById("right_tweet_p").innerHTML = fake_acct_array[roundNumber];
    } else {
      rightText = "Correct!";
      leftText = "Incorrect!";
      document.getElementById("right_tweet_p").innerHTML = real_acct_array[roundNumber]; //set tweets to cards
      document.getElementById("left_tweet_p").innerHTML = fake_acct_array[roundNumber];
    }
   
    roundNumber += 1;
    document.getElementById("right_pick").innerHTML = ""
    document.getElementById("left_pick").innerHTML = ""; //update the correct/incorrect
  }
  leftElementIsClicked = false;
  rightElementIsClicked = false; //reset states to be not clicked 

}



function draw() {
  if (roundNumber != 4) {
    if (leftElementIsClicked == false && rightElementIsClicked == false) {
      checkVictoryCondition();
    } else {
      updateTweets();
    }

  }else{
    console.log('GAME OVER');
    noLoop();
  }


}