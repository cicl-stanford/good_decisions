// create timeline
timeline_exp_first = [];

//preload stimuli
let preload12 = { //load files
    type: jsPsychPreload,
    images: all_images_exp_first
}
timeline_exp_first.push(preload12)

timeline_exp_first.push(welcome);

let loop_timeline_exp_first = [];

let example_pages_exp_first = [];
for (let i = 1; i <= 12; i++) {
    let page = '<img alt="" src="' + example_trial_info_exp_first[0]['slide' + i] + '"/><br>' +
        '<p class="image-prompt">' + example_trial_info_exp_first[0]['prompt'+i] +
        '</p>';
    example_pages_exp_first.push(page);
}
let bonus_page = '<div style="width:60%; min-width:300px; margin:5em auto auto auto;">' +
    '<h2>Bonus Payments</h2><p>' + example_trial_info_exp_first[0]['prompt13'] +  '</p></div>'
example_pages_exp_first.push(bonus_page);
let e2_trials = [1];
for (let i = 0; i < e2_trials.length; i++) {
    let page = '<h2>Apollo Theater</h2><img alt="" src="' + example_trial_info_exp_first[1]['slide' +
        e2_trials[i]] + '"/><br> <p class="image-prompt">' +
        example_trial_info_exp_first[1]['prompt'+e2_trials[i]] + '</p>';
    example_pages_exp_first.push(page);
}

let instructions = {
    timeline_variables: example_trial_info_exp_first,
    type: jsPsychInstructions,
    pages: example_pages_exp_first,
    show_clickable_nav: true,
    on_start: function() { jsPsych.setProgressBar(0.02); },
    on_finish: function() { jsPsych.setProgressBar(0.1); }
};
loop_timeline_exp_first.push(instructions);

let example_response = {
    type: jsPsychSurveyHtmlForm,
    html: function () {
        return '<h2>Apollo Theater</h2> <img alt="" src="experiment12/trials/trialE2-1.png"/> <p class="image-prompt"></p>' +
            '<div style="max-width:600px; text-align:center; display:inline-block"> ' +
            '<p>Please estimate the percentage of people at this movie theater.<br>Your input must sum to 100%.</p>' +
            '<div class="row" style="display:inline-block; line-height:1.8em;">' +
            '<div class="column-left" style="text-align:left">' +
            '<em>Encouraged</em> to go by the flyer:<br>' +
            '<em>Would</em> go with or without the flyer:<br>' +
            '<em>Would not</em> go with or without the flyer:<br>' +
            '<em>Discouraged</em> to go by the flyer:' +
            '</div>' +
            '<div class="column-right" style="text-align:right">' +
            '<input name="compliers" type="number" min="0" max="100" style="width:2em direction:rtl" id="compliers">%<br>' +
            '<input name="always" type="number" min="0" max="100" style="width:2em direction:rtl" id="always">%<br>' +
            '<input name="never" type="number" min="0" max="100" style="width:2em direction:rtl" id="never">%<br>' +
            '<input name="defiers" type="number" min="0" max="100" style="width:2em direction:rtl" id="defiers">%' +
            '</div> <div style="display:inline-block"><br>' +
            'The <b>Apollo Theater</b> is Jeff\'s local theater.<br><br>' + info +
            '<br><br>Do you want to hand <b>Jeff</b> a flyer?</div>' +
            '<div style="max-width:700px; text-align:center;">' +
            '<input type="radio" id="nohandout" name="flyer" value=0>' +
            '<label for="nohandout">No</label>    ' +
            '<input type="radio" id="handout" name="flyer" value=1>\n' +
            '<label for="handout">Yes</label><br></div>';
    },
    data: {trial: jsPsych.timelineVariable('trial')},
    button_label: 'Continue',
    on_load: function () {
        const submitButton = document.querySelector('#jspsych-survey-html-form-next');
        submitButton.disabled = true;  // Disable the submit button initially
        // Add event listeners to validate the input and enable the button
        const inputFields = ['compliers', 'always', 'never', 'defiers'];
        const radioButtons = document.querySelectorAll('input[name="flyer"]');
        function validateForm() {
            let compliers = Math.abs(parseInt(document.getElementById('compliers').value)) || 0;
            let always = Math.abs(parseInt(document.getElementById('always').value)) || 0;
            let never = Math.abs(parseInt(document.getElementById('never').value)) || 0;
            let defiers = Math.abs(parseInt(document.getElementById('defiers').value)) || 0;
            let flyerSelected = Array.from(radioButtons).some(rb => rb.checked);
            let sumCorrect = (compliers + always + never + defiers === 100);
            submitButton.disabled = !(flyerSelected && sumCorrect);
        }
        // Add listeners for all input fields and radio buttons
        inputFields.forEach(field => {
            document.getElementById(field).addEventListener('input', validateForm);
        });
        radioButtons.forEach(radio => {
            radio.addEventListener('change', validateForm);
        });
    }
}
loop_timeline_exp_first.push(example_response)
let example_feedback = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
        let data = jsPsych.data.getLastTrialData().trials[0];
        let decision, decision_cf, right_wrong, outcome, outcome_cf;
        let b = 0.1 * -7.5;
        let b_display = Math.abs(parseFloat(b.toFixed(2))).toString()
        let response = data.response
        if (response['flyer'] === '1') {
            decision = "to hand out"
            decision_cf = "not to hand out"
        } else {
            decision = "not to hand out"
            decision_cf = "to hand out"
        }
        if (b > 0) {
            if (response['flyer'] === '1') {
                right_wrong = "<span style=\"color:green\">right</span>"
                outcome = "earned $" + b_display
                outcome_cf = "earned $0.00"
            } else {
                right_wrong = "<span style=\"color:red\">wrong</span>"
                outcome = "earned $0.00"
                outcome_cf = "earned $" + b_display
            }
        } else {
            if (response['flyer'] === '0') {
                right_wrong = "<span style=\"color:green\">right</span>"
                outcome = "lost $0.00"
                outcome_cf = "lost $" + b_display
            } else {
                right_wrong = "<span style=\"color:red\">wrong</span>"
                outcome = "lost $" + b_display
                outcome_cf = "lost $0.00"
            }
        }
        const feedback_contents = '<h4> You chose to <b>' + decision + '</b> the flyer.</h4>' +
            '<h4> This was the <b>' + right_wrong + '</b> choice.</h4>' +
            '<h4> You <b>' + outcome + '</b>. You would have ' + outcome_cf +
            ' if you had decided ' + decision_cf + ' the flyer.</h4>';
        return '<h2>Apollo Theater</h2><div id="jspsych-html-slider-response-wrapper">' +
            '<div id="jspsych-html-slider-response-stimulus"><img alt="" src="experiment12/trials/trialE2-1.png"></div>' +
            '<p>After each trial, you will find out how much money you earned or lost, based on the decision ' +
            'you made. You will also find out how much money you would have earned or lost, if you had ' +
            'chosen differently.</p>' +
            '<div style="border: 2px solid #232324; background-color: #edf1fa; margin:20px">' +
            '<div style="margin:20px">' + feedback_contents + '</div></div>';
    },
    choices: ['Continue']
}
loop_timeline_exp_first.push(example_feedback)
loop_timeline_exp_first.push(comprehension_qs);
loop_timeline_exp_first.push(fail_comprehension);

let loop_node = {
    timeline: loop_timeline_exp_first,
    loop_function: function(data){
        data = jsPsych.data.get().last(1).values()[0];
        return !(data.correct);
    }
}
timeline_exp_first.push(loop_node);

timeline_exp_first.push(trials_start);

let full_trials = {
    timeline_variables: full_trial_info_exp_first,
    timeline: [
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                return '<div>Trial ' + jsPsych.timelineVariable('trial', true) + ' out of 22</div> ' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide3', true) + '"/>' +
                    '<p class="image-prompt">' + jsPsych.timelineVariable('prompt3', true) + '</p>';
            },
        },
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                return '<div>Trial ' + jsPsych.timelineVariable('trial', true) + ' out of 22</div> ' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide6', true) + '"/>' +
                    '<p class="image-prompt"><div style="display:inline-block">' +
                    jsPsych.timelineVariable('prompt6', true) + '</div></p>';
            },
        },
        {
            type: jsPsychSurveyHtmlForm,
            html: function () {
                return '<div>Trial ' + jsPsych.timelineVariable('trial', true) + ' out of 22</div> ' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide7', true) + '"/>' +
                    '<p class="image-prompt"></p>' +
                    '<div style="max-width:600px; text-align:center; display:inline-block"> ' +
                    '<p>Please estimate the percentage of people at this movie theater.<br>Your input must sum to 100%.</p>' +
                    '<div class="row" style="display:inline-block; line-height:1.8em;">' +
                    '<div class="column-left" style="text-align:left">' +
                    '<em>Encouraged</em> to go by the flyer:<br>' +
                    '<em>Would</em> go with or without the flyer:<br>' +
                    '<em>Would not</em> go with or without the flyer:<br>' +
                    '<em>Discouraged</em> to go by the flyer:' +
                    '</div>' +
                    '<div class="column-right" style="text-align:right">' +
                    '<input name="compliers" type="number" min="0" max="100" style="width:2em direction:rtl" id="compliers">%<br>' +
                    '<input name="always" type="number" min="0" max="100" style="width:2em direction:rtl" id="always">%<br>' +
                    '<input name="never" type="number" min="0" max="100" style="width:2em direction:rtl" id="never">%<br>' +
                    '<input name="defiers" type="number" min="0" max="100" style="width:2em direction:rtl" id="defiers">%' +
                    '</div> <div style="display:inline-block"><br>' +
                    jsPsych.timelineVariable('prompt7', true) + '</div>' +
                    '<div style="max-width:700px; text-align:center;">' +
                    '<input type="radio" id="nohandout" name="flyer" value=0>' +
                    '<label for="nohandout">No</label>    ' +
                    '<input type="radio" id="handout" name="flyer" value=1>\n' +
                    '<label for="handout">Yes</label><br></div>';
            },
            data: {trial: jsPsych.timelineVariable('trial')},
            button_label: 'Continue',
            on_load: function () {
                const submitButton = document.querySelector('#jspsych-survey-html-form-next');
                submitButton.disabled = true;  // Disable the submit button initially
                // Add event listeners to validate the input and enable the button
                const inputFields = ['compliers', 'always', 'never', 'defiers'];
                const radioButtons = document.querySelectorAll('input[name="flyer"]');
                function validateForm() {
                    let compliers = Math.abs(parseInt(document.getElementById('compliers').value)) || 0;
                    let always = Math.abs(parseInt(document.getElementById('always').value)) || 0;
                    let never = Math.abs(parseInt(document.getElementById('never').value)) || 0;
                    let defiers = Math.abs(parseInt(document.getElementById('defiers').value)) || 0;
                    let flyerSelected = Array.from(radioButtons).some(rb => rb.checked);
                    let sumCorrect = (compliers + always + never + defiers === 100);
                    submitButton.disabled = !(flyerSelected && sumCorrect);
                }
                // Add listeners for all input fields and radio buttons
                inputFields.forEach(field => {
                    document.getElementById(field).addEventListener('input', validateForm);
                });
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', validateForm);
                });
            }
        },
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: function () {
                let data = jsPsych.data.getLastTrialData().trials[0];
                let decision, decision_cf, right_wrong, outcome, outcome_cf;
                let b = 4 * 0.1 * jsPsych.timelineVariable('benefit', true);
                let b_display = Math.abs(b).toFixed(2).toString()
                let response = data.response
                if (response['flyer'] === '1') {
                    benefits.push(b)
                    decision = "to hand out"
                    decision_cf = "not to hand out"
                } else {
                    benefits.push(0)
                    decision = "not to hand out"
                    decision_cf = "to hand out"
                }
                if (b > 0) {
                    optimal_decisions.push(b);
                    if (response['flyer'] === '1') {
                        right_wrong = "<span style=\"color:green\">right</span>"
                        outcome = "earned $" + b_display
                        outcome_cf = "earned $0.00"
                    } else {
                        right_wrong = "<span style=\"color:red\">wrong</span>"
                        outcome = "earned $0.00"
                        outcome_cf = "earned $" + b_display
                    }
                } else {
                    optimal_decisions.push(0);
                    if (response['flyer'] === '0') {
                        right_wrong = "<span style=\"color:green\">right</span>"
                        outcome = "lost $0.00"
                        outcome_cf = "lost $" + b_display
                    } else {
                        right_wrong = "<span style=\"color:red\">wrong</span>"
                        outcome = "lost $" + b_display
                        outcome_cf = "lost $0.00"
                    }
                }
                const feedback_contents = '<h4> You chose to <b>' + decision + '</b> the flyer.</h4>' +
                    '<h4> This was the <b>' + right_wrong + '</b> choice.</h4>' +
                    '<h4> You <b>' + outcome + '</b>. You would have ' + outcome_cf +
                    ' if you had decided ' + decision_cf + ' the flyer.</h4>';
                return '<div>Trial ' + jsPsych.timelineVariable('trial', true) + ' out of 22</div> ' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide7', true) + '"/>' +
                    '<div style="border: 2px solid #232324; background-color: #edf1fa; margin:20px">' +
                    '<div style="margin:20px">' + feedback_contents + '</div></div>';
            }
        }
    ],
    choices: ['Continue'],
    on_finish: function() {
        jsPsych.setProgressBar(jsPsych.getProgressBarCompleted() + 0.02);
    }
};
timeline_exp_first.push(full_trials);

timeline_exp_first.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: '<div style="width:70%; min-width:300px; margin:5em auto auto auto;">' +
        start_prompt2 + '<br><br>Click the button below to continue.<br><br></div>',
    choices: ['Continue'],
    on_finish: function() {
        jsPsych.setProgressBar(jsPsych.getProgressBarCompleted() + 0.02);
    }
});

let condensed_trials = {
    timeline_variables: condensed_trial_info_exp_first,
    timeline: [
        {
            type: jsPsychSurveyHtmlForm,
            html: function () {
                return '<div>Trial ' + trialCounter + ' out of 22</div>' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide7', true) + '"/>' +
                    '<p class="image-prompt"></p>' +
                    '<div style="max-width:600px; text-align:center; display:inline-block"> ' +
                    '<p>Please estimate the percentage of people at this movie theater.<br>Your input must sum to 100%.</p>' +
                    '<div class="row" style="display:inline-block; line-height:1.8em;">' +
                    '<div class="column-left" style="text-align:left">' +
                    '<em>Encouraged</em> to go by the flyer:<br>' +
                    '<em>Would</em> go with or without the flyer:<br>' +
                    '<em>Would not</em> go with or without the flyer:<br>' +
                    '<em>Discouraged</em> to go by the flyer:' +
                    '</div>' +
                    '<div class="column-right" style="text-align:right">' +
                    '<input name="compliers" type="number" min="0" max="100" style="width:2em direction:rtl" id="compliers">%<br>' +
                    '<input name="always" type="number" min="0" max="100" style="width:2em direction:rtl" id="always">%<br>' +
                    '<input name="never" type="number" min="0" max="100" style="width:2em direction:rtl" id="never">%<br>' +
                    '<input name="defiers" type="number" min="0" max="100" style="width:2em direction:rtl" id="defiers">%' +
                    '</div> <div style="display:inline-block"><br>' + info +
                    '<br>The <b>' + jsPsych.timelineVariable('theater', true) + '</b> is ' +
                    jsPsych.timelineVariable('name', true) + '\'s local theater.<br> ' +
                    'Do you want to hand <b>' + jsPsych.timelineVariable('name', true) + '</b> a flyer? </div>' +
                    '<div style="max-width:700px; text-align:center;">' +
                    '<input type="radio" id="nohandout" name="flyer" value=0>' +
                    '<label for="nohandout">No</label>    ' +
                    '<input type="radio" id="handout" name="flyer" value=1>\n' +
                    '<label for="handout">Yes</label><br></div>';
            },
            data: {trial: jsPsych.timelineVariable('trial')},
            button_label: 'Continue',
            on_load: function () {
                const submitButton = document.querySelector('#jspsych-survey-html-form-next');
                submitButton.disabled = true;  // Disable the submit button initially
                // Add event listeners to validate the input and enable the button
                const inputFields = ['compliers', 'always', 'never', 'defiers'];
                const radioButtons = document.querySelectorAll('input[name="flyer"]');
                function validateForm() {
                    let compliers = Math.abs(parseInt(document.getElementById('compliers').value)) || 0;
                    let always = Math.abs(parseInt(document.getElementById('always').value)) || 0;
                    let never = Math.abs(parseInt(document.getElementById('never').value)) || 0;
                    let defiers = Math.abs(parseInt(document.getElementById('defiers').value)) || 0;
                    let flyerSelected = Array.from(radioButtons).some(rb => rb.checked);
                    let sumCorrect = (compliers + always + never + defiers === 100);
                    submitButton.disabled = !(flyerSelected && sumCorrect);
                }
                // Add listeners for all input fields and radio buttons
                inputFields.forEach(field => {
                    document.getElementById(field).addEventListener('input', validateForm);
                });
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', validateForm);
                });
            }
        },
        {
            type: jsPsychHtmlButtonResponse,
            choices: ['Continue'],
            stimulus: function () {
                let data = jsPsych.data.getLastTrialData().trials[0];
                let decision, decision_cf, right_wrong, outcome, outcome_cf;
                let b = 4 * 0.1 * jsPsych.timelineVariable('benefit', true);
                let b_display = Math.abs(b).toFixed(2).toString()
                let response = data.response
                if (response['flyer'] === '1') {
                    benefits.push(b)
                    decision = "to hand out"
                    decision_cf = "not to hand out"
                } else {
                    benefits.push(0)
                    decision = "not to hand out"
                    decision_cf = "to hand out"
                }
                if (b > 0) {
                    optimal_decisions.push(b);
                    if (response['flyer'] === '1') {
                        right_wrong = "<span style=\"color:green\">right</span>"
                        outcome = "earned $" + b_display
                        outcome_cf = "earned $0.00"
                    } else {
                        right_wrong = "<span style=\"color:red\">wrong</span>"
                        outcome = "earned $0.00"
                        outcome_cf = "earned $" + b_display
                    }
                } else {
                    optimal_decisions.push(0);
                    if (response['flyer'] === '0') {
                        right_wrong = "<span style=\"color:green\">right</span>"
                        outcome = "lost $0.00"
                        outcome_cf = "lost $" + b_display
                    } else {
                        right_wrong = "<span style=\"color:red\">wrong</span>"
                        outcome = "lost $" + b_display
                        outcome_cf = "lost $0.00"
                    }
                }
                const feedback_contents = '<h4> You chose to <b>' + decision + '</b> the flyer.</h4>' +
                    '<h4> This was the <b>' + right_wrong + '</b> choice.</h4>' +
                    '<h4> You <b>' + outcome + '</b>. You would have ' + outcome_cf +
                    ' if you had decided ' + decision_cf + ' the flyer.</h4>';
                trialCounter++;
                return '<div>Trial ' + (trialCounter - 1).toString() + ' out of 22</div>' +
                    '<h2>' + jsPsych.timelineVariable('theater', true) + '</h2> ' +
                    '<img alt="" src="' + jsPsych.timelineVariable('slide7', true) + '"/>' +
                    '<div style="border: 2px solid #232324; background-color: #edf1fa; margin:20px">' +
                    '<div style="margin:20px">' + feedback_contents + '</div></div>';
            }
        }
    ],
    randomize_order: true,
    on_finish: function() {
        jsPsych.setProgressBar(jsPsych.getProgressBarCompleted() + 0.015);
    },
};
timeline_exp_first.push(condensed_trials);

timeline_exp_first.push(thanks);
timeline_exp_first.push(demographics_trial);
timeline_exp_first.push(save_email_data);
timeline_exp_first.push(save_data);