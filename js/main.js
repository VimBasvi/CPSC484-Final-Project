
var host = "cpsc484-04.stdusr.yale.internal:8888";

//This can store the options for each question. populate it based on our current screen 
var optionMapping = {
    'Pre_startPage': ['mainQuestion'],
    'mainQuestion': ['eatQuestion', 'studyQuestion', 'connectQuestion'],
    'eatQuestion': ['resultGroupA', 'resultGroupB'],
    'studyQuestion': ['resultGroupC', 'resultGroupD'],
    'connectQuestion': ['resultGroupE', 'resultGroupF']
};

var option_list = optionMapping['Pre_startPage'];
var current_index = 0;
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
                console.log("Person detected");
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
                        console.log("Arms up");
                        //Then we want to select this as our option
                        option_list = option_select();
                        current_index = 0;
                    }
                    //Check for right hand raised
                    else if(right_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the right
                        console.log("Right hand");
                        current_index = move_right();
                    }
                    //Check for left hand raised
                    else if(left_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the left
                        console.log("Move left");
                        current_index = move_left();
                    }
                }
            }
        }

    },

    show: function (frame) {
        console.log(option_list);
        
    }
};


// This function handles transitioning between screens
function transitionTo(index) {
    //current_index = index;
    console.log("Transition scene");
    //Transition to the new screen
    $('.screen').removeClass('active'); 
    $('#' + option_list[current_index]).addClass('active'); 
    option_list = optionMapping[current_index];
    return option_list;
}

// Updated move_right function
function move_right() {
    current_index = (current_index + 1) % option_list.length;
    return current_index;
}

// Updated move_left function
function move_left() {
    current_index = (current_index - 1 + option_list.length) % option_list.length;
    return current_index;
}

// Updated option_select function
function option_select() {
    var selectedOption = option_list[current_index];
    console.log('Option selected:', selectedOption);
    
    // Transition to the selected option screen
    option_list = transitionTo(selectedOption);
    return option_list;
}


