<?php

	include_once('../include/config.php.inc');
	include_once('../include/functions/db_rest.inc.php');
	include_once('../include/functions/auth.inc.php');
		
	$userProfile = UserState::Get();
		
	$psCollection = Config::DbCollectionProcessSpecification;
	$modulesCollection = Config::DbCollectionModules;
	
	# Apply modifications to yield image of a reasonable size and resolution for 
	# on screen rendition
	function standardizeImageData($img)
	{
	 # @TODO make these parameters to the TRONDOC2 application or saved in the dB   
     $targetImageWidth =800;
     $targetImageHeight=600;
     # resample at ppi which should show distortion free even in the expanded view
     $targetPPI = 72;
     $img->setImageResolution($targetPPI,$targetPPI);
     $img->resampleImage($targetPPI,$targetPPI,imagick::FILTER_MITCHELL,1);
     $img->scaleImage($targetImageWidth,0);
     $d = $img->getImageGeometry();
     $h = $d['height'];
     if($h > $targetImageHeight) {
        $img->scaleImage(0,$targetImageHeight);
     } 
      // Watermark text,@TODO evaluate if we use this
     /*$text = 'Copyright JOTRON';
     $draw = new ImagickDraw();
     $draw->setFontSize(20);
     $draw->setFillColor('black');
     $draw->setGravity(Imagick::GRAVITY_SOUTHEAST);
     $img->annotateImage($draw, 10, 12, 0, $text);
     $draw->setFillColor('white');
     $img->annotateImage($draw, 11, 11, 0, $text);*/
	}
	
	
	switch($_POST['subject'])
	{
	case 'readPSTemplate':
		# ******************************************************* 
		# Reading template for a new PS */
		# ******************************************************* 
		$query ="
		let \$ps := doc('$psCollection//templates/ps_template.xml')//template/process_specification
		return \$ps
		";
		echo $result = dbQuery($query);
		break;
	case 'readParagraphTemplate':
		# ******************************************************* 
		# Reading template for a new paragraph */
		# ******************************************************* 
		$psNumber = $_POST['name'];
		$query ="
		let \$ps := doc('$psCollection//templates/ps_template.xml')//template/process_specification/content
		return \$ps
		";
		echo $result = dbQuery($query);
		break;
	case 'readPS':
		# ******************************************************* 
		# Reading process specification */
		# ******************************************************* 
		$psNumber = $_POST['name'];
		/*$query ="
		let \$ps := collection('$psCollection/documents')//process_specification[biblioid/docnum/number()=number('$psNumber')]
		return \$ps
		";*/
		$query ="
		let \$psNumber := '$psNumber'
		let \$ps_path := concat('/db/trondoc/process_specification/documents/', \$psNumber, '.xml')
		let \$ps := doc(\$ps_path)
		let \$revisions := \$ps/process_specification/content/paragraph[@state='active']/revision[@state='approved']/@approval_time
		let \$last_revision := max(\$revisions/string())
		let \$ps_updated := update delete \$ps/process_specification/info/last_updated
		let \$ps_updated := update insert <last_updated>{\$last_revision}</last_updated> into \$ps/process_specification/info
  	    return \$ps
		";
		echo $result = dbQuery($query);
		break;
	case 'readPSList':
		# ******************************************************* 
		# Reading list of all process specification */
		# ******************************************************* 
		$psNumber = $_POST['name'];
		$query ="
		<ps_list>
		{
			for \$docnum in collection('$psCollection/documents')//process_specification/biblioid/docnum
			order by \$docnum/number() 
			return
			<ps>
				{\$docnum}
			</ps> 
		}
		</ps_list>
		";
		echo $result = dbQuery($query);
		break;
		
	case 'saveNewPS':
		# ******************************************************* 
		# Save a new process specification */
		# ******************************************************* 
		$psXML = $_POST['data'];
		//echo $psXML; 
		$query ="
			let \$number := doc('$psCollection//templates/ps_properties.xml')//ps_number
			let \$newnumber := data(\$number) + 1
			return
				<num>
					{\$newnumber}
					{update replace \$number with <ps_number>{\$newnumber}</ps_number>}
				</num>
		";
		$result = dbQuery($query);
		$psNumber = new SimpleXmlElement($result);
		echo $psNumber->asXML();
		$newDocnum = (String)$psNumber->num;
		$newPS = new SimpleXmlElement($psXML);
		$newPS->process_specification->biblioid->docnum = $newDocnum;
		$newPS->process_specification->info->date = date("Y-m-d");
		$newPS->process_specification->info->time = date("H:i:s");
		$data = $newPS->process_specification->asXML();
		dbPut($psCollection."documents/".$newDocnum.".xml", $data);
		break;
		
	case 'savePSContent':
		# ******************************************************* 
		# Save process specification content */
		# ******************************************************* 
		$psNumber = $_POST['name'];
		$psXML = $_POST['data'];
		//echo $psXML; 
		$query ="
			let \$ps := collection('$psCollection/documents')//process_specification[biblioid/docnum/number()=number('$psNumber')]
			return
				update replace \$ps/content[1] with $psXML
		";
		echo $result = dbQuery($query);
		break;
		
	case 'savePSInfo':
		# ******************************************************* 
		# Save process specification info */
		# ******************************************************* 
		$psNumber = $_POST['name'];
		$psXML = $_POST['data'];
		//echo $psXML; 
		$query ="
			let \$ps := collection('$psCollection/documents')//process_specification[biblioid/docnum/number()=number('$psNumber')]
			return
				update replace \$ps/info[1] with $psXML
		";
		echo $result = dbQuery($query);
		break;
		
	case 'updateOwnerModule':
		# ******************************************************* 
		# Updates the ps owner module when a new ps is created 
		# ******************************************************* 
		$psNumber = $_POST['name'];
		$moduleNumber = $_POST['data'];
		$query ="
			let \$module := collection('$modulesCollection')//moduledef[biblioid/group='$moduleNumber']
			return
				update insert <psid number='$psNumber'/> into \$module/module[1]/ps[1]
		";
		$result = dbQuery($query);
		break;
		
	case 'usersFullName':
		# ******************************************************* 
		# Reading all users full name */
		# ******************************************************* 
		echo UserInfo::userFullnames();
		break;
		
    case 'saveImage':
		# ******************************************************* 
		# Saves image data to the database after standardization
		# effects have been applied
		# *******************************************************
        //$dbPath  = "/db/trondoc/process_specification/ps_images/" . $_POST['name'];
        //$path = Config::Idrive."ps_images\\";
        $path = Config::PSphpPath;
        $base64EncodeedImage=$_POST['data'];    
        $dataparts = explode(',', $base64EncodeedImage);
        $fileData = base64_decode($dataparts[1]); 
        $img = new Imagick();
        $img->readimageblob($fileData);   
        /* perfrom image manipulation*/
        standardizeImageData($img);
        /* all done write to db */ 
        $correctedImage = $img->getImageBlob();
        //echo $result = dbPut($dbPath, $correctedImage);
        if(!is_dir($path)){
			$test = mkdir($path);
		}
		$filePath = $path.$_POST['name'];
		echo file_put_contents($filePath, $correctedImage);
        $img->destroy();         
		break;
		
# The following cases is just used for supporting the OLD system or
# for converting data and pictures from OLD to NEW system.
		
	case 'updateModuleStructure':
		# ******************************************************* 
		# Save updates to module structure files in OLD system */
		# ******************************************************* 
		$psnum = $_POST['psnum'];
		$mainDirectory = $_POST['mainDirectory'];
		$moduleX = $_POST['moduleX'];
		$moduleName = $_POST['moduleName'];
		$unitX = $_POST['unitX'];
		$hostName = $_POST['hostName'];
		$psType = $_POST['pstype'];
		//echo $psnum.",".$mainDirectory.",".$moduleX.",".$moduleName.",".$unitX.",".$hostName.",".$psType ;
		$basePath = ($hostName == 'jotron') ? 'i:\\':'v:\\Products\\';
		$filePath = $basePath.$mainDirectory."\\Product_Structure\\ModuleStruct_".$unitX.".xml";
		
		$xml = simplexml_load_file($filePath);
		foreach ($xml->Modules->M as $module) {
			if ($module->Module_X[0] == $moduleX) {
				$nodeName = 'PS_' . $psType;
				if($psType == 'Test')
				{
					if ((string)$module->PS_Test[0] == '') {
						$module->PS_Test[0] = $psnum;
					} else {
						$module->addChild($nodeName, $psnum);
					}
				}
				if($psType == 'Assembly')
				{
					if ((string)$module->PS_Assembly[0] == '') {
						$module->PS_Assembly[0] = $psnum;
					} else {
						$module->addChild($nodeName, $psnum);
					}
				}
				
				break;
			}
		}
		$xml->asXML($filePath);
		break;
		
	case 'readImageList':
		# ******************************************************* 
		# Reading list of all TO BE CONVERTED
		# This is only used during convertion from OLD system to NEW system!
		# ******************************************************* 
		//$psNumber = $_POST['name'];
		$query ="
			let \$pictures := doc('$psCollection/pictures.xml')/pictures
			return \$pictures
			 
		";
		echo $result = dbQuery($query);
		break;
		
	case 'convertImages':
		# ******************************************************* 
		# Converts pictures from OLD SYSTEM
		# ******************************************************* 
        $psPath  = $_POST['data'];
		$newFileName  = urlencode($_POST['name']);
		//$psPath = "i:\\TA74\\Spesification_Process\\PS00445_99042_assembly\\doc\\pictures\\". 'prove2.jpg';
		$fileData = file_get_contents($psPath);
		//$fileData = base64_decode($fileData);
		
        //$base64EncodeedImage=$_POST['data'];    
        //$dataparts = explode(',', $base64EncodeedImage);
        //$fileData = base64_decode($dataparts[1]); 
        $img = new Imagick();
        $img->readimageblob($fileData);   
        /* perfrom image manipulation*/
        standardizeImageData($img);
        /* all done write to db */ 
        $correctedImage = $img->getImageBlob();
        //echo $result = dbPut($dbPath, $correctedImage);
        //$img->destroy();
        // OBS file_put_contents ser ikke ut til å håndtere æøå
        file_put_contents("c:\\Pers\\PS_convert\\tmp_newPS_JotTest\\images\\".$newFileName ,$correctedImage);
        //echo $psPath;  
		break;
		
	}
?>
