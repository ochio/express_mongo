const btnSubmit_onClick = function(event){
  const $submit = $(this);
  const $form = $submit.parents("form");
  $form.attr("method", $submit.data("method"));
  $form.attr("action", $submit.data("action"));
  $form.submit();
};

const document_onready = function(event){
  $("input[type='submit").on("click", btnSubmit_onClick);
};

$(document).ready(document_onready);