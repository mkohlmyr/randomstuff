$("form").submit(function (evt) {
    $.get(`/search?search_term=${$("input").val()}`).done(function (data) {
        $("main").html(data);
        $("main tr").each(function (index, result) {
            const {owner, name} = $(result).find("article").data();
            $.getJSON(`https://api.github.com/repos/${owner}/${name}/commits`, function (commits) {
                const {html_url, sha, commit} = commits[0];
                if (html_url && sha && commit && commit.author && commit.message) {
                    const message = commit.message.split("\n")[0];
                    $(result).find("summary").html(`<span class="hash" title="${message}">${sha} <a href="${html_url}"><i class="fa fa-external-link-square" aria-hidden="true"></i></a></span> by ${commit.author.name}`);
                } else {
                    $(result).find("summary").html("failed to get commit information");
                }

            });
        });
    }).fail(function (data) {
        $("body > header").html(data.responseText);
    });
    evt.preventDefault();
});


