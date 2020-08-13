<?php
class endpoint {
	
	/* *********************************************** */
	/* Send the test report to the TronDOC API         */
	/* *********************************************** */
	function send_report($uploadName, $uuid){
		// Find the path to the uploaded test report
		$file = getcwd()."\\files\\".$uuid."\\".$uploadName;
		if (file_exists($file)) {
			if($xml = simplexml_load_file($file)) {
				$docnum = (string) $xml->biblioid->docnum;
				$group = (string) $xml->biblioid->group;
				$curl = curl_init();
				$xml_string = $xml->asXML();
				$serverName = $_SERVER['SERVER_NAME'];
				$url = 'http://'. $serverName .'/TronDOC2/rest_api/testreports/'.$group.'/testrep_put/new/'.$docnum.'.xml';
				// Set some curl options
				curl_setopt_array($curl, array(
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_URL => $url,
					CURLOPT_CUSTOMREQUEST=>'PUT',
					CURLOPT_POSTFIELDS=>$xml_string
				));
				// Send the report & save response to $resp
				$resp = curl_exec($curl);
				$resp = (string) $resp;
				// Close request to clear up some resources
				curl_close($curl);
			} else  {
				$resp = 'XML parser failed!';
			}
		} else {
			$resp = 'File not found!';
		}
		return $resp;
	}
}
?>