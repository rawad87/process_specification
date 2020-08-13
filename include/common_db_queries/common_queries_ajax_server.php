<?php

	include_once('../config.php.inc');
	include_once('../functions/db_rest.inc.php');
	include_once('../functions/auth.inc.php');
		
	//$userProfile = UserState::Get();
		
	$sequenceNumbersDoc = Config::DbDocumentSequenceNumbers;
	
	switch($_POST['searchtype'])
	{
	case 'sharedSerial':
		# ******************************************************* 
		# Read data for units sharing serial number range */
		# ******************************************************* 
		$itemnumber = $_POST['criteria'];

		$query ="
		xquery version '3.0';
		let \$itemnumber := '$itemnumber'
	    let \$sequence := doc('$sequenceNumbersDoc')//sequence[codes/code/number/string()= \$itemnumber] 
	    return 
	        \$sequence
		";
		
		$result = dbQuery($query);
		$sequence = new SimpleXmlElement($result);
		echo $sequence->asXML();
		break;
		
	default:
		break;	
	}
?>
