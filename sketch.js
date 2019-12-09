//Using the NPM dotenv package to allow me to process my environmental variables with my API keys: https://github.com/motdotla/dotenv
//require('dotenv').config();

//Authentication using the CodeBird library: https://github.com/jublo/codebird-js
var cb = new Codebird();
//cb.setConsumerKey(process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET_KEY); //using the NPM dotenv package to process these tokens
cb.setConsumerKey(
  "",
  ""
);

//Global Vars
var leftElementIsClicked = false; //var that tracks the state of the leftCard
var rightElementIsClicked = false; //var that tracks the state of the rightCard
let leftText = "Let's jump into the game!"; //set initial text to the left card when user first enters the game
let rightText = "Let's jump into the game!"; //set initial text to the right card
let roundNumber; //keep track of which round we're on
let total_rounds;
let real_acct_array = []; //array to store real tweets in
let fake_acct_array = []; //array to store fake tweets in
let randomBonusRound;
let numCorrect = 0;
let bonusTweets = [
  "The hatred that clown @krauthammer has for me is unbelievable – causes him to lie when many others say Trump easily won debate.",
  "How can a dummy dope like Harry Hurt, who wrote a failed book about me but doesn’t know me or anything about me, be on TV discussing Trump?",
  "My plan will lower taxes for our country, not raise them. Phony @club4growth says I will raise taxes—just another lie.",
  "Lightweight Senator @RandPaul should focus on trying to get elected in Kentucky--- a great state which is embarrassed by him.",
  "Truly weird Senator Rand Paul of Kentucky reminds me of a spoiled brat without a properly functioning brain. He was terrible at DEBATE!",
  "The president of the pathetic Club For Growth came to my office in N.Y.C. and asked for a ridiculous $1,000,000 contribution. I said no way!",
  ".@MeghanMcCain was terrible on @TheFive yesterday. Angry and obnoxious, she will never make it on T.V. @FoxNews can do so much better!",
  "Huma Abedin, the top aide to Hillary Clinton and the wife of perv sleazebag Anthony Wiener, was a major security risk as a collector of info"
]; //bonus round tweets

/*-------------------------SETTING SEARCH PARAMETERS FOR TWEETS---------------------------------
_______________________________________________________________________________________________________________________*/
var real_acct_search_parameters = {
  //Specify search params for querying real Trump account
  screen_name: "@realDonaldTrump", //key word to search with,
  result_type: "recent", //specify when you want to search
  truncated: "false",
  exclude_replies: "false", //excludes tweets that are replies to other tweets if true (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  include_rts: "false", //exclude retweets from returned results
  count: 10 //specify how many results you want to return
};

var fake_acct_search_parameters = {
  //Specify search params for querying fake Trump
  screen_name: "@RealDonalDrumpf", //key word to search with,
  result_type: "recent", //specify when you want to search
  truncated: "false",
  exclude_replies: "false", //excludes tweets that are replies to other tweets if true (note you will not get count number of tweets, the query will find count number of tweets then filter them to exclude those with replies)
  include_rts: "false", //exclude retweets from returned results
  count: 5 //specify how many results you want to return
};
//_____________________________________________________________________________________________________________________

/*-------------------------QUERYING THE TWEETS AND SETTING ROUND NUMBERS FOR THE GAME---------------------------------
_______________________________________________________________________________________________________________________*/
//Checks if the query happens correctly
 /*total_rounds_ternary = total_rounds ? total_rounds: 5; //if user doesn't enter a value, defaults to 5
      console.log(real_acct_array.length, total_rounds_ternary);
      if (real_acct_array.length < total_rounds_ternary) {
        for (i = 0; i < bonusTweets.length; i++) {
          real_acct_array.push(bonusTweets[i]); //if there's an error with the query (i.e. it only queries one tweet when you instruct it to query 5, extend it with the bonus tweets database)
        }
      }*/



function preload() {
  queryRealTweets();
  queryFakeTweets();
 
  total_rounds = window.prompt("How many rounds would you like to play? You can play up to 5!"); //get user input as to how many rounds they'd like to play (can play up to 5 rounds, don't want to overuse the amount of queries I have available with the API)
  //have image dissapear after five seconds
  randomBonusRound = int(random(3, total_rounds));
  console.log(total_rounds);
  console.log("rand bonus round:", randomBonusRound);
  document.getElementById("contentWrapper").style.opacity = 1;
}

function setup() {
  createCanvas(1920, 1080);

  roundNumber = 0;

  console.log("real:", real_acct_array);
  console.log("fake:", fake_acct_array);

  //Change this to display above the cards
  document.getElementById("left_tweet_p").innerHTML = "Welcome to He Tweeted That?!";
  document.getElementById("right_tweet_p").innerHTML = "Click a button to continue!";
}

/* Comment out to not make unneccesary queries when working on styling*/
function queryRealTweets() {
  cb.__call(
    //Method from Codebird that makes API query to real tweets
    "statuses/userTimeline", //specifying what kind of query we want to make
    real_acct_search_parameters, //specifying the parameters we set above
    function (reply) {
      //what to do with the reply/the data
      console.log(reply);
      for (i = 0; i < reply.length; i++) {
        real_acct_array.push(reply[i].text);
      }
    }

  );
}

function queryFakeTweets() {
  cb.__call(
    //Method from Codebird that makes API query to fake tweets
    "statuses/userTimeline", //specifying what kind of query we want to make
    fake_acct_search_parameters, //specifying the parameters we set above
    function (reply) {
      //what to do with the reply/the data
      console.log(reply);
      for (i = 0; i < reply.length; i++) {
        fake_acct_array.push(reply[i].text);
      }
    }
  );
}
//_______________________________________________________________________________________________________________________

/*-----------FUNCTIONS THAT ALLOW GAME FUNCTIONALITY (CHECK VICTORY CONDITION, UPDATE TWEETS, BONUS ROUND)--------------
_______________________________________________________________________________________________________________________*/

//Need to allow this function to be able to say which element is correct RANDOMLY, not just left and right card
//Idea: rather than just having the innerHTML change to "correct" or "incorrect", have it update to a global var that we can set then update in the updateTweets
function checkVictoryCondition() {
  //Code for right card referenced from StackOverflow: https://stackoverflow.com/questions/22018136/how-do-i-detect-if-something-is-being-clicked-in-javascript-without-using-jque
  //Code for left card referenced from MDN: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event

  //NOTE: the left card and right card functionalities below do the same thing, it's just two different ways to do the same thing. Left card has arrow function rather than the handler
  //Right card has a handler that the event listener calls on click (both do the same thing! The event => just executes the code of the handler in right card)

  /*LEFT CARD*/
  /* Check if card was clicked by adding event listener for the button corresponding to the correct card*/
  var left_button = document.getElementById("left_button"); // set var to be the element you want to listen for click on
  left_button.addEventListener("click", event => {
    //on click, execute this code below
    leftElementIsClicked = true; //update the element to be true
    document.getElementById("correct").innerHTML = leftText; //update text within correct card
    //disable the buttons once the victory condition is met
    document.getElementById("left_button").disabled = true;
    document.getElementById("right_button").disabled = true;
  }); //link the function that listens for click to the left_card

  /*RIGHT CARD*/
  function rightClickHandler() {
    //this function updates the state onClick
    rightElementIsClicked = true; //update the element to be true
    document.getElementById("correct").innerHTML = rightText; //update text within correct card
    //disable the buttons once the victory condition is met
    document.getElementById("left_button").disabled = true;
    document.getElementById("right_button").disabled = true;
  }

  var right_button = document.getElementById("right_button"); // set var to be the element you want to listen for click on
  right_button.addEventListener("click", rightClickHandler); //link the function that listens for click to the left_card
}

function updateTweets() {
  if ((leftElementIsClicked == true || rightElementIsClicked == true)) { //If user clicked one of the answers update the tweets
    let card_decider = int(random(1, 10)); //Have conditional here to set to left if random number is odd or right if random number is even
    if (card_decider % 2 == 0) {
      //if random number is even, display real tweet to left. else display it to right
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
    //Update round, re-enable buttons, set the state for clicked to false to be checked again in future rounds
    console.log('roundNum before:', roundNumber);
    roundNumber += 1;
    console.log('roundNum after:', roundNumber);
    //re-enable the buttons
    document.getElementById("left_button").disabled = false;
    document.getElementById("right_button").disabled = false;

    document.getElementById("correct").innerHTML = ""; //update the correct/incorrect


  }

  leftElementIsClicked = false;
  rightElementIsClicked = false; //reset states to be not clicked

}

function bonusRound() {
  let bonusTweetIndex = int(random(0, 6)); //select index for which to select for the bonus round
  if ((leftElementIsClicked == true || rightElementIsClicked == true)) { //If user clicked one of the answers
    leftText = "These are both real tweets!";
    rightText = "These are both real tweets!";

    let card_decider = int(random(1, 10)); //Have conditional here to set to left if random number is odd or right if random number is even
    if (card_decider % 2 == 0) {
      //if random number is even, display bonus tweet to left. else display it to right
      document.getElementById("left_tweet_p").innerHTML = bonusTweets[bonusTweetIndex]; //display the bonusTweet
      document.getElementById("right_tweet_p").innerHTML = real_acct_array[roundNumber]; //set tweets to cards
    } else {
      document.getElementById("left_tweet_p").innerHTML = real_acct_array[roundNumber]; //set tweets to cards
      document.getElementById("right_tweet_p").innerHTML = bonusTweets[bonusTweetIndex]; //display the bonusTweet
    }
    //Update round, re-enable buttons, set the state for clicked to false to be checked again in future rounds
    roundNumber += 1;
    //re-enable the buttons
    document.getElementById("left_button").disabled = false;
    document.getElementById("right_button").disabled = false;

    document.getElementById("correct").innerHTML = ""; //update the correct/incorrect


  }

  leftElementIsClicked = false;
  rightElementIsClicked = false; //reset states to be not clicked

}
//_____________________________________________________________________________________________________________________


/*-------------------------DRAW LOOP WHERE ALL OF THE GAME FUNCTIONALITY FUNCTIONS ARE CALLED--------------------------
---------------------------ALSO WHERE WE GENERATE THE TABLE UPON ENDING THE GAME---------------------------------------
_______________________________________________________________________________________________________________________*/

function draw() {
  roundsCounter = total_rounds ? total_rounds : 5;
  if (roundNumber < roundsCounter) { //while we're still in the game, the rounds haven't finished (setting default number to 5 if user doesn't enter a value using the ternary)
    if (leftElementIsClicked == false && rightElementIsClicked == false) {
      checkVictoryCondition();
    } else {
      if (roundNumber == randomBonusRound) {
        document.getElementById("correct").innerHTML = "Bonus Round!!"
        //if we're on the randomly picked bonus Round, have them both be trump tweets
        setTimeout(bonusRound, 1000); //go to bonus round after 3 seconds
      } else {
        setTimeout(updateTweets, 1000); //update Tweets after 3 seconds
      }
    }
  } else {
    noLoop(); //end the draw loop
    console.log("IN LOOP GAME OVER");
    setTimeout(function () {
      //Make cards dissapear by changing the opacity of the element
      document.getElementById("card_container").style.opacity = "0";

      //CREATE TABLE DYNAMICALLY BASED UPON HOW MANY ROUNDS ARE PLAYED
      /*
      1. Make a new <td> element, then for every tweet that we went through, make a new <tr> and then append that <td> to the <tr>
      (Note that these are each nested below their respective headers for the table of Real Tweets and Fake Tweets)
      2. Then once the structure is in place, change the innerHTML of the <td> to the tweet*/

      //set timeout for table to show up after a certain time period? Have it fade in by changing opacity styling and adding a transition
      for (i = 0; i < roundsCounter; i++) {
        //Making real tweets table row
        real_tweet_data = document.createElement("TD"); //we're adding table data (TD) to the scoreTable DOM element to allow the table to created dynamically depending on the number of tweets queried. This lets user choose the number of rounds they want to play
        new_row = document.createElement("TR"); //create the <tr>
        document.getElementById("real_tweets_score_header").appendChild(new_row); //make a new row to add data to
        new_row.setAttribute("id", "real_row" + i); //set ID of new row so we can append data to it
        document.getElementById("real_row" + i).appendChild(real_tweet_data); //append the <td> to the table row for the real tweet
        real_tweet_data.setAttribute("id", "real_tweet_data" + i); //set the id of the appended element so we can access it and change the innerHTML
        document.getElementById(
          "real_tweet_data" + i
        ).innerHTML = real_acct_array[i] ? real_acct_array[i] : ""; //set the string to be added to the inner HTML of the newly created td tag or to empty string if tweet doesn't exist
      }

      for (i = 0; i < roundsCounter; i++) {
        //Making fake tweets table row
        fake_tweet_data = document.createElement("TD");
        new_row = document.createElement("TR"); //create the <tr>
        document.getElementById("fake_tweets_score_header").appendChild(new_row); //make a new row to add data to
        new_row.setAttribute("id", "fake_row" + i); //set ID of new row so we can append data to it
        document.getElementById("fake_row" + i).appendChild(fake_tweet_data); //append the <td> to the table row for the fake tweet
        fake_tweet_data.setAttribute("id", "fake_tweet_data" + i); //set the id of the appended element so we can access it and change the innerHTML
        document.getElementById(
          "fake_tweet_data" + i
        ).innerHTML = fake_acct_array[i] ? fake_acct_array[i] : ""; //set the string to be added to the inner HTML of the newly created td tag, or set the value to empty string if tweet doesn't exist
      }
      document.getElementById("scoreboard").style.opacity = "1";


    }, 5000); //run the scoreboard 5 seconds after the last round


  }
}