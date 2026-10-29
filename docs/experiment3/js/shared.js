let benefits = [];
let optimal_decisions = [];
let trialCounter = 3;  // Initialize the trial counter, account for full trials
let email_temp = "";
let final_payment = 0;

// Initialize jsPsych and run the experiment
let jsPsych = initJsPsych({
    on_finish: function(){
        jsPsych.data.displayData();
    },
    show_progress_bar: true,
    auto_update_progress_bar: false
});
let expID = "9buyyHifAKTx"; //from Datapipe
let subjectID = jsPsych.randomization.randomID(10);

let info = "<div style=\"display: inline-block\">" +
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

// display welcome screen
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p><b>Consent Form</b></p> <div style="text-align:left;' +
        'background-color:lightblue; padding:20px; max-width:900px;">' +
        '<p><b>Description:</b> You are invited to participate in a research study in cognitive psychology. ' +
        'You will be asked to perform various tasks on a computer which may include: looking at images or ' +
        'videos, listening to sounds, reading scenarios, or playing games. You may be asked a number of ' +
        'different questions such as giving descriptions of what happened, making causal judgments, and ' +
        'interpreting people’s actions. All information collected will remain confidential. </p>' +
        '<p><b>Risks and benefits:</b> Risks involved in this study are the same as those normally ' +
        'associated with using a computer (e.g., mild eye/arm strain). If you have any pre-existing ' +
        'conditions that might make reading and completing a computer-based survey strenuous for you, you ' +
        'should probably elect to not participate in this study. If at any time during the study you feel ' +
        'unable to participate because you are experiencing strain, you may end your participation without ' +
        'penalty. We cannot and do not guarantee or promise that you will receive any benefits from this ' +
        'study. Your decision whether or not to participate in this study will not affect your ' +
        'employment/medical care/grades in school. Only the PI and the research team will have access to and ' +
        'analyze the data. Compensation will be paid out through a third-party and the emails will be stored ' +
        'in a separate location from the de-identified data. Anyone who advertises the study on our behalf ' +
        'is not a part of the study and will not know who participates.</p>' +
        '<p><b>Time involvement:</b> Your participation in this experiment will take 30 minutes. </p>' +
        '<p><b> Payment:</b> You will receive a base compensation at a rate of $40 per hour. You will also ' +
        'receive a bonus based on your performance in the task of up to $20.20 per hour. Your expected bonus ' +
        'will be $4.00 per hour. This bonus depends on what decisions you make in the experiment. </p>' +
        "<p><b>Subject's rights:</b> If you have read this notice and have decided to participate in this " +
        "project, please understand your participation is voluntary and you have the right to withdraw your " +
        "consent or discontinue participation at any time without penalty or loss of benefits to which you " +
        "are otherwise entitled. You have the right to refuse to answer particular questions. Your " +
        "individual privacy will be maintained in all published and written data resulting from the study. " +
        "</p>" +
        '<p><b>Contact information:</b> Questions, Concerns, or Complaints: If you have any questions, ' +
        'concerns or complaints about this research study, its procedures, risks and benefits, you should ' +
        'ask the Protocol Director, (Professor Tobias Gerstenberg, Phone: (650) 725-2431; Email: ' +
        'gerstenberg@stanford.edu). </p>' +
        '<p><b>Independent contact:</b> If you are not satisfied with how this study is being conducted, or ' +
        'if you have any concerns, complaints, or general questions about the research or your rights as a ' +
        'participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone ' +
        'independent of the research team via email at  irbnonmed@stanford.edu, or via phone at ' +
        '(650) 723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford ' +
        'University, 1705 El Camino Real, Palo Alto, CA 94306. </p>' +
        '<p>You may want to print a copy of this consent form to keep. By clicking the button below, you ' +
        'acknowledge that you have read the above information, that you are 18 years of age, or older and ' +
        'give your consent to participate in our internet-based study and consent for us to analyze the ' +
        'resulting data. </p> </div>' +
        '<p> Do you agree with the terms of the experiment as explained above? </p>',
    choices: ['I agree']
};

// display comprehension questions
let options_tf = ['True', 'False'];
let comprehension_qs = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: 'The flyer may encourage or discourage people to see the new movie.',
            options: options_tf,
            horizontal: true,
            required: true
        },
        {
            prompt: 'The effect of the flyer is the same for all movie-goers that frequent the same theater.',
            options: options_tf,
            horizontal: true,
            required: true
        },
        {
            prompt: 'When the flyers are obtainable, movie-goers are free to choose whether or not to take a flyer.',
            options: options_tf,
            horizontal: true,
            required: true
        },
        {
            prompt: 'When the flyers are handed out, movie-goers are free to choose whether or not to take a flyer.',
            options: options_tf,
            horizontal: true,
            required: true
        },
        {
            prompt: 'When you are handing out flyers, movie-goers who don\'t receive a flyer are still able ' +
                'to obtain one if they want one.',
            options: options_tf,
            horizontal: true,
            required: true
        }
    ],
    css_classes: ['center-radio'],
    preamble: 'Please answer a few comprehension questions so we know that you understand the setup.',
    on_finish: function(data){
        let correct_answers = {
            Q0: "True",
            Q1: "False",
            Q2: "True",
            Q3: "False",
            Q4: "False"
        };

        // data.response contains the user's answers as an object
        let user_responses = data.response;

        // Check if all answers are correct
        data.correct = (
            user_responses.Q0 === correct_answers.Q0 &&
            user_responses.Q1 === correct_answers.Q1 &&
            user_responses.Q2 === correct_answers.Q2 &&
            user_responses.Q3 === correct_answers.Q3 &&
            user_responses.Q4 === correct_answers.Q4
        );
    }
}

let fail_comprehension = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: 'Unfortunately, you missed some of the comprehension ' +
            'questions.</p> <p> Please review the instructions again.',
        choices: ['Review'],
    }],
    conditional_function: function(){
        let data = jsPsych.data.get().last(1).values()[0];
        return !(data.correct);
    }
}

let start_prompt1 = "Correct! You'll now be asked similar questions about various theaters owned by ABC Cinemas. " +
    "You want to maximize your profit by handing out flyers only to individuals who you think would be encouraged " +
    "by the flyer. Your final earnings will be between $20.00 and $30.20, depending on the number of correct " +
    "decisions you make.";

let start_prompt2 = "Great! To speed up the experiment, for the rest of the theaters, you'll only see the data " +
    "from the marketing campaigns.";

// add transition to start
let trials_start = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<div style="width:60%; min-width:300px; margin:5em auto auto auto;"><p>' +
        start_prompt1 + "<br> <br> Please do not refresh the page." +
        " Click the start button whenever you're ready. <br> </div>",
    choices: ['Start'],
    on_finish: function() { jsPsych.setProgressBar(0.14); },
};

let thanks = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
        let hand_outs = 0, rights = 0, wrongs = 0, bonus = 4;
        for (let i = 0; i < benefits.length; i++) {
            let b = benefits[i];
            let d = optimal_decisions[i];
            if (b !== 0) {
                hand_outs++;
                bonus = bonus + b;
            }
            if (b === d) {
                rights++;
            } else {
                wrongs++;
            }
        }
        if (bonus < 0) { bonus = 0; }
        bonus = parseFloat(bonus.toFixed(2));
        final_payment = 20 + bonus;

        return '<div style="margin: auto;"> <p>' +
            'Congrats on completing our study! Out of the 22 total scenarios, you chose to hand out <b>' +
            hand_outs + '</b> flyers in total.<br><br>You made the right decision in <b>' + rights +
            '</b> scenarios and the wrong decision in <b>' + wrongs + '</b> scenarios.<br><br>' +
            'You earned a total bonus payment of <b>$' + bonus + '</b>.<br><br>' +
            'Thank you for participating in this experiment! </p>'
    },
    choices: ['Continue']
}


// feedback form
let demographics_form = '<div style="max-width:600px; margin:auto; text-align:left;">' +
    '<p>What factors influenced how you decided to respond? Do you have any questions or comments regarding the experiment?</p>' +
    '<textarea name="feedback" cols="40" rows="6" autofocus style="width:100%;"></textarea>' +
    '<p>Please provide the following information to complete the study.</p>' +

    '<label for="age" style="display: inline-block; margin-right: 10px;"><strong>Age:</strong></label>' +
    '<input name="age" type="number" min="18" max="100" style="width: calc(100% - 60px); display: inline-block;" /><br><br>' +

    '<label for="gender"><strong>Gender:</strong></label><br>' +
    '<input name="gender" type="radio" id="female" value="Female" /> <label for="female"> Female </label><br>' +
    '<input name="gender" type="radio" id="male" value="Male" /> <label for="male"> Male </label><br>' +
    '<input name="gender" type="radio" id="nonbinary" value="Non-binary" /> <label for="nonbinary"> Non-binary </label><br>' +
    '<input name="gender" type="radio" id="other_gender" value="other_gender" style="display: inline-block; margin-right: 5px;" />' +
    '<label for="other_gender" style="display: inline-block; margin-right: 10px;">Other:</label>' +
    '<input type="text" name="other_gender" style="width: calc(100% - 150px); display: inline-block;" /><br><br>' +

    '<label for="race"><strong>Race:</strong></label><br>' +
    '<input name="race" type="radio" id="white" value="White" /> <label for="white"> White </label><br>' +
    '<input name="race" type="radio" id="black" value="Black/African American" /> <label for="black"> Black/African American </label><br>' +
    '<input name="race" type="radio" id="am_ind" value="American Indian/Alaska Native" /> <label for="am_ind"> American Indian/Alaska Native </label><br>' +
    '<input name="race" type="radio" id="asian" value="Asian" /> <label for="asian"> Asian </label><br>' +
    '<input name="race" type="radio" id="pac_isl" value="Native Hawaiian/Pacific Islander" /> <label for="pac_isl"> Native Hawaiian/Pacific Islander </label><br>' +
    '<input name="race" type="radio" id="other_race" value="other_race" style="display: inline-block; margin-right: 5px;" />' +
    '<label for="other_race" style="display: inline-block; margin-right: 10px;">Other:</label>' +
    '<input type="text" name="other_race" style="width: calc(100% - 150px); display: inline-block;" /><br><br>' +

    '<label for="ethnicity"><strong>Ethnicity:</strong></label><br>' +
    '<input name="ethnicity" type="radio" id="hisp" value="Hispanic" /> <label for="hisp"> Hispanic </label><br>' +
    '<input name="ethnicity" type="radio" id="nonhisp" value="Non-Hispanic" /> <label for="nonhisp"> Non-Hispanic </label><br><br>' +

    '<label for="degree"><strong>Which one describes you best?</strong></label><br>' +
    '<input name="degree" type="radio" id="undergrad" value="Undergraduate student" /> <label for="undergrad"> Undergraduate student </label><br>' +
    '<input name="degree" type="radio" id="masters" value="Masters student" /> <label for="masters"> Masters student </label><br>' +
    '<input name="degree" type="radio" id="phd" value="PhD student" /> <label for="phd"> PhD student </label><br>' +
    '<input name="degree" type="radio" id="postdoc" value="Postdoc" /> <label for="postdoc"> Postdoc </label><br>' +
    '<input name="degree" type="radio" id="faculty" value="Faculty" /> <label for="faculty"> Faculty </label><br><br>' +

    '<label for="department"><strong>What department are you in?</strong></label><br>' +
    '<input type="text" name="department" style="width:100%;" /><br><br>' +

    '<label for="area_of_study"><strong>What is your area of study?</strong></label><br>' +
    '<input type="text" name="area_of_study" style="width:100%;" /><br><br>' +

    '<label for="causal_inference"><strong>How familiar are you with methods for causal inference?</strong></label><br>' +
    '<input name="causal_inference" type="radio" id="not_at_all" value="not at all" /> <label for="not_at_all"> not at all </label><br>' +
    '<input name="causal_inference" type="radio" id="slightly" value="slightly" /> <label for="slightly"> slightly </label><br>' +
    '<input name="causal_inference" type="radio" id="somewhat" value="somewhat" /> <label for="somewhat"> somewhat </label><br>' +
    '<input name="causal_inference" type="radio" id="very" value="very" /> <label for="very"> very </label><br><br>' +

    '<label for="email"><strong>Email (@stanford.edu):</strong></label><br>' +
    '<p><i>If you do not wish to receive compensation, use x@stanford.edu.</i></p>' +
    '<input type="text" name="email" id="email-input" style="width:100%;" /><br><br>' +

    '<p style="text-align:center;">Please press the finish button to complete the experiment.</p>' +
    '</div>'

let demographics_trial = {
    type: jsPsychSurveyHtmlForm,
    html: demographics_form,
    button_label: 'Finish',
    on_start: function() { jsPsych.setProgressBar(1.0); },
    on_load: function() {
        const submitButton = document.querySelector('#jspsych-survey-html-form-next');
        submitButton.disabled = true;

        const emailInput = document.getElementById('email-input');
        const ageInput = document.querySelector('input[name="age"]');
        const genderInputs = document.querySelectorAll('input[name="gender"]');
        const raceInputs = document.querySelectorAll('input[name="race"]');
        const ethnicityInputs = document.querySelectorAll('input[name="ethnicity"]');
        const degreeInputs = document.querySelectorAll('input[name="degree"]');
        const departmentInput = document.querySelector('input[name="department"]');
        const areaOfStudyInput = document.querySelector('input[name="area_of_study"]');
        const causalInputs = document.querySelectorAll('input[name="causal_inference"]');

        function validateForm() {
            const email = emailInput.value;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@stanford\.edu$/;
            const emailValid = emailRegex.test(email);

            const ageValid = ageInput.value !== "";
            const genderValid = Array.from(genderInputs).some(input => input.checked);
            const raceValid = Array.from(raceInputs).some(input => input.checked);
            const ethnicityValid = Array.from(ethnicityInputs).some(input => input.checked);
            const degreeValid = Array.from(degreeInputs).some(input => input.checked);
            const departmentValid = departmentInput.value !== "";
            const areaOfStudyValid = areaOfStudyInput.value !== "";
            const causalValid = Array.from(causalInputs).some(input => input.checked);

            submitButton.disabled = !(emailValid && ageValid && genderValid && raceValid && ethnicityValid
                && degreeValid && departmentValid && areaOfStudyValid && causalValid);
        }

        emailInput.addEventListener('input', validateForm);
        ageInput.addEventListener('input', validateForm);
        departmentInput.addEventListener('input', validateForm);
        areaOfStudyInput.addEventListener('input', validateForm);
        genderInputs.forEach(input => input.addEventListener('change', validateForm));
        raceInputs.forEach(input => input.addEventListener('change', validateForm));
        ethnicityInputs.forEach(input => input.addEventListener('change', validateForm));
        degreeInputs.forEach(input => input.addEventListener('change', validateForm));
        causalInputs.forEach(input => input.addEventListener('change', validateForm));
    },
    on_finish: function(data) {
        // Store email in the temporary variable
        email_temp = data.response.email;
        // Remove email from the main data
        // delete data.response.email;
    }
};

// Save the email data as a separate file
const save_email_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: expID,
    filename: () => `${subjectID}-email.csv`,
    data_string: () => {
        // Extract headers from the main data CSV
        const headers = jsPsych.data.get().csv().split("\n")[0];  // Get the header row
        // Create an empty row with only the 'response' populated
        const emailDataArray = ["", "", "", "", "", "", "", "", "", "", "", `{${email_temp}: ${final_payment}}`]
        return `${headers}\n${emailDataArray.join(",")}`;
    },
    on_finish: function() {
        email_temp = "";
    }
};

const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: expID,
    filename: `${subjectID}.csv`,
    data_string: () => jsPsych.data.get().csv()
};