function callUneddit(commentHref, formId, deleted)
{
    $.ajax(
    {
	url: commentHref,
	dataType: "json",
	success: function(content) {
	    if(content != null)
	    {
		var contentHtml = $("<p></p>").html(SnuOwnd.getParser().render(content.content));
		if(deleted) {
		    undelete(formId, content.name, content.author, contentHtml.html());
		} else {
		    toggleEdit(formId, content.name, contentHtml.html())
		}
	    }
	    else
	    {
		nullResponse(formId);
	    }
	},
	error: function(e, status, message) {
	    if(message == null || message == "")
	    {
		message = "Host not found.";
	    }
	    unedditError(formId, message);
	}
    });
}

function nullResponse(formId)
{
    var form = $("#"+formId);
    form.find(".md").text("UnedditReddit could not find this comment");
}

function unedditError(formId, message)
{
    var form = $("#"+formId);
    form.find(".md").text("UnedditReddit encountered an error: " + message);
}

function undelete(formId, contentId, authorName, contentHtml)
{
    var form = $("#"+formId);
    form.removeClass('grayed');
    form.parent().find(".tagline>em").replaceWith(
	$("<a></a>")
	.attr("href", "http://reddit.com/user/"+authorName)
	.addClass("author").addClass("id-"+contentId)
	.text(authorName)
    );

    form.find(".md").html(contentHtml);

    var link = $("#undelete-" + contentId);
    link.unbind("click");
    link.hide();
}

function toggleEdit(formId, contentId, newCommentHtml) {
    var comment = $("#" + formId).find(".md");
    var oldCommentHtml = comment.html();
    comment.html(newCommentHtml);

    var link = $("#unedit-"+contentId);
    link.text(link.text() == "unedit" ? "re-edit" : "unedit");
    link.unbind("click");
    link.click(function() {
	toggleEdit(formId, contentId, oldCommentHtml);
    });
}

//Loop through each of the "permalink" links, and act on those--those be comments
$(".flat-list:has(a:contains('permalink'))").each(function(index){
    var permalink = $("a:contains('permalink')",$(this)).get(0);
    var form = $("a:contains('permalink')",$(this)).parents(".entry").find("form.usertext");

    //Deleted forms have the "grayed" class, and the taglines have an "edited-timestamp" class time tag
    if(form.hasClass("grayed") || form.parent().has("time.edited-timestamp").length)
    {
	permalink.hostname = "www.unedditreddit.com";
	var unedditHref = permalink.href;
	permalink.hostname = "www.reddit.com";
	var deleted = form.hasClass("grayed");
	var action = deleted ? "undelete" : "unedit";
	var a = $("<a href='javascript:void(0)' id='" + action + "-" + form.find('input[name="thing_id"]').attr("value") + "'>" + action + "</a>");
	a.click(function(){
	    callUneddit(unedditHref, form.attr("id"), deleted);
	});
	$(this).append($("<li></li>").append(a));
    }
});

