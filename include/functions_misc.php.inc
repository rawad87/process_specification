<?php

//********************************************************************
//Hensikt: Skrive ut innholdet av en matrise eller en variabel. Fungerer
//    med vanlige matriser og alle superglobale matriser.
//********************************************************************
function dumpInnhold($var){
	echo '<pre>';
	print_r($var);
	echo '</pre>';
}

//********************************************************************
//Hensikt: Sette inn et nytt element i en matrise i en gitt posisjon
//********************************************************************
function array_insert($array,$pos,$val)
{
   $array2 = array_splice($array,$pos);
   $array[] = $val;
   $array = array_merge($array,$array2);
  
   return $array;
}

//********************************************************************
//Hensikt: Lager et HTML-<select>-felt for å legge inn datoer
// Feltene vil hete 'Day'-'Month'-'Year'
//********************************************************************
function html_selectDate(){
	$maxDate = array(31,12,date('Y')+10);
	$minDate = array(1,1,date('Y'));
	$dateType = array('Day','Month','Year');
	foreach($dateType as $key=>$type){
		for($i=$minDate[$key];$i<=$maxDate[$key];$i++){
			$selectOptions .= "<option>$i</option>\n";
		}
		$treatmentDateSelect.= "$type: <select name='$type'>\n
					$selectOptions
					</select>\n";
		$selectOptions = NULL;
	}
	return $treatmentDateSelect;
}

//********************************************************************
//Hensikt: Lager et HTML-<select>-felt for å legge inn datoer
// Feltene vil hete 'Day'-'Month'-'Year'
// Startåret er inngangsparameter
//********************************************************************
function html_selectDateStartYear($startYear){
	$maxDate = array(31,12,$startYear+10);
	$minDate = array(1,1,$startYear);
	$dateType = array('Day','Month','Year');
	foreach($dateType as $key=>$type){
		for($i=$minDate[$key];$i<=$maxDate[$key];$i++){
			$selectOptions .= "<option>$i</option>\n";
		}
		$treatmentDateSelect.= "$type: <select name='$type'>\n
					$selectOptions
					</select>\n";
		$selectOptions = NULL;
	}
	return $treatmentDateSelect;
}

?>
