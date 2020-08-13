<?php
#************************************************************************
# Funksjoner for å håndtere databasen
#************************************************************************
# Opprettet 24.07.2012, Per Jørgensen (per.jorgensen@jotron.com)
#***********************************************************************
# Endret: (Dato, hvem, hva)
#
#***********************************************************************

include ('db_eXist.php');

function db_query($query, $wsdl) {
	# Create new eXist object
	$db = new eXist('admin', 'trondoc', $wsdl);

	try { 
		$db->setHighlight(FALSE);
		# Connect
		$db->connect() or die ($db->getError());
		# executing a query
		$result = $db->xquery($query); //or die ($db->getError());
		// $db->disconnect() or die ($db->getError());
		return $result;
	}
	catch (Exception $e)
	{
		die($e);
	}	
}
	
function db_queryAWP($query, $wsdl) {
# added to make sure that my query not die when missing results.
	try
		{ 
		# Create new eXist object
		$db = new eXist('admin', 'trondoc', $wsdl);
		$db->setHighlight(FALSE);
		# Connect if we don't connect we die.
		$db->connect() or die ($db->getError());
		# executing a query
		$result = $db->xquery($query);
		return $result;
		$db->disconnect();
	 }
	catch( Exception $e )
		{
		return "Error $e";
		}
	}
	
function create_collection($path, $wsdl) 
	{
		$db = new eXistAdmin('admin', 'trondoc', $wsdl);
		$db->connect() or die ($db->getError());
		# Lage samlingen
		$db->createCollection('/db/'.$path.'/');
		$db->disconnect();	
	}
	
function remove_collection($path, $wsdl) 
	{
		$db = new eXistAdmin('admin', 'trondoc', $wsdl);
		$db->connect() or die ($db->getError());
		# Slette samlingen
		$db->removeCollection('/db/'.$path.'/');
		$db->disconnect();	
	}

function db_store_file($filename, $path, $content, $wsdl) 
	{
		$db = new eXistAdmin('admin', 'trondoc', $wsdl);
		$db->connect() or die ($db->getError());
		# Lagre dokumentet
		$db->store($content, 'UTF-8',"/db/$path/".$filename, true);
		$db->disconnect();
	}

?>
