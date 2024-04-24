
var host = "cpsc484-04.stdusr.yale.internal:8888";

//This can store the options for each question. populate it based on our current screen 
var optionMapping = {
    'surveyScreen': ['mainQuestion'],
    'mainQuestion': ['eatQuestion', 'studyQuestion', 'connectQuestion'],
    'eatQuestion': ['recommendations_page/result_group_a.html', 'recommendations_page/result_group_b.html'],
    'studyQuestion': ['recommendations_page/result_group_c.html', 'recommendations_page/result_group_d.html'],
    'connectQuestion': ['recommendations_page/result_group_e.html', 'recommendations_page/result_group_f.html'],
    'recommendations_page/result_group_a.html': ['surveyScreen'],
    'recommendations_page/result_group_b.html': ['surveyScreen'],
    'recommendations_page/result_group_c.html': ['surveyScreen'],
    'recommendations_page/result_group_d.html': ['surveyScreen'],
    'recommendations_page/result_group_e.html': ['surveyScreen'],
    'recommendations_page/result_group_f.html': ['surveyScreen']

};

var option_list = optionMapping['surveyScreen'];
var current_index = 0;
//Keep track of weather arms are already up
var reset = true;
//get the data of the user

$(document).ready(function () {
    //console.log("Starting");
    frames.start();
});

//Prints frame information to console
var frames = {
    socket: null,

    start: function () {
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function (event) {
            var data = JSON.parse(event.data)
            frames.show(data);

            //Then there is at least one person in from
            if(data.people.length > 0)
            {
                console.log("Person detected", data.people.length);
                //Transition screens
                //transitionTo('mainQuestion');
                //Right hand is joint 15
                //Chest is joint 2
                //Left hand is joint 8
                var target_person = data.people[0];
                if (target_person.joints.length > 14) {
                    //Get the right hand
                    var right_h = target_person.joints[15];
                    //Get the left hand
                    var left_h = target_person.joints[8];
                    //Get chest 
                    var chest = target_person.joints[2];

                    //Check for input
                    //Check for both hands raised
                    if(right_h.pixel.y < chest.pixel.y && left_h.pixel.y < chest.pixel.y)
                    {
                        if(reset == true){
                            reset = false;
                            console.log("Arms up");
                            //Then we want to select this as our option
                            option_list = optionMapping[option_select(option_list, current_index)];
                            current_index = 0;
                        }
        
                    }
                    //Check for right hand raised
                    else if(right_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the right
                        if(reset == true)
                        {
                            reset = false;
                            console.log("Right hand");
                            current_index = move_right(option_list, current_index);
                            
                        }

                    }
                    //Check for left hand raised
                    else if(left_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the left
                        if(reset == true)
                        {
                            reset = false;
                            console.log("Move left");
                            current_index = move_left(option_list, current_index);
                        }

                    }
                    else{
                        //no arms are raised
                        reset = true;
                    }
                }
            }
            else {
                //exit to the start page
                transitionTo('surveyScreen');
                option_list = optionMapping['surveyScreen'];
            }
        }

    },

    show: function (frame) {
        console.log(option_list);
        
    }
};


// This function handles transitioning between screens
function transitionTo(selectedOption) {
    //current_index = index;
    console.log("Transition scene");
    //Transition to the new screen
    $('.screen').removeClass('active'); 
    $('#' + selectedOption).addClass('active'); 
    option_list = optionMapping[selectedOption];
    console.log("OPTION LIST TRANSIT: ", option_list);
    return option_list;
}
function results_page(pageId) {
    window.location.href = pageId;
}


// Updated move_right function
function move_right(option_list, current_index) {
    current_index = (current_index + 1) % option_list.length;
    return current_index;
}

// Updated move_left function
function move_left(option_list, current_index) {
    current_index = (current_index - 1 + option_list.length) % option_list.length;
    return current_index;
}

// Updated option_select function
function option_select(option_list, current_index) {

    var selectedOption = option_list[current_index];
    console.log("Option selected:", selectedOption);
    if(selectedOption == null)
    {
        selectedOption = optionMapping['surveyScreen'];
    }
    if(selectedOption == 'surveyScreen' || selectedOption == 'mainQuestion' || selectedOption == 'eatQuestion' || selectedOption == 'studyQuestion' || selectedOption == 'connectQuestion' )
    {
    // Transition to the selected option screen
        transitionTo(selectedOption);
    }
    
    else{
        results_page(selectedOption);
    }

    console.log("OPtions: ", option_list);
    return selectedOption;
}


