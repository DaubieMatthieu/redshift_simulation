$(document).ready(function() {
  var sliders=$(".slider");
  sliders.each(function () {
    var slider=$(this);
    var input=$('input[name="'+slider.attr("name")+'"]').first();
    var max=parseInt(slider.attr("max"));
    var min=parseInt(slider.attr("min"));
    var value=parseInt(input.val());
    slider.slider({
      range: "max",
      min: min,
      max: max,
      value: value,
      slide: function (event, ui) {
        input.val(ui.value);
        getRedshift(displayRedshift);
      }
    });
    input.change(function() {
      slider.slider("value", $(this).val());
    });
  })
  getRedshift(displayRedshift);
});


function displayRedshift(response) {
  $('#redshift').html(JSON.parse(response));
}


function getRedshift(callback=function(){}) {
  data=getData();
  if (data["radius"]==0) {
    alert("Singularité !");
  } else {
    pydata={data:JSON.stringify(data)};
    $.getJSON('/_get_data/', pydata, callback);
  }
}

function getData() {
  data={};
  inputs=$("input");
  inputs.each(function () {
    data[this.name]=this.value;
  });
  return data;
}
