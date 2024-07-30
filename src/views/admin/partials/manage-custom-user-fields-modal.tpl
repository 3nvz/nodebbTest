<form>
	<div class="mb-3">
		<label class="form-label">[[admin/manage/user-custom-fields:type-of-input]]</label>
		<select class="form-select" id="type-select" name="type">
			<option value="input-text" {{{ if (type == "input-text") }}}selected{{{ end }}}>[[admin/manage/user-custom-fields:input-type-text]]</option>
			<option value="input-number" {{{ if (type == "input-number") }}}selected{{{ end }}}>[[admin/manage/user-custom-fields:input-type-number]]</option>
			<option value="select" {{{ if (type == "select") }}}selected{{{ end }}}>[[admin/manage/user-custom-fields:input-type-select]]</option>
		</select>
	</div>
	<div class="mb-3">
		<label class="form-label">[[admin/manage/user-custom-fields:key]]</label>
		<input class="form-control" type="text" name="key" value="{./key}">
	</div>
	<div class="mb-3">
		<label class="form-label">[[admin/manage/user-custom-fields:name]]</label>
		<input class="form-control" type="text" name="name" value="{./name}">
	</div>

	<div class="mb-3 {{{ if (type != "select") }}}hidden{{{ end }}}" data-input-type="select">
		<label class="form-label">[[admin/manage/user-custom-fields:select-options]]</label>
		<textarea class="form-control" name="select-options" rows="6">{./select-options}</textarea>
		<p class="form-text">[[admin/manage/user-custom-fields:select-options-help]]</p>
	</div>
</form>
