$(document).ready(function() {
  var sliders=$(".slider");
  sliders.each(function () {
    var slider=$(this);
    var input=$('input[name="'+slider.attr("name")+'"]').first();
    var max=parseInt(slider.attr("max"));
    var min=parseInt(slider.attr("min"));
    var value=parseInt(input.attr('value'));
    var name=slider.attr("name");
    step=1;
    if ((max-min)/step>50) {step=(max-min)/50;}
    slider.slider({
      range: "max",
      min: min,
      max: max,
      step: step,
      value: value,
      slide: function (event, ui) {
        input.val(ui.value);
        getRedshift();
      }
    });
    input.on("change",function() {
      slider.slider("value", $(this).val());
      getRedshift();
    });
  })
  $("#displayRedshiftGradient").click(getRedshiftGradient);
  getRedshift();
  getRedshiftGradient();
  $("#autoGradient").click(toggleGradientAutoDisplay);
  $(document).tooltip();
});

function toggleGradientAutoDisplay() {
  checked=$(this).prop("checked");
  setSlidersDisplayGradient(checked);
  if (checked) {display="none";} else {display="inline-block";}
  $("#displayRedshiftGradient").css({display:display});
}

function setSlidersDisplayGradient(auto=true) {
  $(".slider").each(function () {
    slider=$(this);
    input=$('input[name="'+slider.attr("name")+'"]').first();
    if (auto) {
      slider.on("slide",getRedshiftGradient);
      input.on("change",getRedshiftGradient);
    } else {
      slider.off("slide",getRedshiftGradient);
      input.off("change",getRedshiftGradient);
    }
  });
}


function displayRedshift(response) {
  data=getData();
  response=JSON.parse(response);
  originalWavelength=parseInt(data["wavelength"]);
  shiftedWavelength=response["shifted_wavelength"];
  $('#original-wavelength').html(JSON.stringify(originalWavelength));
  $('#original-wavelength-color').css({background:RGBAToHexA(wavelengthToColor(originalWavelength))});
  $('#redshift-value').html(JSON.stringify(response["redshift"]));
  $('#shifted-wavelength').html(JSON.stringify(shiftedWavelength));
  if (shiftedWavelength==0) {background="lightgrey";} else {background=RGBAToHexA(wavelengthToColor(shiftedWavelength));}
  $('#shifted-wavelength-color').css({background:background});
}

function getRedshift() {
  data=getData();
  data["request"]="getRedshift";
  if (data["radius"]==0) {
    alert("Singularité !");
  } else {
    pydata={data:JSON.stringify(data)};
    $.getJSON('/_get_data/', pydata, displayRedshift);
  }
}

function getRedshiftGradient() {
  data=getData();
  data["request"]="getRedshiftGradient";
  radius=data["radius"];
  distance=data["distance"];
  valuesnumber=parseInt(parseInt(distance)/(parseInt(distance)+parseInt(radius))*100);
  data["valuesnumber"]=valuesnumber;
  if (radius==0) {
    alert("Singularité !");
  } else if (valuesnumber==0) {
    alert("La distance à l'objet doit être plus importante");
  } else {
    pydata={data:JSON.stringify(data)};
    $.getJSON('/_get_data/', pydata, displayRedshiftGradient);
  }
}

function displayRedshiftGradient(response) {
  response=JSON.parse(response);
  distances=response["distances"];
  shiftedFrequencies=response["shifted_frequencies"];
  data=getData();
  distance=parseInt(data["distance"]);
  radius=parseInt(data["radius"]);
  objectPercentage=parseInt(radius/(distance+radius)*100);
  background="radial-gradient(";
  background+="black "+objectPercentage+"%"
  shiftedFrequencies.forEach(function(shiftedWavelength) {
    if (shiftedWavelength==0) {color="lightgrey";} else {color=RGBAToHexA(wavelengthToColor(shiftedWavelength));}
    background+=","+color;
  });
  background+=")";
  $('#redshift-gradient-display').css({
    background: background
  });
}

function getData() {
  data={};
  inputs=$("input");
  inputs.each(function () {
    data[this.name]=this.value;
  });
  return data;
}

function toggleAutoGradient() {

}

// takes wavelength in nm and returns an rgba value
function wavelengthToColor(wavelength) {
    var r,
        g,
        b,
        alpha,
        colorSpace,
        wl = wavelength,
        gamma = 1;


    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
   } else if (wl >= 440 && wl < 490) {
       R = 0;
       G = (wl - 440) / (490 - 440);
       B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 645) {
        R = 1;
        G = -1 * (wl - 645) / (645 - 580);
        B = 0.0;
    } else if (wl >= 645 && wl <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // intensty is lower at the edges of the visible spectrum.
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    colorSpace = [parseInt(R*255),parseInt(G*255),parseInt(B*255),alpha];

    // colorSpace is an array with 5 elements.
    // The first element is the complete code as a string.
    // Use colorSpace[0] as is to display the desired color.
    // use the last four elements alone or together to access each of the individual r, g, b and a channels.

    return colorSpace;

}

function RGBAToHexA(rgba) {

  let r = (+rgba[0]).toString(16),
      g = (+rgba[1]).toString(16),
      b = (+rgba[2]).toString(16),
      a = Math.round(+rgba[3] * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  return "#" + r + g + b + a;
}
