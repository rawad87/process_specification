<?php
require_once "Mail.php";
function send_mail($to, $subject, $body)
{
	//echo $to;
	$from = "TronDOC <srv_inet1@jotron.com>";
	$host = "smtp.office365.com";
	$port = "587";
	$username = "srv_inet1@jotron.com";
	$password = "INET07pw";
	 
	$headers = array (
		'From' => $from,
		'To' => $to,
		'Subject' => $subject,
		'Content-Type'  => 'text/html; charset=UTF-8'
	);
	
	$smtp = Mail::factory('smtp',
		array ('host' => $host,
			'port' => $port,
			'auth' => true,
			'username' => $username,
			'password' => $password));
	
	$mail = $smtp->send($to, $headers, $body);
	
	/*if (PEAR::isError($mail)) {
		echo("<p>" . $mail->getMessage() . "</p>");
	} else {
		echo("<p>Message successfully sent!</p>");
	}*/
	
	if (PEAR::isError($mail)) {
		echo("<p>" . $mail->getMessage() . "</p>");
		return FALSE;
	} else {
		return TRUE;
	}
}

?>