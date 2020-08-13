<?php
#************************************************************************
# Funksjoner for å håndtere brukere
#************************************************************************
# Opprettet 24.07.2012, Per Jørgensen (per.jorgensen@jotron.com)
#***********************************************************************
# Endret: (Dato, hvem, hva)
#
#***********************************************************************

function users_array($usersfile) {
	# Leser alle brukerne og deres attributter inn i en tabell
	$usersDOMDoc = new DOMDocument('1.0','utf-8');
	$usersDOMDoc -> load($usersfile);
	$userNodes = $usersDOMDoc->getElementsByTagName('user');
	// Leser data fra '$usersDOMDoc'
	foreach($userNodes as $userNode){
		$userNameLong = $userNode->getElementsByTagName('userNameLong')->item(0)->firstChild->nodeValue;
		$userArray[$userNameLong]['userID'] = $userNode->getAttribute('id');
		$userArray[$userNameLong]['userState'] = $userNode->getAttribute('state');
		$userArray[$userNameLong]['userName'] = $userNode->getElementsByTagName('userName')->item(0)->firstChild->nodeValue;
		$userArray[$userNameLong]['userPassword'] = $userNode->getElementsByTagName('userPassword')->item(0)->firstChild->nodeValue;
		$userArray[$userNameLong]['userMail'] = $userNode->getElementsByTagName('userMail')->item(0)->firstChild->nodeValue;
		
		$userProfiles = $userNode->getElementsByTagName('userProfiles')->item(0);
		if($userProfiles->hasChildNodes()){
			$userProfileNodes = $userProfiles->getElementsByTagName('profile');
			$i=0;	
			foreach($userProfileNodes as $userProfileNode){
				$userArray[$userNameLong]["userProfile$i"] = $userProfileNode->firstChild->nodeValue;
				$i++;
			}
		}
		$userAttributesNode = $userNode->getElementsByTagName('userAttributes')->item(0);
		$userAttributeNodes = $userAttributesNode->getElementsByTagName('attribute');
		$i=0;
		foreach($userAttributeNodes as $userAttributeNode){
			$userArray[$userNameLong]["userAttribute$i"] = $userAttributeNode->firstChild->nodeValue;
			$i++;
		}
	}
	return $userArray;
	}

?>
