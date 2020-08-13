
<html>
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="../../stylesheets/dist/js/bootstrap.min.js"></script>
<script src="common_queries.js"></script>
<script>
//	function unitsList(arr){
//    	var html_options='';
//    	for(var i=0; i<arr.length;i++){
//    		//html_options = html_options + "<option value = '" +arr[i]+ "'>"+ arr[i]+"</option>";
//    		html_options = html_options + "<li><a href='#'>"+ arr[i]+"</a></li>";
//    	}
//    	html_select="<div class='dropdown'>"
//    		+"<button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>"
//    		+"Dropdown"
//    		+"<span class='caret'></span>"
//    		+"</button>"
//    		+"<ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>"+html_options+"</ul></div>";
//    	//html_select="<select id = 'selUnit'>"+html_options+"</select>";
//    	alert(html_select);
//    	document.getElementById('selUnit').innerHTML = html_select;
//    }
	
    
function unitsList(module) {
	sharedRangeUnits(module, function(status){
    alert(status);
  });
}

unitsList('100004');
</script>
<div id="selUnit" />

</html>
