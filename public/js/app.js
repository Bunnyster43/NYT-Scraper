// scrape button
$(document).on("click", "#scrapeButton", function () {
    $.get("/scrape", function (data) {
        if (data.count) {
            $("#numArticles").text("Added " + data.count + " new articles!");
        } else {
            $("#numArticles").text("No New Articles.");
        }
        $("#scrapeModal").modal();
    });
});

// timeout
$(document).on("click", "#closeModal", function () {
    setTimeout(function () {
        window.location = "/";
    }, 500);
});

// save article
$(document).on("click", "#savearticle", function () {
    let dataID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/savearticle/" + dataID
    })
        .then(function () {
            $("#" + dataID).fadeOut();
        });
});

// delete article
$(document).on("click", "#deletearticle", function () {
    let dataID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/deletearticle/" + dataID
    })
        .then(function () {
            $("#" + dataID).fadeOut("normal", function () {
                $(this).remove();
                if ($("#search-results").children().length == 0) {
                    $("#noarticles").show();
                }
            });
        });
});

// search article
$(document).on("click", "#searcharticle", function () {
    let dataID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/searcharticle/" + dataID
    })
        .then(function () {
            $("#" + dataID)
        });
});

// clear datebase
$(document).on("click", "#cleardb", function () {
    $.ajax({
        method: "GET",
        url: "/cleardb"
    })
        .then(function () {
            window.location = "/";
        });
});

// view notes
$(document).on("click", "#viewnotes", function () {
    let articleId = $(this).attr("data-id");
    getNotes(articleId);
});

// search notes
$(document).on("click", "#searchwnotes", function () {
    let articleId = $(this).attr("data-id");
    getNotes(articleId);
});

// save notes
$(document).on("click", "#savenote", function () {
    let articleId = $(this).attr("data-id");
    let newnote = $("#bodyinput").val();
    $.ajax({
        method: "POST",
        url: "/articles/" + articleId,
        data: { body: newnote }
    })
        .then(function (data) {
            getNotes(articleId);
        });
    $("#bodyinput").val("");
});

// get notes
function getNotes(articleId) {
    $.ajax({
        method: "GET",
        url: "/articles/" + articleId
    })
        .then(function (data) {
            $("#notesModal").modal();
            $("#notesModalLabel").text("Notes for Article: " + data._id);
            $("#savenote").attr("data-id", data._id);
            $("#displaynotes").empty();
            if (data.notes.length) {
                for (let i = 0; i < data.notes.length; i++) {
                    let card = $("<div>").addClass("card mb-2");
                    let cardBody = $("<div>").addClass("card-body").text(data.notes[i].body);
                    let delButton = $("<button>").addClass("btn btn-sm py-0 float-right");
                    delButton.attr("id", "deletenote");
                    delButton.attr("data-id", data.notes[i]._id);
                    delButton.attr("data-article-id", data._id);
                    delButton.text("X");
                    cardBody.append(delButton);
                    card.append(cardBody);
                    $("#displaynotes").append(card);
                }
            } else {
                $("#displaynotes").text("Add Notes");
            }
            $('#viewnotes[data-id="' + data._id + '"]').text("Notes (" + data.notes.length + ")");
        })
}

// delete note
$(document).on("click", "#deletenote", function () {
    let noteId = $(this).attr("data-id");
    let articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "POST",
        url: "/deletenote/" + noteId
    })
        .then(function () {
            getNotes(articleId);
        });
});    