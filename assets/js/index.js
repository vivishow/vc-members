$(function() {
  $(document).on("click", ".item-link", function() {
    $.showPreloader();
  });
  $(".icon-refresh").on("click", function() {
    $.showPreloader();
    window.location.reload();
  });
});
