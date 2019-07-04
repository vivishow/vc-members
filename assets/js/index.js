$(function() {
  $(document).on("click", ".item-link", function() {
    $.showPreloader();
  });

  $(".icon-refresh").on("click", function() {
    $.showPreloader();
    window.location.reload();
  });

  $("#add-user").on("click", function() {
    let nickName = $("input#add-nickname")[0].value,
      noteName = $("input#add-notename")[0].value;
    if (!nickName) {
      $.alert("请填写昵称！");
    } else {
      $.showPreloader();
      axios
        .post("/api/members", {
          nickName: nickName,
          noteName: noteName
        })
        .then(function(res) {
          $.hidePreloader();
          $.alert(res.data.data, function() {
            window.location.reload();
          });
        });
    }
  });
});
