var body = $('body');
var wikiEl = $('#wikipedia-links');
var wikiHeaderEl = $('#wikipedia-header');
var nytEl = $('#nytimes-articles');
var img = $('.photo');
var city = $('#city');

$( document ).ready(function() {
    $('#form-container').on('submit', loadData);
});

function Clear() {
    wikiEl.text('');
    nytEl.text('');
}

function prepareGoogleData() {

    var street = $('#street').val();
    var cityVal = city.val();
    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=800x500&location=' + street + ", " + cityVal +'&heading=151.78&pitch=-0.76&key=AIzaSyB-i_BLvLuEipeeiCzHEsEPNYyYTHhtVqo';

    img.attr("src", streetViewUrl);
}

function fetchData(url, dataType, renderContent, renderError) {
    $.ajax({
        url: url,
        dataType: dataType,
        success: renderContent,
        error: renderError
    });
}

function renderNYTimesContent(data) {

    var articles = data.response.docs;

    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        nytEl.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
    }
}

function prepareNYTimesData() {

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city.val() + '&sort=oldest&api-key=3c2b347976404869946e1dcc15e46b03' ;

    fetchData(nytimesUrl, 'json', renderNYTimesContent, renderNYTimesError);
}

function renderWikiContent(data) {

    var articles = data[1];

    for (var i = 0; i < articles.length; i++) {

        var article = articles[i];
        wikiEl.append('<li>'+'<a href="'+'http://en.wikipedia.org/wiki/'+article+'">'+article+'</a>' +'</li>');
    }
}

function prepareWikiData() {

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city.val() + '&format=json&callback=wikiCallback';
    fetchData(wikiUrl, 'jsonp', renderWikiContent, renderWikiError);
}

function loadData(submit) {

    submit.preventDefault();
    Clear();
    prepareGoogleData();
    prepareNYTimesData();
    prepareWikiData();
}

/* Error */
function renderWikiError() {
    wikiHeaderEl.text('Coś poszło nie tak...');
}

function renderNYTimesError() {
    nytHeaderEl.text('Coś poszło nie tak...');
}
