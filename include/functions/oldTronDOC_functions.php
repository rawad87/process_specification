<?php

	include_once('C:/TronDOC_Scripts/TronDOC2/include/config.php.inc');
	//include_once('C:/TronDOC_Scripts/TronDOC2/include/functions/db_rest.inc.php');
	include_once('C:/TronDOC_Scripts/TronDOC2/include/functions/auth.inc.php');
		
	$userProfile = UserState::Get();
	$productCollection = Config::DbCollectionProducts;
	$moduleCollection = Config::DbCollectionModules;
	$psCollection = Config::DbCollectionProcessSpecification;
	$DbDocumentUsers = Config::DbDocumentUsers;
	$DbDocumentProductGroups = Config::DbDocumentProductGroups;
	
	class oldTronDOC {
		public static function readUsers()
		{ 
			# ******************************************************* 
			# Reading all users */
			# *******************************************************
			$query ="
				<users>
				{
				for \$users in doc('/db/trondoc/system_data/users/users.xml')//user
				order by \$users/userFullName
				return \$users
				}
				</users>
				";
			$result = dbQuery($query);
			$users = new SimpleXmlElement($result);
			return $users->users->asXML();
		}
		public static function userFullName($index)
		{ 
			# ******************************************************* 
			# Returns a users full name */
			# *******************************************************
			$query ="
				let \$user := doc('/db/trondoc/system_data/users/users.xml')//user[@index='$index']/userFullName
				return \$user
				";
			$result = dbQuery($query);
			$user = new SimpleXmlElement($result);
			//return $user->asXML();
			return $user->userFullName;
		}
		public static function userEmail($index)
		{ 
			# ******************************************************* 
			# Returns a user profile, by index */
			# *******************************************************
			$query ="
				let \$user := doc('/db/trondoc/system_data/users/users.xml')//user[@index='$index']
				return
				<email>
					<user email='{data(\$user/userEmail)}' fullname='{data(\$user/userFullName)}' />
				</email>
				";
			$result = dbQuery($query);
			$user = new SimpleXmlElement($result);
			//return $user->asXML();
			return $user;
		}
		public static function userEmailByName($fullName)
		{ 
			# ******************************************************* 
			# Returns a user profile, by full name */
			# *******************************************************
			$query ="
				let \$user := doc('/db/trondoc/system_data/users/users.xml')//user[userFullName='$fullName']
				return
				<email>
					<user email='{data(\$user/userEmail)}' fullname='{data(\$user/userFullName)}' />
				</email>
				";
			$result = dbQuery($query);
			$user = new SimpleXmlElement($result);
			//return $user->asXML();
			return $user;
		}
		
		public static function findEmailReceivers($xnumArray, $type)
		{ 
			# ******************************************************* 
			# Search for responsibles and subscribers */
			# *******************************************************
			$subscrType = ($type == 'cn') ? "@cn='true'" : "@nc='true'";
			$xnumbers = implode(',', $xnumArray);
			$query ="
				for \$productX in ($xnumbers)
				let \$productdef := collection('/db/trondoc/products/')/productdef[biblioid/group = \$productX]
				return 
				    <email>
				        {
				            let \$userIndex := data(\$productdef/product/developer)
				            let \$email := doc('/db/trondoc/system_data/users/users.xml')//user[@index=\$userIndex]/userEmail
				            let \$fullName := doc('/db/trondoc/system_data/users/users.xml')//user[@index=\$userIndex]/userFullName
				            return 
				                <user email='{data(\$email)}' fullname='{data(\$fullName)}' />
				        }
				        {
				            let \$userIndex := data(\$productdef/product/prodengineer)
				            let \$email := doc('/db/trondoc/system_data/users/users.xml')//user[@index=\$userIndex]/userEmail
				            let \$fullName := doc('/db/trondoc/system_data/users/users.xml')//user[@index=\$userIndex]/userFullName
				            return 
				                <user email='{data(\$email)}' fullname='{data(\$fullName)}' />
				        }
						{
							(: Subscribers :)
				            let \$division := data(\$productdef/product/division)
				            let \$maingroup := data(\$productdef/product/maingroup)
				            let \$subgroup := data(\$productdef/product/subgroup)
				            let \$users := doc('/db/trondoc/system_data/users/users.xml')//user[subscriptions/subscription/@division=\$division and subscriptions/subscription/$subscrType]
				            let \$subscriptions := \$users/subscriptions/subscription
				            for \$num in (1 to count(\$subscriptions))
				            for \$sortedusers in \$users[subscriptions/subscription[\$num]/@division=\$division and subscriptions/subscription[\$num]/@maingroup=\$maingroup and subscriptions/subscription[\$num]/@subgroup=\$subgroup and subscriptions/subscription[\$num]/$subscrType]
				            return 
				                <user email='{data(\$sortedusers/userEmail)}' fullname='{data(\$sortedusers/userFullName)}' />
				        }
				    </email>
				";
			$result = dbQuery($query);
			$responsibles = new SimpleXmlElement($result);
			//echo $subscrType;
			//echo $xnumbers;
			return $responsibles;
		}
		public static function readProductStructure($product) {
			# ******************************************************* 
			# Reading product and modules */
			# *******************************************************
			$productCollection = Config::DbCollectionProducts;
			$moduleCollection = Config::DbCollectionModules;
			//$query = "for \$info in collection('".$productCollection."/')/productdef[biblioid/group = '" . $product . "']
			$query = "
			let \$info := doc('/db/trondoc/products/" . $product . ".xml')//productdef
				return
					<Modules>
			        {
			            for \$data in \$info/modules/module
			            let \$parent := \$data/@parent/string()
			            let \$moduleDef := \$data/@moduleDef/string()
		        		let \$x := \$data/@x/string()
		        		let \$moddoc := concat('/db/trondoc/modules/',\$x,'.xml')
		        		for \$moduledef in doc(\$moddoc)//moduledef	
		        		return
		        		    <M parent='{\$parent}' moduleDef='{\$moduleDef}'>
		        			    <Module_X>{\$x}</Module_X>
		        			    <Module_Name>{data(\$moduledef/module/name)}</Module_Name>
		        			    <SubStructures>
		        			        {for \$substructure in \$moduledef/module/substructures/substructure
		        			            return 
		        			                <Struct>
		        			                    <Struct_X>{data(\$substructure/@x)}</Struct_X>
		        			                    <Struct_Name>{data(\$substructure/@name)}</Struct_Name>
		        			                </Struct>
		        			        }
		                        </SubStructures>
		        		    </M>
			        }
	    			</Modules>
				";
			return $result = dbQuery($query);
		}
		
		static public function readProducts() {
			# ******************************************************* 
			# Reading all products */                                                      
			# *******************************************************
			$productCollection = Config::DbCollectionProducts;
			$moduleCollection = Config::DbCollectionModules;
			//$query = "for \$info in collection('".$productCollection."/')/productdef[biblioid/group = '" . $product . "']
			$query = "
				xquery version '3.0';
				for \$products in collection('$productCollection')//biblioid/group
				let \$module := collection('$moduleCollection')//moduledef[biblioid/group = \$products]
				order by \$module/biblioid/group
				return 
					<product x='{data(\$module/biblioid/group)}' name='{data(\$module/module/name)}' />
			";
			return $result = dbQuery($query);
		}
		
		public function findModuleDependencies($moduleX,$partnumToCheck)
		{ 
			# ******************************************************* 
			# Search for module dependecies in product definitions */
			# *******************************************************
			$query ="
				let \$moduleX := '$moduleX'
		        let \$moduleName := collection('/db/trondoc/modules/')/moduledef[biblioid/group = \$moduleX]/module/name
		        for \$modules in collection('/db/trondoc/products/')/productdef[modules/module/@x = \$moduleX]
		        return 
		         <result>
		            {
		                let \$x := data(\$modules/biblioid/group)
		                let \$productName := collection('/db/trondoc/modules/')/moduledef[biblioid/group = \$x]/module/name
		                return 
		                <item product_x='{data(\$modules/biblioid/group)}' product_name='{data(\$productName)}' module_x='{\$moduleX}' module_name='{data(\$moduleName)}'/>
		            }
            	</result>
				";
			$result = dbQuery($query);
			$dependencies = new SimpleXmlElement($result);
			$influenceArray = [];
			$arrayNum = 0;
			foreach ($dependencies->result as $result) {
				$influenceArray[$arrayNum]['Unit_X'] = (string)$result->item['product_x'];
				$influenceArray[$arrayNum]['Unit_Name'] = (string)$result->item['product_name'];
				$influenceArray[$arrayNum]['Module_X'] = (string)$result->item['module_x'];
				$influenceArray[$arrayNum]['Module_Name'] = (string)$result->item['module_name'];
				$influenceArray[$arrayNum]['SubStruct_X'] = '';
				$influenceArray[$arrayNum]['SubStruct_Name'] = '';
				$arrayNum++;
			}
			return $influenceArray;
			//return $dependencies->asXML();
		}
	}
	
	if(array_key_exists('subject', $_POST)){
		switch($_POST['subject'])
		{
			case 'readProduct':
			# ******************************************************* 
			# Reading product and modules */
			# *******************************************************
			$product = $_POST['name'];
			$query = "for \$info in doc('".$productCollection."/".$product.".xml')/productdef
				where \$info/biblioid/group = '" . $product . "'
				return
				<product>
					{\$info}
					<moduledefs>
					{
					for \$data in \$info/modules/module
					let \$x := \$data/@x/string()
					let \$moddoc := concat('".$moduleCollection."',\$x,'.xml')
					for \$moduledef in doc(\$moddoc)//moduledef	
					return
						\$moduledef
					}
					</moduledefs>
				</product>";
			echo $result = dbQuery($query);
			break;	
			
			case 'users':
			# ******************************************************* 
			# Reading all users */
			# ******************************************************* 
			$query ="
				<users>
				{
				for \$users in doc('$DbDocumentUsers')//user
				order by \$users/userFullName
				return \$users
				}
				</users>
				";
			$result = dbQuery($query);
			$users = new SimpleXmlElement($result);
			
			echo $users->users->asXML();
			break;	
				
			case 'product_groups':
			# ******************************************************* 
			# Read the template for product groups */
			# ******************************************************* 
			$query ="
				for \$product_groups in doc('$DbDocumentProductGroups')//product_groups
				return \$product_groups
				";
			echo $result = dbQuery($query);
			break;
			
			/*case 'save_product':
			# ******************************************************* 
			# Save a product, new or updated
			# ******************************************************* 
			$productNum = $_POST['name'];
			$productXML = $_POST['data'];
			
			$newProduct = new SimpleXmlElement($productXML);
			$productXML = $newProduct->asXML();
			
			$url = $productCollection."/".$productNum.".xml";
			$content = $productXML;
			
			echo dbPut($url, $content);
			break;
			
			case 'save_module':
			# ******************************************************* 
			# Save a module, new or updated
			# ******************************************************* 
			$moduleNum = $_POST['name'];
			$moduleXML = $_POST['data'];
			
			$newModule = new SimpleXmlElement($moduleXML);
			$moduleXML = $newModule->asXML();
			
			//$moduleNum = "987654321";
			$url = $moduleCollection.$moduleNum.".xml";
			$content = $moduleXML;
			
			echo dbPut($url, $content);
			break;*/
	}}
?>
