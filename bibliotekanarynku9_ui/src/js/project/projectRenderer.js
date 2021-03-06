function renderProjectNotFoundError() {
    var elem = createPageElement('<div>', 'main-content__not-found-message');
    return elem.text('На жаль вказаного Вами проекту не існує. Спробуйте обрати інший. Дякуюємо за розуміння =)');
}

function renderProjectList(projectList) {
    var htmlProjectList = [];
    for (var i = 0; i < projectList.length; i++) {
        var project = projectList[i];
        htmlProjectList.push(renderProjectArticle(project));
    }
    return htmlProjectList;
}

function renderProjectArticle(projectArticle, isDetailed) {
    var translation = projectArticle.translations[0];
    if (translation) {
        var paragraphs = splitTextToParagraphs(translation.description),
            links = translation.links,
            $article = createPageElement('<article>',
                'main-content-article main-content-article_style_default main-content-article_style_day rounded'
            ),
            $articleHeading = createPageElement('<h3>',
                'main-content-article__heading main-content-article__heading_style_default page-header'
            ),
            $articleBody = createPageElement('<section>', 'main-content-article__body clearfix'),
            $articlePictureWrapper = createPageElement('<figure>',
                'main-content-article__picture-wrapper picture-wrapper'
            ),
            $articlePicture = createPageElement('<img>', 'page-picture page-picture__style_default rounded');

        var htmlParagraphs = [];
        paragraphs.forEach(function (paragraph) {
            var $paragraph = createPageElement('<p>',
                'main-content-article__paragraph'
            );
            if (isDetailed) {
                $paragraph.addClass('main-content-article__paragraph_style_visible');
            }
            $paragraph.text(paragraph);
            htmlParagraphs.push($paragraph);
        });

        var htmlLinks = [];
        links.forEach(function (link) {
            var $link = createPageElement('<a>',
                'main-content-article__link main-content-article__link_style_default page-link'
            );
            $link.text(link.label);
            $link.attr('href', link.href);
            $link.attr('target', '_blank');
            htmlLinks.push($link);
        });

        $articleHeading.text(translation.title);
        $articleHeading.click(function() {
            window.location.hash = 'project/' + projectArticle.id;
        });
        $articlePicture.attr('src', parseImagePath(projectArticle.avatar));
        $articlePictureWrapper.append($articlePicture);
        $articleBody.append($articlePictureWrapper, htmlParagraphs);
        $article.append($articleHeading);
        $article.append($articleBody);
        $article.append(htmlLinks);
        return $article;
    }
}
