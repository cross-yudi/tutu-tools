var fromUnit=document.getElementById('fromUnit'),inputVal=document.getElementById('inputVal');
for(var key in units.data){var opt=document.createElement('option');opt.value=key;opt.textContent=key;fromUnit.appendChild(opt);}
fromUnit.selectedIndex=Math.floor(Object.keys(units.data).length/2);
inputVal.addEventListener('input',convert);fromUnit.addEventListener('change',convert);
function convert(){
  var val=parseFloat(inputVal.value);if(isNaN(val))return;
  var baseVal=val*units.data[fromUnit.value];
  var html='';
  for(var key in units.data){html+='<div style="padding:4px 0;border-bottom:1px solid #f1f5f9;">'+key+' = <strong>'+(baseVal/units.data[key]).toFixed(6)+'</strong></div>';}
  document.getElementById('resultList').innerHTML=html;
}
function copyResult(){var t='';document.getElementById('resultList').querySelectorAll('div').forEach(function(d){t+=d.textContent+'\n';});copyText(t);}
convert();
