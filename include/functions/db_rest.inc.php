<?php
	require("RestRequest.inc.php");
	
	#***************************************************************
	# First basic functions for GET, POST DELETE and PUT.
	# Then complete functions for query, saving and delete:
	#   dbQuery, dbSave, dbDelete
	#****************************************************************
		
	function dbGet ($queryString)
	{
		$query = urlencode($queryString);
		$request = new RestRequest(Config::DbRestUrl . "?_query=".$query."", 'GET');
		$request->setUsername(Config::DbRestUsername);
		$request->setPassword(Config::DbRestPassword);
		$request->execute();
		$responseBody=$request->getResponseBody();
		return $responseBody;
	}
	function dbPost ($queryString)
	{
		$query = $queryString;
		$request = new RestRequest(Config::DbRestUrl, 'POST', $query);
		$request->setUsername(Config::DbRestUsername);
		$request->setPassword(Config::DbRestPassword);
		$request->execute();
		//echo '<pre>' . print_r($request, true) . '</pre>';
		$responseBody=$request->getResponseBody();
		/* $responseInfo = $request->getResponseInfo();
		echo $responseInfo['http_code']; */
		return $responseBody;
	}
	
	function dbDelete ($path)
	{
		$query = Config::DbRestUrl . $path;
		$request = new RestRequest($query, 'DELETE');
		$request->setUsername(Config::DbRestUsername);
		$request->setPassword(Config::DbRestPassword);
		$request->execute();
		//echo '<pre>' . print_r($request, true) . '</pre>';
		$responseBody=$request->getResponseBody();
		return $responseBody;
	}
	function dbPut ($path, $file)
	{
		$contentType = findContType($path);
		$query = Config::DbRestUrl . $path;
		$request = new RestRequest($query, 'PUT', $file);
		$request->setUsername(Config::DbRestUsername);
		$request->setPassword(Config::DbRestPassword);
		$request->setAcceptType('*/*');
		$request->setContentType($contentType);
		$request->execute();
		//return '<pre>' . print_r($request, true) . '</pre>';
		$responseInfo=$request->getResponseInfo();
		return $responseInfo['http_code'];
	}
	
	#*****************************************************************
	# User functions:
	# dbQuery, dbRemove, findContType
	#*****************************************************************
	function dbQuery ($queryString)
	{
		$queryString="<?xml version='1.0' encoding='UTF-8'?>
			<query xmlns='http://exist.sourceforge.net/NS/exist' start='1' max='0'>
				<text><![CDATA[".$queryString."]]></text>
				<properties>
					<property name='indent' value='yes'/>
				</properties>
        	</query>";
        	$queryResponse = dbPost($queryString);
		return $queryResponse;
	}
	
	function dbRemove ($path)
	{
		# Må sjekke at $path ikke slutter med '/'
		# for da kan vi slette en hel samling.
		if("/" != substr($path, strlen($path)-1 , 1))
		{
			//echo "Deleted: ".$path;
			dbDelete ($path);
		}
		else
		{
			//echo "Deleting collections is not allowed!";
		}
	}
	
	function findContType ($path)
	{
		# Resolve format, png or else
		$fileType = substr($path, stripos($path, '.')+1);
		switch($fileType)
		{
			case "png": 
				$contType = "image/png";
				break;
			case "jpg": 
				$contType = "image/jpg";
				break;
			case "xml": 
				$contType = "application/xml";
				break;
			case "json": 
				$contType = "application/json";
				break;
			default: $contType = "";
		}
		//return $contType;
		return $contType;
	}
	

class atcUpgradeServer {
	public static function atcUpgradePost ($queryString)
	{
		$query = $queryString;
		$request = new RestRequest(Config::AtcUpgradeUrl, 'POST', $query);
		$request->setUsername(Config::AtcUpgradeUsername);
		$request->setPassword(Config::AtcUpgradePassword);
		$request->setAcceptType('Content-Type: application/xml');
		$request->execute();
		//echo '<pre>' . print_r($request, true) . '</pre>';
		$responseBody=$request->getResponseBody();
		/* $responseInfo = $request->getResponseInfo();
		echo $responseInfo['http_code']; */
		return $responseBody;
	}
}
?>
