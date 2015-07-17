var loadHash;

(function() {
  var tmplHash = _.template($('#tmpl-hash').html());

  var fileContentsEl = $('#file-contents');
  var commitsEl = $('#commits');
  var treeEl = $('#tree');

  var addLinksToHashes = function(text) {
    var addLinkToMatchedText = function(matched, type, hash) {
      return type + ' ' + tmplHash({hash: hash});
    }

    return textWithHashes = text.replace(/(blob|parent|tree) (\w*)/g,
        addLinkToMatchedText);
  }

  var formatLinebreaks = function(text) {
    return text.replace(/\n/g, '<br>');
  }

  var cleanAndSetHtml = function(text, el) {
    el.html(addLinksToHashes(text));
  }

  loadHash = function(hash) {
    var gitObject = gitObjects[hash];

    if(gitObject.contents.slice(1, 7) === 'commit') {
      var treeHash = gitObject.meaning.match(/tree (.*)/)[1];
      var treeMeaning = formatLinebreaks(gitObjects[treeHash].meaning);
      cleanAndSetHtml('<h2>Tree</h2>' + treeMeaning, treeEl);
    }
    cleanAndSetHtml('<h2>File contents</h2>' + formatLinebreaks(
        gitObject.meaning), fileContentsEl);
  };

  var commits_html = '<h2>Commits</h2>';
  _.each(commits, function(commit) {
    commits_html = commits_html + tmplHash({hash: commit}) + '<br>';
  });
  cleanAndSetHtml(commits_html, commitsEl);
})();

