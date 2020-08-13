<?php

include_once('../include/config.php.inc');
include_once('../include/functions/db_rest.inc.php');

# A user profile
class User {
	public $Userindex;
	public $Userstate;
	public $Username;
	public $Fullname;
	public $Email;
	public $Profiles;
	public $Attributes;
	public $ResetPasswordNotice = false;
	
	/* public function IsAdmin() {
		return in_array('adm', $this->Roles);
	} */
	
	# Checking a users PROFILE
	public function IsSuperAdmin() {
		return (hexdec('0x00000001') & hexdec($this->Profiles));
	}
	public function IsAdmin() {
		return (hexdec('0x00000002') & hexdec($this->Profiles));
	}
	public function IsLocalAdmin() {
		return (hexdec('0x00000004') & hexdec($this->Profiles));
	}
	public function IsNonConformAdmin() {
		return (hexdec('0x00000010') & hexdec($this->Profiles));
	}
	public function IsExAdmin() {
		return (hexdec('0x00000020') & hexdec($this->Profiles));
	}
	public function IsCalibrationAdmin() {
		return (hexdec('0x00000040') & hexdec($this->Profiles));
	}
	public function IsQualityAdmin() {
		return (hexdec('0x00000080') & hexdec($this->Profiles));
	}
	public function IsAtcUpgradeAdmin() {
		return (hexdec('0x00000400') & hexdec($this->Profiles));
	}
	public function IsAtcLicenseAdmin() {
		return (hexdec('0x00000800') & hexdec($this->Profiles));
	}
    public function IsSequenceNumberAdmin() {
		return (hexdec('0x00001000') & hexdec($this->Profiles));
	}
    
	
	# Checking a users ATTRIBUTES
	public function AttrPSEditor() {
		return (hexdec('0x00000001') & hexdec($this->Attributes));
	}
	public function AttrPSApprover() {
		return (hexdec('0x00000002') & hexdec($this->Attributes));
	}
	/*public function AttrSignTestReport() { //For now, use different bit for test reports
		return (hexdec('0x00000008') & hexdec($this->Attributes));
	}*/
	public function AttrCNEditor() { //used in cookies, php crash if not present
		return (hexdec('0x00000008') & hexdec($this->Attributes));
	}
	public function AttrEditTestStation() {
		return (hexdec('0x00000010') & hexdec($this->Attributes));
	}
	public function AttrVersionDocEditor() {
		return (hexdec('0x00000020') & hexdec($this->Attributes));
	}
	public function AttrMoveTestReports() {
		return (hexdec('0x00000040') & hexdec($this->Attributes));
	}
	public function AttrConfigurationDocCreator() {
		return (hexdec('0x00000080') & hexdec($this->Attributes));
	}
	public function AttrConfigurationDocEditor() {
		return (hexdec('0x00000100') & hexdec($this->Attributes));
	}
	public function AttrExDocEditor() {
		return (hexdec('0x00000400') & hexdec($this->Attributes));
	}
	public function AttrSignTestReport() { //For now, use different bit for test reports
		return (hexdec('0x00000800') & hexdec($this->Attributes));
	}
	public function AttrEditCalibInstrument() {
		return (hexdec('0x00001000') & hexdec($this->Attributes));
	}
	public function AttrAtcUpgradeAllowDownUser() {
		return (hexdec('0x00002000') & hexdec($this->Attributes));
	}
	public function AttrAtcUpgradeUser() {
		return (hexdec('0x00004000') & hexdec($this->Attributes));
	}
	public function AttrAtcUpgradeSupportUser() {
		return (hexdec('0x00008000') & hexdec($this->Attributes));
	}
	public function AttrAtcLicenseEditor() {		
		return (hexdec('0x00010000') & hexdec($this->Attributes));
	}
    public function AttrSequenceNumberEditor() {		
		return (hexdec('0x00020000') & hexdec($this->Attributes));
	}
    
    
	
	# Defining who can do what.
	public function CanEditUsers() {
		return $this->IsAdmin()
			|| $this->IsLocalAdmin();
	}
	public function CanEditProducts() {
		return $this->IsAdmin()
			|| $this->IsLocalAdmin();
	}
	public function CanEditPS() {
		return $this->IsAdmin()
			|| $this->AttrPSEditor();
	}
	public function CanApprovePS() {
		return $this->IsAdmin()
			|| $this->AttrPSApprover();
	}
	public function CanEditCN(){
		return $this->IsAdmin()
			|| $this->AttrCNEditor();
	}
	public function CanSignTestReport() {
		return $this->AttrSignTestReport();
	}
	public function CanEditTestStation() {
		return $this->AttrEditTestStation();
	}
	public function CanEditVersionDoc() {
		return $this->IsAdmin() 
			|| $this->AttrVersionDocEditor();
	}
	public function CanMoveTestReports() {
		return $this->IsAdmin() 
			|| $this->AttrMoveTestReports();
	}
	public function CanCreateConfigDoc() {
		return $this->IsAdmin()
			|| $this->AttrConfigurationDocCreator();
	}
	public function CanEditConfigDoc() {
		return $this->IsAdmin()
			|| $this->AttrConfigurationDocEditor();
	}
	public function CanEditCalibInstrument() {
		return $this->IsAdmin()
			|| $this->AttrEditCalibInstrument()
			|| $this->IsCalibrationAdmin();
	}
	public function CanEditExPS() {
		return $this->IsAdmin()
			|| $this->IsExAdmin()
			|| $this->AttrExDocEditor();
	}
	public function CanApproveExPS() {
		return $this->IsAdmin()
			|| $this->IsExAdmin();
	}
	public function CanAllowDownAtcUpgrade() {
		return $this->IsAdmin()
			|| $this->AttrAtcUpgradeAllowDownUser()
			|| $this->IsAtcUpgradeAdmin();
	}
	public function CanEditAtcUpgradeUnits() {
		return $this->IsAdmin()
			|| $this->AttrAtcUpgradeUser()
			|| $this->AttrAtcUpgradeSupportUser()
			|| $this->IsAtcUpgradeAdmin();
	}
	public function CanCreateAtcUpgradeCustomDB() {
		return $this->IsAdmin()
			|| $this->IsAtcUpgradeAdmin()
			|| $this->AttrAtcUpgradeSupportUser();
	}
	public function CanConfAtcUpgradeProd() {
		return $this->IsSuperAdmin()
			|| $this->IsAtcUpgradeAdmin();
	}
	
	public function CanEditAtcLicense() {
		return $this->IsSuperAdmin()
			|| $this->IsAtcLicenseAdmin()
			|| $this->AttrAtcLicenseEditor();
	}
    
    public function CanEditSequenceNumber() {
		return $this->IsSuperAdmin()
			|| $this->IsSequenceNumberAdmin();
	}
    
    public function CanSendSequenceNumberRequest() {
		return $this->IsSuperAdmin()
			|| $this->IsSequenceNumberAdmin()
			|| $this->AttrSequenceNumberEditor();
	}
	
	public function CanRemoveAtcLicense() {
		return $this->IsSuperAdmin()
			|| $this->IsAtcLicenseAdmin();
	}
}

# Functions for communicating with session about the actual user
# This class is used by various PHP scripts to check a users permissions
# E.g. UserState::CanEditPS();
class UserState {

	const sessionKey = 'User';
	
	// får beskjed når en bruker har logget inn og lagrer det i SESSION
	public static function LoggedIn(User $user) {
		if (!isset($_SESSION)) session_start();
		// sets 'user' in session to given user profile ($user
		$_SESSION[self::sessionKey] = $user;
	}
	
	// fjerner bruker fra SESSION
	public static function LogOut() {
		if (!isset($_SESSION)) session_start();
		// sets the 'user' to null
		$_SESSION[self::sessionKey] = null;
		
		//For compability with old system
		setcookie(Administrator,'false',0,'/');
		setcookie(EditVerDoc,'false',0,'/');
		setcookie(EditConfDoc,'false',0,'/');
		setcookie(EditCN,'false',0,'/'); 
		setcookie(EditPS,'false',0,'/');
		setcookie(NewConfDoc,'false',0,'/');
		setcookie(EditChecklist,'false',0,'/');
		setcookie(EditCustomerInfo,'false',0,'/');
		setcookie(username,'',0,'/');
	}
	
	// henter bruker fra SESSION
	public static function Get() {
		if (!isset($_SESSION)) session_start();
		if (!isset($_SESSION[self::sessionKey]))
			return null;
		
		return $_SESSION[self::sessionKey];
	}
	
	public static function IsAdmin() {
		$user = self::Get();
		return $user && $user->IsAdmin();
	}
	public static function IsLocalAdmin() {
		$user = self::Get();
		return $user && $user->IsLocalAdmin();
	}
	public static function IsCalibAdmin() {
		$user = self::Get();
		return $user && $user->IsCalibrationAdmin();
	}
	public static function CanEditUsers() {
		$user = self::Get();
		return $user && $user->CanEditUsers();
	}
	public static function CanEditProducts() {
		$user = self::Get();
		return $user && $user->CanEditProducts();
	}
	public static function CanEditPS() {
		$user = self::Get();
		return $user && $user->CanEditPS();
	}
	public static function CanApprovePS() {
		$user = self::Get();
		return $user && $user->CanApprovePS();
	}
	/*
	public function CanSignTestReport() {
		return $this->AttrSignTestReport();
	}
	public function CanEditTestStation() {
		return $this->AttrEditTestStation();
	}*/
	public static function CanSignTestReport(){
		$user = self::Get();
		return $user && $user->CanSignTestReport();
	}
	public static function CanEditTestStation(){
		$user = self::Get();
		return $user && $user->CanEditTestStation();
	}
	public static function CanEditCN() {
		$user = self::Get();
		return $user && $user->CanEditCN();
	}
	public static function CanEditVersionDoc() {
		$user = self::Get();
		return $user && $user->CanEditVersionDoc();
	}
	public static function CanMoveTestReports() {
		$user = self::Get();
		return $user && $user->CanMoveTestReports();
	}
	public static function CanCreateConfigDoc() {
		$user = self::Get();
		return $user && $user->CanCreateConfigDoc();
	}
	public static function CanEditConfigDoc() {
		$user = self::Get();
		return $user && $user->CanEditConfigDoc();
	}
	public static function CanEditCalibInstrument() {
		$user = self::Get();
		return $user && $user->CanEditCalibInstrument();
	}
	public static function CanEditExPS() {
		$user = self::Get();
		return $user && $user->CanEditExPS();
	}
	public static function CanApproveExPS() {
		$user = self::Get();
		return $user && $user->CanApproveExPS();
	}
	public static function CanAllowDownAtcUpgrade() {
		$user = self::Get();
		return $user && $user->CanAllowDownAtcUpgrade();
	}
	public static function CanEditAtcUpgradeUnits() {
		$user = self::Get();
		return $user && $user->CanEditAtcUpgradeUnits();
	}
	public static function CanCreateAtcUpgradeCustomDB() {
		$user = self::Get();
		return $user && $user->CanCreateAtcUpgradeCustomDB();
	}
	public static function CanConfAtcUpgradeProd() {
		$user = self::Get();
		return $user && $user->CanConfAtcUpgradeProd();
	}
	public static function CanEditAtcLicense() {
		$user = self::Get();
		return $user && $user->CanEditAtcLicense();
	}
	public static function CanRemoveAtcLicense() {
		$user = self::Get();
		return $user && $user->CanRemoveAtcLicense();
	}
    public static function CanEditSequenceNumber() {
		$user = self::Get();
		return $user && $user->CanEditSequenceNumber();
	}
    public static function CanSendSequenceNumberRequest() {
		$user = self::Get();
		return $user && $user->CanSendSequenceNumberRequest();
	}
	

}

class UserInfo {
	# Various functions for searching in users database
	
	public static function findUserFullname($userindex)
	{
		$query = "for \$user in doc('/db/trondoc/system_data/users/users.xml')/users/user[@index = '$userindex']
			return \$user/userFullName";
		return $result = dbQuery($query);
	}
	public static function userFullnames()
	{
		$query = "
			<users>
				{for \$user in doc('/db/trondoc/system_data/users/users.xml')/users/user
	    			return 
						<userfullname index='{\$user/@index}'>{data(\$user/userFullName)}</userfullname>}
			</users>
		";
		return $result = dbQuery($query);
		//$userFullname = new SimpleXmlElement($result);
		//return $userFullname->asXML();
	}
}

// sjekker brukernavn og password 
class Auth {

	private static function LdapLogin($username, $password, $domain = 'jotron', $server = '10.0.2.244') {
		if (!$username || !$password){
			return null; // ldap will try a anonymous login when user/pass is missing, dont want that.
		}
		//try{$ds = @ldap_connect($server) or die("Could not connect");}catch(Exception $e){file_put_contents("c:\Pers\varTest.txt", $e->getMessage() . "\n", FILE_APPEND);}
		$ds = @ldap_connect($server) or die();		
		if (!$ds){
			return null; // unable to connect to ldap server
		}
		//anonymous bind
		/*if(!ldap_bind($ds, $domain  . "\\" . $username)){
			ldap_close($ds);
			return null;
		}*/
		//bind to LDAP directory	
		if (!@ldap_bind($ds, $domain  . "\\" . $username, $password)) {
			ldap_close($ds);
			return null; // unable to login to ldap server
		}
		//setting value of the given option
		ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);
		$sr = @ldap_search($ds, "OU=Users,OU=Jotron,DC=Jotron,DC=local", "mailnickname=" . $username);
		if (!$sr) {
			ldap_close($ds); // unable to search ldap server for user profile
			return null;
		}
		//count the number of entries in a search
		if (ldap_count_entries($ds, $sr) == 0) {
			ldap_close($ds); // nothing was found
			return null;
		}

		$info = ldap_get_entries($ds, $sr);
		ldap_close($ds);
		return $info[0]; // return first matching ldap profile
	}

	public static function Login($username, $password) {
		// // username and password is checked against ldap
		// $ldapUser = self::LdapLogin($username, $password);
		// //if($username == 'krizek') /* bypass */ ;
		// if (!$ldapUser)
		// 	return null;
		
		// login was ok, fetch trondoc user
		$query = "for \$info in doc('/db/trondoc/system_data/users/users.xml')/users/user
			where \$info/userName = '" . $username . "'
			return \$info";
		
		$result = dbQuery($query);
		$userObj = new SimpleXmlElement($result);
		//if (!$result)
			//return null;
		if(empty($userObj->user)){
			return -1;
		}
		# Creating xml object from search result
		
		# Creating a new User object, and set properties from search result
		$user = new User();
		$user->Userindex = (integer)$userObj->user['index'];
		$user->Userstate = (string)$userObj->user['active'];
		$user->Username = (string)$userObj->user->userName;
		$user->Fullname = (string)$userObj->user->userFullName;
		$user->Email = (string)$userObj->user->userEmail;
		if($user->Userstate == 'true'){
			$user->Profiles = (string)$userObj->user->userProfiles;
			$user->Attributes = (string)$userObj->user->userAttributes;
		} else {
			$user->Profiles = '0';
			$user->Attributes = '0';
		}
		
		/* $user->Roles = array();
		foreach ($userObj->user->userProfiles->profile as $role)
			$user->Roles[] = (string)$role; */
		# Login function returns a User object
		return $user;
	}

	public static function oldSystemLogin($user)
	{
		$userName = $user->Fullname;
		setcookie(username,$userName,0,'/');
		if(UserState::isAdmin()){
			setcookie(Administrator,'true',0,'/');
			setcookie(EditVerDoc,'true',0,'/');
			setcookie(EditConfDoc,'true',0,'/');
			setcookie(EditCN,'true',0,'/');
			setcookie(EditPS,'true',0,'/');
			setcookie(NewConfDoc,'true',0,'/');
			setcookie(EditChecklist,'true',0,'/');
			setcookie(EditCustomerInfo,'true',0,'/');
		}
		if(UserState::CanEditVersionDoc()){
			setcookie(EditVerDoc,'true',0,'/');
		}
		if(UserState::CanEditCN()){
			setcookie(EditCN,'true',0,'/');
		}
		if(UserState::CanCreateConfigDoc()){
			setcookie(NewConfDoc,'true',0,'/');
			setcookie(EditConfDoc,'true',0,'/');
		}
		/*switch ($userProfile->firstChild->nodeValue){
			case 'adm':
			setcookie(Administrator,'true',0,'/');
			setcookie(EditVerDoc,'true',0,'/');
			setcookie(EditConfDoc,'true',0,'/');
			setcookie(EditCN,'true',0,'/');
			setcookie(EditPS,'true',0,'/');
			setcookie(NewConfDoc,'true',0,'/');
			setcookie(EditChecklist,'true',0,'/');
			setcookie(EditCustomerInfo,'true',0,'/');
			break;
			case 'test':
			setcookie(EditVerDoc,'true',0,'/');
			setcookie(EditConfDoc,'true',0,'/');
			setcookie(NewConfDoc,'true',0,'/');
			setcookie(EditPS,'true',0,'/');
			break;
			case 'service':
			setcookie(EditConfDoc,'true',0,'/');
			setcookie(EditCustomerInfo,'true',0,'/');
			break;
			case 'resp_prod':
			setcookie(EditChecklist,'true',0,'/');
			break;
			case 'resp_design':
			setcookie(EditPS,'true',0,'/');
			setcookie(EditCN,'true',0,'/');
			break;
			case 'resp_team':
			//Ingen spesielle rettigheter
			break;
			case '':
			break;
		}*/
	}
}
 
 
