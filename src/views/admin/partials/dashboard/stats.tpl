<div class="table-responsive mb-3">
	<table class="table table-striped">
		<thead>
			<tr>
				<th></th>
				<th class="text-end">[[admin/dashboard:stats.yesterday]]</th>
				<th class="text-end">[[admin/dashboard:stats.today]]</th>
				<th></th>
				<th class="text-end">[[admin/dashboard:stats.last-week]]</th>
				<th class="text-end">[[admin/dashboard:stats.this-week]]</th>
				<th></th>
				<th class="text-end">[[admin/dashboard:stats.last-month]]</th>
				<th class="text-end">[[admin/dashboard:stats.this-month]]</th>
				<th></th>
				<th class="text-end">[[admin/dashboard:stats.all]]</th>
			</tr>
		</thead>
		<tbody>
			<!-- BEGIN stats -->
			<tr>
				<td>
					<strong>
						{{{ if ../href }}}
							<a href="{../href}">{../name}</a>
						{{{ else }}}
							{../name}
						{{{ end }}}
					</strong>
				</td>
				<td class="text-end formatted-number">{stats.yesterday}</td>
				<td class="text-end formatted-number">{stats.today}</td>
				<td class="{stats.dayTextClass}"><small>{stats.dayIncrease}%</small></td>

				<td class="text-end formatted-number">{stats.lastweek}</td>
				<td class="text-end formatted-number">{stats.thisweek}</td>
				<td class="{stats.weekTextClass}"><small>{stats.weekIncrease}%</small></td>

				<td class="text-end formatted-number">{stats.lastmonth}</td>
				<td class="text-end formatted-number">{stats.thismonth}</td>
				<td class="{stats.monthTextClass}"><small>{stats.monthIncrease}%</small></td>

				<td class="text-end formatted-number">{stats.alltime}</td>
			</tr>
			<!-- END stats -->
		</tbody>
	</table>
</div>