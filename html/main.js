$(function(){
  console.log('hello:' + new Date().toTimeString());
  var dp = $('#dp');
  dp.datepicker({
    preset: '2016-02-15'    
  });

  var dateInput = $('#date');
  dateInput.val('2016-02-25');
  var btnSet = $('#set');
  btnSet.click(function(){
    var theDate = dateInput.val();
    if(theDate.length) {
      dp.datepicker('setDate', theDate);
      //console.log(dp)
      //dp.find('input').val('bar');
    }
  });
});
