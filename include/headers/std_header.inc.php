

  <!-- *************************************************************** -->
  <!-- The top navbar -->
  <!-- *************************************************************** -->
		<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">TronDOC - <?php echo $headerTitle; ?></a>
				</div>
				<div class="navbar-collapse collapse">
					<ul class='nav navbar-nav navbar-left'>
      					<li class='dropdown'>
      						<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Site Navigation <b class='caret'></b></a>
      						<ul class='dropdown-menu'>
      							<li><a href='../main_page/main_page.php'>Products Home</a></li>
      							<li><a href='../atc_upgrade_system/atc_upgrade_search.php'>ATC Upgrade</a></li>
      							<li><a href='../svs_reports/list_svs_reports.php'>SVS Reports</a></li>
      							<li><a href='../pspec/pspec_list.php'>PS Overview</a></li>
      							<li><a href='../calibration_system/list.php'>Calibration System</a></li>
      							<li><a href='../license_sip/license_sip.php'>Phontech License</a></li>
								<li><a href='../license_atc/license_atc.php'>ATC License</a></li>
                                <li><a href='../sequence_numbers/sequence_numbers.php'>Sequence numbers</a></li>
                                <li><a href='../test_reports/upload_testReport.php'>Upload Test Reports</a></li>
                                <li><a href='../test_stations/view_test.php'>Test stations</a></li>
      							<li class='divider'></li>
      							<?php
      							if(UserState::IsAdmin() or UserState::IsLocalAdmin())
      								echo "<li><a href='../administration/ControlPanel.php'>TronDOC Control Panel</a></li>";
      							?>
      						</ul>
      					</li>
      				</ul>
					<?php
					/* Verify signin status */
					if (UserState::Get() != null) {
						/* already signed in */
						$userProfile = UserState::Get();
						echo "
							<form class='navbar-form navbar-right' role='form' action='../signin/signin.php' method='get'>
								<button type='submit' class='btn btn-success' name='btnLogout'>Sign out</button>
								<input type='hidden' name='gotoUrl' value='".$_SERVER['PHP_SELF']."?".$_SERVER['QUERY_STRING']."' />
							</form>";
						echo "<p class='navbar-text navbar-right'>Signed in as <a href='#' class='navbar-link'>".$userProfile->Fullname."</a></p>";
						if($userProfile->Userstate == 'false'){
							echo "<p class='navbar-text navbar-right' style='color:red;'>[Inactive user]</p>";
						}
						
					}
					else {
						/* Not signed in */
						echo "
							<form class='navbar-form navbar-right' role='form' action='../signin/signin.php' method='post'>
								<div class='form-group'>
									<input type='text' placeholder='User Name' class='form-control' name='username'/>
								</div>
								<div class='form-group'>
									<input type='password' placeholder='Password' class='form-control' name='password'/>
								</div>
								<button type='submit' class='btn btn-success' name='btnLogin'>Sign in</button>
								<input type='hidden' name='gotoUrl' value='".$_SERVER['PHP_SELF']."?".$_SERVER['QUERY_STRING']."' />
							</form>
						";
					}
					?>

				</div><!--/.navbar-collapse -->
			</div>
		</div><!-- end .navbar -->


