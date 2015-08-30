<div class="row">
	<form role="form" class="category" data-cid="{category.cid}">
		<ul class="nav nav-pills">
			<li class="active"><a href="#category-settings" data-toggle="tab">[[admin:category.category_settings]]</a></li>
			<li><a href="#privileges" data-toggle="tab">[[admin:category.privileges]]</a></li>
		</ul>
		<br />
		<div class="tab-content">
			<div class="tab-pane fade active in row" id="category-settings">
				<div class="col-md-9">
					<div class="category-settings-form">
						<fieldset>
							<label for="cid-{category.cid}-name">[[admin:category.category_name]]</label>
							<input id="cid-{category.cid}-name" type="text" class="form-control" placeholder="[[admin:category.category_name]]" data-name="name" value="{category.name}" /><br />

							<label for="cid-{category.cid}-description">[[admin:category.category_description]]</label>
							<input id="cid-{category.cid}-description" data-name="description" placeholder="[[admin:category.category_description]]" value="{category.description}" class="form-control category_description description"></input><br />
						</fieldset>

						<fieldset class="row">
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-bgColor">[[admin:category.background_colour]]</label>
									<input id="cid-{category.cid}-bgColor" placeholder="#0059b2" data-name="bgColor" value="{category.bgColor}" class="form-control category_bgColor" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-color">[[admin:category.text_colour]]</label>
									<input id="cid-{category.cid}-color" placeholder="#fff" data-name="color" value="{category.color}" class="form-control category_color" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-imageClass">[[admin:category.background_image_size]]</label>
										<select id="cid-{category.cid}-imageClass" class="form-control" data-name="imageClass" data-value="{category.imageClass}">
										<option value="auto">[[admin:category.auto]]</option>
										<option value="cover">[[admin:category.cover]]</option>
										<option value="contain">[[admin:category.contain]]</option>
									</select>
								</div>
							</div><br />
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-class">[[admin:category.custom_class]]</label>
									<input id="cid-{category.cid}-class" type="text" class="form-control" placeholder="col-md-6 col-xs-6" data-name="class" value="{category.class}" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-numRecentReplies">[[admin:category.num_of_recent_replies]]</label>
									<input id="cid-{category.cid}-numRecentReplies" type="text" class="form-control" placeholder="2" data-name="numRecentReplies" value="{category.numRecentReplies}" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-link">[[admin:category.external_link]]</label>
									<input id="cid-{category.cid}-link" type="text" class="form-control" placeholder="http://domain.com" data-name="link" value="{category.link}" />
								</div>
							</div>
						</fieldset>
					</div>
				</div>

				<div class="col-md-3 options acp-sidebar">
					<div class="panel panel-default">
						<div class="panel-body">
							<div class="category-preview" style="
								<!-- IF category.backgroundImage -->background-image: url({category.backgroundImage});<!-- ENDIF category.backgroundImage -->
								<!-- IF category.bgColor -->background-color: {category.bgColor};<!-- ENDIF category.bgColor -->
								<!-- IF category.imageClass -->background-size: {category.imageClass};<!-- ENDIF category.imageClass -->
								color: {category.color};
							">
								<div class="icon">
									<i data-name="icon" value="{category.icon}" class="fa {category.icon} fa-2x"></i>
								</div>
							</div>
							<div class="btn-group btn-group-justified">
								<div class="btn-group">
									<button type="button" data-cid="{category.cid}" data-name="image" data-value="{category.image}" class="btn btn-default upload-button"><i class="fa fa-upload"></i> [[admin:category.upload]]</button>
								</div>
								<!-- IF category.image -->
								<div class="btn-group">
									<button class="btn btn-warning delete-image"><i data-name="icon" value="fa-times" class="fa fa-times"></i> [[admin:category.remove]]</button>
								</div>
								<!-- ENDIF category.image -->
							</div><br />

							<fieldset>
								<div class="form-group text-center">
									<label for="cid-{category.cid}-parentCid">[[admin:category.parent_category]]</label>
									<br/>
									<div class="btn-group <!-- IF !category.parent.name -->hide<!-- ENDIF !category.parent.name-->">
										<button type="button" class="btn btn-default" data-action="changeParent" data-parentCid="{category.parent.cid}"><i class="fa {category.parent.icon}"></i> {category.parent.name}</button>
										<button type="button" class="btn btn-warning" data-action="removeParent" data-parentCid="{category.parent.cid}"><i class="fa fa-times"></i></button>
									</div>
									<button type="button" class="btn btn-default btn-block <!-- IF category.parent.name -->hide<!-- ENDIF category.parent.name-->" data-action="setParent"><i class="fa fa-sitemap"></i> [[admin:category.none]]</button>
								</div>
							</fieldset>

							<hr />
							<button class="btn btn-danger btn-block purge"><i class="fa fa-eraser"></i> [[admin:category.purge_category]]</button>
						</div>
					</div>
				</div>
			</div>

			<div class="tab-pane fade col-xs-12" id="privileges">
				<div class="panel panel-default">
					<div class="panel-body">
						<p>
							[[admin:category.privileges_description]]
						</p>
						<p class="text-warning">
							<strong>[[admin:category.note]]</strong>: [[admin:category.privileges_note]]
						</p>
						<hr />
						<div class="privilege-table-container">
							<!-- IMPORT admin/partials/categories/privileges.tpl -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
    <i class="material-icons">save</i>
</button>

