<nav id="menu" class="hidden-lg-up">
	<section class="menu-section">
		<h3 class="menu-section-title">General</h3>
		<ul class="menu-section-list">
			<a href="{relative_path}/admin/general/dashboard">Dashboard</a>
			<li><a href="{relative_path}/admin/general/homepage">Home Page</a></li>
			<li><a href="{relative_path}/admin/general/navigation">Navigation</a></li>
			<li><a href="{relative_path}/admin/general/languages">Languages</a></li>
			<li><a href="{relative_path}/admin/general/sounds">Sounds</a></li>
			<li><a href="{relative_path}/admin/general/social">Social</a></li>
		</ul>
	</section>

	<section class="menu-section">
		<h3 class="menu-section-title">Manage</h3>
		<ul class="menu-section-list">
			<li><a href="{relative_path}/admin/manage/categories">Categories</a></li>
			<li><a href="{relative_path}/admin/manage/tags">Tags</a></li>
			<li><a href="{relative_path}/admin/manage/users/latest">Users</a></li>
			<li><a href="{relative_path}/admin/manage/registration">Registration Queue</a></li>
			<li><a href="{relative_path}/admin/manage/groups">Groups</a></li>
			<li><a href="{relative_path}/admin/manage/flags">Flags</a></li>
			<li><a href="{relative_path}/admin/manage/ip-blacklist">IP Blacklist</a></li>
		</ul>
	</section>

	<section class="menu-section">
		<h3 class="menu-section-title">Settings</h3>
		<ul class="menu-section-list">
			<li><a href="{relative_path}/admin/settings/general">General</a></li>
			<li><a href="{relative_path}/admin/settings/reputation">Reputation</a></li>
			<li><a href="{relative_path}/admin/settings/email">Email</a></li>
			<li><a href="{relative_path}/admin/settings/user">User</a></li>
			<li><a href="{relative_path}/admin/settings/group">Group</a></li>
			<li><a href="{relative_path}/admin/settings/guest">Guests</a></li>
			<li><a href="{relative_path}/admin/settings/uploads">Uploads</a></li>
			<li><a href="{relative_path}/admin/settings/post">Post</a></li>
			<li><a href="{relative_path}/admin/settings/chat">Chat</a></li>
			<li><a href="{relative_path}/admin/settings/pagination">Pagination</a></li>
			<li><a href="{relative_path}/admin/settings/tags">Tags</a></li>
			<li><a href="{relative_path}/admin/settings/notifications">Notifications</a></li>
			<li><a href="{relative_path}/admin/settings/web-crawler">Web Crawler</a></li>
			<li><a href="{relative_path}/admin/settings/sockets">Sockets</a></li>
			<li><a href="{relative_path}/admin/settings/advanced">Advanced</a></li>
		</ul>
	</section>

	<section class="menu-section">
		<h3 class="menu-section-title">Appearance</h3>
		<ul class="menu-section-list">
			<li><a href="{relative_path}/admin/appearance/themes">Themes</a></li>
			<li><a href="{relative_path}/admin/appearance/skins">Skins</a></li>
			<li><a href="{relative_path}/admin/appearance/customise">Custom HTML &amp; CSS</a></li>
		</ul>
	</section>

	<section class="menu-section">
		<h3 class="menu-section-title">Extend</h3>
		<ul class="menu-section-list">
			<li><a href="{relative_path}/admin/extend/plugins">Plugins</a></li>
			<li><a href="{relative_path}/admin/extend/widgets">Widgets</a></li>
			<li><a href="{relative_path}/admin/extend/rewards">Rewards</a></li>
		</ul>
	</section>

	<!-- IF authentication.length -->
	<section class="menu-section">
		<h3 class="menu-section-title">Social Authentication</h3>
		<ul class="menu-section-list">
			<!-- BEGIN authentication -->
			<li>
				<a href="{relative_path}/admin{authentication.route}">{authentication.name}</a>
			</li>
			<!-- END authentication -->
		</ul>
	</section>
	<!-- ENDIF authentication.length -->

	<!-- IF plugins.length -->
	<section class="menu-section">
		<h3 class="menu-section-title">Plugins</h3>
		<ul class="menu-section-list">
			<!-- BEGIN plugins -->
			<li>
				<a href="{relative_path}/admin{plugins.route}">{plugins.name}</a>
			</li>
			<!-- END plugins -->
		</ul>
	</section>
	<!-- ENDIF plugins.length -->

	<section class="menu-section">
		<h3 class="menu-section-title">Advanced</h3>
		<ul class="menu-section-list">
			<li><a href="{relative_path}/admin/advanced/database">Database</a></li>
			<li><a href="{relative_path}/admin/advanced/events">Events</a></li>
			<li><a href="{relative_path}/admin/advanced/logs">Logs</a></li>
			<li><a href="{relative_path}/admin/advanced/errors">Errors</a></li>
			<li><a href="{relative_path}/admin/advanced/post-cache">Post Cache</a></li>
			<!-- IF env -->
			<li><a href="{relative_path}/admin/development/logger">Logger</a></li>
			<!-- ENDIF env -->
		</ul>
	</section>
</nav>

<main id="panel">
	<nav class="header" id="header">
		<div class="pull-xs-left">
			<div id="mobile-menu">
				<div class="bar"></div>
				<div class="bar"></div>
				<div class="bar"></div>
			</div>
			<h1 id="main-page-title"></h1>
		</div>

		<ul id="user_label" class="pull-xs-right">
			<li class="dropdown pull-xs-right">
				<a class="dropdown-toggle" data-toggle="dropdown" href="#" id="user_dropdown">
					<i class="fa fa-fw fa-ellipsis-v"></i>
				</a>
				<ul id="user-control-list" class="dropdown-menu" aria-labelledby="user_dropdown">
					<li class="dropdown-item">
						<a href="#" class="nav-link restart" title="Restart Forum">
							Restart Forum
						</a>
					</li>
					<div class="dropdown-divider"></div>
					<li class="dropdown-item" component="logout">
						<a class="nav-link" href="#">Log out</a>
					</li>
				</ul>
			</li>

			<li class="pull-xs-right">
				<a href="{config.relative_path}/">
					<i class="fa fa-fw fa-home" title="View Forum"></i>
				</a>
			</li>

			<form class="pull-xs-right hidden-md-down" role="search">
				<div class="" id="acp-search" >
					<div class="dropdown">
						<input type="text" data-toggle="dropdown" class="form-control" placeholder="Search...">
						<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>
					</div>
				</div>
			</form>
		</ul>
		<ul id="main-menu">
			<li class="menu-item">
				<a href="{relative_path}/admin/general/dashboard">Dashboard</a>
			</li>
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">General</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/general/homepage">Home Page</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/general/navigation">Navigation</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/general/languages">Languages</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/general/sounds">Sounds</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/general/social">Social</a></li>
				</ul>
			</li>
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Manage</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/categories">Categories</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/tags">Tags</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/users/latest">Users</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/registration">Registration Queue</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/groups">Groups</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/flags">Flags</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/manage/ip-blacklist">IP Blacklist</a></li>
				</ul>
			</li>
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Settings</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/general">General</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/reputation">Reputation</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/email">Email</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/user">User</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/group">Group</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/guest">Guests</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/uploads">Uploads</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/post">Post</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/chat">Chat</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/pagination">Pagination</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/tags">Tags</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/notifications">Notifications</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/web-crawler">Web Crawler</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/sockets">Sockets</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/settings/advanced">Advanced</a></li>
				</ul>
			</li>
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Appearance</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/appearance/themes">Themes</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/appearance/skins">Skins</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/appearance/customise">Custom HTML &amp; CSS</a></li>
				</ul>
			</li>
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Extend</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/extend/plugins">Plugins</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/extend/widgets">Widgets</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/extend/rewards">Rewards</a></li>
				</ul>
			</li>
			<!-- IF authentication.length -->
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Social Authentication</a>
				<ul class="dropdown-menu" role="menu">
					<!-- BEGIN authentication -->
					<li class="dropdown-item">
						<a class="nav-link" href="{relative_path}/admin{authentication.route}">{authentication.name}</a>
					</li>
					<!-- END authentication -->
				</ul>
			</li>
			<!-- ENDIF authentication.length -->
			<!-- IF plugins.length -->
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Plugins</a>
				<ul class="dropdown-menu" role="menu">
					<!-- BEGIN plugins -->
					<li class="dropdown-item">
						<a class="nav-link" href="{relative_path}/admin{plugins.route}">{plugins.name}</a>
					</li>
					<!-- END plugins -->
					<div class="dropdown-divider"></div>
					<li class="dropdown-item" data-link="1">
						<a class="nav-link" href="{relative_path}/admin/extend/plugins">Install Plugins</a>
					</li>
				</ul>
			</li>
			<!-- ENDIF plugins.length -->
			<li class="dropdown menu-item">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Advanced</a>
				<ul class="dropdown-menu" role="menu">
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/advanced/database">Database</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/advanced/events">Events</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/advanced/logs">Logs</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/advanced/errors">Errors</a></li>
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/advanced/post-cache">Post Cache</a></li>
					<!-- IF env -->
					<li class="dropdown-item"><a class="nav-link" href="{relative_path}/admin/development/logger">Logger</a></li>
					<!-- ENDIF env -->
				</ul>
			</li>
		</ul>

		<ul class="nav navbar-nav navbar-right hidden-sm-down reconnect-spinner">
			<li>
				<a href="#" id="reconnect" class="hide" title="Connection to {title} has been lost, attempting to reconnect...">
					<i class="fa fa-check"></i>
				</a>
			</li>
		</ul>
	</nav>