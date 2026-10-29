var start_prompt1 = "Correct! You'll now be asked similar questions about various theaters owned by ABC Cinemas. " +
    "You want to maximize your profit by handing out flyers only to individuals who you think would be encouraged " +
    "by the flyer. Your final earnings will be between $5.00 and $7.55, depending on the number of correct " +
    "decisions you make.";

var start_prompt2 = "Great! To speed up the experiment, for the rest of the theaters, you'll only see the data " +
    "from the marketing campaigns.";

var info = "<div style=\"display: inline-block\">" +
    "<style type=\"text/css\">\n" +
    ".tg  {border-collapse:collapse;border-spacing:0;}\n" +
    ".tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;\n" +
    "  overflow:hidden;padding:10px 5px;word-break:normal;}\n" +
    ".tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;\n" +
    "  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}\n" +
    ".tg .tg-7btt{border-color:inherit;font-weight:bold;text-align:center;vertical-align:top}\n" +
    "</style>\n" +
    "<table class=\"tg\">\n" +
    "<thead>\n" +
    "  <tr>\n" +
    "    <th class=\"tg-7btt\">Value of returning customer</th>\n" +
    "    <th class=\"tg-7btt\">Cost of discouraged customer</th>\n" +
    "    <th class=\"tg-7btt\">Cost of flyer</th>\n" +
    "  </tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "  <tr>\n" +
    "    <td class=\"tg-7btt\">+$10</td>\n" +
    "    <td class=\"tg-7btt\">-$20</td>\n" +
    "    <td class=\"tg-7btt\">-$0.50</td>\n" +
    "  </tr>\n" +
    "</tbody>\n" +
    "</table>" +
    "</div>"

var example_trial_info = [
    {
        "trial": "E1",
        "prompt1": "ABC Cinemas wants to encourage movie-goers to see a new movie with flyers that " +
            "advertise for the movie. In order to find the flyer design that best encourages movie-goers to see " +
            "the new movie, each theater owned by ABC Cinemas is provided with flyers that have a different design.",
        "slide1": "trials/trialE1-1.png",
        "prompt2": "The marketing department is experimenting with a wide variety of flyer designs. While some " +
            "flyers may <b>encourage</b> movie-goers to see the movie, others may <b>discourage</b> movie-goers to " +
            "see the movie. It is possible that these people <em>would have</em> gone to see the movie if they had " +
            "not seen the flyer.",
        "slide2": "trials/trialE1-2.png",
        "prompt3": "Each theater owned by ABC Cinemas distributed the flyers in two different ways.<br><br>In the " +
            "<b>flyers handed out</b> setting, no flyers were made obtainable. Instead, an employee stood at the exit of the " +
            "theater and randomly <b>gave</b> the flyers to half of the movie-goers. A person who was not handed a " +
            "flyer was not able to get it in any other way.<br><br>In the <b>flyers obtainable</b> setting, the flyers " +
            "are partially visible from a box. After watching a movie, each movie-goer <b>chooses</b> whether or not " +
            "to take a flyer from the box.",
        "slide3": "trials/trialE1-3.png",
        "prompt4": "At the <b>Orion Theater</b>, 20 other movie-goers were randomly selected to participate in an " +
            "experiment. 10 movie-goers were given the flyer and 10 weren't given the flyer. Since the box of flyers " +
            "was not on display that day, these 10 movie-goers had no other way of getting a flyer even if they " +
            "wanted one.<br><br>The graphic above shows that <b>5 out of 10</b> movie-goers who received the flyer " +
            "went to see the movie, and <b>5 out of 10</b> movie-goers who didn't receive the flyer went to " +
            "see the movie.",
        "slide4": "trials/trialE1-4.png",
        "prompt5": "At the same theater, 10 movie-goers took the flyer and 10 movie-goers didn't. The graphic" +
            " above shows that <b>8 out of 10</b> movie-goers who took the flyer went to see the movie, while only " +
            "<b>2 out of 10</b> movie-goers who didn't take the flyer went to see the movie.",
        "slide5": "trials/trialE1-5.png",
        "prompt6": "In this study, we'll show you data from the marketing campaigns conducted in different movie " +
            "theaters owned by ABC Cinemas. For each theater, you will see data from both of the settings: the " +
            "setting in which the flyer was handed out, and the one in which the flyer was obtainable. As Chief " +
            "Marketing Officer for ABC Cinemas, you are tasked with deciding whether a flyer should be handed out to " +
            "an individual at their local theater.",
        "slide6": "trials/trialE1-6.png",
        "prompt7": "To help you make decisions, the marketing team has identified four types of responses a " +
            "movie-goer may have after seeing a flyer. These four types of responses are represented by four " +
            "movie-goers: Mary, Jerry, Larry, and Carrie.<br><br>These four movie-goers differ in terms of whether " +
            "they went to see the new movie, and whether they would have gone to see the movie if they hadn't seen " +
            "the flyer. We will explain the different types of movie-goers on the next slides.",
        "slide7": "trials/trialE1-7.png",
        "prompt8": "Mary was <b>encouraged</b> to see the movie. She <em>wouldn't have</em> gone to see the movie " +
            "without the flyer. The company earns <b>$10</b> from a ticket purchase and a flyer costs <b>$0.50</b> " +
            "to produce. Therefore, the company earns a net total of <b>$9.50</b> by <em>encouraging</em> someone " +
            "like Mary to see the movie who wouldn't have gone otherwise.",
        "slide8": "trials/trialE1-8.png",
        "prompt9": "Carrie is <b>discouraged</b> by the flyer. She <em>would have</em> gone to see the movie without " +
            "the flyer. Once handing the flyer to Carrie, she decided to not see the movie. The company loses " +
            "<b>$20</b> in ticket sales by <em>discouraging</em> someone like Carrie to not see the movie who would " +
            "have gone otherwise. Accounting for the cost of a flyer, the company loses a total of <b>$20.50</b> by " +
            "handing a flyer to someone like Carrie.",
        "slide9": "trials/trialE1-9.png",
        "prompt10": "Jerry <b>definitely will</b> see the movie and handing him the flyer does not change his mind. " +
            "Since he <em>would have</em> gone to see the movie with or without the flyer, the company loses " +
            "<b>$0.50</b> by wasting a flyer.",
        "slide10": "trials/trialE1-10.png",
        "prompt11": "Larry <b>definitely won't</b> see the movie and handing him the flyer does not change his mind. " +
            "Since he <em>wouldn't have</em> gone to see the movie with or without the flyer, the company loses " +
            "<b>$0.50</b> by wasting a flyer.",
        "slide11": "trials/trialE1-11.png",
        "prompt12": "To summarize, your task as Chief Marketing Officer at ABC Cinemas is to maximize profit by " +
            "handing out flyers and encouraging movie-goers to see the new movie. The company gains <b>$9.50</b> by " +
            "encouraging a movie-goer like Mary to return. However, the company loses <b>$20.50</b> by discouraging " +
            "a movie-goer like Carrie. By handing out flyers to movie-goers like Jerry and Larry, the company wastes " +
            "the <b>$0.50</b> used to make the flyer.",
        "slide12": "trials/trialE1-12.png",
        "prompt13": "How much money you earn for participating depends on what decisions you make in the experiment. " +
            "You are awarded a <em>base pay</em> of <b>$2.00</b> and a <em>starting bonus</em> of <b>$1.00</b>." +
            "<br><br>Your goal is to encourage potential movie-goers to see the movie, but remember that handing out " +
            "a flyer could also discourage movie-goers. Depending on your performance, you'll earn between " +
            "<b>$2.00</b> and <b>$4.55</b> total.",
    },
    {
        "trial": "E2",
        "prompt1": "As another example, the same procedure was repeated at the <b>Apollo Theater</b> with a " +
            "different flyer.<br><br>The data on the <em>left</em> shows the results from when the flyers were " +
            "<b>handed-out</b> (movie-goers were randomly assigned to either receive or not receive the flyer). The " +
            "data on the <em>right</em> shows the results from when the flyers were <b>obtainable</b> (movie-goers " +
            "decided themselves whether or not to take the flyer).<br><br>On the <em>top</em> are the results of the " +
            "movie-goers who <b>saw</b> the flyer, and on the <em>bottom</em> are the results of the movie-goers who " +
            "<b>didn't see</b> the flyer.",
        "slide1": "trials/trialE2-1.png",
    }
];

var full_trial_info = [
    {
        "trial": "1",
        "theater": "Hercules Theater",
        "benefit": 0.5,
        "prompt3": "At the <b>Hercules Theater</b>, the actions of 20 movie-goers were observed when the flyers were " +
            "obtainable. For 20 other movie-goers, 10 were handed the flyer and 10 were not handed the flyer.",
        "slide3": "trials/trial1-3.png",
        "prompt6": "<div class='float-container' >" +
            "   <div class='float-child'>" +
            "       <b>5 out of 10</b> movie-goers who were given the flyer went to see the movie, and " +
            "       <b>4 out of 10</b> movie-goers who were not given the flyer went to see the movie.</div>" +
            "   <div class='float-child'>" +
            "       <b>10 out of 10</b> movie-goers who took the flyer went to see the movie, and " +
            "       <b>0 out of 10</b> movie-goers who didn't take the flyer went to see the movie.</div>" +
            "</div>",
        "slide6": "trials/trial1-6.png",
        "prompt7": info + "<br>The <b>Hercules Theater</b> is Matthew's local theater.<br>Do you want to " +
            "hand <b>Matthew</b> a flyer?",
        "slide7": "trials/trial1-7.png"
    },
    {
        "trial": "2",
        "theater": "Olympus Theater",
        "benefit": -0.5,
        "prompt3": "At the <b>Olympus Theater</b>, 10 movie-goers were handed the flyer and 10 were not handed the " +
            "flyer. The actions of 20 other movie-goers were observed when the flyers were obtainable. ",
        "slide3": "trials/trial2-3.png",
        "prompt6": "<div class='float-container' >" +
            "   <div class='float-child'>" +
            "       <b>5 out of 10</b> movie-goers who were given the flyer went to see the movie, and " +
            "       <b>5 out of 10</b> movie-goers who were not given the flyer went to see the movie.</div>" +
            "   <div class='float-child'>" +
            "       <b>0 out of 10</b> movie-goers who took the flyer went to see the movie, and " +
            "       <b>10 out of 10</b> movie-goers who didn't take the flyer went to see the movie.</div>" +
            "</div>",
        "slide6": "trials/trial2-6.png",
        "prompt7": "The <b>Olympus Theater</b> is Marcus's local theater.<br><br>" + info + "<br><br>Do you want to " +
            "hand <b>Marcus</b> a flyer?",
        "slide7": "trials/trial2-7.png"
    }
];

var condensed_trial_info = [
    {
        "trial": "3",
        "theater": "Achilles Theater",
        "benefit": -0.5,
        "name": "Joe",
        "slide7": "trials/trial3-7.png"
    },
    {
        "trial": "4",
        "theater": "Athena Theater",
        "benefit": -5.5,
        "name": "Alex",
        "slide7": "trials/trial4-7.png"
    },
    {
        "trial": "5",
        "theater": "Odysseus Theater",
        "benefit": -3.5,
        "name": "Frederick",
        "slide7": "trials/trial5-7.png"
    },
    {
        "trial": "6",
        "theater": "Perseus Theater",
        "benefit": -5.5,
        "name": "Julius",
        "slide7": "trials/trial6-7.png"
    },
    {
        "trial": "7",
        "theater": "Prometheus Theater",
        "benefit": -3.5,
        "name": "Belle",
        "slide7": "trials/trial7-7.png"
    },
    {
        "trial": "8",
        "theater": "Poseidon Theater",
        "benefit": 0.5,
        "name": "Tanya",
        "slide7": "trials/trial8-7.png"
    },
    {
        "trial": "9",
        "theater": "Orpheus Theater",
        "benefit": 0.5,
        "name": "Frank",
        "slide7": "trials/trial9-7.png"
    },
    {
        "trial": "10",
        "theater": "Theseus Theater",
        "benefit": -3.5,
        "name": "Murphy",
        "slide7": "trials/trial10-7.png"
    },
    {
        "trial": "11",
        "theater": "Pandora Theater",
        "benefit": -1.5,
        "name": "Eddie",
        "slide7": "trials/trial11-7.png"
    },
    {
        "trial": "12",
        "theater": "Andromeda Theater",
        "benefit": 1.5,
        "name": "Cody",
        "slide7": "trials/trial12-7.png"
    },
    {
        "trial": "13",
        "theater": "Ithaca Theater",
        "benefit": -1.5,
        "name": "Chloe",
        "slide7": "trials/trial13-7.png"
    },
    {
        "trial": "14",
        "theater": "Ajax Theater",
        "benefit": 1.5,
        "name": "Alison",
        "slide7": "trials/trial14-7.png"
    },
    {
        "trial": "15",
        "theater": "Icarus Theater",
        "benefit": 1.5,
        "name": "Ron",
        "slide7": "trials/trial15-7.png"
    },
    {
        "trial": "16",
        "theater": "Artemis Theater",
        "benefit": -1.5,
        "name": "Josie",
        "slide7": "trials/trial16-7.png"
    },
    {
        "trial": "17",
        "theater": "Dionysus Theater",
        "benefit": -1.5,
        "name": "Aaron",
        "slide7": "trials/trial17-7.png"
    },
    {
        "trial": "18",
        "theater": "Homer Theater",
        "benefit": 1.5,
        "name": "Peggy",
        "slide7": "trials/trial18-7.png"
    },
    {
        "trial": "19",
        "theater": "Europa Theater",
        "benefit": 0.5,
        "name": "Danica",
        "slide7": "trials/trial19-7.png"
    },
    {
        "trial": "20",
        "theater": "Antigone Theater",
        "benefit": 2.5,
        "name": "Jen",
        "slide7": "trials/trial20-7.png"
    },
    {
        "trial": "21",
        "theater": "Midas Theater",
        "benefit": 3.5,
        "name": "Collin",
        "slide7": "trials/trial21-7.png"
    },
    {
        "trial": "22",
        "theater": "Aphrodite Theater",
        "benefit": 2.5,
        "name": "Lennie",
        "slide7": "trials/trial22-7.png"
    },
];

var all_images = [
    "trials/trial1-3.png",
    "trials/trial1-6.png",
    "trials/trial6-7.png",
    "trials/trial10-7.png",
    "trials/trial11-7.png",
    "trials/trial12-7.png",
    "trials/trial13-7.png",
    "trials/trial14-7.png",
    "trials/trial15-7.png",
    "trials/trial16-7.png",
    "trials/trial17-7.png",
    "trials/trial18-7.png",
    "trials/trial19-7.png",
    "trials/trial2-3.png",
    "trials/trial2-6.png",
    "trials/trial2-7.png",
    "trials/trial20-7.png",
    "trials/trial21-7.png",
    "trials/trial22-7.png",
    "trials/trial3-7.png",
    "trials/trial4-7.png",
    "trials/trial5-7.png",
    "trials/trial1-7.png",
    "trials/trial7-7.png",
    "trials/trial8-7.png",
    "trials/trial9-7.png",
    "trials/trialE1-1.png",
    "trials/trialE1-2.png",
    "trials/trialE1-3.png",
    "trials/trialE1-4.png",
    "trials/trialE1-5.png",
    "trials/trialE1-6.png",
    "trials/trialE1-7.png",
    "trials/trialE1-8.png",
    "trials/trialE1-9.png",
    "trials/trialE1-10.png",
    "trials/trialE1-11.png",
    "trials/trialE1-12.png",
    "trials/trialE2-1.png",
];
