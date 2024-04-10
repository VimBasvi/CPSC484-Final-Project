
var host = "cpsc484-02.stdusr.yale.internal:8888";

//This can store the options for each question. We will need to populate this list. 
var option_list = [];
var current_index = 0;
//get the data of the user

$(document).ready(function () {
    twod.start();
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
                        //Then we want to select this as our option
                        option_select();
                    }
                    //Check for right hand raised
                    else if(right_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the right
                        move_right();
                    }
                    //Check for left hand raised
                    else if(left_h.pixel.y < chest.pixel.y) {
                        //Then we want to move options to the left
                        move_left();
                    }
                }
            }
        }

    },

    show: function (frame) {
        console.log(frame);
    }
};

function move_right() {
    //We want to scroll the currently selected option to the right
    if(current_index == option_list.length) {
        //then go to option 0 (Start of the list)
        current_index = 0;
    }
    else {
        //We want to go right
        current_index ++;
    }

}

function move_left() {
    //We want to scroll the currently selected optioin to the left
    if(current_index == 0) {
        //then go to option at end of list
        current_index = option_list.length;
    }
    else {
        //We want to go left
        current_index --;
    }
}

function option_select() {
    //Make this our saved answer and move onto next question
    //TODO: Program behavior for switching to next question

}
var twod = {
    socket: null,

    // create a connection to the camera feed
    start: function () {
        var url = "ws://" + host + "/twod";
        twod.socket = new WebSocket(url);

        // whenever a new frame is received...
        twod.socket.onmessage = function (event) {

            // parse and show the raw data
            twod.show(JSON.parse(event.data));
        }


    },

    // show the image by adjusting the source attribute of the HTML img object previously created
    show: function (twod) {
        $('img.twod').attr("src", 'data:image/pnjpegg;base64,' + twod.src);
    },
};

// // Mock functions to simulate direction detection
// function detectDirection() {
//     // This would be replaced by actual Kinect SDK calls and logic
// 	// eg if left hand is raised, food, else study pot if moved to right 
//     const optionFood = document.getElementById('option-food');
//     optionFood.innerHTML += '<p>Move Left</p>';

//     const optionStudySpot = document.getElementById('option-study-spot');
//     optionStudySpot.innerHTML += '<p>Move Right</p>';
// }

// // simulate direction detection
// setTimeout(detectDirection, 2000);