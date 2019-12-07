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
let total_rounds;
let real_acct_array = []; //array to store real tweets in
let fake_acct_array = []; //array to store fake tweets in
let randomBonusRound;
let numCorrect = 0;
let bonusTweets = ["The hatred that clown @krauthammer has for me is unbelievable – causes him to lie when many others say Trump easily won debate.",
"How can a dummy dope like Harry Hurt, who wrote a failed book about me but doesn’t know me or anything about me, be on TV discussing Trump?",
"My plan will lower taxes for our country, not raise them. Phony @club4growth says I will raise taxes—just another lie.",
"Lightweight Senator @RandPaul should focus on trying to get elected in Kentucky--- a great state which is embarrassed by him.",
"Truly weird Senator Rand Paul of Kentucky reminds me of a spoiled brat without a properly functioning brain. He was terrible at DEBATE!",
"The president of the pathetic Club For Growth came to my office in N.Y.C. and asked for a ridiculous $1,000,000 contribution. I said no way!",
".@MeghanMcCain was terrible on @TheFive yesterday. Angry and obnoxious, she will never make it on T.V. @FoxNews can do so much better!",
"Huma Abedin, the top aide to Hillary Clinton and the wife of perv sleazebag Anthony Wiener, was a major security risk as a collector of info"];//bonus round tweets

/*SEARCH PARAMETERS 
________________________________________________________________________________________________________________*/
var real_acct_search_parameters = { //Specify search params for querying real Trump account
  screen_name: "@realDonaldTrump", //key word to search with,
  result_type: "recent", //specify when you want to search
  //exclude_replies: "true", //excludes tweets that are replies to other tweets (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  count: 2 //specify how many results you want to return
};

var fake_acct_search_parameters = { //Specify search params for querying fake Trump
  screen_name: "@RealDonalDrumpf", //key word to search with,
  result_type: "recent", //specify when you want to search
  //exclude_replies: "true", //excludes tweets that are replies to other tweets (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  count: 2 //specify how many results you want to return
};
//_______________________________________________________________________________________________________________________

function preload() {
  //Loading display image to show onLoad()
  //loadingImage = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user187892/visual799637/h93fee237a67c9d6e82ff36ab736549c5/trump-twitter-icon.png');
  total_rounds = window.prompt("How many rounds would you like to play? You can play up to 20!"); //get user input as to how many rounds they'd like to play (can play up to 20 rounds, query only makes max 20 queries)
  //have image dissapear after five seconds
  randomBonusRound = random(1, total_rounds);
  document.getElementById("contentWrapper").style.opacity = 1;
}

function setup() {
  createCanvas(1920, 1080);
  let m = millis();
  //image(loadingImage, 775, 350, loadingImage.width / 8, loadingImage.height / 8);

  //have image fade after 5 seconds

  roundNumber = 0;

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

  }
  leftElementIsClicked = false;
  rightElementIsClicked = false; //reset states to be not clicked 

}

function bonusRound() {
  let bonusTweetIndex = random (0, 7);//select index for which to select for the bonus round
  if (!(leftElementIsClicked == false && rightElementIsClicked == false)) { //If user clicked one of the answers
    //update the tweets
      leftText = "Correct!";
      rightText = "Also Correct!";
      document.getElementById("left_tweet_p").innerHTML = real_acct_array[roundNumber]; //set tweets to cards
      document.getElementById("right_tweet_p").innerHTML = bonusTweets[bonusTweetIndex]; //display the bonusTweet
    }
    roundNumber += 1;
  leftElementIsClicked = false;
  rightElementIsClicked = false; //reset states to be not clicked 
}

function draw() { 
  roundsCounter = total_rounds ? total_rounds : 5;
  if (roundNumber < roundsCounter) { //while we're still in the game, the rounds haven't finished (setting default number to 5 if user doesn't enter a value using the ternary)
    if (leftElementIsClicked == false && rightElementIsClicked == false) {
      checkVictoryCondition();
    } else {
      if (roundNumber === randomBonusRound) { //if we're on the randomly picked bonus Round, have them both be trump tweets
        bonusRound();
      }
      updateTweets();

      document.getElementById("right_pick").innerHTML = ""
      document.getElementById("left_pick").innerHTML = ""; //update the correct/incorrect
    }

  } else {
    console.log('GAME OVER', total_rounds);

    //Make cards dissapear by changing the opacity of the element
    document.getElementById("card_container").style.opacity = '0';

    //CREATE TABLE DYNAMICALLY BASED UPON HOW MANY ROUNDS ARE PLAYED
    /*
    1. Make a new <td> element, then for every tweet that we went through, make a new <tr> and then append that <td> to the <tr>
    (Note that these are each nested below their respective headers for the table of Real Tweets and Fake Tweets)
    2. Then once the structure is in place, change the innerHTML of the <td> to the tweet*/

    //set timeout for table to show up after a certain time period?
    for (i = 0; i < total_rounds; i++) { //Making real tweets table row
      real_tweet_data = document.createElement("TD"); //we're adding table data (TD) to the scoreTable DOM element to allow the table to created dynamically depending on the number of tweets queried. This lets user choose the number of rounds they want to play
      new_row = document.createElement("TR"); //create the <tr>
      document.getElementById("real_tweets_score_header").appendChild(new_row); //make a new row to add data to
      new_row.setAttribute("id", "real_row" + i); //set ID of new row so we can append data to it
      document.getElementById("real_row" + i).appendChild(real_tweet_data); //append the <td> to the table row for the real tweet
      real_tweet_data.setAttribute("id", "real_tweet_data" + i) //set the id of the appended element so we can access it and change the innerHTML      
      document.getElementById("real_tweet_data" + i).innerHTML = real_acct_array[i] ? real_acct_array[i] : ""; //set the string to be added to the inner HTML of the newly created td tag or to empty string if tweet doesn't exist
    }


    for (i = 0; i < total_rounds; i++) { //Making fake tweets table row    
      fake_tweet_data = document.createElement("TD")
      new_row = document.createElement("TR"); //create the <tr>
      document.getElementById("fake_tweets_score_header").appendChild(new_row); //make a new row to add data to  
      new_row.setAttribute("id", "fake_row" + i); //set ID of new row so we can append data to it
      document.getElementById("fake_row" + i).appendChild(fake_tweet_data); //append the <td> to the table row for the fake tweet
      fake_tweet_data.setAttribute("id", "fake_tweet_data" + i) //set the id of the appended element so we can access it and change the innerHTML      
      document.getElementById("fake_tweet_data" + i).innerHTML = fake_acct_array[i] ? fake_acct_array[i] : "" //set the string to be added to the inner HTML of the newly created td tag, or set the value to empty string if tweet doesn't exist
    }
    console.log(document.getElementById("score_table"));
    document.getElementById("scoreboard").style.opacity = '1';
    noLoop();

  }


}