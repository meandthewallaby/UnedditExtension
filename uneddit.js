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
		unedditError(formId, "UnedditReddit couldn't find this comment", "", deleted);
	    }
	},
	error: function(e, status, message) {
	    if(message == null || message == "")
	    {
		message = "Host not found.";
	    }
	    unedditError(formId, "UnedditReddit encountered an error: ", message, deleted);
	}
    });
}

function getContentIdFromFormId(formId)
{
    return $("#"+formId).children("input[name='thing_id']").val();
}

function unedditError(formId, display, message, deleted)
{
    if(deleted)
    {
	var form = $("#"+formId);
	form.find(".md").text(display + message);
	removeLink(formId, getContentIdFromFormId(formId), deleted, "");
    } else {
	toggleEdit(formId, getContentIdFromFormId(formId), display + message);
    }
}

function removeLink(formId, contentId, deleted, oldCommentHtml)
{
    if(deleted) {
	var link = $("#undelete-" + contentId);
	link.unbind("click");
	link.hide();
    } else {
	var link = $("#unedit-"+contentId);
	link.text(link.text() === "unedit" || link.text() === "unediting..." ? "re-edit" : "unedit");
	link.unbind("click");
	link.click(function() {
	    toggleEdit(formId, contentId, oldCommentHtml);
	});
    }
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

    removeLink(formId, contentId, true, "");
}

function toggleEdit(formId, contentId, newCommentHtml) {
    var comment = $("#" + formId).find(".md");
    var oldCommentHtml = comment.html();
    comment.html(newCommentHtml);
    removeLink(formId, contentId, false, oldCommentHtml);
}

//Loop through each of the "permalink" links, and act on those--those be comments
$(".flat-list:has(a.bylink)").each(function(index){
    var permalink = $("a.bylink",$(this)).get(0);
    var form = $("a.bylink",$(this)).parents(".entry").find("form.usertext");

    //Deleted forms have the "grayed" class, and the taglines have an "edited-timestamp" class time tag
    if(form.hasClass("grayed") || form.parent().has("time.edited-timestamp").length)
    {
	var deleted = form.hasClass("grayed");
	var action = deleted ? "undelete" : "unedit";
	var a = $("<a href='javascript:void(0)' id='" + action + "-" + form.find('input[name="thing_id"]').attr("value") + "'>" + action + "</a>");
	a.click(function(){
	    a.text(deleted ? "undeleting..." : "unediting...");
	    callUneddit(
		permalink.href.replace(/\/\/[^\/]*\.reddit\.com\//,
		    '//www.unedditreddit.com\/'),
		form.attr("id"), deleted
	    );
	});
	$(this).append($("<li></li>").append(a));
    }
});

