<ul data-cid="{cid}" class="m-0 p-0 list-unstyled user-select-none">
{{{ each categories }}}
	<li data-cid="{categories.cid}" data-parent-cid="{categories.parentCid}" data-name="{categories.name}" class="{{{ if categories.disabled }}}disabled{{{ end }}}">
		<hr/>
		<div class="category-row d-flex justify-content-between mb-1">
			<div class="flex-grow-1 align-items-start d-flex gap-2">
				<div class="d-flex gap-2">
					<div class="toggle text-center text-sm">
						<i class="fa fa-chevron-down"></i>
					</div>
					<div class="information flex-1 align-items-start d-flex gap-2">
						<div>
						{buildCategoryIcon(@value, "28px", "rounded-1")}
						</div>
						<div class="d-grid gap-0">
							<div class="title fw-semibold">
								<a class="category-header text-reset" href="{config.relative_path}/admin/manage/categories/{categories.cid}">{categories.name}</a> {{{ if categories.link }}}<a class="text-xs text-muted" href="{categories.link}"><i class="fa fa-link"></i> {categories.link}</a>{{{ end }}}
							</div>
							{{{ if categories.descriptionParsed }}}
							<div class="description text-muted text-xs w-100">{categories.descriptionParsed}</div>
							{{{ end }}}
						</div>
					</div>
				</div>
			</div>
			<div class="flex-shrink-0 d-flex gap-1 align-items-start">
				<a href="{{{if ./link}}}{./link}{{{else}}}{config.relative_path}/category/{./cid}{{{end}}}" class="btn btn-light btn-sm" target="_blank">[[admin/manage/categories:view]]</a>
				<a href="./categories/{./cid}" class="btn btn-light btn-sm">[[admin/manage/categories:edit]]</a>

				<div class="category-tools">
					<button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown" type="button"><i class="fa fa-fw fa-gear text-primary"></i></button>
					<ul class="dropdown-menu dropdown-menu-end p-1">
						<li><a class="dropdown-item rounded-1" href="./categories/{categories.cid}/analytics">[[admin/manage/categories:analytics]]</a></li>
						<li><a class="dropdown-item rounded-1" href="{config.relative_path}/admin/manage/privileges/{categories.cid}">[[admin/manage/categories:privileges]]</a></li>
						<li><a href="#" class="set-order dropdown-item rounded-1" data-cid="{categories.cid}" data-order="{categories.order}">[[admin/manage/categories:set-order]]</a></li>
						<li class="dropdown-divider"></li>
						<li>
							<a class="dropdown-item rounded-1" href="#" data-disable-cid="{categories.cid}" data-action="toggle" data-disabled="{categories.disabled}">
							{{{if categories.disabled}}}
							[[admin/manage/categories:enable]]
							{{{else}}}
							[[admin/manage/categories:disable]]
							{{{end}}}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<ul class="list-unstyled has-more-categories {{{ if !../hasMoreSubCategories}}}hidden{{{ end }}}">
			<li>
				<a href="{config.relative_path}/admin/manage/categories?cid={categories.cid}&page={categories.showMorePage}" class="btn btn-sm btn-light">[[category:x-more-categories, {../subCategoriesLeft}]]</a>
			</li>
		</ul>
	</li>
{{{ end }}}
</ul>
