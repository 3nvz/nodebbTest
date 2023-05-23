<div class="alert {{{ if upgradeAvailable }}}alert-warning{{{ else }}}alert-info{{{ end }}} mb-0 py-1 pe-2 alert-dismissible">
	<span>[[admin/menu:alerts.version, {version}]]</span>
	{{{ if upgradeAvailable }}}
	<a href="https://docs.nodebb.org/configuring/upgrade/" target="_blank">
		[[admin/menu:alerts.upgrade, {latestVersion}]]
	</a>
	{{{ end }}}
	<button type="button" class="btn-close p-2" data-bs-dismiss="alert" aria-label="Close"></button>
</div>