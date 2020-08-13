<?php
	require("RestRequest.inc.php");
	
	#****************************************************************
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
		$query = Config::DbRestUrl . $path;
		$request = new RestRequest($query, 'PUT', $file);
		$request->setUsername(Config::DbRestUsername);
		$request->setPassword(Config::DbRestPassword);
		$request->execute();
		//echo '<pre>' . print_r($request, true) . '</pre>';
		$responseBody=$request->getResponseBody();
		return true;
		//return $responseBody;
	}
	
	#*****************************************************************
	# User functions:
	#dbQuery, dbRemove
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
			echo "Deleted: ".$path;
			dbDelete ($path);
		}
		else
		{
			echo "Deleting collections is not allowed!";
		}
	}
	
?>
