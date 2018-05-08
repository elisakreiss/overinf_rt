// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function make_slides(f) {
  preload(
    ["pictures/banana_blue.png","pictures/carrot_orange.png","pictures/tomato_purple.png","pictures/pear_yellow.png","pictures/pepper_green.png","pictures/pear_green.png","pictures/avocado_red.png","pictures/carrot_purple.png","pictures/avocado_black.png","pictures/banana_brown.png","pictures/avocado_green.png","pictures/pepper_orange.png","pictures/tomato_green.png","pictures/tomato_red.png","pictures/apple_green.png","pictures/pepper_black.png","pictures/apple_red.png","pictures/carrot_brown.png","pictures/apple_blue.png","pictures/pear_orange.png","pictures/banana_yellow.png","pictures/pepper_red.png"], 
    {after: function() {console.log("all images loaded")}}
  );
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.intro = slide({
    name : "intro",
    button : function() {
      exp.go();
    }
  });

  slides.clickObj = slide({
    name: "clickObj",
    present: exp.stims,
    present_handle: function(stim) {

      document.getElementById("img_0").style.border = "4px solid lightgrey";
      document.getElementById("img_1").style.border = "4px solid lightgrey";
      document.getElementById("img_2").style.border = "4px solid lightgrey";
      document.getElementById('submitObj').style.visibility = 'hidden';
      document.getElementById('refExp').style.visibility = 'hidden';
      document.getElementById('showRefExp').style.visibility = 'visible';
      $("#showRefExp").focus();


      console.log("stim");
      console.log(stim);
      this.stim = stim;
      console.log('made it into production');
      console.log(stim);

      var refExp = "Please, select the <strong>"+stim.utterance+"</strong>!"
      $("#refExp").html(refExp);

      var target_html = '<img src="pictures/'+stim.target_type+'_'+stim.target_color+'.png" style="height:110px;">';
      var dist1_html = '<img src="pictures/'+stim.dist1_type+'_'+stim.dist1_color+'.png" style="height:110px;">';
      var dist2_html = '<img src="pictures/'+stim.dist2_type+'_'+stim.dist2_color+'.png" style="height:110px;">';
      shuffled_images = _.shuffle([target_html, dist1_html, dist2_html]);

      // to log position of objects
      var target_pos = shuffled_images.indexOf(target_html);
      this.stim.target_pos = target_pos;
      var dist1_pos = shuffled_images.indexOf(dist1_html);
      this.stim.dist1_pos = dist1_pos;
      var dist2_pos = shuffled_images.indexOf(dist2_html);
      this.stim.dist2_pos = dist2_pos;

      // jquery pictures to html
      $("#img_0").html(shuffled_images[0]);
      $("#img_1").html(shuffled_images[1]);
      $("#img_2").html(shuffled_images[2]);

      $(function(){
        $('#showRefExp').click(function() {
          // to measure response time
          this.utt_present = Date.now();
          document.getElementById('refExp').style.visibility = 'visible';
          document.getElementById('showRefExp').style.visibility = 'hidden';
          document.getElementById('error').style.visibility = 'hidden';
        });
      });

      var tbl = document.getElementById("tblMain");
      if (tbl != null) {
          for (var i = 0; i < tbl.rows.length; i++) {
              for (var j = 0; j < tbl.rows[i].cells.length; j++)
                  tbl.rows[i].cells[j].onclick = function () { getval(this); };
          }
      }

      this.trial_end;
      this.clickedObject;
      this.selectedItems = 0;

      function getval(cel) {
        if (document.getElementById('refExp').style.visibility == 'hidden') {
          document.getElementById('error').style.visibility = 'visible';
        } else {
          _s.trial_end = Date.now();
          document.getElementById("img_0").style.border = "4px solid lightgrey";
          document.getElementById("img_1").style.border = "4px solid lightgrey";
          document.getElementById("img_2").style.border = "4px solid lightgrey";
          _s.clickedObject = cel.id;
          document.getElementById(cel.id).style.border = "4px solid green";
          _s.selectedItems += 1;
          document.getElementById('submitObj').style.visibility = 'visible';
          $("#submitObj").focus();
        }
      }

    },
    button : function() { 
      // this.stim.clickedObject = clickedObject;
      this.log_responses();
      console.log("exp.data_trials");
      console.log(exp.data_trials);
      _stream.apply(this);
    },

    log_responses : function() {
        exp.data_trials.push({
          "target_type" : this.stim.target_type,
          "target_color" : this.stim.target_color,
          "dist1_type" : this.stim.dist1_type,
          "dist1_color" : this.stim.dist1_color,
          "dist2_type" : this.stim.dist2_type,
          "dist2_color" : this.stim.dist2_color,
          "target_pos" : this.stim.target_pos,
          "dist1_pos" : this.stim.dist1_pos,
          "dist2_pos" : this.stim.dist2_pos,
          "utterance" : this.stim.utterance,
          "slide_number_in_experiment" : exp.phase,
          "rt" : _s.trial_end - _s.utt_present,
          "response_pos" : _s.clickedObject,
          "nrSelectedItems" : _s.selectedItems,
          "condition" : this.stim.condition
        });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

  var items = _.shuffle([
    {
      "target_type": "apple",
      "target_color": "red",
      // distractor for -cc conditions
      "colorCompetitor_type": "tomato",
      // distractors to vary informativity of context (colors of other apples)
      "typeCompetitor_color": ["green","blue"]
    },
	  {
      "target_type": "apple",
      "target_color": "green",
      "colorCompetitor_type": "tomato",
      "typeCompetitor_color": ["red","blue"]
    },
    {
      "target_type": "apple",
      "target_color": "blue",
      "colorCompetitor_type": "banana",
      "typeCompetitor_color": ["green","red"]
    },
    {
      "target_type": "avocado",
      "target_color": "black",
      "colorCompetitor_type": "pepper",
      "typeCompetitor_color": ["green","red"]
    },
    {
      "target_type": "avocado",
      "target_color": "green",
      "colorCompetitor_type": "pepper",
      "typeCompetitor_color": ["black","red"]
    },
    {
      "target_type": "avocado",
      "target_color": "red",
      "colorCompetitor_type": "apple",
      "typeCompetitor_color": ["green","black"]
    },
    {
      "target_type": "banana",
      "target_color": "blue",
      "colorCompetitor_type": "apple",
      "typeCompetitor_color": ["brown","yellow"]
    },
    {
      "target_type": "banana",
      "target_color": "brown",
      "colorCompetitor_type": "carrot",
      "typeCompetitor_color": ["blue","yellow"]
    },
    {
      "target_type": "banana",
      "target_color": "yellow",
      "colorCompetitor_type": "pear",
      "typeCompetitor_color": ["brown","blue"]
    },
    {
      "target_type": "carrot",
      "target_color": "orange",
      "colorCompetitor_type": "pepper",
      "typeCompetitor_color": ["purple","brown"]
    },
    {
      "target_type": "carrot",
      "target_color": "purple",
      "colorCompetitor_type": "tomato",
      "typeCompetitor_color": ["orange","brown"]
    },
    {
      "target_type": "carrot",
      "target_color": "brown",
      "colorCompetitor_type": "banana",
      "typeCompetitor_color": ["purple","orange"]
    },
    {
      "target_type": "pear",
      "target_color": "green",
      "colorCompetitor_type": "apple",
      "typeCompetitor_color": ["orange","yellow"]
    },
    {
      "target_type": "pear",
      "target_color": "orange",
      "colorCompetitor_type": "carrot",
      "typeCompetitor_color": ["green","yellow"]
    },
    {
      "target_type": "pear",
      "target_color": "yellow",
      "colorCompetitor_type": "banana",
      "typeCompetitor_color": ["orange","green"]
    },
    {
      "target_type": "pepper",
      "target_color": "black",
      "colorCompetitor_type": "avocado",
      "typeCompetitor_color": ["orange","red"]
    },
    {
      "target_type": "pepper",
      "target_color": "orange",
      "colorCompetitor_type": "pear",
      "typeCompetitor_color": ["black","red"]
    },
    {
      "target_type": "pepper",
      "target_color": "red",
      "colorCompetitor_type": "tomato",
      "typeCompetitor_color": ["black","orange"]
    },
    {
      "target_type": "tomato",
      "target_color": "green",
      "colorCompetitor_type": "pear",
      "typeCompetitor_color": ["purple","red"]
    },
    {
      "target_type": "tomato",
      "target_color": "purple",
      "colorCompetitor_type": "carrot",
      "typeCompetitor_color": ["green","red"]
    },
    {
      "target_type": "tomato",
      "target_color": "red",
      "colorCompetitor_type": "pepper",
      "typeCompetitor_color": ["purple","green"]
    }
  ]);

  function randomChoice(colorType, colorOnly, typeOnly) {

    var prob = getRandomInt(1,100);

    if (prob < colorOnly) {
      return "color-only";
    } else if (colorOnly < prob && prob < (colorOnly + typeOnly)) {
      return "type-only";
    } else {
      return "color-and-type";
    }

  };

  function getUtterance(condition, type, color) {

    var utteranceType;

    // utteranceType is decided on by probability (colorType,color,type)
    // inspired by empirical study results
    if (condition == "informative") {
      utteranceType = randomChoice(75,25,0);
    } else if (condition == "informative-cc") {
      utteranceType = randomChoice(100,0,0);
    } else if (condition == "overinformative") {
      utteranceType = randomChoice(45,20,35);
    } else {
      utteranceType = randomChoice(50,0,50);
    };

    var utterance = utteranceType == "color-and-type" ? color.concat(" ",type) : 
      ( utteranceType == "color-only" ? color.concat(" one") : type );

    return utterance;
  };

  function makeStim(item_entry, context_condition) {
    // context_condition (1) informative; (2) informative-cc;
    //                   (3) overinformative; (4) overinformative-cc

    var new_target = items[item_entry];

    var condition;
    var dist1_type;
    var dist1_color;
    var dist2_type;
    var dist2_color;

    // handle informative(-cc) conditions
    if (context_condition == 0 || context_condition == 1) {
      // first distractor is of same type as target
      dist1_type = new_target.target_type;
      // has other random color
      dist1_color = new_target.typeCompetitor_color[getRandomInt(0,1)];

      if (context_condition == 1) {
        condition = "informative-cc";
        // second distractor is of same color as target
        dist2_type = new_target.colorCompetitor_type;
        dist2_color = new_target.target_color;
      } else {
        condition = "informative";
        // otherwise choose random distractor that is of a different type and color as target 
        // i.e., there could be two tomato distractors 
        // initialize with target values to start while loop
        dist2_type = new_target.target_type;
        dist2_color = new_target.target_color;
        while (dist2_type == new_target.target_type || dist2_color == new_target.target_color) {
          // is this the correct range?
          random_dist_entry = getRandomInt(0,21);
          dist2_type = items[random_dist_entry].target_type;
          dist2_color = items[random_dist_entry].target_color;
        }
      }
    }
    // handle overinformative(-cc) conditions
    else {
      if (context_condition == 4) {
        condition = "overinformative-cc";
        // first distractor is of same color as target
        dist1_type = new_target.colorCompetitor_type;
        dist1_color = new_target.target_color;
      } else {
        condition = "overinformative";
        // both distractors are random (see comment before)
        // initialize with target values to start while loop
        dist1_type = new_target.target_type;
        dist1_color = new_target.target_color;
        while (dist1_type == new_target.target_type || dist1_color == new_target.target_color) {
          // is this the correct range?
          random_dist_entry = getRandomInt(0,21);
          dist1_type = items[random_dist_entry].target_type;
          dist1_color = items[random_dist_entry].target_color;
        }
      }
      // second distractor is random, but can't have the same type or color as target
      // and can't be the exact same stimulus as the other distractor
      // initialize with target values to start while loop
      dist2_type = new_target.target_type;
      dist2_color = new_target.target_color;
      while (dist2_type == new_target.target_type || dist2_color == new_target.target_color ||
            (dist2_type == dist1_type && dist2_color == dist1_color)) {
        // is this the correct range?
        random_dist_entry = getRandomInt(0,21);
        dist2_type = items[random_dist_entry].target_type;
        dist2_color = items[random_dist_entry].target_color;
      }
    }

    utterance = getUtterance(condition, new_target.target_type, new_target.target_color);
    // console.log("utterance");
    // console.log(utterance);

    return {
      "target_type" : new_target.target_type,
      "target_color" : new_target.target_color,
      "dist1_type" : dist1_type,
      "dist1_color" : dist1_color,
      "dist2_type" : dist2_type,
      "dist2_color" : dist2_color,
      "condition" : condition,
      "utterance" : utterance
    }
  } 

  exp.stims = [];
  for (var item_entry=0; item_entry<items.length; item_entry++) {
    for (var context_condition=0; context_condition<4; context_condition++) {
      exp.stims.push(makeStim(item_entry, context_condition));
    }
  }
  exp.stims = _.shuffle(exp.stims);

	console.log(exp.stims);
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = {}; //can randomize between subject conditions here
  exp.exposure_order = [];
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "intro", "clickObj", 'subj_info', 'thanks'];
  
  exp.data_trials = [];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = 43;//utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined
  $(".nQs").html(exp.nQs);

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  $("#agree_button").click(function() {
    exp.go();
  });

  exp.go(); //show first slide
}
