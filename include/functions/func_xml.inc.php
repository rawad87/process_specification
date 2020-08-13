<?php
#************************************************************************
# Funksjoner for vanlige brukte xml-håndteringer
#************************************************************************
# Opprettet 26.07.2012, Per Jørgensen (per.jorgensen@jotron.com)
#***********************************************************************
# Endret: (Dato, hvem, hva)
#
#***********************************************************************
# ER NOK IKKE I BRUK LENGER

function set_date($dateNode, $documentNode) {
	# Legger inn dagens dato
	$txtNode = $documentNode->createTextNode(date('Y'));
	$year = $dateNode->getElementsByTagName('year')->item(0);
	$year-> appendChild($txtNode);
	$txtNode = $documentNode->createTextNode(date('m'));
	$month = $dateNode->getElementsByTagName('month')->item(0);
	$month-> appendChild($txtNode);
	$txtNode = $documentNode->createTextNode(date('d'));
	$day = $dateNode->getElementsByTagName('day')->item(0);
	$day -> appendChild($txtNode);
}
	
function set_node_value($node, $nodeValue, $documentNode)  {
	# Sjekker om det ligger en tekstnode der fra før.
	# Denne blir i tilfelle slettet
	if($node->hasChildNodes()) {
		$txtNode = $documentNode->createTextNode($nodeValue);
		$oldTxtNode = $node->firstChild;
		$node->replaceChild($txtNode, $oldTxtNode);
	}
	else {
		$txtNode = $documentNode->createTextNode($nodeValue);
		$node->appendChild($txtNode);
	}
}

function set_author($authorNode, $authorName, $documentNode)  {
	# 'Trimmer' strengen for mellomrom o.l. foran og bak
	$authorName = trim($authorName);
	# Fjerner eventuelle dobble mellomrom 
	$authorName = str_replace('  ',' ', $authorName);
	# $authorName er en streng, og må deles i for- eventuelt mellom- og etternavn
	$split = explode(' ',$authorName);
	$firstname = $split[0];
	if(count($split)==2) {
		$othername = '';
		$surname = $split[1];
	}
	else {
		$othername = $split[1];
		$surname = $split[2];
	}
	# Legger inn forfatternavnet
	# Om det ligger noe der fra før, blir dette slettet
	
	$firstnameNode = $authorNode->getElementsByTagName('firstname')->item(0);
	if($firstnameNode->hasChildNodes()) {
		$txtNode = $documentNode->createTextNode($firstname);
		$oldTxtNode = $firstnameNode->firstChild;
		$firstnameNode->replaceChild($txtNode, $oldTxtNode);
	}
	else {
		$txtNode = $documentNode->createTextNode($firstname);
		$firstnameNode->appendChild($txtNode);
	}
	
	$othernameNode = $authorNode->getElementsByTagName('othername')->item(0);
	if($othernameNode->hasChildNodes()) {
		$txtNode = $documentNode->createTextNode($othername);
		$oldTxtNode = $othernameNode->firstChild;
		$othernameNode->replaceChild($txtNode, $oldTxtNode);
	}
	else {
		$txtNode = $documentNode->createTextNode($othername);
		$othernameNode->appendChild($txtNode);
	}
	
	$surnameNode = $authorNode->getElementsByTagName('surname')->item(0);
	if($surnameNode->hasChildNodes()) {
		$txtNode = $documentNode->createTextNode($surname);
		$oldTxtNode = $surnameNode->firstChild;
		$surnameNode->replaceChild($txtNode, $oldTxtNode);
	}
	else {
		$txtNode = $documentNode->createTextNode($surname);
		$surnameNode->appendChild($txtNode);
	}
}
	
?>
