<?php
// +---------------------------------------------------------------------
// | PHP Source
// | Denne fila skal inkluderes i alle php-skriptene
// | Alle stier til filer og servere skal settes i dette dokumentet.
// | Ved flytting av systemet skal det være tilstrekkelig å gjøre endringer
// | i dette dokumentet for å få systemet til å fungere.
// | (I tillegg må oppsettet til editoren "spaw" muligens endres. Se ReadMe
// | i katalogen "spaw2")
// |
// | Dette dokumentet leses ved hvert kall til PHP-skript i TronDOC,
// | så endringer i servervariable får umiddelabrt effekt.
// | Flere servere, med forskjellige dokumentrøtter kan brukes samtidig.
// +----------------------------------------------------------------------
//
// Email server
    //$mailServerIP = 'webmail.jotron.com';

//Alle websider skal bruke tegnsett UTF-8
    header('Content-Type: text/html; charset=utf-8');

//---------------------------------------------------------------------------
// Oppsett av grunnleggende stier i variabler
//---------------------------------------------------------------------------
# Finner navnet på webserveren
    $PATH_HTTP = "http://" . $_SERVER['SERVER_NAME'];
# Finner dokumentrota til webserveren. Alle produktmapper ligger her.
    $PATH_ROOT = $_SERVER['DOCUMENT_ROOT'];

# Database
class Config {
	const systemIndexFile = "trondoc";
	const systemDir = "TronDOC2";
	const oldSystemDir = "TronDOC1";
	const documentsServer = "trondoc.docs.jotron.inet";
	# Database constants 
	//const DbRestUrl = "http://trondoc.jotron.inet:8081/exist/rest/";
	# Set to 'localhost' when using local db, for debugging
	const DbRestUrl = "http://localhost:8081/exist/rest/";
	const DbRestUsername = "admin";
	const DbRestPassword = "trondoc";
	
	# Database collections constants
	const DbCollection = "/db/trondoc";
	const DbCollectionProducts = "/db/trondoc/products";
	const DbCollectionAtcUpgrade = "/db/trondoc/atc_upgrade/";
	const DbCollectionAtcLicenses = "/db/trondoc/atc_licenses";
	const DbCollectionModules = "/db/trondoc/modules/";
	const DbCollectionTestReports = "/db/trondoc/test_reports/";
	const DbCollectionSVSReports = "/db/trondoc/software_verification/";
	const DbCollectionProcessSpecification = "/db/trondoc/process_specification/";
	const DbCollectionCalibration = "/db/trondoc/calibration/";
	# Database documents
	const DbDocumentUsers = "/db/trondoc/system_data/users/users.xml";
	const DbDocumentProductGroups = "/db/trondoc/system_data/products/product_groups_template.xml";
	const DbDocumentUsersTemplate = "/db/trondoc/system_data/users/usersTemplate.xml";
	const DbDocumentPUTReportsTemplate = "/db/trondoc/test_reports/templates/template_puttest.xml";
	const DbDocumentATCUpgradeTemplate = "/db/trondoc/atc_upgrade/templates/template_atc_upgrade.xml";
	const DbDocumentATCUpgradeAddTemplate = "/db/trondoc/atc_upgrade/templates/template_atc_upgrade_add.xml";
	const DbDocumentATCLicenseTemplate = "/db/trondoc/atc_licenses/templates/atc_license_template.xml";
	const DbCollectionAtcLicensesProducts = "/db/trondoc/atc_licenses/templates/products.xml"; 
    const DbDocumentSequenceNumbers = "/db/trondoc/system_data/sequence_numbers/sequence_numbers.xml"; 

	# Miscellanious constants
	const DATE_FORMAT = "Y-m-d" ;
	const TIME_FORMAT = "H:i:s" ;
	
	# ATC Upgrade CONSTANTS 
	# - When using 'localhost' the program Upgrade7000v2Server.exe must run
	# on the same machine as the web server! Which is the normal configuration.
	//const AtcUpgradeUrl = "http://localhost:8082/standard";
	const AtcUpgradeUrl = "http://trondoc.jotron.inet:9080/standard";
	const AtcUpgradeUsername = "J0tr0nU7000user";
	const AtcUpgradePassword = "GimmeDB2135478Now7896327";
	# Where the database is copied to
	const AtcUpgradeDbRemoteDir = "I:\Common\Upgrade 7000 Databases";
	const AtcUpgradeCustomDbRemoteDir = "I:\Common\Upgrade 7000 Custom Databases";
	
	//const AtcUpgradeDbLocalDir = "C:\Upgrade7000Service\Databases";
	# Path to server application
	const AtcUpgradeServerPath = "C:/Upgrade7000/Upgrade7000v2Server.exe -e";
	
	//const ATC upgrade preliminary path
	//const ATCUpgradePreliminaryPath = "C:/ATC_Firmware/preliminary/";
	const Idrive = "\\\\no01ws-FP02\\Common\\07_Logistics\\Production\\Products\\";
	const Idir = "I:\\";

	# Voter reports constant
	const VoterReportsPath = "//no01ws-FP02/Common/07_Logistics/Production/Products/Common/Voter_report";
	
	# IFS DocManService constants
	//Test environment
	const IfsDocManServiceUrl = "http://no01ws-ifs-ta.jotron.local:81/DocumentManagementServiceRest_v1/DocumentManagementService/CreateAndCheckIn/xml";
	//const IfsSoftwareVersionServiceUrl = "http://no01ws-ifs-ta.jotron.local:81/PartCatalogServiceRest_v1/PartCatalogService/SWVersionToPartSerialHistory/xml";
	//Real world environment
	//const IfsDocManServiceUrl = "http://no01ws-ifs02.jotron.local:81/DocumentManagementServiceRest_v1/DocumentManagementService/CreateAndCheckIn/xml";
	const IfsSoftwareVersionServiceUrl = "http://no01ws-ifs02.jotron.local:81/PartCatalogServiceRest_v1/PartCatalogService/SWVersionToPartSerialHistory/xml";
	
	const IfsTestReportDocClass = "11-REPORT";
	const IfsTestReportFormatSize = "11-14";
	
	/***TO DO***/
	/*Set path to IfsPickUpFolder and TestStationIncludeFolder. They are only sat to local path in test environment.*/
	//Pick up point for IFS test reports
	//const IfsPickUpFolder = "C:/test/";
	const IfsPickUpFolder = "\\\\NO01WS-IFS-TA\\Documents\\";
	//const IfsPickUpFolder = "X:/";
	
	//Pick up point for uploaded include-files in Test Stations
	const FineUploaderDropFolder = "C:/TronDOC_Scripts/TronDOC2/include/php-traditional-server-master/files/";
	
	//Test environment
	//const IfsSoftwareVersionResendService = "http://trondoc.jotron.local/TronDOC2/rest_api/software_version_upload_service";
	//const IfsDocManResendService = "http://trondoc.jotron.local/TronDOC2/rest_api/testreports/upload_ifs";
	//Real world environment
	const IfsSoftwareVersionResendService = "http://trondoc.jotron.inet/TronDOC2/rest_api/software_version_upload_service";
	const IfsDocManResendService = "http://trondoc.jotron.inet/TronDOC2/rest_api/testreports/upload_ifs";
	
	//Calibration reports and procedures
	const CalibrationReportsPath = "C:/CalibrationDocuments/";
	
	//Process Specifications Images
	const PSPath = "http://trondoc.jotron.inet/ps_images/";
	//const PSPath = "http://trondoc.jotron.local/ps_images/";
	const PSphpPath = "C:/TronDOC_Files/ps_images/";

}
?>
